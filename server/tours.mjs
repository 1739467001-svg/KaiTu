import {randomUUID} from 'node:crypto';
import {tourProblems} from '../src/tour-model.js';
const fail=m=>{throw Object.assign(new Error(m),{status:400});};
const text=(s,max)=>typeof s==='string'&&s.length<=max?s.trim():fail('导览文字过长或格式无效');
export function tourStore(db){db.exec('CREATE TABLE IF NOT EXISTS tours(id TEXT PRIMARY KEY,project_id TEXT NOT NULL,document TEXT NOT NULL,published INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL)');return{
 get(id){const r=db.prepare('SELECT * FROM tours WHERE id=?').get(id);return r?{...r,document:JSON.parse(r.document)}:null;},
 save(projectId,document,id){id||=randomUUID();db.prepare('INSERT INTO tours VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET document=excluded.document,published=1,updated_at=excluded.updated_at').run(id,projectId,JSON.stringify(document),1,new Date().toISOString());return this.get(id);},
 unpublish(id){db.prepare('UPDATE tours SET published=0 WHERE id=?').run(id);}
};}
export function validateTour(input,store){
 if(!input||input.confirmPublic!==true)fail('请确认照片授权、现场通行关系和公开发布范围');
 const projectId=text(input.projectId,80);if(!store.project(projectId))fail('场地不存在');
 if(!Array.isArray(input.nodes)||!input.nodes.length||input.nodes.length>12)fail('需有 1–12 个点位');
 const doc={title:text(input.title,100),demo:input.demo===true,nodes:input.nodes.map(n=>{
 const assetId=text(n.assetId,80),a=store.asset(assetId);if(!a||a.project_id!==projectId||!['.jpg','.jpeg','.png','.webp','.mp4'].includes(a.extension))fail('点位照片必须属于当前场地且为 JPG/PNG/WebP/MP4');
 if((n.format==='video')!==(a.extension==='.mp4'))fail('视频与照片类型不匹配');
 if(!['panorama','photo','video'].includes(n.format)||!['place','food'].includes(n.kind)||!Array.isArray(n.links)||n.links.length>12)fail('点位类型或热点数量无效');
 return{id:text(n.id,80),assetId,name:text(n.name,60),description:text(n.description||'',1000),kind:n.kind,format:n.format,links:n.links.map(l=>{if(!Number.isFinite(l.yaw)||!Number.isFinite(l.pitch)||Math.abs(l.yaw)>Math.PI*2||Math.abs(l.pitch)>Math.PI/2)fail('热点角度无效');return{to:text(l.to,80),label:text(l.label,60),yaw:l.yaw,pitch:l.pitch};})};})};
 const errors=tourProblems(doc);if(errors.length)fail(errors.join('；'));return{projectId,doc};
}
