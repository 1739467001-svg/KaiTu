import {offers,getOffer} from './venues.js';
export const storageKey='kaitu-commerce-v3';
export function seedCommerce(){
 const events=[],coupons=[];let n=0;for(const offer of offers){for(let i=0;i<7;i++)events.push({type:'view',venue:offer.venue,seed:true});for(let i=0;i<4;i++)events.push({type:'plan',venue:offer.venue,seed:true});for(let i=0;i<2;i++){const id='DEMO-BASE-'+String(++n).padStart(3,'0');coupons.push({id,offerId:offer.id,venue:offer.venue,status:i===0?'redeemed':'issued',createdAt:'示例底稿',redeemedAt:i===0?'示例底稿':null,seed:true});}}return{version:3,events,coupons};
}
export function loadCommerce(storage){try{const s=JSON.parse(storage.getItem(storageKey));if(s?.version===3&&Array.isArray(s.events)&&Array.isArray(s.coupons)&&s.coupons.every(c=>getOffer(c.offerId)&&['issued','redeemed'].includes(c.status)))return s;}catch{}return seedCommerce();}
export function issueCoupon(state,offerId,id,now=new Date().toISOString()){
 const offer=getOffer(offerId);if(!offer)throw new Error('套餐不存在');const existing=state.coupons.find(c=>!c.seed&&c.offerId===offerId&&c.status==='issued');if(existing)return existing;if(state.coupons.some(c=>c.id===id))throw new Error('券编号重复');const coupon={id,offerId,venue:offer.venue,status:'issued',createdAt:now,redeemedAt:null,seed:false};state.coupons.push(coupon);return coupon;
}
export function redeemCoupon(state,id,now=new Date().toISOString()){const coupon=state.coupons.find(c=>c.id===id);if(!coupon)throw new Error('券不存在');if(coupon.status==='redeemed')return false;coupon.status='redeemed';coupon.redeemedAt=now;return true;}
export function metrics(state,venue){const events=state.events.filter(e=>e.venue===venue),coupons=state.coupons.filter(c=>c.venue===venue),redeemed=coupons.filter(c=>c.status==='redeemed');return{views:events.filter(e=>e.type==='view').length,plans:events.filter(e=>e.type==='plan').length,claims:coupons.length,redeemed:redeemed.length,value:redeemed.reduce((n,c)=>n+getOffer(c.offerId).price,0)};}
