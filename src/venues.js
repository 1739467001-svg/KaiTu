// Reference geometry and fictional commercial examples are deliberately separate.
export const venues = [
  {id:'xianlin',name:'仙林度假村',fullName:'Club Med 南京仙林度假村',en:'XIANLIN · LAKESIDE ESCAPE',theme:'水岸度假',season:'四季水岸',accent:'#b9dba3',headline:'把假期，交给湖风。',summary:'沿弧形客房楼与水岸漫游，让亲子用餐、休憩与影像体验连成一次完整到访。',overview:[178,152,205],target:[0,0,0],street:[-12,7,57],streetTarget:[-15,5,-14],panorama:[-10,3,26],capture:'主入口 → 湖岸步道 → 公共裙房 → 原路闭环',sourceTitle:'Club Med 官方场地介绍',sourceUrl:'https://corporate.clubmed/strongclub-med-10-8-strong-105141/',evidence:'历史规划与公开实景参考，非测绘模型',commercial:'度假村套餐导览 · 餐饮增购 · 拍摄体验',places:[
    {id:'resort',name:'湖畔主建筑',type:'landmark',pos:[0,17,-35],look:[0,7,-20],camera:[105,57,90],detail:'弧形四层客房楼、公共裙房与湖岸层次，依据历史规划和建成照片重绘。'},
    {id:'restaurant',name:'琼林餐厅入口',type:'food',pos:[-27,6,-17],look:[-27,3,-17],camera:[-52,23,28],detail:'场所名称有公开依据；入口位置和演示套餐待实际核验。'},
    {id:'ubar',name:'U Bar 休憩点',type:'food',pos:[27,6,-17],look:[27,2,-17],camera:[62,25,28],detail:'以湖岸休憩与饮品服务为样例，不代表真实在售菜单。'},
    {id:'water',name:'湖岸与水幕',type:'view',pos:[0,2,33],look:[0,5,30],camera:[0,26,124],detail:'水幕为创意预演。19:30 是演示时刻，不代表当日节目安排。'}
  ],walks:{resort:[[0,.45,-57],[-46,.45,-39],[-53,.45,-6]],restaurant:[[-53,.45,-6],[-29,.45,-1]],ubar:[[-29,.45,-1],[0,.45,-7],[28,.45,0]],water:[[28,.45,0],[49,.45,8],[61,.45,28],[61,.45,49],[48,.45,70],[25,.45,81],[0,.45,83]]}},
  {id:'qixia',name:'栖霞山',fullName:'南京栖霞山风景区',en:'QIXIA · A WALK THROUGH AUTUMN',theme:'山林赏景',season:'秋色艺术预演',accent:'#eeb382',headline:'一山秋色，一盏慢茶。',summary:'明镜湖、古寺红墙与层叠山林，串起赏景、拍照和山下茶点的半日体验。',overview:[148,136,177],target:[0,10,-10],street:[-8,5,58],streetTarget:[0,9,-10],panorama:[-8,3,51],capture:'入口广场 → 明镜湖外沿 → 寺前广场 → 茶点驿站',sourceTitle:'栖霞区政府 · 红枫染栖霞',sourceUrl:'https://www.njqxq.gov.cn/sjb2018/qxzx/tpxw/202511/t20251125_5697124.html',evidence:'公开地标与建筑风貌重绘，山形与距离为示意；秋色非当前实况',commercial:'赏景路线 · 山下茶点导流 · 全景摄影内容',places:[
    {id:'q-gate',name:'栖霞山入口',type:'landmark',pos:[0,7,65],look:[0,4,60],camera:[27,20,105],detail:'入口尺度与位置为场景构图参考，真实导览图待校准。'},
    {id:'q-lake',name:'明镜湖',type:'view',pos:[-28,2,35],look:[-28,1,33],camera:[-62,24,78],detail:'湖面、桥亭与枫林相互映照，水岸边界待实测。'},
    {id:'q-temple',name:'栖霞寺',type:'landmark',pos:[0,12,-4],look:[0,8,-10],camera:[38,36,62],detail:'采用古寺中轴院落、红墙、灰瓦和重檐表现，非文保测绘复刻。'},
    {id:'q-pagoda',name:'舍利塔',type:'landmark',pos:[27,16,-34],look:[27,10,-34],camera:[52,29,-2],detail:'八角、五层密檐的地标特征重绘；雕刻与尺度仍为简化表达。'},
    {id:'q-maple',name:'山林观景处',type:'view',pos:[48,24,-52],look:[39,16,-40],camera:[77,48,0],detail:'秋色为艺术化预演，真实红叶程度与开放区域以现场为准。'},
    {id:'q-tea',name:'山下茶点驿站',type:'food',pos:[-49,5,13],look:[-49,3,13],camera:[-74,20,53],detail:'虚构示例商家，展示景区外茶点导流与套餐核销流程。'}
  ],walks:{'q-gate':[[0,.4,78],[0,.4,55]],'q-lake':[[0,.4,55],[-15,.4,52],[-42,.4,48],[-45,.4,27]],'q-temple':[[-45,.4,27],[-18,.4,17],[0,.4,17],[0,2.2,8]],'q-pagoda':[[0,2.2,8],[17,2.2,7],[28,2.2,-18],[27,2.2,-29]],'q-maple':[[27,2.2,-29],[40,5,-29],[51,12,-42],[48,19,-53]],'q-tea':[[-45,.4,27],[-49,.4,20]]}},
  {id:'mendong',name:'老门东',fullName:'南京老门东历史文化街区',en:'LAOMENDONG · TASTE THE OLD CITY',theme:'街巷逛吃',season:'灯火街巷',accent:'#efce88',headline:'街巷有烟火，转角有金陵。',summary:'从老门东牌坊沿箍桶巷望向明城墙，在灰瓦白墙之间找一口南京风味。',overview:[114,124,147],target:[0,3,0],street:[0,4.2,77],streetTarget:[0,5,-15],panorama:[0,3,24],capture:'牌坊 → 箍桶巷 → 横向街巷 → 城墙前广场',sourceTitle:'南京地方志 · 古风新韵门东行',sourceUrl:'https://dfz.nanjing.gov.cn/gzdt/202411/t20241101_4998828.html',evidence:'按公开街巷关系与建筑风貌重绘，商铺与距离为演示',commercial:'逛吃推荐 · 商户联券 · 到店归因',places:[
    {id:'m-gate',name:'老门东牌坊',type:'landmark',pos:[0,13,61],look:[0,8,60],camera:[30,25,101],detail:'石牌坊、三开间与雕饰层次的地标表达；牌坊后是箍桶巷中轴。'},
    {id:'m-street',name:'箍桶巷',type:'view',pos:[0,3,16],look:[0,3,-5],camera:[24,24,48],detail:'依据地方志确认的主街与横向街巷关系，展示街巷空间而非精确导航图。'},
    {id:'m-duck',name:'金陵风味小馆',type:'food',pos:[-15,6,23],look:[-15,3,23],camera:[7,15,50],detail:'虚构示例商家：鸭血粉丝汤、盐水鸭小份，用于套餐与券演示。'},
    {id:'m-cake',name:'街角糕点铺',type:'food',pos:[16,5,-1],look:[16,3,-1],camera:[-5,15,30],detail:'虚构示例商家：梅花糕与赤豆甜品，价格不是当地商家报价。'},
    {id:'m-tea',name:'巷里茶馆',type:'food',pos:[-17,7,-26],look:[-17,3,-26],camera:[4,19,5],detail:'虚构示例商家：茶饮与歇脚座位，经营数据为可操作沙盘。'},
    {id:'m-wall',name:'明城墙前广场',type:'landmark',pos:[0,15,-66],look:[0,10,-67],camera:[34,32,-27],detail:'地方志记载箍桶巷直抵明城墙；城墙砖石、垛口与树影为风貌表达。'}
  ],walks:{'m-gate':[[0,.4,75],[0,.4,55]],'m-street':[[0,.4,55],[0,.4,16]],'m-duck':[[0,.4,23],[-8,.4,23]],'m-cake':[[0,.4,16],[0,.4,-1],[9,.4,-1]],'m-tea':[[0,.4,-1],[0,.4,-26],[-9,.4,-26]],'m-wall':[[0,.4,-26],[0,.4,-56],[0,.4,-61]]}}
];
export const getVenue=id=>venues.find(v=>v.id===id)||venues[0];
export const offers=[
 {id:'xl-family',venue:'xianlin',poi:'restaurant',merchant:'方舟餐饮体验店',name:'亲子轻食组合',items:['时蔬汤面 × 2','水果拼盘 × 1','鲜果饮 × 2'],price:88,people:2,tags:['亲子','轻食'],symbol:'◒',color:'#aed196',note:'示例套餐；不含酒店门票或住宿。'},
 {id:'xl-tea',venue:'xianlin',poi:'ubar',merchant:'湖畔休憩体验店',name:'湖畔双人下午茶',items:['茶饮 × 2','小点心拼盘 × 1'],price:68,people:2,tags:['休憩','拍照'],symbol:'◷',color:'#d9c08c',note:'示例套餐；开放区域与入园资格须现场确认。'},
 {id:'qx-tea',venue:'qixia',poi:'q-tea',merchant:'山下茶点驿站',name:'一盏茶 · 一份秋意',items:['热茶 × 1','桂花糕 × 1'],price:28,people:1,tags:['茶点','休憩','预算'],symbol:'♧',color:'#dda268',note:'虚构示例商家；不含景区门票。'},
 {id:'qx-noodle',venue:'qixia',poi:'q-tea',merchant:'山下茶点驿站',name:'暖胃素面与茶',items:['菌菇时蔬面 × 1','热茶 × 1'],price:38,people:1,tags:['素食偏好','午餐'],symbol:'≋',color:'#adbb75',note:'示例素食标签，实际汤底、配方和过敏原需商家确认。'},
 {id:'md-duck',venue:'mendong',poi:'m-duck',merchant:'金陵风味小馆',name:'金陵一口鲜',items:['鸭血粉丝汤 × 1','盐水鸭小份 × 1'],price:48,people:1,tags:['南京风味','午餐'],symbol:'◈',color:'#d5a879',note:'虚构示例商家；示例价格不可用于真实交易。'},
 {id:'md-cake',venue:'mendong',poi:'m-cake',merchant:'街角糕点铺',name:'甜在老城南',items:['梅花糕 × 1','赤豆甜品 × 1'],price:22,people:1,tags:['甜品','预算'],symbol:'✿',color:'#d8a3a1',note:'示例菜单；成分与配方未核实。'},
 {id:'md-tea',venue:'mendong',poi:'m-tea',merchant:'巷里茶馆',name:'慢下来 · 双人茶席',items:['茶饮 × 2','茶点 × 1'],price:58,people:2,tags:['茶点','双人'],symbol:'◴',color:'#aab9a3',note:'虚构示例商家；不代表真实店铺或合作关系。'}
];
export const getOffer=id=>offers.find(o=>o.id===id);
export const plans=[
 {id:'xl-family',venue:'xianlin',intent:'family',title:'把一天，过成一家人的假期',prompt:'带孩子慢慢逛，再找一份轻食',duration:90,budget:88,people:2,stops:['resort','restaurant','water'],offerIds:['xl-family'],hour:15.5,why:['从公共建筑到湖岸，先认识空间再用餐。','用一份双人轻食完成示例消费闭环。','涉及入园和儿童活动的实际安排需现场确认。'],narration:'先在湖畔主建筑认识场地，再到餐饮点休息，最后沿水岸看看风景。把找路和选餐合成一张行程卡。'},
 {id:'xl-photo',venue:'xianlin',intent:'photo',title:'湖岸日落，留给两个人',prompt:'想拍日落，再喝一杯下午茶',duration:60,budget:68,people:2,stops:['resort','ubar','water'],offerIds:['xl-tea'],hour:17.4,why:['把弧形立面和湖面放进同一次取景。','以双人下午茶作为中途歇脚点。','拍摄时间为场景预演，不含日落天气预报。'],narration:'建议用 X4 Air 先完整记录湖岸，再从全景里选择人物与建筑的取景方向；休息点在 U Bar 的示例入口。'},
 {id:'xl-night',venue:'xianlin',intent:'night',title:'湖面亮起之后',prompt:'晚饭后散步，看看水幕光影',duration:45,budget:68,people:2,stops:['ubar','water'],offerIds:['xl-tea'],hour:19.5,why:['休憩点接水岸预演，演示节奏更清楚。','水幕节目和时间都以现场公告为准。'],narration:'这是一段水岸夜游的产品演示。先选饮品套餐，再切换到水幕视角；19:30 只用于视觉预演。'},
 {id:'qx-relax',venue:'qixia',intent:'relax',title:'沿湖看秋色，坐下喝盏茶',prompt:'少爬山，赏景拍照，再喝热茶',duration:70,budget:28,people:1,stops:['q-gate','q-lake','q-tea'],offerIds:['qx-tea'],hour:15.8,why:['方案留在入口、湖岸与示例茶点区域。','不把山上观景处排进这条短线。','不是无障碍路线认证，路况以现场核实为准。'],narration:'从入口到明镜湖感受枫林与水面的关系，再到山下茶点驿站停一停。这里展示的是秋色预演，实际红叶季要以景区信息为准。'},
 {id:'qx-culture',venue:'qixia',intent:'culture',title:'古寺、石塔，与一碗暖面',prompt:'想看古建筑，中午偏好素食',duration:110,budget:38,people:1,stops:['q-gate','q-temple','q-pagoda','q-tea'],offerIds:['qx-noodle'],hour:11,why:['用寺院与石塔串联文化主题。','示例套餐标记素食偏好，但汤底和成分须确认。','古建细部为参考重绘，参观范围以现场为准。'],narration:'把栖霞寺与舍利塔放在同一条文化主题线上，参观结束后在山下用餐。AI 负责组织已有内容，不替代真实开放信息。'},
 {id:'qx-photo',venue:'qixia',intent:'photo',title:'把一山秋色，收进全景',prompt:'红枫和古寺都想拍，顺便歇脚',duration:120,budget:28,people:1,stops:['q-gate','q-lake','q-temple','q-maple','q-tea'],offerIds:['qx-tea'],hour:16,why:['湖面、中轴古建与山林三个取景层次。','X4 Air 全景记录后再构图。','山路部分需要依据实测路况调整。'],narration:'先取湖岸全景，再补古寺正面与斜侧面，最后把山林作为远景。采集时保持连续平移，先拍一段小样检查拼接。'},
 {id:'md-food',venue:'mendong',intent:'food',title:'一碗金陵，一口老城南',prompt:'第一次来南京，80元以内边走边吃',duration:90,budget:70,people:1,stops:['m-gate','m-duck','m-cake','m-wall'],offerIds:['md-duck','md-cake'],hour:17,why:['两份示例套餐合计 70 元，预算透明。','主街、餐饮、甜品和城墙串成一段逛吃。','价格为演示设定，不是实际商户报价。'],narration:'从老门东牌坊进入，先尝鸭血粉丝与盐水鸭，再用梅花糕和赤豆甜品收尾，最后走到城墙前广场。'},
 {id:'md-budget',venue:'mendong',intent:'budget',title:'二十二元，尝一点老南京',prompt:'预算30元，想吃甜品、逛老街',duration:45,budget:22,people:1,stops:['m-gate','m-street','m-cake'],offerIds:['md-cake'],hour:14.5,why:['只推荐一份 22 元示例甜品套餐。','保留牌坊和主街，缩短停留时间。'],narration:'不用安排满满一桌，沿主街走一段，在街角糕点铺尝一份甜品，就能演示从内容浏览到商户领券的转化。'},
 {id:'md-night',venue:'mendong',intent:'night',title:'等灯笼亮起，再慢慢走',prompt:'两个人夜游，拍灯笼、喝茶聊天',duration:80,budget:58,people:2,stops:['m-gate','m-street','m-tea','m-wall'],offerIds:['md-tea'],hour:19,why:['以灯笼街景和双人茶席为主。','少切换消费点，让行程更松弛。','没有实时客流或商户营业状态承诺。'],narration:'牌坊、石板街和灯笼在夜景中展开；在巷里茶馆休息，再到城墙前看看街区的轮廓。'}
];
export const getPlan=id=>plans.find(p=>p.id===id);
export const x4Air={name:'Insta360 X4 Air',specs:['8K / 30 fps 全景','165 g 轻量机身','单镜头 4K / 60 fps','先拍摄，后取景'],source:'https://www.insta360.com/cn/product/insta360-x4-air',profiles:[{title:'空间采集',setting:'全景 8K30 · 稳定参数',tip:'镜头擦净，保持约 1.5 m 机位，慢走闭环；先拍 20 秒小样。'},{title:'菜品细节',setting:'单镜头 4K60 / 清晰照片',tip:'食物、菜单、店面关系分别拍；近距离细节不要强求双镜头拼接。'},{title:'内容导流',setting:'全景 → 横版 / 竖版取景',tip:'一份全景服务网页导览与宣传素材。示例取景器使用场景合成全景。'}]};
