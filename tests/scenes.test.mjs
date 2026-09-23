import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createQixia} from '../src/scenes/qixia.js';
import {createMendong} from '../src/scenes/mendong.js';
// Geometry construction is testable without a GPU. Text rasterisation is mocked;
// browser inspection remains necessary for colour, shadows and actual shaders.
const context={fillRect(){},strokeRect(){},fillText(){}};
test('new scene geometry is finite, scaled for the viewer and animates without WebGL',()=>{
 const original=globalThis.document;globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
 try{for(const build of [createQixia,createMendong]){const {root,tick}=build();let vertices=0,instanced=0;root.traverse(o=>{if(o.isInstancedMesh)instanced++;if(o.isMesh){const p=o.geometry.attributes.position;vertices+=p.count;for(const n of p.array)assert.ok(Number.isFinite(n));}});root.updateMatrixWorld(true);const size=new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());assert.ok(size.x>100&&size.x<350);assert.ok(size.y>15&&size.y<110);assert.ok(vertices<1000000,'Keep static geometry within a bounded budget');assert.ok(instanced>=2);tick(1,{sun:{position:new THREE.Vector3(10,50,20)},night:.8,moving:true});tick(2,{sun:{position:new THREE.Vector3(10,50,20)},night:0,moving:false});}}
 finally{globalThis.document=original;}
});
