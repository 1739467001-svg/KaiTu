import {openStore} from './store.mjs';
import {join,resolve,extname} from 'node:path';
import {readFile,stat,readdir,mkdir} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const exec=promisify(execFile);
const inputOptions=file=>['-protocol_whitelist','file,pipe','-format_whitelist',({'.mp4':'mov','.jpg':'jpeg_pipe,image2','.jpeg':'jpeg_pipe,image2','.png':'png_pipe,image2','.webp':'webp_pipe,image2'})[extname(file)]||'mov'];
async function probe(file){const {stdout}=await exec('ffprobe',['-v','error',...inputOptions(file),'-select_streams','v:0','-show_entries','stream=width,height,codec_name:format=duration','-of','json',file],{timeout:30000,maxBuffer:1024*1024});const info=JSON.parse(stdout);return{width:info.streams?.[0]?.width,height:info.streams?.[0]?.height,codec:info.streams?.[0]?.codec_name,duration:Number(info.format?.duration)||null};}
export async function processJob(store,job){
 const a=store.asset(job.asset_id),file=join(store.directory,'assets',a.id+a.extension);
 try{
  if(job.kind==='inspect'){
   const metadata={name:a.name,bytes:(await stat(file)).size,sha256:a.sha256};
   if(['.insv','.insp'].includes(a.extension)){store.finish(job.id,'blocked',{...metadata,nextStep:'请使用影石 Media SDK 或 Studio 拼接，保留双镜头和全部分段'},'原始影石素材尚未拼接');return;}
   if(['.mp4','.jpg','.jpeg','.png','.webp'].includes(a.extension)){Object.assign(metadata,await probe(file));metadata.erpCandidate=!!metadata.width&&Math.abs(metadata.width/metadata.height-2)<.08;metadata.note='2:1 只校验比例，不证明已正确拼接；请人工检查接缝与清晰度。';}
   else if(a.extension==='.ply'){const handle=await import('node:fs/promises').then(m=>m.open(file));const buf=Buffer.alloc(8192);try{await handle.read(buf,0,buf.length,0);}finally{await handle.close();}metadata.gaussian=buf.includes('scale_0')&&buf.includes('rot_0');metadata.note='仅校验高斯属性，未验证坐标或场景精度。';}
   else metadata.note='文件已登记，请在浏览器中检查内容与方向。';
   store.db.prepare('UPDATE assets SET metadata=? WHERE id=?').run(JSON.stringify(metadata),a.id);store.finish(job.id,'succeeded',metadata);
  }else if(job.kind==='extract'){
   const info=await probe(file);if(!info.width||Math.abs(info.width/info.height-2)>.08)throw new Error('输入不是 2:1 ERP 视频，请先拼接');
   const folder=join(store.directory,'jobs',job.id);await mkdir(folder,{recursive:true});
   await exec('ffmpeg',['-nostdin','-hide_banner','-loglevel','error',...inputOptions(file),'-i',file,'-threads','2','-vf','fps=1/2,scale=2048:1024','-frames:v','60','-q:v','3',join(folder,'frame-%04d.jpg')],{timeout:240000,maxBuffer:1024*1024});
   const outputs=[];for(const name of (await readdir(folder)).filter(f=>/^frame-\d+\.jpg$/.test(f)).sort()){const data=await readFile(join(folder,name));const id=randomUUID();await import('node:fs/promises').then(m=>m.copyFile(join(folder,name),join(store.directory,'assets',id+'.jpg')));outputs.push(store.addAsset({id,project_id:a.project_id,name:a.name+'-'+name,extension:'.jpg',bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),metadata:{sourceAssetId:a.id,jobId:job.id,frameIndex:outputs.length,seconds:outputs.length*2}}).id);}
   store.finish(job.id,'succeeded',{frames:outputs.length,assetIds:outputs,intervalSeconds:2,maximumFrames:60,nextStep:'这些是 ERP 抽帧，不是 3D 重建。继续做清晰度筛选、位姿求解与 GPU 重建。'});
  }
 }catch(e){const message=e.code==='ENOENT'?'缺少 FFmpeg/ffprobe；请使用附带的 worker 容器或安装 FFmpeg':e.message;store.finish(job.id,'failed',null,message.slice(0,700));}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const store=openStore(resolve(process.env.DATA_DIR||'data'));let running=true;for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>running=false);console.log('KaiTu CPU worker ready (inspection + ERP extraction)');while(running){const job=store.claim();if(job)await processJob(store,job);else await new Promise(r=>setTimeout(r,1500));}store.close();}
