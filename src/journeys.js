import {shortestPath} from './routing.js';
// Split authored corridor polylines at all collinear junctions. No straight-line
// shortcut across buildings is introduced when a stop lies along a longer edge.
export function corridorGraph(venue){
 const key=p=>p.map(n=>Math.round(n*100)/100).join(','),points=new Map(),segments=[];
 for(const walk of Object.values(venue.walks))for(let i=0;i<walk.length;i++){points.set(key(walk[i]),walk[i]);if(i)segments.push([walk[i-1],walk[i]]);}
 const graph=Object.fromEntries([...points].map(([id,position])=>[id,{position,edges:[]} ]));
 for(const [a,b]of segments){const ab=b.map((v,i)=>v-a[i]),length2=ab.reduce((n,v)=>n+v*v,0);const candidates=[];for(const [id,p]of points){const t=p.reduce((n,v,i)=>n+(v-a[i])*ab[i],0)/length2;const error=Math.hypot(...p.map((v,i)=>v-a[i]-t*ab[i]));if(t>=-.001&&t<=1.001&&error<.05)candidates.push({id,t});}candidates.sort((x,y)=>x.t-y.t);for(let i=1;i<candidates.length;i++){const x=candidates[i-1].id,y=candidates[i].id;if(!graph[x].edges.includes(y))graph[x].edges.push(y);if(!graph[y].edges.includes(x))graph[y].edges.push(x);}}
 return graph;
}
export function routeForStops(venue,stops){
 const graph=corridorGraph(venue);let current=null;const route=[];
 const anchors=stops.map(id=>{const walk=venue.walks[id];if(!walk)throw new Error('Unknown venue stop: '+id);const point=walk[walk.length-1];return Object.keys(graph).find(k=>Math.hypot(...point.map((v,i)=>v-graph[k].position[i]))<.05);});
 for(const next of anchors){if(current)route.push(...shortestPath(graph,current,next).path.slice(1));else route.push(next);current=next;}
 return {points:route.map(id=>graph[id].position),anchors:anchors.map(id=>graph[id].position),nodes:route,graph};
}
