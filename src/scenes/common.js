import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {Water} from 'three/addons/objects/Water.js';
export const mat=(color,options={})=>new THREE.MeshStandardMaterial({color,roughness:.83,...options});
export function add(parent,geometry,material,position=[0,0,0]){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...position);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
export const box=(p,w,h,d,x,y,z,m)=>add(p,new THREE.BoxGeometry(w,h,d),m,[x,y,z]);
export const seeded=(seed=17)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const textureCache=new Map();
export function surfaceTexture(kind){
 if(textureCache.has(kind))return textureCache.get(kind);
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),rand=seeded(kind.length*77);
 const tile=kind==='tile',stone=kind==='paving';g.fillStyle=tile?'#7b817b':stone?'#a5a79b':'#999f99';g.fillRect(0,0,256,256);
 const rows=tile?16:8,cols=tile?12:4,dh=256/rows,dw=256/cols;
 for(let y=0;y<rows;y++)for(let x=-1;x<=cols;x++){const offset=!tile&&y%2?dw/2:0,v=Math.floor((tile?78:stone?151:117)+rand()*28);g.fillStyle=`rgb(${v},${v+3},${v+1})`;g.fillRect(x*dw+offset+1,y*dh+1,dw-2,dh-2);g.strokeStyle=tile?'#abb0a548':'#ffffff13';g.lineWidth=1;g.strokeRect(x*dw+offset+3,y*dh+3,dw-6,dh-6);}
 for(let i=0;i<3800;i++){g.fillStyle=rand()>.5?'#f8f7e712':'#182b2412';g.fillRect(rand()*256,rand()*256,rand()*2+1,1);}
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;textureCache.set(kind,texture);return texture;
}
export function textured(color,kind,repeat=1){const map=surfaceTexture(kind).clone();map.repeat.set(repeat,repeat);map.needsUpdate=true;return mat(color,{map,bumpMap:map,bumpScale:kind==='tile'?.12:.055});}
export function curve(parent,points,material,radius=.1){const c=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return add(parent,new THREE.TubeGeometry(c,Math.max(12,points.length*5),radius,5,false),material);}
export function sign(parent,text,pos,{width=8,height=2,color='#ded8b6',background='#243a35',font=90}={}){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.round(1024*height/width);const ctx=canvas.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle=color;ctx.lineWidth=6;ctx.strokeRect(14,14,canvas.width-28,canvas.height-28);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.font=`600 ${font}px "Songti SC","Noto Serif SC",serif`;ctx.fillText(text,512,canvas.height/2,940);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return add(parent,new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false}),pos);
}
export function roof(parent,w,d,h,y,material,upturn=.55){
 const nx=24,nz=20,geo=new THREE.PlaneGeometry(w,d,nx,nz);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;
 const height=(x,z)=>{const u=Math.min(1,Math.abs(x/(w/2))),v=Math.min(1,Math.abs(z/(d/2)));return h*Math.pow(1-v,1.6)*(1-.12*Math.pow(u,6))+upturn*(Math.pow(v,5)+Math.pow(u,8));};
 for(let i=0;i<p.count;i++)p.setY(i,height(p.getX(i),p.getZ(i)));geo.computeVertexNormals();const r=add(parent,geo,material,[0,y,0]);r.material.side=THREE.DoubleSide;
 const ridge=mat('#53584f');curve(parent,Array.from({length:13},(_,i)=>{const x=(i/12-.5)*w;return[x,y+h+upturn*Math.abs(x/(w/2))**5,0];}),ridge,.16);
 for(const z of [-d/2,d/2])curve(parent,Array.from({length:13},(_,i)=>{const x=(i/12-.5)*w;return[x,y+height(x,z)-.04,z];}),ridge,.10);
 const ends=new THREE.InstancedMesh(new THREE.CylinderGeometry(.11,.11,.26,7),ridge,Math.ceil(w/.4)*2);const dummy=new THREE.Object3D();let idx=0;for(const z of [-d/2,d/2])for(let x=-w/2+.2;x<w/2;x+=.4){dummy.position.set(x,y+height(x,z),z);dummy.rotation.x=Math.PI/2;dummy.updateMatrix();if(idx<ends.count)ends.setMatrixAt(idx++,dummy.matrix);}ends.count=idx;ends.castShadow=true;parent.add(ends);return r;
}
export function chineseHall(parent,{x=0,z=0,y=0,w=24,d=13,h=6,red=true,label='',double=false}={}){
 const root=new THREE.Group();root.position.set(x,y,z);parent.add(root);const wall=mat(red?'#ad6646':'#d8d3bd'),wood=mat('#654b35'),tile=textured('#9a9b8c','tile',3),base=textured('#c7c2ae','paving',3);
 box(root,w+3,.7,d+3,0,.35,0,base);box(root,w,h,d,0,.7+h/2,0,wall);
 for(const side of [-1,1])for(let i=0;i<7;i++){const px=(i/6-.5)*(w-2);add(root,new THREE.CylinderGeometry(.23,.3,h+1,10),wood,[px,(h+1)/2+.5,side*(d/2+.35)]);if(i<6){const panel=box(root,w/7-.3,h*.65,.2,px+w/14,2.7,side*(d/2+.1),mat('#473f30'));for(let s=0;s<4;s++)box(root,.055,h*.59,.1,px+w/14+(s-1.5)*.46,2.7,side*(d/2+.25),wood);}}
 for(let j=0;j<4;j++)box(root,w*.55,.24,1+j*.45,0,.1+j*.16,d/2+1.8-j*.3,base);
 roof(root,w+4,d+4,3.3,h+1,tile,.75);if(double)roof(root,w*.75,d*.68,2.5,h+4.5,tile,.6);
 if(label)sign(root,label,[0,h-.3,d/2+.58],{width:Math.min(8,w*.5),height:1.9,color:'#eee0a6',background:'#423326',font:110});return root;
}
export function lantern(parent,x,y,z,scale=1){
 const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(scale);parent.add(group);const red=mat('#be5037',{emissive:'#fa782b',emissiveIntensity:.08,roughness:.5});const sphere=add(group,new THREE.SphereGeometry(.48,12,10),red,[0,0,0]);sphere.scale.y=1.25;const gold=mat('#b59458',{metalness:.4});for(const yy of [-.55,.55])add(group,new THREE.CylinderGeometry(.25,.25,.13,10),gold,[0,yy,0]);curve(group,[[0,-.5,0],[0,-1,0]],gold,.025);curve(group,[[0,.6,0],[0,1,0]],gold,.035);return red;
}
let foliageTexture;
function foliageMap(){
 if(foliageTexture)return foliageTexture;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=seeded(778);
 // Individual leaf strokes create an irregular silhouette at human viewing distance.
 for(let i=0;i<520;i++){const a=r()*Math.PI*2,rad=Math.sqrt(r()),x=64+Math.cos(a)*rad*53,y=64+Math.sin(a)*rad*54;g.fillStyle=`rgba(${Math.round(140+r()*100)},${Math.round(150+r()*95)},${Math.round(125+r()*110)},${.7+r()*.3})`;g.beginPath();g.ellipse(x,y,1+r()*4,1+r()*2.5,r()*Math.PI,0,Math.PI*2);g.fill();}
 foliageTexture=new THREE.CanvasTexture(c);foliageTexture.colorSpace=THREE.SRGBColorSpace;return foliageTexture;
}
export function trees(parent,points,{autumn=false,seed=38}={}){
 const rand=seeded(seed),leaf=mat('#ffffff',{map:foliageMap(),alphaTest:.45,side:THREE.DoubleSide,roughness:.92}),trunk=mat('#665546'),wind={value:0};leaf.onBeforeCompile=shader=>{shader.uniforms.canopyTime=wind;shader.vertexShader='uniform float canopyTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(canopyTime*.7+position.y*3.)*.035;');};leaf.customProgramCacheKey=()=>'kaitu-leaves-v2';
 const canopy=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),leaf,points.length*16),trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.10,.24,1,7),trunk,points.length),o=new THREE.Object3D();let k=0;
 for(let i=0;i<points.length;i++){const[x,y,z,h=5]=points[i];o.position.set(x,y+h*.34,z);o.rotation.set(0,0,0);o.scale.set(1,h*.68,1);o.updateMatrix();trunks.setMatrixAt(i,o.matrix);
 for(let j=0;j<16;j++){const a=j*2.399,size=h*(.36+rand()*.16),radius=j<12?.22:.06;o.position.set(x+Math.sin(a)*h*radius,y+h*(.58+rand()*.32),z+Math.cos(a)*h*radius);o.scale.set(size,size,1);o.rotation.set((rand()-.5)*2,rand()*Math.PI,rand()*.6);o.updateMatrix();canopy.setMatrixAt(k,o.matrix);const color=new THREE.Color();if(autumn)color.setHSL([.015,.04,.085,.12,.22][Math.floor(rand()*5)],.55+rand()*.19,.32+rand()*.18);else color.setHSL(.22+rand()*.1,.23+rand()*.2,.31+rand()*.15);canopy.setColorAt(k++,color);}
 }
 canopy.castShadow=canopy.receiveShadow=true;trunks.castShadow=true;parent.add(canopy,trunks);return time=>wind.value=time;
}
export function bench(parent,x,z,rotation=0){const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=rotation;parent.add(b);const wood=mat('#957654'),iron=mat('#354343',{metalness:.3});for(let i=0;i<5;i++)box(b,2.6,.12,.14,0,.68,(i-2)*.18,wood);for(let i=0;i<3;i++)box(b,2.6,.13,.12,0,1+i*.18,-.52,wood);for(const a of [-1,1]){box(b,.12,.8,.9,a,.3,0,iron);box(b,.12,1,.12,a,.9,-.52,iron);}return b;}
export function visitors(parent,paths,{count=18,seed=18}={}){
 const root=new THREE.Group();root.userData.skipBatch=true;parent.add(root);const rand=seeded(seed),people=[];const skin=mat('#c9a883'),trousers=mat('#384345');
 for(let i=0;i<count;i++){const p=new THREE.Group();root.add(p);const shirt=mat(['#e4dbc4','#be6c48','#487f82','#a7ad72','#586174'][i%5]);const h=1.55+rand()*.25;p.scale.setScalar(h/1.75);add(p,new THREE.CapsuleGeometry(.21,.42,3,7),shirt,[0,1.13,0]);add(p,new THREE.SphereGeometry(.17,10,8),skin,[0,1.68,0]);const legs=[];for(const x of [-.11,.11]){const pivot=new THREE.Group();pivot.position.set(x,.85,0);p.add(pivot);add(pivot,new THREE.CapsuleGeometry(.07,.53,2,6),trousers,[0,-.32,0]);legs.push(pivot);const arm=add(p,new THREE.CapsuleGeometry(.055,.4,2,6),shirt,[x*2.65,1.12,0]);arm.rotation.z=x>0?-.12:.12;}people.push({p,legs,offset:rand(),speed:.008+rand()*.006,path:paths[i%paths.length],phase:rand()*6});}
 return (time,moving=true)=>{for(const v of people){const t=(v.offset+(moving?time*v.speed:0))%1,pos=v.path.getPointAt(t),next=v.path.getPointAt((t+.003)%1);v.p.position.copy(pos);v.p.rotation.y=Math.atan2(next.x-pos.x,next.z-pos.z);v.legs[0].rotation.x=moving?Math.sin(time*5+v.phase)*.36:0;v.legs[1].rotation.x=-v.legs[0].rotation.x;}};
}
export function makePath(points,closed=false){return new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),closed,'catmullrom',.05);}
export function reflectiveWater(parent,geometry,position=[0,0,0],color='#496e69'){
 const data=new Uint8Array(128*128*4);for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4;data[i]=128+25*Math.sin(x*.45+y*.27);data[i+1]=128+25*Math.cos(y*.4-x*.2);data[i+2]=245;data[i+3]=255;}
 const normals=new THREE.DataTexture(data,128,128);normals.wrapS=normals.wrapT=THREE.RepeatWrapping;normals.needsUpdate=true;
 const water=new Water(geometry.clone().rotateX(Math.PI/2),{textureWidth:256,textureHeight:256,waterNormals:normals,sunDirection:new THREE.Vector3(-1,1,1).normalize(),sunColor:0xffefd3,waterColor:color,distortionScale:1.7,alpha:.96,fog:true});water.rotation.x=-Math.PI/2;water.position.set(...position);parent.add(water);const reflect=water.onBeforeRender;water.onBeforeRender=function(renderer,scene,camera){if(!scene.overrideMaterial)reflect.call(this,renderer,scene,camera);};water.userData.skipBatch=true;
 return {mesh:water,tick(time,sun,night=0){water.material.uniforms.time.value=time*.28;water.material.uniforms.sunDirection.value.copy(sun.position).normalize();water.material.uniforms.waterColor.value.set(color).multiplyScalar(1-night*.5);}};
}
export function optimizeStatic(root){
 root.updateMatrixWorld(true);const groups=new Map(),inverse=root.matrixWorld.clone().invert();root.traverse(mesh=>{if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material)||mesh.material.transparent)return;let a=mesh;while(a&&a!==root.parent){if(!a.visible||a.userData.skipBatch)return;a=a.parent;}const layout=Object.entries(mesh.geometry.attributes).map(([k,a])=>k+':'+a.itemSize+':'+a.normalized+':'+a.array.constructor.name).sort().join('|');const key=mesh.material.uuid+mesh.castShadow+mesh.receiveShadow+Boolean(mesh.geometry.index)+layout;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);});
 for(const group of groups.values()){if(group.length<3)continue;const geometries=group.map(m=>m.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,m.matrixWorld)));let merged;try{merged=mergeGeometries(geometries,false);}catch{/* Mixed attribute layouts keep their original meshes. */}if(merged){const batch=new THREE.Mesh(merged,group[0].material);batch.castShadow=group[0].castShadow;batch.receiveShadow=group[0].receiveShadow;root.add(batch);for(const m of group)m.removeFromParent();}geometries.forEach(g=>g.dispose());}
}
