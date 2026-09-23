import {plans,getOffer} from './venues.js';
const training={family:['带孩子亲子一家人小朋友家庭轻食','带娃游玩找餐厅'],photo:['拍照摄影全景拍日落相机取景红枫','想拍古寺和风景'],night:['晚上夜游灯笼夜景水幕晚饭后','夜晚散步喝茶'],relax:['慢慢逛少爬山轻松休息湖岸喝茶','沿湖赏景歇脚'],culture:['古建筑寺庙历史文化石塔素食午餐','参观栖霞寺舍利塔'],food:['第一次南京当地特色鸭血粉丝盐水鸭逛吃','边走边吃南京风味'],budget:['便宜省钱预算甜品梅花糕糕点','三十元以内只吃甜品']};
const tokens=text=>{const chars=[...text.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')];return [...chars,...chars.slice(1).map((c,i)=>chars[i]+c)];};
// Tiny on-device multinomial Naive Bayes intent model. It selects reviewed
// catalog plans; it cannot invent shops, prices, live availability or ingredients.
const vocab=new Set(),models=Object.fromEntries(Object.entries(training).map(([intent,sentences])=>{const counts=new Map();for(const sentence of sentences)for(const t of tokens(sentence)){vocab.add(t);counts.set(t,(counts.get(t)||0)+1);}return[intent,{counts,total:[...counts.values()].reduce((a,b)=>a+b,0)}];}));
export function recommend(venueId,query){
 const input=String(query).slice(0,500),ts=tokens(input).filter(t=>vocab.has(t));
 const budget=input.match(/(?:预算\s*)?(\d+)\s*元/),minutes=input.match(/(\d+)\s*分钟/),people=input.match(/([一二两三四五六]|\d+)\s*(?:个人|人)/);
 const maxBudget=budget?Number(budget[1]):Infinity,maxMinutes=minutes?Number(minutes[1]):Infinity,peopleCount=people?({'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6}[people[1]]||Number(people[1])):null;
 const noClimb=/少爬|不爬|不想爬|不登山/.test(input),vegetarian=/素食|不吃肉|不吃鸭/.test(input),noSweet=/不吃甜|不要甜|不想吃甜/.test(input),allergy=/过敏|忌口/.test(input);
 if(allergy)return{plan:null,mode:'local-intent',reason:'示例菜品没有经过核实的配方与过敏原数据，不能据此推荐安全餐食。请先向商家确认。'};
 const eligible=plans.filter(p=>p.venue===venueId&&p.budget<=maxBudget&&p.duration<=maxMinutes&&(!peopleCount||p.people===peopleCount)&&(!noClimb||!p.stops.includes('q-maple'))&&(!vegetarian||p.offerIds.every(id=>!getOffer(id).items.some(i=>/鸭|肉/.test(i))))&&(!noSweet||!p.offerIds.some(id=>/cake/.test(id))));
 if(!eligible.length)return{plan:null,mode:'local-intent',reason:'现有示例没有同时满足人数、餐饮预算和停留时间的方案。可以直接选择下方完整示例，或调整条件。'};
 if(!ts.length)return{plan:null,mode:'local-intent',reason:'暂未识别到可支持的出游需求。试试“拍日落”“预算30元”或下方预置示例。'};
 const score=p=>ts.reduce((sum,t)=>sum+Math.log(((models[p.intent]?.counts.get(t)||0)+1)/((models[p.intent]?.total||1)+vocab.size)),0);
 eligible.sort((a,b)=>score(b)-score(a));return{plan:eligible[0],mode:'local-intent',reason:'本地意图模型从已审核示例中选出方案，再按人数、时间和餐饮预算校验；没有调用云端大模型。'};
}
