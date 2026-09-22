export function shortestPath(graph,start,end){
 if(!graph[start]||!graph[end]) throw new Error('未知点位');
 const dist=new Map([[start,0]]),prev=new Map(),pending=new Set(Object.keys(graph));
 while(pending.size){
  const u=[...pending].sort((a,b)=>(dist.get(a)??Infinity)-(dist.get(b)??Infinity))[0];
  if(!Number.isFinite(dist.get(u)??Infinity)) break;
  pending.delete(u);if(u===end) break;
  for(const v of graph[u].edges){
   if(!graph[v]) throw new Error('无效连边');
   const d=dist.get(u)+Math.hypot(...graph[u].position.map((n,i)=>n-graph[v].position[i]));
   if(d<(dist.get(v)??Infinity)){dist.set(v,d);prev.set(v,u);}
  }
 }
 if(!dist.has(end)) throw new Error('点位之间尚无通路');
 const path=[end];while(path[0]!==start) path.unshift(prev.get(path[0]));
 return {path,distance:dist.get(end)};
}
export function planRoute(graph,stops){
 const unique=[...new Set(stops)];let paths=['entrance'],distance=0,current='entrance';
 // At most four counters; enumerate permutations for the shortest open route on this graph.
 function permutations(xs){return xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>j!==i)).map(p=>[x,...p])):[[]];}
 let best=null;
 for(const order of permutations(unique)){
  paths=['entrance'];distance=0;current='entrance';
  for(const next of order){const leg=shortestPath(graph,current,next);paths.push(...leg.path.slice(1));distance+=leg.distance;current=next;}
  if(!best||distance<best.distance)best={nodes:paths,distance,stops:order};
 }
 return best;
}
