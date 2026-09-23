export const instaSample = {
 id:'gateway-one-rs', title:'印度门 · 孟买', camera:'Insta360 ONE RS', author:'Fuzheado',
 src:'/panoramas/insta360-one-rs-gateway.jpg', fileName:'insta360-one-rs-gateway.jpg',
 source:'https://commons.wikimedia.org/wiki/File:Pano-20230403-Gateway-of-India.jpg',
 license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',
 dimensions:'6528 × 3264', note:'公开授权实拍 · 非南京 / 非 X4 Air · 单点 360° 全景'
};
export const venueMedia = {
 xianlin:{name:'仙林度假村',source:'https://corporate.clubmed/strongclub-med-10-8-strong-105141/',note:'尚未找到同时具备机型证明和原片复用授权的仙林度假村 360° 素材。当前保留参考模型，现场拍摄后可替换。'},
 qixia:{name:'栖霞山',photo:'/images/qixia-photo.jpg',photoTitle:'栖霞寺山门 · 历史实景参考',author:'Farm',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',source:'https://commons.wikimedia.org/wiki/File:Gate_of_Qixia_Temple_nanjing.jpg',tour:'https://720.vrqjcs.com/t/910d0f6d48a30e96',tourSource:'https://www.vrqjcs.com/p/910d0f6d48a30e96',tourStatus:'unavailable',tourAuthor:'江南君',note:'公开全景历史记录 · 发布于 2023-12-25 · 拍摄机型未披露。2026-09-23 播放器返回“未查询到相关项目”，暂不可播放；不作为影石实拍证明。'},
 mendong:{name:'老门东',photo:'/images/laomendong-photo.jpg',photoTitle:'老门东牌坊 · 实景参考',author:'Zhou Guanhuai',license:'CC0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',source:'https://commons.wikimedia.org/wiki/File:Laomendong_(Nanjing).jpg',tour:'https://720.vrqjcs.com/t/efb593c77e7a4da9',tourSource:'https://www.vrqjcs.com/p/efb593c77e7a4da9',tourStatus:'unavailable',tourAuthor:'江南君',note:'公开全景历史记录 · 发布于 2023-12-25 · 拍摄机型未披露。2026-09-23 播放器返回“未查询到相关项目”，暂不可播放；不作为影石实拍证明。'}
};
export function createMediaLibrary({world,getVenueId,onInstaSample}){
 const dialog=document.querySelector('#media-dialog');let view='photo';
 const link=(url,text)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;
 function render(){const m=venueMedia[getVenueId()];if(view==='tour'&&!m.tour)view='photo';
 dialog.innerHTML=`<div class="media-head"><div><span class="eyebrow">来自真实世界的明信片</span><h2>${m.name} · 实景资料夹</h2></div><button class="square" id="close-media" aria-label="关闭实景资料夹">×</button></div><div class="media-tabs"><button data-media="photo" aria-pressed="${view==='photo'}">实景对照</button>${m.tour?`<button data-media="tour" aria-pressed="${view==='tour'}">全景检索记录</button>`:''}<button id="media-insta">影石实拍样例 ↗</button></div><div class="media-body">${view==='tour'?`<div class="tour-unavailable"><span class="archive-stamp">检索记录 · 暂不可播放</span><h3>找到过这里的全景，<br/>但旧播放器已无法打开。</h3><p>${m.note}</p><p>原页署名：${m.tourAuthor}。保留线索供后续联系作者，当前不加载失效播放器。</p>${link(m.tourSource,'查看原站介绍页')}<p class="small">可以切回实景对照，或点击右上方「影石实拍样例」，体验已嵌入的 360° 影像。</p></div>`:m.photo?`<figure><img src="${m.photo}" alt="${m.photoTitle}"/><figcaption><b>${m.photoTitle}</b><span>${m.author} · ${link(m.licenseUrl,m.license)} · 原文件未修改</span>${link(m.source,'照片原始出处')}</figcaption></figure><div class="media-explanation"><b>照片提供纹理与建筑特征，模型提供空间交互。</b><p>三维模型按公开照片人工参考建模，尚未测绘配准。公开全景与照片的拍摄日期不同，不代表当前活动或店铺状态。</p></div>`:`<div class="media-pending"><div class="postcard-art"></div><h3>仙林水岸，等待你的实拍。</h3><p>${m.note}</p>${link(m.source,'查看 Club Med 官方资料')}<p>现在可以先体验已嵌入的 Insta360 ONE RS 实拍样例，演示全景浏览与横竖版取景。</p><small>上图为 AI 创意插画，非现场照片。</small></div>`}</div><div class="media-footer"><span>资料来源与复用方式清晰可查</span>${link('/ASSET_LICENSES.md','素材署名与授权记录')}</div>`;
 dialog.querySelector('#close-media').onclick=()=>dialog.close();dialog.querySelectorAll('[data-media]').forEach(b=>b.onclick=()=>{view=b.dataset.media;render();});dialog.querySelector('#media-insta').onclick=()=>{dialog.close();onInstaSample();};
 }
 dialog.addEventListener('close',()=>{dialog.querySelector('iframe')?.remove();world?.setPaused(false);});
 return{open(next='photo'){view=next;render();world?.setPaused(true);dialog.showModal();}};
}
