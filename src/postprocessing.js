import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
export function createPostprocessing(renderer,scene,camera){
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
 const ao=new GTAOPass(scene,camera,1,1);ao.updateGtaoMaterial({radius:1.7,distanceExponent:1.3,thickness:1,scale:1,samples:8});ao.blendIntensity=.45;composer.addPass(ao);
 const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.2,.45,1.1);composer.addPass(bloom);composer.addPass(new OutputPass());
 const fxaa=new ShaderPass(FXAAShader);composer.addPass(fxaa);let high=false;
 function resize(w,h){composer.setSize(Math.max(1,w),Math.max(1,h));const ratio=renderer.getPixelRatio();fxaa.uniforms.resolution.value.set(1/(w*ratio),1/(h*ratio));}
 return{resize,get high(){return high;},toggle(){high=!high;return high;},render(mode,night){if(mode==='asset'){renderer.render(scene,camera);return;}ao.enabled=high;bloom.enabled=night>.25;bloom.strength=.16+night*.15;composer.render();},dispose(){ao.dispose();bloom.dispose();fxaa.dispose();composer.dispose();}};
}
