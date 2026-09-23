import * as THREE from 'three';
import {add,box,mat,textured,seeded,chineseHall,roof,sign,lantern,trees,bench,visitors,makePath,optimizeStatic} from './common.js';
export function createMendong(){
 const root=new THREE.Group();root.name='Laomendong reference streets';const paving=textured('#b5b3a0','paving',18),brick=textured('#9ca095','brick',9),plaster=mat('#dfdbca'),wood=mat('#73583e'),roofMat=textured('#838778','tile',3),trim=mat('#bbb5a0');
 box(root,151,4,175,0,-2.2,0,mat('#6f7865'));box(root,150,.3,174,0,-.05,0,paving);
 box(root,17,.16,150,0,.18,1,textured('#c6c3b2','paving',12));for(const z of [39,12,-15,-43])box(root,139,.16,6,0,.18,z,paving);
 // Gutong Lane forms the spine; cross lanes remain open all the way to the wall.
 const lamps=[],warmWindows=[],rand=seeded(132);
 function house(x,z,w,d,h,label){
  const group=new THREE.Group();group.position.set(x,0,z);group.rotation.y=x>0?-Math.PI/2:Math.PI/2;root.add(group);
  box(group,w,h,d,0,h/2+.25,0,Math.abs(z)%3>1?brick:plaster);box(group,w+.2,.5,d+.2,0,.3,0,brick);
  roof(group,w+1.7,d+2,2.5,h+.5,roofMat,.24);
  for(const sx of [-1,1]){box(group,.26,h+1.6,d+.2,sx*(w/2),h/2+.9,0,plaster);for(let k=0;k<3;k++)box(group,.4,.38,d*(1-k*.25),sx*(w/2),h+1+k*.43,0,trim);}
  const win=mat('#4e5140',{emissive:'#e8b768',emissiveIntensity:.03});warmWindows.push(win);
  for(let i=0;i<3;i++){const xx=(i-1)*w*.28;box(group,w*.22,2.4,.14,xx,2.1,d/2+.09,wood);box(group,w*.19,1.4,.17,xx,2.35,d/2+.2,win);for(let k=0;k<4;k++)box(group,.05,1.5,.06,xx+(k-1.5)*w*.048,2.35,d/2+.3,wood);if(h>6){box(group,w*.21,1.8,.16,xx,h-1.65,d/2+.1,win);for(let k=0;k<3;k++)box(group,.075,1.9,.08,xx+(k-1)*w*.065,h-1.65,d/2+.24,wood);}}
  if(h>6){box(group,w+1,.2,1.5,0,h-2.9,d/2+.5,wood);for(let i=0;i<12;i++)box(group,.055,.7,.06,(i/11-.5)*w,h-2.45,d/2+1.2,wood);box(group,w,.08,.08,0,h-2.1,d/2+1.2,wood);}
  if(label)sign(group,label,[0,4.15,d/2+.3],{width:w*.76,height:1.15,font:95,background:'#3b4238',color:'#ecdfb5'});
  for(const xx of [-w*.38,w*.38])lamps.push(lantern(group,xx,3.8,d/2+.85,.68));
  if(rand()>.45){const awning=box(group,w*.8,.12,2.1,0,3.35,d/2+1,mat(['#a2855f','#768474','#a36c4f'][Math.floor(rand()*3)]));awning.rotation.x=.11;}
 }
 const labels=['茶事','金陵风味 · 示例','手作','街角糕点 · 示例','小巷书屋','巷里茶馆 · 示例','百味南京'];
 for(const side of [-1,1])for(let i=0;i<5;i++){const z=52-i*27;const label=side<0&&i===1?'金陵风味 · 示例':side>0&&i===2?'街角糕点 · 示例':side<0&&i===3?'巷里茶馆 · 示例':labels[(i+(side>0?2:0))%labels.length];house(side*17,z,20,16,5.5+(i%3)*1.4,label);}
 for(const side of [-1,1])for(let col=0;col<2;col++)for(let i=0;i<5;i++){const x=side*(39+col*20),z=52-i*27;house(x,z,20,18,5+(i%2)*2,'');}
 // Grey stone arch, layered beams and relief medallions rather than a generic red gate.
 const arch=new THREE.Group();arch.position.set(0,0,63);root.add(arch);const stone=textured('#c1c0aa','brick',2),detail=mat('#979f8c');
 for(const x of [-12,-5,5,12]){box(arch,1.35,13,1.45,x,6.5,0,stone);box(arch,2.7,.55,3,x,.3,0,stone);add(arch,new THREE.SphereGeometry(.52,10,8),detail,[x,13.6,0]);for(const z of [-1.2,1.2]){const buttress=box(arch,.95,1.3,2,x,.9,z,detail);buttress.rotation.x=z>0?.28:-.28;}}
 box(arch,26,1.1,1.7,0,7.8,0,stone);box(arch,25.5,1.1,1.8,0,11,0,stone);box(arch,11.8,1.2,2,0,14,0,stone);box(arch,12.4,.4,2.5,0,14.8,0,detail);for(const x of [-9,9])box(arch,6,.4,2.2,x,12.1,0,detail);
 sign(arch,'老 门 东',[0,11.1,1],{width:7.5,height:2,font:150,color:'#40554e',background:'#c5c3ab'});
 for(const x of [-9,9])sign(arch,x<0?'金陵旧事':'城南烟火',[x,9.3,1],{width:4.5,height:1.2,font:115,color:'#596958',background:'#c5c3ab'});
 for(let i=0;i<15;i++){const ring=add(arch,new THREE.TorusGeometry(.3,.1,6,10),detail,[-11.2+i*1.6,7.8,.91]);}
 // The southern city wall closes the street vista.
 box(root,150,15,8,0,7.5,-73,brick);box(root,153,.6,10,0,15.2,-73,trim);for(let i=0;i<38;i++)box(root,2.4,1.8,3,-73+i*3.9,16.3,-69.8,brick);box(root,134,.3,12,0,.18,-58,paving);
 for(const side of [-1,1])for(const z of [-51,-25,0,25,52]){const x=side*7.7;add(root,new THREE.CylinderGeometry(.1,.17,4.6,8),wood,[x,2.3,z]);lamps.push(lantern(root,x,4.4,z,.75));}
 for(let i=0;i<5;i++){const z=36-i*19;for(let j=0;j<5;j++)lamps.push(lantern(root,(j-2)*3,6.6-Math.cos((j-2)/2)*.8,z,.47));}
 const pots=mat('#947256');for(const [x,z]of [[-9,34],[9,10],[-9,-16],[9,-38],[-27,62],[28,64]]){add(root,new THREE.CylinderGeometry(.8,.6,1,10),pots,[x,.5,z]);add(root,new THREE.SphereGeometry(1.1,10,8),mat('#577a50'),[x,1.6,z]);}
 const points=[[-30,0,65,7],[29,0,66,8],[-38,0,-58,7],[35,0,-58,8],[-57,0,13,7],[58,0,-14,7]];const wind=trees(root,points,{seed:28});for(const [x,z]of [[-23,63],[25,62],[-18,-58],[18,-58]])bench(root,x,z,0);
 const paths=[makePath([[0,.35,76],[2,.35,45],[-1,.35,18],[2,.35,-12],[0,.35,-54],[3,.35,-24],[0,.35,76]]),makePath([[-64,.35,12],[-24,.35,12],[0,.35,12],[52,.35,12],[0,.35,12],[-64,.35,12]])];const people=visitors(root,paths,{count:30,seed:80});
 // A few shop tables give the dining stops a readable human scale.
 for(const [x,z]of [[-8,23],[8,-1],[-8,-26]]){box(root,2.2,1,.9,x,.5,z,wood);for(let i=0;i<3;i++)add(root,new THREE.CylinderGeometry(.19,.16,.16,12),mat('#ead8ae'),[x+(i-1)*.5,1.08,z]);}
 optimizeStatic(root);return{root,tick(t,{night,moving}){wind(t);people(t,moving);for(const m of lamps)m.emissiveIntensity=.05+night*1.1;for(const m of warmWindows)m.emissiveIntensity=.03+night*.62;}};
}
