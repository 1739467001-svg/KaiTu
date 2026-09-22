// Real OSC transport based on Insta360's published protocol; not a simulated SDK.
export class OscClient {
 constructor({baseUrl='http://192.168.42.1',fetchImpl=fetch,timeoutMs=8000}={}){
  const u=new URL(baseUrl);
  if(u.protocol!=='http:'||!['192.168.42.1','127.0.0.1','localhost'].includes(u.hostname))throw new Error('相机地址必须为本地相机或测试服务');
  this.baseUrl=u.origin;this.fetch=fetchImpl;this.timeoutMs=timeoutMs;this.queue=Promise.resolve();
 }
 serial(task){const next=this.queue.then(task,task);this.queue=next.catch(()=>{});return next;}
 async request(path,body){
  const response=await this.fetch(this.baseUrl+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json;charset=utf-8','Accept':'application/json','X-XSRF-Protected':'1'},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(this.timeoutMs)});
  if(!response.ok)throw new Error(`相机 HTTP ${response.status}`);const data=await response.json();
  if(data.state==='error'||data.error)throw new Error(data.error?.message||data.error?.code||'相机拒绝命令');return data;
 }
 async execute(name,parameters){let result=await this.request('/osc/commands/execute',{name,...(parameters?{parameters}:{})});const started=Date.now();while(result.state==='inProgress'){
   if(!result.id)throw new Error('相机异步命令缺少 id');if(Date.now()-started>15000)throw new Error('相机命令状态未知：请检查相机后再操作，勿自动重试');
   await new Promise(r=>setTimeout(r,1000));result=await this.request('/osc/commands/status',{id:result.id});
  }if(result.state!=='done')throw new Error('相机未确认命令完成，请检查设备状态');return result;
 }
 status(){return this.serial(async()=>{const info=await this.request('/osc/info');const data=await this.request('/osc/state',{});return{connected:true,model:info.model,firmware:info.firmwareVersion,battery:data.state?.batteryLevel,cardState:data.state?._cardState,transport:'OSC'};});}
 start(){return this.serial(async()=>{
  await this.request('/osc/info');const state=await this.request('/osc/state',{});
  if(state.state?._cardState!=='pass')throw new Error('相机存储卡尚未就绪');
  const options=await this.execute('camera.getOptions',{optionNames:['captureMode']});
  if(options.results?.options?.captureMode!=='video')throw new Error('请先在相机上切换到普通全景录像模式并核对 8K30；未修改相机设置');
  const result=await this.execute('camera.startCapture');return{result,message:'相机已接受开始录像命令'};
 });}
 stop(){return this.serial(async()=>{const result=await this.execute('camera.stopCapture');return{result,message:'相机已接受停止录像命令，原始文件保存在相机'};});}
}
