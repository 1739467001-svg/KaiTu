import * as THREE from 'three';
import {add,box,mat,textured,optimizeStatic} from './common.js';
// Main facade interpreted from the licensed ONE RS panorama, not a 3D reconstruction.
export function createGateway(){
 const root=new THREE.Group();root.name='Gateway of India · photo-reference model';
 const stone=textured('#b7aa8d','brick',3),trim=mat('#877f6c'),dark=mat('#626657'),ground=textured('#aeaaa0','paving',15);
 box(root,110,.4,90,0,-.3,10,ground);box(root,112,.15,36,0,-.5,-54,mat('#759b9d',{roughness:.3,metalness:.3}));
 // The centre arch has a real opening instead of a dark decal.
 const facade=new THREE.Shape();facade.moveTo(-12,0);facade.lineTo(-12,24);facade.lineTo(12,24);facade.lineTo(12,0);facade.lineTo(5,0);facade.lineTo(5,11);facade.absarc(0,11,5,0,Math.PI,false);facade.lineTo(-5,0);facade.closePath();
 const geo=new THREE.ExtrudeGeometry(facade,{depth:7,bevelEnabled:true,bevelSize:.13,bevelThickness:.13,bevelSegments:1,curveSegments:30});add(root,geo,stone, [0,0,-3.5]);
 for(const z of [-3.65,3.65]){const arch=new THREE.CurvePath();arch.add(new THREE.LineCurve3(new THREE.Vector3(-5.3,0,z),new THREE.Vector3(-5.3,11,z)));for(let i=0;i<32;i++){const a=Math.PI-i*Math.PI/32,b=Math.PI-(i+1)*Math.PI/32;arch.add(new THREE.LineCurve3(new THREE.Vector3(Math.cos(a)*5.3,11+Math.sin(a)*5.3,z),new THREE.Vector3(Math.cos(b)*5.3,11+Math.sin(b)*5.3,z)));}arch.add(new THREE.LineCurve3(new THREE.Vector3(5.3,11,z),new THREE.Vector3(5.3,0,z)));add(root,new THREE.TubeGeometry(arch,75,.3,6,false),trim);}
 for(const x of [-9,9]){box(root,5.6,22,10,x,11,0,stone);for(const y of [1,2,3,17.8,19.2,21.7,23])box(root,6,.27,10.5,x,y,0,trim);for(const z of [-5.1,5.1]){box(root,2.3,7.6,.15,x,7,z,dark);box(root,3.4,3.4,.15,x,15,z,trim);for(let i=0;i<9;i++)box(root,.065,3.4,.1,x-1.6+i*.4,15,z*1.02,stone);for(let i=0;i<6;i++)box(root,3.4,.065,.1,x,13.4+i*.6,z*1.02,stone);}}
 for(const y of [20.5,22,23.6])box(root,26,.4,12,0,y,0,trim);
 for(let i=0;i<21;i++){box(root,.4,1.1,.7,-12+i*1.2,21.15,5.6,stone);box(root,.4,1.1,.7,-12+i*1.2,21.15,-5.6,stone);}
 for(const x of [-10,10])for(const z of [-4.2,4.2]){add(root,new THREE.CylinderGeometry(1.4,1.45,2.8,8),stone,[x,25,z]);add(root,new THREE.CylinderGeometry(1.85,1.85,.3,8),trim,[x,26.3,z]);const dome=add(root,new THREE.SphereGeometry(1.7,16,10,0,Math.PI*2,0,Math.PI/2),stone,[x,26.4,z]);dome.scale.y=.8;add(root,new THREE.ConeGeometry(.2,.9,8),trim,[x,28,z]);}
 for(let i=0;i<4;i++)box(root,29+i*1.8,.25,16+i*2,0,-.1-i*.22,1,stone);
 // Low bollards and chain rails visible in the photograph establish human scale.
 for(const x of [-22,22])for(let z=-11;z<24;z+=4){add(root,new THREE.CylinderGeometry(.13,.19,1.1,8),dark,[x,.55,z]);if(z<20){const c=new THREE.CatmullRomCurve3([new THREE.Vector3(x,1,z),new THREE.Vector3(x,.6,z+2),new THREE.Vector3(x,1,z+4)]);add(root,new THREE.TubeGeometry(c,10,.035,4,false),dark);}}
 optimizeStatic(root);return root;
}
