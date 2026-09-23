import * as THREE from 'three';
import {add,box,mat,textured,seeded,chineseHall,roof,sign,trees,bench,visitors,makePath,reflectiveWater,optimizeStatic} from './common.js';
export function createQixia(){
 const root=new THREE.Group();root.name='Qixia reference landscape';const grass=textured('#939771','paving',18),stone=textured('#c7bfa7','paving',8),red=mat('#ae6748'),wood=mat('#72543a'),tile=textured('#92917e','tile',3);
 const elevation=(x,z)=>{const hills=42*Math.exp(-((x+55)**2/1700+(z+68)**2/1100))+53*Math.exp(-((x-35)**2/2100+(z+75)**2/1500));const ramp=THREE.MathUtils.smoothstep(-z,8,51);const clear=1-.85*Math.exp(-(x*x/800+(z+15)**2/800));const towerClear=1-THREE.MathUtils.smoothstep(12-Math.hypot(x-27,z+34),0,7);return hills*ramp*clear*towerClear;};
 const terrain=new THREE.PlaneGeometry(220,212,76,76);terrain.rotateX(-Math.PI/2);const positions=terrain.attributes.position;for(let i=0;i<positions.count;i++)positions.setY(i,elevation(positions.getX(i),positions.getZ(i)));terrain.computeVertexNormals();add(root,terrain,grass);
 box(root,223,5,215,0,-2.8,0,mat('#6c7964'));box(root,52,.25,82,0,.2,13,stone);box(root,15,.26,162,0,.2,4,stone);box(root,93,.28,9,-20,.2,21,stone);box(root,76,.26,8,0,.2,-19,stone);
 // The public landmark relation is retained; dimensions are scene reference units.
 chineseHall(root,{z:24,w:30,d:9,h:5,label:''});chineseHall(root,{z:-3,y:.45,w:35,d:18,h:7,label:'大雄宝殿',double:true});chineseHall(root,{z:-32,y:1,w:27,d:14,h:6,label:'藏经楼'});
 for(const x of [-24,24]){chineseHall(root,{x,z:-9,w:11,d:44,h:4,red:false});box(root,.6,3.5,79,x*1.3,1.75,-1,red);}
 for(let i=0;i<7;i++)box(root,13,.22,1.25,0,.25+i*.2,11-i*1.1,stone);
 // Three arched portals and blue plaque reflect the recognisable red frontage.
 for(const x of [-8,0,8]){const portal=new THREE.Shape();portal.moveTo(-1.55,0);portal.lineTo(1.55,0);portal.lineTo(1.55,2.45);portal.absarc(0,2.45,1.55,0,Math.PI,false);portal.lineTo(-1.55,0);const doorway=add(root,new THREE.ShapeGeometry(portal,24),mat('#302d25'),[x,.76,28.67]);}
 sign(root,'栖 霞 古 寺',[0,5.8,28.76],{width:7.4,height:1.55,color:'#eee2b1',background:'#3b5c64',font:115});
 // Mingjing Lake: curving shore, bridge, a small pavilion and shoreline planting.
 const shape=new THREE.Shape();for(let i=0;i<=64;i++){const a=i/64*Math.PI*2,x=-30+Math.cos(a)*18,z=40+Math.sin(a)*13;i?shape.lineTo(x,-z):shape.moveTo(x,-z);}shape.closePath();const lakeGeo=new THREE.ShapeGeometry(shape);lakeGeo.rotateX(-Math.PI/2);const water=reflectiveWater(root,lakeGeo,[0,.35,0],'#527f6b');
 for(let i=0;i<11;i++){const x=-39+i*1.8,y=.8+Math.sin(i/10*Math.PI)*1.7;box(root,1.9,.3,3.6,x,y,40,stone);for(const z of [38.1,41.9]){box(root,.18,1.25,.18,x,y+.65,z,stone);box(root,2, .12,.16,x,y+1.25,z,stone);}}
 const pavilion=new THREE.Group();pavilion.position.set(-42,1,33);root.add(pavilion);add(pavilion,new THREE.CylinderGeometry(4.6,4.8,.5,6),stone);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;add(pavilion,new THREE.CylinderGeometry(.16,.21,3.7,10),wood,[Math.cos(a)*3.5,2,Math.sin(a)*3.5]);}const pagRoof=add(pavilion,new THREE.ConeGeometry(5.4,2,6),tile,[0,4.8,0]);pagRoof.rotation.y=Math.PI/6;
 // The stupa is an octagonal, five-storey close-eaved interpretation.
 const pagoda=new THREE.Group();pagoda.position.set(27,2,-34);root.add(pagoda);const limestone=textured('#d7cbb4','brick',2);add(pagoda,new THREE.CylinderGeometry(4.3,5.6,1.3,8),limestone,[0,.65,0]);
 for(let f=0;f<5;f++){const radius=3.7-f*.34,yy=1.3+f*2.8;add(pagoda,new THREE.CylinderGeometry(radius,radius+.12,2.2,8),limestone,[0,yy+1,0]);add(pagoda,new THREE.CylinderGeometry(radius+.55,radius+.95,.46,8),limestone,[0,yy+2.25,0]);add(pagoda,new THREE.CylinderGeometry(radius+.9,radius+.1,.66,8),limestone,[0,yy+2.8,0]);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;const relief=box(pagoda,.52,.8,.09,Math.sin(a)*(radius+.07),yy+1.1,Math.cos(a)*(radius+.07),mat('#a59b86'));relief.rotation.y=a;}}
 add(pagoda,new THREE.ConeGeometry(1.2,2.7,8),limestone,[0,16,0]);add(pagoda,new THREE.SphereGeometry(.4,12,8),limestone,[0,17.5,0]);
 // Entrance and a deliberately fictional dining touchpoint sit outside the temple.
 const gate=new THREE.Group();gate.position.set(0,0,66);root.add(gate);for(const x of [-9,-4,4,9])box(gate,.7,6,.7,x,3,0,wood);box(gate,21,.75,1.4,0,6,0,wood);roof(gate,23,4,1.6,6.4,tile,.6);sign(gate,'栖霞山',[0,5.3,.8],{width:7,height:1.8,font:130});
 const tea=chineseHall(root,{x:-51,z:12,w:18,d:12,h:4,red:false,label:'山下茶点 · 示例'});for(const x of [-56,-48])for(const z of [23,28]){add(root,new THREE.CylinderGeometry(1.1,1.1,.12,16),wood,[x,.9,z]);for(const dx of [-1.6,1.6])add(root,new THREE.CylinderGeometry(.43,.48,.5,10),wood,[x+dx,.3,z]);}sign(root,'茶  /  桂花糕',[-51,2,18.2],{width:5,height:1.3,font:95});
 const random=seeded(836),points=[];for(let i=0;i<1450&&points.length<440;i++){const x=(random()-.5)*209,z=(random()-.5)*200;if(Math.abs(x)<35&&z<50&&z>-50||((x+30)/22)**2+((z-40)/17)**2<1||Math.abs(x)<12||Math.abs(z-21)<7||x<-39&&x>-64&&z>1&&z<33)continue;points.push([x,elevation(x,z),z,4+random()*5]);}const wind=trees(root,points,{autumn:true,seed:21});
 for(const [x,z,r]of [[13,49,0],[-13,53,0],[-47,52,.7],[12,-51,0],[-61,25,1.6]])bench(root,x,z,r);
 const people=visitors(root,[makePath([[0,.4,74],[0,.4,42],[0,.4,32],[12,.4,30],[0,.4,42],[0,.4,74]]),makePath([[-44,.4,27],[-40,.4,51],[-14,.4,52],[-6,.4,37],[-44,.4,27]])],{count:20,seed:8});optimizeStatic(root);
 return{root,tick(t,{sun,night,moving}){wind(t);people(t,moving);water.tick(t,sun,night);}};
}
