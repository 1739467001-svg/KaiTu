export function tourProblems(t){
 const issues=[];if(!t?.title?.trim())issues.push('填写导览标题');
 if(!Array.isArray(t?.nodes)||!t.nodes.length)return [...issues,'至少添加一个实景点位'];
 if(t.nodes.length>12)issues.push('每份导览最多 12 个点位');
 const ids=new Set(t.nodes.map(n=>n.id));if(ids.size!==t.nodes.length)issues.push('点位编号重复');
 for(const n of t.nodes){if(!n.name?.trim())issues.push('有点位未命名');if(!n.assetId&&!n.blob)issues.push(n.name+' 缺少照片');
 if((n.links||[]).some(l=>!ids.has(l.to)||l.to===n.id))issues.push(n.name+' 有无效跳转');
 if(n.kind==='food'&&!n.description?.trim())issues.push(n.name+' 需要餐饮信息（未知价格或营业时间请写待确认）');}
 const seen=new Set(),visit=id=>{if(seen.has(id))return;seen.add(id);for(const l of t.nodes.find(n=>n.id===id)?.links||[])visit(l.to);};visit(t.nodes[0].id);
 if(t.nodes.some(n=>!seen.has(n.id)))issues.push('有点位从入口无法到达，请补充热点连接');return issues;
}
export function routeTo(nodes,from,to){const q=[[from]],seen=new Set([from]);while(q.length){const path=q.shift(),id=path.at(-1);if(id===to)return path;for(const l of nodes.find(n=>n.id===id)?.links||[]){if(!seen.has(l.to)){seen.add(l.to);q.push([...path,l.to]);}}}return null;}
export function draftCopy(node){return node.kind==='food'?`${node.name}：${node.description||'请补充已确认的餐品、价格及营业信息。'}\n请沿已核对的实景点位查看入口，到店前确认营业情况。`:`这里是${node.name}。${node.description||'请核对现场标识和通行条件。'}\n点击画面中的方向热点，继续查看下一处实景。`;}
