import './style.css';
import {createWorld} from './scene.js';
import {createWorkbench} from './workbench.js';
import {places,foods,graph,sources} from './data.js';
import {planRoute} from './routing.js';
const $=s=>document.querySelector(s);
let tab='explore',selected='resort',choice='all',world,workbench,toastTimer;
const selectedFoods=new Set();
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),6500);}
function setSceneCopy(title,subtitle,chip,note){$('#scene-title').textContent=title;$('#scene-subtitle').textContent=subtitle;$('#evidence-chip').textContent=chip;$('#scene-note').textContent=note;}
const resortCopy=()=>{setSceneCopy('从一段影像，到一个世界。','Club Med 南京仙林 · 场地参考模型','规划与实景参考 · 待校准','建筑与布展均待实拍校准 · 水幕为创意预演');$('.time-console').hidden=false;};
function selectPlace(id){selected=id;world?.focus(id);if(tab!=='explore')switchTab('explore',false);else render();resortCopy();}
function updateFood(focusNode){
 const picked=foods.filter(f=>selectedFoods.has(f.id));const result=picked.length?planRoute(graph,picked.map(f=>f.node)):null;
 world?.drawRoute(result?.nodes||[]);world?.selectCounters(picked.map(f=>f.node),focusNode);
 const element=$('#route-result');if(element)element.innerHTML=result?`<div class="route-result"><b>${result.stops.length} 个餐台已联动到右侧</b><br/>入口 → ${result.stops.map(s=>foods.find(f=>f.node===s).counter).join(' → ')}<small>金色路径连接所选餐台 · 未做现实距离标定</small></div>`:'<div class="route-result">点击 ＋，右侧立即高亮餐台并绘制路径。</div>';
}
function render(){
 const panel=$('#panel');$('.sidebar').className=`sidebar ${tab}`;
 if(tab==='explore'){
  panel.innerHTML=`<h3 class="section-heading">一张图，认识一个场地 <span>01 / EXPLORE</span></h3>${places.map((p,i)=>`<button class="place ${selected===p.id?'selected':''}" data-place="${p.id}"><span class="place-index">0${i+1}</span><span class="place-text"><strong>${p.name}</strong><small>${p.en}</small></span><span class="place-arrow">↗</span></button>`).join('')}<div class="place-detail"><b>${places.find(p=>p.id===selected).name}</b><br/>${places.find(p=>p.id===selected).detail}</div><button class="primary" id="start-capture">把真实场地带进来 <span>↗</span></button><div class="explore-note"><b>2026 BOLD MAKER</b><p>湖岸门头、展示旗与水幕内容已加入赛事视觉。布展为提案，等明天的照片逐一校准。</p><button class="text-button" id="toggle-events">显示 / 隐藏赛事布展</button></div>`;
  panel.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>selectPlace(b.dataset.place));$('#start-capture').onclick=()=>switchTab('capture');$('#toggle-events').onclick=()=>toast(world?.environment.toggleEvents()?'已显示赛事布展提案':'已隐藏赛事布展提案');
 }else if(tab==='capture')workbench.render(panel);
 else if(tab==='food'){
  const visible=foods.filter(f=>choice==='all'||f.type===choice);
  panel.innerHTML=`<h3 class="section-heading">场地接入后，服务如何发生？</h3><span class="data-label">服务示例 01 · 取餐路线</span><p class="work-lead">这是空间服务的一种接入样例：选择需求，看到对应点位和路径。餐台与菜单目前使用示例数据。</p><label class="field">风味偏好<select id="preference"><option value="all">随心探索 · 全部风味</option><option value="local">金陵风味</option><option value="vegetable">蔬果偏好</option><option value="sweet">甜品时刻</option></select></label><div>${visible.map(f=>`<div class="food-card ${selectedFoods.has(f.id)?'picked':''}"><span class="food-symbol">${f.symbol}</span><div class="food-info"><strong>${f.name}</strong><div class="small">${f.counter}</div></div><button data-food="${f.id}" aria-label="${selectedFoods.has(f.id)?'移除':'选择'}${f.name}" aria-pressed="${selectedFoods.has(f.id)}">${selectedFoods.has(f.id)?'✓':'+'}</button></div>`).join('')}</div><div class="selection-summary"><span>已选 ${selectedFoods.size} 道</span><button class="text-button" id="clear-food">清空选择</button></div><div id="route-result"></div><button class="primary" id="route">查看完整路径 ↗</button><p class="source-note">基于标签匹配与图路径计算，尚未接入 AI。真实菜单及配方待餐厅确认；这里的路径不能用于现场导航。</p>`;
  $('#preference').value=choice;$('#preference').onchange=e=>{choice=e.target.value;render();updateFood();};
  panel.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{const id=b.dataset.food,adding=!selectedFoods.has(id);adding?selectedFoods.add(id):selectedFoods.delete(id);render();updateFood(adding?foods.find(f=>f.id===id).node:null);toast(adding?'餐台已高亮，示例路径已更新。':'已移除该餐台，路径同步更新。');});
  $('#clear-food').onclick=()=>{selectedFoods.clear();render();updateFood();};$('#route').onclick=()=>{updateFood();world?.restaurant();};updateFood();
 }else{
  panel.innerHTML=`<h3 class="section-heading">每一处还原，都有依据。</h3><span class="data-label">公开资料参考 · 待实拍与测量校准</span>${sources.map(s=>`<a class="source-card" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗<small>${s.label}</small></a>`).join('')}<p class="source-note">弧形建筑参考 2019 年 NO.2018G23 历史规划图与官方建成照片，尚无竣工测绘图。当前不是精确数字孪生。</p><div class="evidence-row"><b>太阳与昼夜</b><span>南京城市级经纬度、2026-09-23 日期的太阳方位近似计算。尚未校准场地地理北向，不适用于建筑日照评估。</span></div><div class="evidence-row"><b>水幕与赛事布展</b><span>官方资料确认有水幕秀。19:30 为本演示的预设时刻，节目、喷头位置和当日场次均待现场确认。</span></div><div class="evidence-row"><b>明天优先补充</b><span>导览牌、楼层图、主入口立面、湖岸水幕设备、赛事背景板和签到区；附拍摄位置、朝向与一段实测距离。</span></div><a class="source-card" href="https://gml.noaa.gov/grad/solcalc/solareqns.PDF" target="_blank" rel="noopener noreferrer">太阳轨迹公式来源 ↗<small>NOAA · 太阳方位近似公式</small></a>`;
 }
}
function switchTab(next,move=true){tab=next;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.tab===next));render();if(move){if(next==='food'){world?.restaurant();setSceneCopy('一个需求，落到真实点位。','取餐服务 · 交互样例','餐厅示例空间 · 非实测','选择菜品会同步高亮餐台、更新路径');$('.time-console').hidden=true;}else if(next!=='capture'){world?.overview();resortCopy();}}}
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>switchTab(b.dataset.tab);
$('#help').onclick=()=>$('#help-dialog').showModal();document.querySelectorAll('.dialog-close').forEach(b=>b.onclick=()=>$('#help-dialog').close());
function overview(){world?.overview();resortCopy();}
$('#overview').onclick=overview;$('#plan').onclick=()=>{world?.plan();if(world?.mode==='resort')resortCopy();};$('#reset').onclick=overview;
$('#orbit').onclick=e=>{const active=world?.orbit();e.currentTarget.classList.toggle('active',active);e.currentTarget.setAttribute('aria-pressed',String(!!active));};
function syncTimeButtons(){const playing=!!world?.environment.playing;$('#play-day').textContent=playing?'Ⅱ 暂停演示':'▶ 自动演示';$('#play-day').setAttribute('aria-pressed',String(playing));}
$('#time-slider').oninput=e=>{world?.environment.setTime(Number(e.target.value));syncTimeButtons();$('#water-show').setAttribute('aria-pressed','false');$('#water-show').classList.remove('active');};
$('#play-day').onclick=()=>{world?.environment.toggleDay();syncTimeButtons();};
$('#water-show').onclick=e=>{overview();const active=world?.environment.show();syncTimeButtons();e.currentTarget.classList.toggle('active',active);e.currentTarget.setAttribute('aria-pressed',String(!!active));toast(active?'水幕创意预演 · 19:30 为演示时刻，实际场次待确认。':'已结束水幕预演；拖动时间轴切换日照。');};
try{world=createWorld($('#viewport'),selectPlace);}catch(e){$('#viewport').innerHTML='<div class="error-panel">此设备未能启动 WebGL2。请使用支持硬件加速的现代浏览器。场地档案与采集清单仍可使用。</div>';$('#render-state').textContent='三维渲染不可用';console.error(e);}
workbench=createWorkbench({world,toast,onAsset:name=>{setSceneCopy('现场，正在展开。',name,'用户导入 · 尚未配准','素材预览不自动生成道路、楼层或真实尺度');$('.time-console').hidden=true;},onReturn:resortCopy});
render();resortCopy();
// Optional WebMCP tools reuse the visible actions and preserve evidence labels.
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 for(const tool of [
  {name:'get_scene_evidence',description:'Read observed versus illustrative data in KaiTu.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({geometry:'historic-plan-and-photo-reference',interior:'illustrative',menu:'demo',waterShow:'creative-preview',realCaptureLoaded:!!workbench.assetName,view:tab})},
  {name:'navigate_to_place',description:'Move the visible reference scene camera; not real-world navigation.',inputSchema:{type:'object',properties:{placeId:{type:'string',enum:places.map(p=>p.id)}},required:['placeId'],additionalProperties:false},execute:input=>{if(!input||!places.some(p=>p.id===input.placeId))throw new Error('未知场所');selectPlace(input.placeId);return{selectedPlace:input.placeId,evidence:'reference-model'};}}
 ]){try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser capability. */}}
}
