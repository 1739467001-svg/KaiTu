import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
export function openStore(directory){
 mkdirSync(join(directory,'assets'),{recursive:true});
 const db=new DatabaseSync(join(directory,'kaitu.sqlite'));db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,name TEXT NOT NULL,created_at TEXT NOT NULL,checklist TEXT NOT NULL DEFAULT '{}');
 CREATE TABLE IF NOT EXISTS assets(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),name TEXT NOT NULL,extension TEXT NOT NULL,bytes INTEGER NOT NULL,sha256 TEXT NOT NULL,created_at TEXT NOT NULL,metadata TEXT NOT NULL DEFAULT '{}');
 CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY,asset_id TEXT NOT NULL REFERENCES assets(id),kind TEXT NOT NULL,status TEXT NOT NULL,created_at TEXT NOT NULL,started_at TEXT,result TEXT,error TEXT);
 `);
 const now=()=>new Date().toISOString();
 return {db,directory,
  projects:()=>db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all().map(p=>({...p,checklist:JSON.parse(p.checklist)})),
  project:id=>{const p=db.prepare('SELECT * FROM projects WHERE id=?').get(id);return p?{...p,checklist:JSON.parse(p.checklist)}:null;},
  createProject(name){const id=randomUUID();db.prepare('INSERT INTO projects(id,name,created_at) VALUES (?,?,?)').run(id,name,now());return this.project(id);},
  updateChecklist(id,checklist){db.prepare('UPDATE projects SET checklist=? WHERE id=?').run(JSON.stringify(checklist),id);return this.project(id);},
  assets:id=>db.prepare('SELECT * FROM assets WHERE project_id=? ORDER BY created_at DESC').all(id).map(a=>({...a,metadata:JSON.parse(a.metadata)})),
  asset:id=>{const a=db.prepare('SELECT * FROM assets WHERE id=?').get(id);return a?{...a,metadata:JSON.parse(a.metadata)}:null;},
  addAsset(data){const id=data.id||randomUUID();db.prepare('INSERT INTO assets(id,project_id,name,extension,bytes,sha256,created_at,metadata) VALUES(?,?,?,?,?,?,?,?)').run(id,data.project_id,data.name,data.extension,data.bytes,data.sha256,now(),JSON.stringify(data.metadata||{}));return this.asset(id);},
  job:id=>{const j=db.prepare('SELECT * FROM jobs WHERE id=?').get(id);return j?{...j,result:j.result?JSON.parse(j.result):null}:null;},
  jobs:projectId=>db.prepare('SELECT jobs.* FROM jobs JOIN assets ON assets.id=jobs.asset_id WHERE assets.project_id=? ORDER BY jobs.created_at DESC').all(projectId).map(j=>({...j,result:j.result?JSON.parse(j.result):null})),
  enqueue(assetId,kind){const duplicate=db.prepare("SELECT * FROM jobs WHERE asset_id=? AND kind=? AND status IN ('queued','running')").get(assetId,kind);if(duplicate)return this.job(duplicate.id);const id=randomUUID();db.prepare('INSERT INTO jobs(id,asset_id,kind,status,created_at) VALUES (?,?,?,?,?)').run(id,assetId,kind,'queued',now());return this.job(id);},
  claim(){db.exec('BEGIN IMMEDIATE');try{db.prepare("UPDATE jobs SET status='failed',error='处理进程中断或超过 10 分钟；请重新提交任务' WHERE status='running' AND started_at < ?").run(new Date(Date.now()-600000).toISOString());const j=db.prepare("SELECT * FROM jobs WHERE status='queued' ORDER BY created_at LIMIT 1").get();if(j)db.prepare("UPDATE jobs SET status='running',started_at=? WHERE id=?").run(now(),j.id);db.exec('COMMIT');return j?this.job(j.id):null;}catch(e){db.exec('ROLLBACK');throw e;}},
  finish(id,status,result,error=null){db.prepare('UPDATE jobs SET status=?,result=?,error=? WHERE id=?').run(status,result?JSON.stringify(result):null,error,id);},
  close:()=>db.close(),
 };
}
