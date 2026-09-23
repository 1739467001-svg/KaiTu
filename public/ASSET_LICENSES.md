# 开图：素材来源与复用记录

检索与接入日期：2026-09-23。所有第三方摄影作品的权利仍归各作者；开图和作者、场地方、Insta360 之间不因此形成合作或背书。

## 本地嵌入的真实影像

1. **印度门全景（孟买，非南京）**
   - 本地文件：`panoramas/insta360-one-rs-gateway.jpg`
   - 作者：**Fuzheado**。作品：Pano-20230403-Gateway-of-India.jpg。
   - 原始出处：https://commons.wikimedia.org/wiki/File:Pano-20230403-Gateway-of-India.jpg
   - 下载原文件：https://upload.wikimedia.org/wikipedia/commons/b/bc/Pano-20230403-Gateway-of-India.jpg
   - 许可：**CC BY-SA 4.0**，https://creativecommons.org/licenses/by-sa/4.0/
   - 文件 6528 × 3264；网页 EXIF 标为 Arashi Vision / Insta360 OneRS。非 X4 Air 素材。第三方元数据不是本项目硬件实测。
   - 原文件未修改；浏览器以等距柱状全景映射显示。用户导出属于透视取景裁切并叠加署名，导出的图像衍生作品同样按 CC BY-SA 4.0 提供，随附来源 JSON。不会改变原图中的人物或建筑。
2. **老门东牌坊照片**
   - 本地文件：`images/laomendong-photo.jpg`。
   - 作者：**Zhou Guanhuai**。作品：Laomendong (Nanjing).jpg。
   - 原始出处：https://commons.wikimedia.org/wiki/File:Laomendong_(Nanjing).jpg
   - 许可：**CC0**，https://creativecommons.org/publicdomain/zero/1.0/
   - 原文件未修改。用于实景对照，并参考牌坊的三段瓦檐、石柱、牌匾关系。
3. **栖霞寺山门照片**
   - 本地文件：`images/qixia-photo.jpg`。
   - 作者：**Farm**。作品：Gate of Qixia Temple nanjing.jpg。
   - 原始出处：https://commons.wikimedia.org/wiki/File:Gate_of_Qixia_Temple_nanjing.jpg
   - 选择该页面提供的 **CC BY-SA 3.0** 许可，https://creativecommons.org/licenses/by-sa/3.0/
   - 原文件未修改。历史照片用于对照，非当前实况，非影石拍摄。若分发其衍生图片，应遵守相同许可。

## 历史公开作品线索（播放器暂不可用）

作者均标注为 **江南君**；平台发布日期 2023-12-25。联调时两个原站播放器均返回“未查询到相关项目”，当前不嵌入失效播放器，只保留原页链接与不可用状态。不下载或拼接原始全景瓦片，不裁剪水印，不将其标记为 Insta360 作品。页面未披露相机型号，也未给出原始文件商业复用许可。

- 栖霞山：https://www.vrqjcs.com/p/910d0f6d48a30e96
  播放器：https://720.vrqjcs.com/t/910d0f6d48a30e96
- 老门东：https://www.vrqjcs.com/p/efb593c77e7a4da9
  播放器：https://720.vrqjcs.com/t/efb593c77e7a4da9

2026-09-23 实测：两项目播放器均不可用；介绍页仍可阅读，界面保留原页链接。商业交付如需本地复制或长期保障，应另行取得摄影师授权或使用自采素材。

## AI 插画与三维模型

- `images/nanjing-illustration.png`：本项目 AI 生成的南京旅行主题插画，用于界面、说明书装饰。并非现场照片，不是准确建筑图纸，也不作为相机拍摄证明。
- 南京三处场景为公开资料参考的人工程序化模型；不是测绘数字孪生，不可用作现场导航。
- 印度门额外模型为依据上述全景中主立面关系的人工解释；并非自动 3DGS 重建，不声称单张图恢复完整几何。为清晰保留归属，本文件 `src/scenes/gateway.js` 中的模型构造以及其模型图像按 CC BY-SA 4.0 提供；照片参考署名 Fuzheado，模型实现 开图项目，改变为人工几何解释。
- 栖霞山山门的人工几何参考源为 Farm 的上述历史照片；`src/scenes/qixia.js` 的山门几何段及相应山门渲染按 CC BY-SA 3.0 提供（模型实现 开图项目，改变为人工几何解释）。其他建筑的事实信息参考不代表精度验证。

## 未找到的素材

本次检索尚未找到同时满足“Club Med 南京仙林度假村、可验证为影石拍摄、可复制原文件授权”的全景素材。检索结果不证明不存在。官网照片只作为参考链接，未擅自复制到项目。仙林官方资料：https://corporate.clubmed/strongclub-med-10-8-strong-105141/
