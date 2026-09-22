import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import {OscClient} from './osc.mjs';
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
export function createBridge({camera=new OscClient(),port=8787}={}){
 let busy=false;
 return createServer(async(req,res)=>{
  const host=req.headers.host||'';
  if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host))return json(res,403,{error:'仅允许本机访问'});
  const origin=req.headers.origin;
  if(origin&&!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin))return json(res,403,{error:'拒绝跨站相机控制'});
  if(req.headers['x-ark-client']!=='1')return json(res,403,{error:'缺少本地客户端标识'});
  const routes={'GET /api/camera/status':'status','POST /api/camera/start':'start','POST /api/camera/stop':'stop'};
  const action=routes[`${req.method} ${req.url}`];if(!action)return json(res,404,{error:'接口不存在'});
  if(busy)return json(res,409,{error:'相机正在处理上一条请求，请稍后操作'});
  if(req.method==='POST'&&!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{error:'需要 JSON 请求'});
  busy=true;
  try{json(res,200,await camera[action]());}
  catch(e){const unavailable=e.name==='TimeoutError'||e.name==='TypeError';json(res,503,{error:unavailable?'未能访问相机。请连接影石 Wi-Fi，并确认相机处于可控状态。':e.message,connected:false});}
  finally{busy=false;}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const port=Number(process.env.ARK_BRIDGE_PORT||8787);const server=createBridge();
 server.listen(port,'127.0.0.1',()=>console.log(`Insta360 OSC bridge: http://127.0.0.1:${port} (physical camera required)`));
}
