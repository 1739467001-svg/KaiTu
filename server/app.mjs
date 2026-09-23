import {createServer} from 'node:http';
import {createReadStream,createWriteStream,existsSync} from 'node:fs';
import {stat,rename,rm} from 'node:fs/promises';
import {resolve,join,extname,basename,sep} from 'node:path';
import {randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import {Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {pathToFileURL} from 'node:url';
import {openStore} from './store.mjs';
import {recommendWithProvider,aiConfigured} from './assistant.mjs';
const allowed=new Set(['.insv','.insp','.mp4','.jpg','.jpeg','.png','.webp','.ply','.spz','.splat','.json']);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json','.pdf':'application/pdf','.md':'text/plain; charset=utf-8'};
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
const body=async(req)=>{let chunks=[],bytes=0;for await(const c of req){bytes+=c.length;if(bytes>16384)throw Object.assign(new Error('JSON 请求过大'),{status:413});chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString()||'{}');}catch{throw Object.assign(new Error('JSON 格式无效'),{status:400});}};
function auth(req,token){const provided=Buffer.from(req.headers.authorization?.replace(/^Bearer /,'')||''),expected=Buffer.from(token);return provided.length===expected.length&&timingSafeEqual(provided,expected);}
export function createApp({directory=resolve(process.env.DATA_DIR||'data'),token=process.env.KAITU_API_TOKEN,dist=resolve('dist'),aiEnv=process.env,maxBytes=Number(process.env.MAX_UPLOAD_MB||512)*1024*1024,store=openStore(directory)}={}){
 if(!token||(token.length<32&&!(process.env.KAITU_ALLOW_SHORT_TOKEN==='true'&&token.length>=4)))throw new Error('KAITU_API_TOKEN 必须设置为至少 32 个字符的随机密钥');
 let uploading=0,aiRequests=0;
 const server=createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
  let temp;
  try{
   const url=new URL(req.url,'http://localhost');const path=url.pathname;
   if(path==='/api/health'&&req.method==='GET')return json(res,200,{service:'kaitu',version:'0.4.0',ai:aiConfigured(aiEnv),status:'ok',capabilities:['projects','uploads','inspect','extract'],reconstruction:'external-worker-required',camera:'local-agent-only'});
   if(path.startsWith('/api/')){
    if(!auth(req,token))return json(res,401,{error:'请在工作台输入部署时配置的访问密钥'});
    if(req.headers.origin){let origin;try{origin=new URL(req.headers.origin);}catch{return json(res,403,{error:'无效来源'});}if(origin.host!==req.headers.host)return json(res,403,{error:'仅接受同源请求'});}
    if(path.startsWith('/api/camera/'))return json(res,501,{error:'云服务器无法直连现场相机；请在现场电脑运行 npm run bridge 和 npm run dev'});
    if(path==='/api/assistant'&&req.method==='POST'){if(aiRequests>=2)return json(res,429,{error:'AI 正在处理其他请求，请稍后重试'});aiRequests++;try{return json(res,200,await recommendWithProvider(await body(req),aiEnv));}finally{aiRequests--;}}
    if(path==='/api/projects'&&req.method==='GET')return json(res,200,{projects:store.projects()});
    if(path==='/api/projects'&&req.method==='POST'){const {name}=await body(req);if(typeof name!=='string'||name.trim().length<1||name.length>100)return json(res,400,{error:'场地名称需为 1–100 个字符'});return json(res,201,store.createProject(name.trim()));}
    const match=path.match(/^\/api\/projects\/([\w-]+)(?:\/(assets|jobs|manifest|checklist))?$/);
    if(match){const [,id,resource]=match,p=store.project(id);if(!p)return json(res,404,{error:'场地不存在'});
     if(!resource&&req.method==='GET')return json(res,200,{...p,assets:store.assets(id),jobs:store.jobs(id)});
     if(resource==='manifest'&&req.method==='GET')return json(res,200,{schemaVersion:2,project:p,assets:store.assets(id),jobs:store.jobs(id),registration:{status:'pending',units:'unscaled',anchors:[]},evidence:'user-uploaded-unverified'});
     if(resource==='checklist'&&req.method==='PUT'){const input=await body(req);const keys=['permission','lens','profile','loop','scale','overlap','review'];if(Object.keys(input).some(k=>!keys.includes(k))||Object.values(input).some(v=>typeof v!=='boolean'))return json(res,400,{error:'检查项无效'});return json(res,200,store.updateChecklist(id,input));}
     if(resource==='assets'&&req.method==='POST'){
      if(uploading>=2)return json(res,429,{error:'已有两个素材正在上传，请稍后再试'});
      const name=basename(url.searchParams.get('name')||'');const ext=extname(name).toLowerCase();if(!name||name.length>180||!allowed.has(ext))return json(res,415,{error:'不支持的素材类型'});
      if(Number(req.headers['content-length'])>maxBytes)return json(res,413,{error:'素材超过上传限制'});
      const aid=randomUUID();temp=join(directory,'assets',aid+'.part');const dest=join(directory,'assets',aid+ext),hash=createHash('sha256');let bytes=0;
      uploading++;try{await pipeline(req,new Transform({transform(chunk,enc,done){bytes+=chunk.length;if(bytes>maxBytes)return done(Object.assign(new Error('素材超过上传限制'),{status:413}));hash.update(chunk);done(null,chunk);}}),createWriteStream(temp,{flags:'wx'}));}finally{uploading--;}
      if(!bytes)throw Object.assign(new Error('文件为空'),{status:400});await rename(temp,dest);temp=null;
      let asset;try{asset=store.addAsset({id:aid,project_id:id,name,extension:ext,bytes,sha256:hash.digest('hex')});}catch(e){await rm(dest,{force:true});throw e;}
      return json(res,201,asset);
     }
     if(resource==='jobs'&&req.method==='POST'){const {assetId,kind}=await body(req);if(typeof assetId!=='string'||typeof kind!=='string')return json(res,400,{error:'缺少素材或任务类型'});const a=store.asset(assetId);if(!a||a.project_id!==id)return json(res,404,{error:'素材不属于此场地'});if(!['inspect','extract'].includes(kind))return json(res,422,{error:'本 CPU 节点只支持素材检查与 ERP 抽帧；重建需要独立 GPU/官方流程'});if(kind==='extract'&&a.extension!=='.mp4')return json(res,422,{error:'请先通过 Media SDK/Studio 将 INSV 拼接为 ERP MP4'});return json(res,202,store.enqueue(assetId,kind));}
    }
    const assetMatch=path.match(/^\/api\/assets\/([\w-]+)$/);
    if(assetMatch&&req.method==='GET'){const a=store.asset(assetMatch[1]);if(!a)return json(res,404,{error:'素材不存在'});const file=join(directory,'assets',a.id+a.extension);res.writeHead(200,{'Content-Type':types[a.extension]||'application/octet-stream','Content-Length':a.bytes,'Cache-Control':'private, no-store','Content-Disposition':`attachment; filename="asset${a.extension}"`});await pipeline(createReadStream(file),res);return;}
    return json(res,404,{error:'接口不存在'});
   }
   if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Method not allowed'});
   let relative;try{relative=decodeURIComponent(path);}catch{return json(res,400,{error:'无效路径'});}
   let file=resolve(dist,'.'+relative);if(!file.startsWith(dist+sep)&&file!==dist)return json(res,403,{error:'无效路径'});
   if(relative==='/'||!extname(relative))file=join(dist,'index.html');
   if(!existsSync(file))return json(res,404,{error:'文件不存在'});const info=await stat(file);if(!info.isFile())return json(res,404,{error:'文件不存在'});
   res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':path.startsWith('/assets/')?'public,max-age=31536000,immutable':'no-cache'});if(req.method==='HEAD')return res.end();await pipeline(createReadStream(file),res);
  }catch(e){if(temp)await rm(temp,{force:true});if(!res.headersSent&&!res.destroyed)json(res,e.status||500,{error:e.status?e.message:'处理失败，请检查服务端日志'});if(!e.status)console.error(e.message);}
 });
 server.requestTimeout=10*60*1000;server.headersTimeout=30000;
 server.on('close',()=>store.close());return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const port=Number(process.env.PORT||8080);const server=createApp();server.listen(port,process.env.HOST||'0.0.0.0',()=>console.log(`KaiTu API and web listening on ${port}`));for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>server.close(()=>process.exit(0)));}
