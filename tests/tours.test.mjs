import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApp} from '../server/app.mjs';
import {tourProblems,routeTo} from '../src/tour-model.js';
const token='tour-tests-private-token-0000000000000';
test('published tour isolates assets, persists updates, validates graph and can be withdrawn',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'kaitu-tour-'));let server=createApp({directory:dir,token});await new Promise(r=>server.listen(0,'127.0.0.1',r));let base=`http://127.0.0.1:${server.address().port}/api`;
 const request=(path,data,method=data?'POST':'GET')=>fetch(base+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});
 try{
 const p=await (await request('/projects',{name:'Tour test'})).json();const a=await (await fetch(base+`/projects/${p.id}/assets?name=entry.jpg`,{method:'POST',headers:{Authorization:'Bearer '+token},body:'test-image'})).json();
 const privateAsset=await (await fetch(base+`/projects/${p.id}/assets?name=private.jpg`,{method:'POST',headers:{Authorization:'Bearer '+token},body:'private-image'})).json();
 const doc={title:'Entry to food',projectId:p.id,confirmPublic:true,nodes:[{id:'entry',assetId:a.id,name:'Entry',kind:'place',format:'panorama',description:'',links:[]}]};
 assert.equal((await fetch(base+'/tours',{method:'POST',body:JSON.stringify(doc)})).status,401);
 assert.equal((await request('/tours',{...doc,confirmPublic:false})).status,400);
 const result=await request('/tours',doc);assert.equal(result.status,201);const {id}=await result.json();
 assert.equal((await fetch(base+'/public/tours/'+id)).status,200);
 assert.equal(await(await fetch(base+`/public/tours/${id}/assets/${a.id}`)).text(),'test-image');
 assert.equal((await fetch(base+`/public/tours/${id}/assets/${privateAsset.id}`)).status,404);
 const range=await fetch(base+`/public/tours/${id}/assets/${a.id}`,{headers:{Range:'bytes=0-3'}});assert.equal(range.status,206);assert.equal(await range.text(),'test');
 assert.equal((await fetch(base+`/public/tours/${id}/assets/${a.id}`,{headers:{Range:'bytes=999-1000'}})).status,416);
 assert.equal((await request('/tours',{...doc,nodes:[{...doc.nodes[0],format:'video'}]})).status,400);

 const other=await(await request('/projects',{name:'Other'})).json();assert.equal((await request('/tours',{...doc,projectId:other.id})).status,400);
 assert.equal((await request('/tours',{...doc,nodes:[{...doc.nodes[0],links:[{to:'missing',label:'bad',yaw:0,pitch:0}]}]})).status,400);
 assert.equal((await request('/tours',{...doc,id,title:'Updated'})).status,201);
 await new Promise(r=>server.close(r));server=createApp({directory:dir,token});await new Promise(r=>server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${server.address().port}/api`;
 assert.equal((await(await fetch(base+'/public/tours/'+id)).json()).title,'Updated');
 assert.equal((await request('/tours/'+id,null,'DELETE')).status,200);assert.equal((await fetch(base+'/public/tours/'+id)).status,404);assert.equal((await fetch(base+`/public/tours/${id}/assets/${a.id}`)).status,404);
 }finally{await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
test('routes follow authored links and unreachable dining blocks publication',()=>{
 const nodes=[{id:'a',name:'门',assetId:'x',links:[{to:'b'}]},{id:'b',name:'餐厅',assetId:'y',kind:'food',description:'营业待确认',links:[]}];
 assert.deepEqual(routeTo(nodes,'a','b'),['a','b']);assert.equal(routeTo(nodes,'b','a'),null);assert.deepEqual(tourProblems({title:'导览',nodes}),[]);
 nodes[0].links=[];assert.match(tourProblems({title:'导览',nodes}).join(''),/无法到达/);
});
