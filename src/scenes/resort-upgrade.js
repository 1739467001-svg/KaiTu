import * as THREE from 'three';
import {box,mat,textured,bench,visitors,makePath,reflectiveWater,optimizeStatic,add} from './common.js';
export function upgradeResort(root,lakeGeometry,oldLake){
 oldLake.visible=false;const detail=new THREE.Group();root.add(detail);const wood=mat('#8b795e'),metal=mat('#536361'),canvas=mat('#e4dfc9'),paving=textured('#d4cab4','paving',5);
 // Window frames, transparent-looking balcony rails and continuous roof parapets.
 for(const [start,end]of [[Math.PI*1.02,Math.PI*1.39],[Math.PI*1.44,Math.PI*1.98]])for(let a=start+.025;a<end;a+=.055){for(let f=0;f<4;f++){const r=59.2,g=new THREE.Group();g.position.set(Math.cos(a)*r,1.9+f*3.8,Math.sin(a)*r+19);g.rotation.y=-a-Math.PI/2;detail.add(g);box(g,3.2,.055,.065,0,0,.9,metal);box(g,3.2,.055,.065,0,.8,.9,metal);for(const x of [-1.5,-.5,.5,1.5])box(g,.04,.85,.04,x,.4,.9,metal);box(g,.075,2.6,.18,0,1.3,.16,metal);}}
 // Outdoor seating, parasols, paving and pool detail.
 for(const x of [-24,-15,16,25]){const umbrella=new THREE.Group();umbrella.position.set(x,.2,5);detail.add(umbrella);add(umbrella,new THREE.CylinderGeometry(.055,.07,3.4,8),metal,[0,1.7,0]);add(umbrella,new THREE.ConeGeometry(2.5,.8,8),canvas,[0,3.2,0]);for(const dz of [3,5.2]){box(detail,1.3,.22,2,x,.6,5+dz,wood);const back=box(detail,1.3,.15,1,x,1,4.4+dz,wood);back.rotation.x=-.45;}}
 for(const [x,z]of [[-52,8],[54,13],[-35,73],[30,73]])bench(detail,x,z,Math.atan2(x,z));
 for(let i=0;i<8;i++)box(detail,7,.08,1,0,.47,-7-i*1.5,paving);
 const randPositions=[[-65,-10],[-57,-36],[55,-39],[62,-5]];for(const [x,z]of randPositions){box(detail,6,.5,2,x,.2,z,mat('#817866'));for(let i=0;i<8;i++)add(detail,new THREE.SphereGeometry(.6,7,6),mat(i%2?'#c6bc8f':'#8b9a6a'),[x-2.5+i*.7,.85,z]);}
 // Waterline tiles, parasol edging, planter grasses and promenade bollards.
 for(let x=-14;x<=14;x+=.7)box(detail,.64,.06,.28,x,.61,2.7,mat('#e8e0c4'));
 for(const side of [-1,1])for(let j=0;j<22;j++){const a=(j/21)*Math.PI*.7-Math.PI*.35,x=side*(55+Math.cos(a)*3),z=35+Math.sin(a)*33;add(detail,new THREE.CylinderGeometry(.09,.14,.95,7),metal,[x,.47,z]);add(detail,new THREE.CylinderGeometry(.15,.15,.15,10),mat('#ecdebc'),[x,.97,z]);}
 for(const [x,z]of randPositions)for(let k=0;k<30;k++){const blade=box(detail,.055,.7+(k%4)*.12,.03,x+(k%10)*.53-2.4,.95,z+(Math.floor(k/10)-1)*.4,mat(k%2?'#829164':'#a1ad72'));blade.rotation.z=Math.sin(k)*.25;}
 optimizeStatic(detail);
 const loop=[];for(let a=0;a<Math.PI*2;a+=.15)loop.push([Math.cos(a)*84,.35,Math.sin(a)*75+11]);const people=visitors(root,[makePath(loop,true),makePath([[-30,.4,0],[0,.4,9],[31,.4,0],[0,.4,9],[-30,.4,0]])],{count:0,seed:37});
 const water=reflectiveWater(root,lakeGeometry.clone(),[0,.025,0],'#426f6b');
 return{tick(t,{sun,night,moving}){people(t,moving);water.tick(t,sun,night);}};
}
