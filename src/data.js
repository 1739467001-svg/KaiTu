// Local scene coordinates, not surveyed metres or georeferenced coordinates.
// Curved footprint is interpreted from the 2019 NO.2018G23 planning image.
export const places = [
 {id:'resort',name:'湖畔主建筑',en:'THE LAKESIDE RESORT',pos:[0,16,-35],look:[0,3,-8],camera:[130,120,155],detail:'沿湖展开的弧形建筑，参考 2019 年规划图与官方外观照片。具体尺寸、立面分格待实拍校准。'},
 {id:'restaurant',name:'琼林国际餐厅',en:'QIONGLIN · DINING',pos:[-27,5,-17],look:[-27,3,-17],camera:[-1,32,35],detail:'公开资料确认的餐饮场所。图上位置暂作体验入口；室内模型、餐台和菜品均为示例。'},
 {id:'ubar',name:'U Bar 潮吧',en:'U BAR · SOCIAL',pos:[27,5,-17],look:[27,2,-17],camera:[73,37,41],detail:'官方资料介绍的休闲潮吧。具体位置与室内结构等待现场核实。'},
 {id:'water',name:'水岸与光影',en:'WATER · LIGHT · LANDSCAPE',pos:[0,1,33],look:[0,1,22],camera:[70,42,90],detail:'官方实景呈现湖岸泳池与水幕秀。水域边界、喷泉位置及设施状态待校准。'},
];
export const foods = [
 {id:'duck',name:'金陵盐水鸭',type:'local',symbol:'◈',counter:'金陵风味台',node:'local',note:'南京风味 · 示例菜品',ingredients:'示例成分：鸭肉、盐、香辛料。真实配方待餐厅确认。'},
 {id:'noodle',name:'时蔬汤面',type:'vegetable',symbol:'≋',counter:'现煮面档',node:'noodle',note:'蔬菜偏好 · 示例菜品',ingredients:'示例成分：小麦面、时蔬。汤底、调料及交叉接触情况未核实。'},
 {id:'fruit',name:'时令水果拼盘',type:'vegetable',symbol:'◒',counter:'鲜果台',node:'fruit',note:'清爽风味 · 示例菜品',ingredients:'示例成分：当季水果。以现场菜单和工作人员说明为准。'},
 {id:'dessert',name:'法式小甜点',type:'sweet',symbol:'▱',counter:'烘焙甜品台',node:'dessert',note:'甜蜜收尾 · 示例菜品',ingredients:'示例成分：小麦、奶、蛋。未经核实的示例，不能作为过敏原判断依据。'},
];
export const graph = {
 entrance:{position:[0,.18,14],edges:['center']},
 center:{position:[0,.18,3],edges:['entrance','west','east']},
 west:{position:[-8,.18,3],edges:['center','local','noodle']},
 east:{position:[8,.18,3],edges:['center','fruit','dessert']},
 local:{position:[-11,.18,-5],edges:['west']},
 noodle:{position:[-11,.18,9],edges:['west']},
 fruit:{position:[11,.18,-5],edges:['east']},
 dessert:{position:[11,.18,9],edges:['east']},
};
export const sources = [
 {title:'Club Med · 官方场地介绍',label:'已核实 · 场所与设施',url:'https://corporate.clubmed/strongclub-med-10-8-strong-105141/'},
 {title:'2019 地块规划报道与总平面',label:'历史规划 · 二手转载，非竣工图',url:'https://m.winshang.com/news658480.html'},
 {title:'Insta360 · 开发者文档',label:'Camera / Media SDK · OSC',url:'https://insta360develop.github.io/Insta360-Developer_Docs/ch/'},
 {title:'Spark · 3DGS 渲染引擎',label:'GitHub · Three.js + Gaussian Splatting',url:'https://github.com/sparkjsdev/spark'},
];
