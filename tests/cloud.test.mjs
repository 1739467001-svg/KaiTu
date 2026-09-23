import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createApp} from '../server/app.mjs';
import {openStore} from '../server/store.mjs';
import {processJob} from '../server/worker.mjs';
import {solarPosition,formatHour} from '../src/solar.js';
const token='test-only-random-access-token-000000000000';
test('cloud authentication, persistent project, raw upload, queue, manifest and validation',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'kaitu-test-'));const store=openStore(dir),server=createApp({directory:dir,store,token,maxBytes:1024,aiEnv:{}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 const request=(path,opts={})=>fetch(url+'/api'+path,{...opts,headers:{Authorization:'Bearer '+token,...opts.headers}});
 try{
  assert.equal((await fetch(url+'/api/health')).status,200);assert.equal((await fetch(url+'/api/projects')).status,401);
  assert.equal((await fetch(url+'/api/assistant',{method:'POST',body:'{}'})).status,401);
  assert.equal((await request('/assistant',{method:'POST',body:JSON.stringify({venue:'mendong',query:'喝茶'})})).status,503);
  assert.equal((await request('/assistant',{method:'POST',body:JSON.stringify({venue:'unknown',query:'喝茶'})})).status,400);
  assert.equal((await request('/projects',{headers:{Origin:'https://evil.test'}})).status,403);
  assert.equal((await request('/projects',{method:'POST',body:'{"name":""}'})).status,400);
  const created=await request('/projects',{method:'POST',body:'{"name":"仙林测试场地"}'});assert.equal(created.status,201);const p=await created.json();
  assert.equal((await request(`/projects/${p.id}/assets?name=evil.html`,{method:'POST',body:'x'})).status,415);
  assert.equal((await request(`/projects/${p.id}/assets?name=large.insv`,{method:'POST',body:'x'.repeat(1025)})).status,413);
  const a=await (await request(`/projects/${p.id}/assets?name=sample.insv`,{method:'POST',body:'raw-test'})).json();assert.equal(a.bytes,8);assert.equal(a.sha256.length,64);
  assert.equal((await fetch(url+'/api/assets/'+a.id)).status,401);assert.equal(await (await request('/assets/'+a.id)).text(),'raw-test');
  const j=await (await request(`/projects/${p.id}/jobs`,{method:'POST',body:JSON.stringify({assetId:a.id,kind:'inspect'})})).json();
  assert.equal((await (await request(`/projects/${p.id}/jobs`,{method:'POST',body:JSON.stringify({assetId:a.id,kind:'inspect'})})).json()).id,j.id);
  assert.equal((await request(`/projects/${p.id}/jobs`,{method:'POST',body:'{}'})).status,400);
  assert.equal((await request(`/projects/${p.id}/jobs`,{method:'POST',body:JSON.stringify({assetId:a.id,kind:'gpu'})})).status,422);
  await processJob(store,store.claim());const result=store.job(j.id);assert.equal(result.status,'blocked');assert.match(result.error,/拼接/);
  await request(`/projects/${p.id}/checklist`,{method:'PUT',body:'{"lens":true}'});
  const manifest=await (await request(`/projects/${p.id}/manifest`)).json();assert.equal(manifest.project.checklist.lens,true);assert.equal(manifest.assets.length,1);assert.equal(manifest.registration.status,'pending');
  const other=openStore(dir);try{assert.equal(other.project(p.id).name,'仙林测试场地');assert.equal(other.asset(a.id).bytes,8);}finally{other.close();}
 }finally{await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
test('two workers cannot claim the same queued job; stale jobs become explicit failures',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'kaitu-queue-'));const a=openStore(dir),b=openStore(dir);
 try{const p=a.createProject('test'),asset=a.addAsset({project_id:p.id,name:'test.mp4',extension:'.mp4',bytes:1,sha256:'x'});const job=a.enqueue(asset.id,'inspect');assert.equal(a.claim().id,job.id);assert.equal(b.claim(),null);a.db.prepare('UPDATE jobs SET started_at=? WHERE id=?').run('2020-01-01T00:00:00Z',job.id);b.claim();assert.equal(a.job(job.id).status,'failed');}finally{a.close();b.close();await rm(dir,{recursive:true,force:true});}
});
test('worker extracts real ERP frames and persists output assets',async t=>{
 const exec=promisify(execFile);try{await exec('ffmpeg',['-version']);}catch{t.skip('FFmpeg unavailable; run worker container for this test');return;}
 const dir=await mkdtemp(join(tmpdir(),'kaitu-frames-')),store=openStore(dir);
 try{const p=store.createProject('test'),a=store.addAsset({project_id:p.id,name:'erp.mp4',extension:'.mp4',bytes:0,sha256:'test'});
  await exec('ffmpeg',['-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i','color=c=green:s=512x256:d=3','-c:v','mpeg4',join(dir,'assets',a.id+'.mp4')]);
  const job=store.enqueue(a.id,'extract');await processJob(store,store.claim());const result=store.job(job.id);assert.equal(result.status,'succeeded',result.error);assert.ok(result.result.frames>=1);assert.equal(store.assets(p.id).length,result.result.frames+1);
  const invalid=store.addAsset({project_id:p.id,name:'broken.mp4',extension:'.mp4',bytes:3,sha256:'bad'});await writeFile(join(dir,'assets',invalid.id+'.mp4'),'bad');const bad=store.enqueue(invalid.id,'inspect');await processJob(store,store.claim());assert.equal(store.job(bad.id).status,'failed');
 }finally{store.close();await rm(dir,{recursive:true,force:true});}
});
test('solar day follows east morning, high noon, west evening and below-horizon night',()=>{
 const morning=solarPosition(8),noon=solarPosition(12),evening=solarPosition(17),night=solarPosition(0);
 assert.ok(morning.azimuth>80&&morning.azimuth<150);assert.ok(noon.elevation>55&&noon.elevation<61);assert.ok(evening.azimuth>230&&evening.azimuth<280);assert.ok(night.elevation<0);assert.ok(Math.abs(Math.hypot(...noon.direction)-1)<1e-10);assert.equal(formatHour(19.5),'19:30');assert.equal(formatHour(24),'00:00');assert.throws(()=>solarPosition(NaN));assert.throws(()=>solarPosition(25));
});
