import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { graph } from './data.js';
import {createEnvironment} from './environment.js';

import {getVenue} from './venues.js';
import {createQixia} from './scenes/qixia.js';
import {createMendong} from './scenes/mendong.js';
import {upgradeResort} from './scenes/resort-upgrade.js';
import {optimizeStatic,trees as buildTrees} from './scenes/common.js';
import {createPostprocessing} from './postprocessing.js';
import {routeForStops} from './journeys.js';
import {createGateway} from './scenes/gateway.js';

export function createWorld(container, onSelect){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#dce6dc');scene.fog=new THREE.Fog('#dce6dc',380,850);
 const camera=new THREE.PerspectiveCamera(39,1,.05,1600);camera.position.set(185,165,220);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;container.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=8;controls.maxDistance=350;controls.maxPolarAngle=Math.PI/2-.04;controls.target.set(0,0,0);controls.autoRotateSpeed=.45;
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
 const hemisphere=new THREE.HemisphereLight('#f1f5e0','#709284',1.35);scene.add(hemisphere);
 const sun=new THREE.DirectionalLight('#fff3cf',2.5);sun.position.set(-90,170,80);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-155,right:155,top:155,bottom:-155,near:1,far:500});sun.shadow.bias=-.0005;sun.shadow.normalBias=.25;scene.add(sun);
 const resort=new THREE.Group();scene.add(resort);const interior=new THREE.Group();interior.visible=false;scene.add(interior);const assets=new THREE.Group();assets.visible=false;scene.add(assets);
 const material=(c,props={})=>new THREE.MeshStandardMaterial({color:c,roughness:.8,...props});
 const grass=material('#6b8260'),stone=material('#bdb6a3'),roof=material('#a5aaa0'),glass=material('#355d5c',{metalness:.35,roughness:.25}),wood=material('#aa8c66'),pathMat=material('#d4cbb5'),leaf=material('#547f64'),trunk=material('#71634e'),dark=material('#1a4041');
 function mesh(geo,mat,pos,parent=resort){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,x,y,z,mat,parent=resort){return mesh(new THREE.BoxGeometry(w,h,d),mat,[x,y,z],parent);}
 const base=mesh(new THREE.CylinderGeometry(130,134,5,96),grass,[0,-3,0]);base.scale.z=.85;
 mesh(new THREE.CylinderGeometry(134,136,2,96),material('#536d58'),[0,-6.3,0]).scale.z=.85;
 const ground=mesh(new THREE.PlaneGeometry(1800,1800),material('#dce6dc'),[0,-8,0],scene);ground.rotation.x=-Math.PI/2;
 function line(points,color,width=.2,parent=resort,closed=false){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),closed,'centripetal');return mesh(new THREE.TubeGeometry(curve,Math.max(16,points.length*8),width,5,closed),material(color),[0,0,0],parent);}
 // Interpretation of the curved hotel zone A in the historic planning drawing.
 const centerZ=19;
 function arc(radius,depth,height,start,end,y,mat,parent=resort){const shape=new THREE.Shape();const n=Math.ceil((end-start)*24);for(let i=0;i<=n;i++){const a=start+(end-start)*i/n;const x=Math.cos(a)*(radius+depth/2),z=Math.sin(a)*(radius+depth/2)+centerZ;i?shape.lineTo(x,-z):shape.moveTo(x,-z);}for(let i=n;i>=0;i--){const a=start+(end-start)*i/n;const x=Math.cos(a)*(radius-depth/2),z=Math.sin(a)*(radius-depth/2)+centerZ;shape.lineTo(x,-z);}shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,curveSegments:40});geo.rotateX(-Math.PI/2);return mesh(geo,mat,[0,y,0],parent);}
 arc(69,24,.45,Math.PI*.97,Math.PI*2.03,0,pathMat);
 const wings=[[Math.PI*1.02,Math.PI*1.39],[Math.PI*1.44,Math.PI*1.98]];
 for(const [start,end] of wings){
  arc(67,13,15.8,start,end,.6,stone);arc(67,14.8,.65,start-.01,end+.01,16.4,roof);
  for(let f=0;f<4;f++){
   arc(59.8,2,.35,start,end,1.2+f*3.8,stone);
   const n=Math.round((end-start)*67/3.4);
   for(let i=0;i<n;i++){
    const a=start+(end-start)*(i+.5)/n;
    for(const r of [59.9,73.6]){const win=box(2.6,2.65,.25,Math.cos(a)*r,2.8+f*3.8,Math.sin(a)*r+centerZ,glass);win.rotation.y=-a-Math.PI/2;}
    const p=box(.22,3.6,1.4,Math.cos(a)*58.9,2.7+f*3.8,Math.sin(a)*58.9+centerZ,stone);p.rotation.y=-a-Math.PI/2;
    const bal=box(2.8,.58,.1,Math.cos(a)*58.8,1.7+f*3.8,Math.sin(a)*58.8+centerZ,wood);bal.rotation.y=-a-Math.PI/2;
   }
  }
  for(let a=start+.07;a<end;a+=.18){const ac=box(1.8,.7,1.6,Math.cos(a)*68,17.05,Math.sin(a)*68+centerZ,roof);ac.rotation.y=-a;}
 }
 arc(46,13,5,Math.PI*1.13,Math.PI*1.88,.3,glass);
 arc(46,15,.5,Math.PI*1.12,Math.PI*1.89,5.35,stone);
 arc(46,12,.18,Math.PI*1.14,Math.PI*1.87,5.65,grass);
 for(let a=Math.PI*1.13;a<Math.PI*1.9;a+=.055){const p=box(.28,5,.28,Math.cos(a)*39.45,2.7,Math.sin(a)*39.45+centerZ,wood);p.rotation.y=-a;}
 const arrival=box(18,6,11,-7,3,-49,glass);box(20,.5,13,-7,6.2,-49,stone);
 box(3,.3,12,-7,.4,-34,stone);
 // Pool and waterside terraces visible in the official exterior photograph.
 for(let i=0;i<4;i++)box(36+i*4,.25,1.4,0,.8-i*.17,8+i*2,stone);
 box(31,.4,7,0,.25,0,stone);
 const pool=box(29,.12,5.6,0,.5,0,material('#68bbb6',{metalness:.3,roughness:.18}));
 for(let x=-14;x<=14;x+=4){box(1.2,.22,2.2,x,.65,6,wood);}
 const lakeShape=new THREE.Shape();const outline=[];
 for(let i=0;i<64;i++){const a=i/64*Math.PI*2;const r=1+.06*Math.sin(a*3)+.045*Math.cos(a*5);const x=Math.cos(a)*53*r,z=Math.sin(a)*39*r+38;outline.push([x,-.05,z]);i?lakeShape.lineTo(x,-z):lakeShape.moveTo(x,-z);}lakeShape.closePath();
 const lakeGeo=new THREE.ShapeGeometry(lakeShape,64);lakeGeo.rotateX(-Math.PI/2);
 const waterMat=new THREE.ShaderMaterial({uniforms:{time:{value:0},night:{value:0}},vertexShader:`varying vec3 p; void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 p;uniform float time;uniform float night;void main(){float w=sin(p.x*.40+p.z*.7+time*.65)*sin(p.z*.9-time*.35);float lines=pow(max(0.,sin(p.z*2.+p.x*.18+time*.25)),20.);vec3 c=mix(vec3(.22,.53,.52),vec3(.43,.68,.61),w*.18+.45);c+=lines*.04; c=mix(c,c*.39,night);float glint=pow(max(0.,sin(p.x*.22+p.z*.7+time*.2)),30.)*.09*(1.-night);c+=glint;gl_FragColor=vec4(c,1.);}`});
 const oldLake=mesh(lakeGeo,waterMat,[0,-.03,0]);line(outline,'#b6c0a0',.65,resort,true);
 // Footpaths are schematic, not measured routes.
 const walk=[];for(let a=Math.PI*.05;a<Math.PI*1.98;a+=.08)walk.push([Math.cos(a)*84,.1,Math.sin(a)*75+11]);line(walk,'#cdc7ad',2.2);
 const boardwalk=[];for(let a=Math.PI*1.15;a<Math.PI*1.88;a+=.07)boardwalk.push([Math.cos(a)*36,.12,Math.sin(a)*34+centerZ]);line(boardwalk,'#d1c2a6',1.1);
 // Small-scale context outside the hotel zone. No residential buildings are claimed as resort rooms.
 for(let x=-64;x<=64;x+=16) {box(8,.12,15,x,0,-78,pathMat);for(let z=-83;z<=-73;z+=5)line([[x-3,.1,z],[x+3,.1,z]],'#f2edcc',.08);}
 let seed=2026;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const trees=[];for(let i=0;i<730;i++){const x=(random()-.5)*248,z=(random()-.5)*210;const radial=Math.hypot(x,z/0.85);const lakeTest=(x/60)**2+((z-38)/45)**2;const a=Math.atan2(z-centerZ,x),rad=Math.hypot(x,z-centerZ);if(radial>124||lakeTest<1.15||((a<0||a>3)&&rad>32&&rad<82)||Math.abs(z+78)<11)continue;trees.push([x,z,2+random()*3.5]);}
 const treeWind=buildTrees(resort,trees.map(([x,z,h])=>[x,0,z,h+1]),{seed:483});
 const fountain=new THREE.Group();fountain.visible=false;resort.add(fountain);for(let i=0;i<21;i++){const x=(i-10)*1.5;const h=1.2+4*Math.sin(i/20*Math.PI);const jet=mesh(new THREE.CylinderGeometry(.075,.12,h,5),material('#bae7db',{transparent:true,opacity:.65}),[x,h/2,35],fountain);jet.userData.height=h;}
 // An intentionally separate demo restaurant; never presented as a surveyed floor plan.
 box(36,.5,34,0,-.5,0,pathMat,interior);box(36,6,.45,0,2.8,-17,stone,interior);box(.4,6,34,-18,2.8,0,glass,interior);box(.4,6,34,18,2.8,0,glass,interior);
 for(let x=-16;x<18;x+=4)box(.2,6,.8,x,2.8,-16.6,wood,interior);
 for(const [id,g] of Object.entries(graph)){if(['local','noodle','fruit','dessert'].includes(id)){const [x,,z]=g.position;box(5,1.7,3.2,x, .7,z-3,wood,interior);box(5.4,.15,3.5,x,1.63,z-3,stone,interior);for(let i=-1;i<=1;i++){mesh(new THREE.CylinderGeometry(.56,.5,.1,24),material('#faf1d8'),[x+i*1.35,1.77,z-3],interior);mesh(new THREE.SphereGeometry(.39,12,8),material(id==='fruit'?'#b87339':id==='local'?'#996c43':'#97a764'),[x+i*1.35,1.92,z-3],interior).scale.y=.5;}}}
 for(const x of [-5,5])for(const z of [-11,-3,8]){mesh(new THREE.CylinderGeometry(1.5,1.5,.18,32),stone,[x,1.4,z],interior);mesh(new THREE.CylinderGeometry(.22,.4,1.4,12),wood,[x,.65,z],interior);for(let a=0;a<6.2;a+=Math.PI/2)box(.8,.15,.8,x+Math.cos(a)*2, .65,z+Math.sin(a)*2,wood,interior);}
 let activeVenue='xianlin';
 const builds={};
 const outdoorRoute=new THREE.Group();scene.add(outdoorRoute);let routeCurve=null,routeBeacon=null;
 let assetIsDemo=false,assetCredit=null,paused=false,referenceModel=null;
 let routeLine=null,routeDots=[],mode='resort',flight=null,splat=null,panorama=null,spark=null,assetUrl=null;
 const highlights=new THREE.Group();interior.add(highlights);
 const captureRoute=new THREE.Group();resort.add(captureRoute);captureRoute.visible=false;
 const capturePoints=[];for(let a=0;a<Math.PI*2;a+=.08)capturePoints.push([Math.cos(a)*84,.5,Math.sin(a)*75+11]);line(capturePoints,'#e2bc64',.24,captureRoute,true);
 const counterElements=Object.entries(graph).filter(([id])=>['local','noodle','fruit','dessert'].includes(id)).map(([id,g])=>{const el=document.createElement('div');el.className='marker';el.style.pointerEvents='none';el.textContent=({local:'金陵风味台',noodle:'现煮面档',fruit:'鲜果台',dessert:'烘焙甜品台'})[id];el.hidden=true;document.querySelector('#markers').append(el);return{id,el,position:[g.position[0],2.5,g.position[2]-3]};});
 let markerElements=[];
 function rebuildMarkers(){markerElements.forEach(({el})=>el.remove());markerElements=getVenue(activeVenue).places.map((place,i)=>{const el=document.createElement('button');el.className='marker';el.innerHTML=`<span class="number">0${i+1}</span>${place.name}`;el.onclick=()=>onSelect(place.id);document.querySelector('#markers').append(el);return{el,place};});}rebuildMarkers();
 function fly(pos,target){flight={from:camera.position.clone(),to:new THREE.Vector3(...pos),targetFrom:controls.target.clone(),target:new THREE.Vector3(...target),start:performance.now()};}
 function setMode(next){mode=next;if(next!=='asset'){camera.fov=camera.aspect<.9?55:39;camera.updateProjectionMatrix();}ground.visible=next!=='asset';controls.maxPolarAngle=Math.PI/2-.04;resort.visible=next==='resort'&&activeVenue==='xianlin';Object.entries(builds).forEach(([id,b])=>b.root.visible=next==='resort'&&activeVenue===id);outdoorRoute.visible=next==='resort';interior.visible=next==='interior';assets.visible=next==='asset';if(routeLine)routeLine.visible=next==='interior';controls.minDistance=next==='resort'?8:.1;controls.maxDistance=next==='resort'?350:200;controls.enablePan=next!=='panorama';markerElements.forEach(({el})=>el.hidden=next!=='resort');counterElements.forEach(({el})=>el.hidden=next!=='interior');scene.fog=next==='resort'?new THREE.Fog(scene.background,380,850):null;}
 function focus(id){setMode('resort');const p=getVenue(activeVenue).places.find(x=>x.id===id)||getVenue(activeVenue).places[0];fly(p.camera,p.look);markerElements.forEach(({el,place})=>el.classList.toggle('selected',place.id===id));}
 function restaurant(){setMode('interior');fly([37,35,48],[0,0,0]);}
 function selectCounters(nodes,focusNode){while(highlights.children.length){const m=highlights.children[0];highlights.remove(m);m.geometry.dispose();m.material.dispose();}counterElements.forEach(c=>c.el.classList.toggle('selected',nodes.includes(c.id)));for(const id of nodes){const p=graph[id].position;const ring=mesh(new THREE.TorusGeometry(2.8,.10,8,40),material('#e6bd59',{emissive:'#db9e37',emissiveIntensity:1}),[p[0],.1,p[2]-3],highlights);ring.rotation.x=-Math.PI/2;}if(focusNode){const p=graph[focusNode].position;setMode('interior');fly([p[0]+20,27,p[2]+32],[p[0],1,p[2]-3]);}}
 function drawRoute(nodes){if(routeLine){scene.remove(routeLine);routeLine.geometry.dispose();routeLine.material.dispose();routeLine=null;}routeDots.forEach(m=>{scene.remove(m);m.geometry.dispose();m.material.dispose();});routeDots=[];const ps=nodes.map(n=>new THREE.Vector3(...graph[n].position));if(ps.length>1){const c=new THREE.CurvePath();for(let i=1;i<ps.length;i++)c.add(new THREE.LineCurve3(ps[i-1],ps[i]));routeLine=mesh(new THREE.TubeGeometry(c,150,.10,8,false),material('#e5a343',{emissive:'#ca8835',emissiveIntensity:.4}),[0,0,0],scene);}restaurant();}
 async function importAsset(file,{demo=false,credit=null}={}){
  const ext=file.name.split('.').pop().toLowerCase();if(file.size>300*1024*1024)throw new Error('文件超过 300 MB，请先裁剪或压缩为 SPZ。');
  const url=URL.createObjectURL(file);let candidate;
  try{
   if(['jpg','jpeg','png','webp'].includes(ext)){
    const texture=await new THREE.TextureLoader().loadAsync(url);const im=texture.image;if(Math.abs(im.width/im.height-2)>.08){texture.dispose();throw new Error('请导入已拼接的 2:1 等距柱状全景图。');}
    texture.colorSpace=THREE.SRGBColorSpace;candidate=new THREE.Mesh(new THREE.SphereGeometry(60,64,32),new THREE.MeshBasicMaterial({map:texture,side:THREE.BackSide,toneMapped:false}));candidate.scale.x=-1;
   }else if(['ply','spz','splat'].includes(ext)){
    if(ext==='ply'){const header=await file.slice(0,8192).text();if(!header.includes('scale_0')||!header.includes('rot_0'))throw new Error('该 PLY 不是高斯模型（缺少 scale_0 / rot_0）。请导出 Gaussian PLY。');}
    const {SparkRenderer,SplatMesh}=await import('@sparkjsdev/spark');if(!spark){spark=new SparkRenderer({renderer});scene.add(spark);}
    candidate=new SplatMesh({fileBytes:new Uint8Array(await file.arrayBuffer()),fileName:file.name});await candidate.initialized;
   }else throw new Error('支持全景 JPG / PNG / WebP 与高斯 PLY / SPZ / SPLAT；INSV 请先拼接和重建。');
   clearAsset();assetIsDemo=demo;assetCredit=credit;assetUrl=url;assets.add(candidate);setMode('asset');
   if(['jpg','jpeg','png','webp'].includes(ext)){panorama=candidate;camera.fov=60;camera.updateProjectionMatrix();camera.position.set(...(credit?[-.01,0,0]:[0,0,.01]));controls.target.set(0,0,0);controls.minDistance=.01;controls.maxDistance=.01;controls.enablePan=false;controls.maxPolarAngle=Math.PI-.05;flight=null;}
   else{splat=candidate;const bounds=candidate.getBoundingBox();const size=bounds.getSize(new THREE.Vector3()).length();const center=bounds.getCenter(new THREE.Vector3());controls.maxDistance=Math.max(200,size*5);controls.minDistance=.05;fly([center.x+size*.7,center.y+size*.4,center.z+size*.8],center.toArray());}
   return ext;
  }catch(e){if(candidate){candidate.dispose?.();candidate.geometry?.dispose();candidate.material?.map?.dispose();candidate.material?.dispose();}URL.revokeObjectURL(url);throw e;}
 }
 function clearAsset(){if(referenceModel){const geos=new Set(),mats=new Set();referenceModel.traverse(o=>{if(o.isMesh){geos.add(o.geometry);mats.add(o.material);}});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());}assets.clear();assetCredit=null;referenceModel=null;if(splat){splat.dispose();splat=null;}if(panorama){panorama.geometry.dispose();panorama.material.map.dispose();panorama.material.dispose();panorama=null;}if(assetUrl){URL.revokeObjectURL(assetUrl);assetUrl=null;}controls.maxPolarAngle=Math.PI/2-.04;controls.enablePan=true;}
 optimizeStatic(resort);
 const resortUpgrade=upgradeResort(resort,lakeGeo,oldLake);
 const post=createPostprocessing(renderer,scene,camera);
 function resize(){const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<.9?55:39;camera.updateProjectionMatrix();post.resize(w,h);}new ResizeObserver(resize).observe(container);resize();
 const environment=createEnvironment({scene,resort,sun,hemisphere,renderer,ground,glass,waterMat,fly});
 let frames=0,last=performance.now(),fps=0,lastFrame=performance.now();const v=new THREE.Vector3();
 renderer.setAnimationLoop(t=>{
  const dt=Math.min(.1,(t-lastFrame)/1000);lastFrame=t;if(document.hidden||paused)return;waterMat.uniforms.time.value=t/1000;environment.tick(t,dt,mode,activeVenue);const night=waterMat.uniforms.night.value;const state={sun,night,moving:!matchMedia('(prefers-reduced-motion:reduce)').matches};if(mode==='resort'){if(activeVenue==='xianlin'){treeWind(t/1000);resortUpgrade.tick(t/1000,state);}else builds[activeVenue]?.tick(t/1000,state);if(routeBeacon&&routeCurve)routeBeacon.position.copy(routeCurve.getPoint((t/16000)%1));}
  if(flight){let p=Math.min(1,(t-flight.start)/1000);p=p*p*(3-2*p);camera.position.lerpVectors(flight.from,flight.to,p);controls.target.lerpVectors(flight.targetFrom,flight.target,p);if(p===1)flight=null;}
  controls.update();
  if(mode==='resort')for(const{el,place}of markerElements){v.set(...place.pos).project(camera);el.style.left=`${(v.x*.5+.5)*container.clientWidth}px`;el.style.top=`${(-v.y*.5+.5)*container.clientHeight}px`;el.hidden=environment.showActive||v.z>1||v.z<0;}
  if(mode==='interior')for(const {el,position} of counterElements){v.set(...position).project(camera);el.style.left=((v.x*.5+.5)*container.clientWidth)+'px';el.style.top=((-v.y*.5+.5)*container.clientHeight)+'px';el.hidden=v.z>1||v.z<0;}
  post.render(mode,waterMat.uniforms.night.value);frames++;if(t-last>1200){fps=Math.round(frames*1000/(t-last));frames=0;last=t;document.querySelector('#render-state').textContent=`${mode==='asset'?(assetCredit?.title||(assetIsDemo?'合成全景样例':'用户素材')):mode==='interior'?'餐厅示例空间':getVenue(activeVenue).name+' · 参考重绘'} · ${fps} FPS`;}
 });
 controls.addEventListener('start',()=>flight=null);
 function overview(){setMode('resort');controls.maxPolarAngle=Math.PI/2-.04;controls.maxDistance=350;controls.minDistance=8;const v=getVenue(activeVenue);fly(v.overview,v.target);}
 function clearJourney(){while(outdoorRoute.children.length){const m=outdoorRoute.children[0];outdoorRoute.remove(m);m.geometry?.dispose();m.material?.dispose();}routeCurve=null;routeBeacon=null;}
 function drawJourney(stops){clearJourney();const {points,anchors}=routeForStops(getVenue(activeVenue),stops);if(points.length<2)return;routeCurve=new THREE.CurvePath();for(let i=1;i<points.length;i++)routeCurve.add(new THREE.LineCurve3(new THREE.Vector3(...points[i-1]).add(new THREE.Vector3(0,.18,0)),new THREE.Vector3(...points[i]).add(new THREE.Vector3(0,.18,0))));const routeMat=new THREE.MeshStandardMaterial({color:'#ffd17e',emissive:'#d99c39',emissiveIntensity:.55,roughness:.4});const path=new THREE.Mesh(new THREE.TubeGeometry(routeCurve,250,.3,6,false),routeMat);outdoorRoute.add(path);anchors.forEach(p=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(1.4,.16,6,24),routeMat.clone());ring.rotation.x=-Math.PI/2;ring.position.set(p[0],p[1]+.4,p[2]);outdoorRoute.add(ring);});routeBeacon=new THREE.Mesh(new THREE.SphereGeometry(.8,12,8),new THREE.MeshBasicMaterial({color:'#fff4cf'}));outdoorRoute.add(routeBeacon);overview();}
 function switchVenue(id){if(!['xianlin','qixia','mendong'].includes(id))return;activeVenue=id;if(id!=='xianlin'&&!builds[id]){builds[id]=id==='qixia'?createQixia():createMendong();scene.add(builds[id].root);}clearJourney();captureRoute.visible=false;rebuildMarkers();environment.setTime(16);overview();}
 async function demoPanorama(){
  setMode('resort');environment.tick(performance.now(),0,'resort',activeVenue);const oldTarget=renderer.getRenderTarget(),oldTone=renderer.toneMapping;const cubeTarget=new THREE.WebGLCubeRenderTarget(512,{type:THREE.HalfFloatType});const cubeCamera=new THREE.CubeCamera(.1,800,cubeTarget);cubeCamera.position.set(...getVenue(activeVenue).panorama);renderer.toneMapping=THREE.NoToneMapping;cubeCamera.update(renderer,scene);
  const geo=new THREE.PlaneGeometry(2,2),shader=new THREE.ShaderMaterial({uniforms:{map:{value:cubeTarget.texture}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform samplerCube map;varying vec2 v;void main(){float lon=(v.x-.5)*6.2831853;float lat=(v.y-.5)*3.14159265;vec3 d=vec3(sin(lon)*cos(lat),sin(lat),cos(lon)*cos(lat));vec3 c=textureCube(map,d).rgb;c=c/(c+vec3(1.));c=pow(c,vec3(1./2.2));gl_FragColor=vec4(c,1.);}'});const quad=new THREE.Mesh(geo,shader),flat=new THREE.Scene();flat.add(quad);const target=new THREE.WebGLRenderTarget(2048,1024),pixels=new Uint8Array(2048*1024*4);renderer.setRenderTarget(target);renderer.render(flat,new THREE.Camera());renderer.readRenderTargetPixels(target,0,0,2048,1024,pixels);renderer.setRenderTarget(oldTarget);renderer.toneMapping=oldTone;
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;const ctx=canvas.getContext('2d'),data=ctx.createImageData(2048,1024);for(let y=0;y<1024;y++)data.data.set(pixels.subarray((1023-y)*8192,(1024-y)*8192),y*8192);ctx.putImageData(data,0,0);ctx.fillStyle='#142c32cc';ctx.fillRect(0,954,2048,70);ctx.fillStyle='#e4edc5';ctx.font='26px sans-serif';ctx.fillText('开图 · '+getVenue(activeVenue).name+' · 三维合成全景示例 / 非 X4 Air 实拍',48,999);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.92));cubeTarget.dispose();target.dispose();geo.dispose();shader.dispose();return new File([blob],activeVenue+'-demo-360.jpg',{type:'image/jpeg'});
 }
 function exportFrame(portrait=false){renderer.render(scene,camera);const c=document.createElement('canvas'),source=renderer.domElement;c.width=portrait?1080:1920;c.height=portrait?1920:1080;const ctx=c.getContext('2d'),ratio=c.width/c.height;let w=source.width,h=source.height;if(w/h>ratio)w=h*ratio;else h=w/ratio;ctx.drawImage(source,(source.width-w)/2,(source.height-h)/2,w,h,0,0,c.width,c.height);const credit=mode==='asset'&&assetCredit?.license?assetCredit:null;ctx.fillStyle='#fff7e8ee';ctx.fillRect(0,c.height-136,c.width,136);ctx.fillStyle='#355647';ctx.font='27px sans-serif';ctx.fillText('开图 · '+(credit?.title||getVenue(activeVenue).name)+' / '+(mode==='asset'?(assetIsDemo?'模型合成全景':credit?'实拍全景取景':'用户素材取景'):'三维参考场景'),28,c.height-88);ctx.font='20px sans-serif';ctx.fillText(credit?credit.author+' · '+credit.license+' · 取景裁切 / '+credit.camera:'参考模型未经测绘配准',28,c.height-53);if(credit){ctx.font='16px sans-serif';ctx.fillText(credit.licenseUrl,28,c.height-23);const record=new Blob([JSON.stringify({...credit,modifications:'Perspective reframing and attribution overlay',outputLicense:credit.license,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});download(record,'kaitu-image-credit.json');}c.toBlob(blob=>download(blob,'kaitu-'+(portrait?'portrait':'landscape')+'.jpg'),'image/jpeg',.95);}
 function download(blob,name){if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
 function showReferenceModel(){clearAsset();referenceModel=createGateway();assets.add(referenceModel);setMode('asset');controls.maxDistance=180;controls.minDistance=5;assetCredit={title:'印度门 · 照片参考模型'};assetIsDemo=false;fly([45,32,58],[0,10,0]);}
 return {renderer,showReferenceModel,setPaused(value){paused=!!value;},focus,restaurant,drawRoute,selectCounters,importAsset,environment,switchVenue,drawJourney,clearJourney,demoPanorama,exportFrame,get venue(){return activeVenue;},quality(){return post.toggle();},get highQuality(){return post.high;},street(){setMode('resort');const v=getVenue(activeVenue);fly(v.street,v.streetTarget);},showCapturePath(){setMode('resort');if(activeVenue==='xianlin'){captureRoute.visible=!captureRoute.visible;overview();return captureRoute.visible;}drawJourney(getVenue(activeVenue).places.filter(p=>p.type!=='landmark'||p===getVenue(activeVenue).places[0]).map(p=>p.id));return true;},get mode(){return mode;},overview,plan(){if(mode==='asset'&&panorama)return;fly(mode==='resort'?[0,220,.1]:[0,65,.1],[0,0,0]);},orbit(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate;},rotateAsset(){if(splat)splat.rotation.x+=Math.PI;},clearAsset};
}
