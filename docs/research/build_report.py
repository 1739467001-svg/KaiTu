"""Build the evidence-led Chinese user research report."""
from pathlib import Path
from xml.sax.saxutils import escape
import sys
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon
from reportlab.graphics import renderPDF

ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(Path(__file__).parent))
from report_content import PAGES
OUT=ROOT/'output/pdf/kaitu-user-research-report.pdf';PUBLIC=ROOT/'public/docs/kaitu-user-research-report.pdf'
pdfmetrics.registerFont(TTFont('CN','/System/Library/Fonts/Supplemental/Arial Unicode.ttf'))
INK=HexColor('#314C43');MUTED=HexColor('#6E7F70');PAPER=HexColor('#FFFCF2');GREEN=HexColor('#E6F0DE');SAGE=HexColor('#B9CDAE');CORAL=HexColor('#D98668');GOLD=HexColor('#E9C878');LINE=HexColor('#D8DEC9');BLUE=HexColor('#CFE5E8')
styles={
 'title':ParagraphStyle('title',fontName='CN',fontSize=25,leading=32,textColor=INK,spaceAfter=7),
 'lead':ParagraphStyle('lead',fontName='CN',fontSize=10.5,leading=17,textColor=MUTED,spaceAfter=12),
 'h':ParagraphStyle('h',fontName='CN',fontSize=12.5,leading=19,textColor=INK,spaceBefore=8,spaceAfter=4),
 'p':ParagraphStyle('p',fontName='CN',fontSize=8.6,leading=14.4,textColor=INK,spaceAfter=6),
 'small':ParagraphStyle('small',fontName='CN',fontSize=7.2,leading=11,textColor=MUTED,spaceAfter=5),
 'cell':ParagraphStyle('cell',fontName='CN',fontSize=7.25,leading=10.5,textColor=INK),
 'headcell':ParagraphStyle('headcell',fontName='CN',fontSize=7.4,leading=10.5,textColor=INK),
 'note':ParagraphStyle('note',fontName='CN',fontSize=7.7,leading=12.3,textColor=MUTED,spaceAfter=6),
 'call':ParagraphStyle('call',fontName='CN',fontSize=8.4,leading=14,textColor=INK,spaceAfter=7),
 'source':ParagraphStyle('source',fontName='CN',fontSize=6.5,leading=9,textColor=MUTED),
}
def para(t,k='p'):return Paragraph(escape(str(t)).replace('\n','<br/>'),styles[k])

class Diagram(Flowable):
 def __init__(self,kind,w=495,h=105):super().__init__();self.kind=kind;self.width=w;self.height=h
 def draw(self):
  d=Drawing(self.width,self.height);d.add(Rect(0,0,self.width,self.height,rx=13,ry=13,fillColor=HexColor('#F2F5E9'),strokeColor=LINE,strokeWidth=.7));k=self.kind
  labels={'chain':['真实影像','可浏览空间','逛吃选择','到店反馈'],'journey':['拍摄','导入','处理','校准','发布','更新'],'loop':['采集资产','核对来源','发布点位','收集反馈','版本更新'],'pipeline':['X4 Air','原片','ERP','AI/人工核验','Three.js / Spark'],'ai':['理解需求','目录筛选','约束检查','可解释推荐'],'conversion':['曝光','展开','领券','到店核销'],'architecture':['相机 / 现场桥接','API + SQLite','Worker / FFmpeg','网页 + 3D'],'workbench':['01 准备','02 采集','03 导入','04 处理','05 校准','06 交付']}.get(k)
  if labels:
   gap=(455-78*len(labels))/(len(labels)-1) if len(labels)>1 else 0
   for i,label in enumerate(labels):
    x=20+i*(78+gap);d.add(Rect(x,55,78,25,rx=8,ry=8,fillColor=HexColor('#FFFDF5'),strokeColor=CORAL if i in (0,len(labels)-1) else SAGE,strokeWidth=1));d.add(String(x+39,63,label,fontName='CN',fontSize=7.1,fillColor=INK,textAnchor='middle'))
    if i<len(labels)-1:
     nx=20+(i+1)*(78+gap);d.add(Line(x+81,67,nx-5,67,strokeColor=CORAL,strokeWidth=1.1));d.add(Polygon(points=[nx-5,67,nx-10,70,nx-10,64],fillColor=CORAL,strokeColor=CORAL))
  elif k=='economics':
   vals=[('收入 699',699,CORAL),('资源 100',100,BLUE),('模型 40',40,GOLD),('人工 180',180,SAGE),('贡献 379',379,INK)];total=sum(v for _,v,_ in vals);x=20
   for label,v,col in vals:
    w=455*v/total;d.add(Rect(x,49,w,25,fillColor=col,strokeColor=PAPER));d.add(String(x+w/2,57,label,fontName='CN',fontSize=7,fillColor=INK,textAnchor='middle'));x+=w
  d.add(String(20,20,{'journey':'高优先级：交接、返工、信息对齐','pipeline':'实线：当前可执行；虚线：待接入或待实机验证','ai':'只允许引用已核验服务 ID；不从图片猜食品安全信息','conversion':'本版：浏览器演示沙盘；生产：服务端账本 + 商户确认','architecture':'现场局域网与公网服务器分工；GPU 重建保持外部接口','workbench':'每一步都有检查项、状态或可下载清单','economics':'假设月收入 699 元；贡献 = 699 - 100 - 40 - 180 = 379 元'}.get(k,''),fontName='CN',fontSize=7.2,fillColor=MUTED))
  renderPDF.draw(d,self.canv,0,0)

def tblock(b):
 data=[[para(v,'headcell') for v in b['headers']]]+[[para(v,'cell') for v in row] for row in b['rows']];ws=b.get('widths') or [1/len(b['headers'])]*len(b['headers']);t=Table(data,colWidths=[495*x for x in ws],repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('ROWBACKGROUNDS',(0,1),(-1,-1),[PAPER,HexColor('#F7F8EE')]),('GRID',(0,0),(-1,-1),.35,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));return t
def header(c,doc):
 c.saveState();w,h=A4;c.setFillColor(PAPER);c.rect(0,0,w,h,fill=1,stroke=0);c.setStrokeColor(LINE);c.setDash(2,3);c.line(39,h-40,w-39,h-40);c.line(39,37,w-39,37);c.setDash();c.setFillColor(MUTED);c.setFont('CN',7.5);c.drawString(39,h-28,'开图 / UNFOLD    用户调研与需求分析报告');c.drawRightString(w-39,h-28,'BOLD MAKER 2026');c.drawString(39,23,'证据：E 事实 / R 公开来源 / S 模拟 / H 假设 / T 目标');c.drawRightString(w-39,23,f'{doc.page:02d} / {len(PAGES)+1:02d}');c.restoreState()
def cover(c,doc):
 c.saveState();w,h=A4;c.setFillColor(PAPER);c.rect(0,0,w,h,fill=1,stroke=0);c.setFillColor(MUTED);c.setFont('CN',9);c.drawString(42,h-57,'2026 影石 Insta360 Bold Maker 智能影像挑战赛 · 赛道一');c.setFillColor(INK);c.setFont('CN',34);c.drawString(42,h-137,'开图');c.setFont('CN',14);c.drawString(44,h-163,'U N F O L D  /  用户调研与需求分析报告');c.setFillColor(CORAL);c.roundRect(42,h-210,240,24,9,fill=1,stroke=0);c.setFillColor(PAPER);c.setFont('CN',9);c.drawString(54,h-202,'从一段全景影像，到一套场地服务。');c.drawImage(str(ROOT/'public/images/nanjing-illustration.png'),31,390,width=w-62,height=214,preserveAspectRatio=True,anchor='c',mask='auto');c.setFillColor(MUTED);c.setFont('CN',6.8);c.drawRightString(w-42,376,'南京主题 AI 创意插画 · 非现场照片');c.setFillColor(INK);c.setFont('CN',15);c.drawString(42,327,'真实问题 → 需求优先级 → 原型证据 → 下一步验证');c.setFont('CN',9.3);c.setFillColor(MUTED);c.drawString(42,298,'情景模拟访谈、竞品任务对照、影像技术链路、商业验证与提交建议');c.setStrokeColor(LINE);c.line(42,264,w-42,264);c.setFillColor(INK);c.setFont('CN',9);c.drawString(42,233,'作品：开图 / UNFOLD');c.drawString(42,211,'版本：0.4 / 2026-09-23');c.drawRightString(w-42,211,'提交建议：PDF');c.setFillColor(MUTED);c.setFont('CN',7.2);c.drawString(42,143,'重要说明：本报告区分真实反馈、代码证据、公开资料、模拟访谈与待验证目标。');c.drawString(42,126,'模拟访谈不能替代赛事要求的 3 人次真实访谈；截图状态见证据附录。');c.restoreState()
def build():
 OUT.parent.mkdir(parents=True,exist_ok=True);PUBLIC.parent.mkdir(parents=True,exist_ok=True);story=[PageBreak()]
 for i,pg in enumerate(PAGES):
  story += [para(pg['k'],'small'),para(pg['title'],'title'),para(pg['lead'],'lead')]
  for b in pg['blocks']:
   typ=b['type']
   if typ in ('p','h','note','call'):story.append(para(b['text'],typ))
   elif typ=='table':story += [tblock(b),Spacer(1,7)]
   elif typ=='figure':story += [Diagram(b['kind']),para(b['caption'],'small'),Spacer(1,3)]
   elif typ=='pic':
    path=ROOT/b['path'];story += [Image(str(path),width=495,height=b['height']),para(b['caption'],'small')] if path.exists() else [para('图像缺失：'+str(path),'note')]
  if pg.get('source'):story += [Spacer(1,3),para('来源：'+pg['source'],'source')]
  if i<len(PAGES)-1:story.append(PageBreak())
 doc=SimpleDocTemplate(str(OUT),pagesize=A4,leftMargin=50,rightMargin=50,topMargin=60,bottomMargin=50,title='开图｜用户调研与需求分析报告',author='开图项目',pageCompression=1);doc.build(story,onFirstPage=cover,onLaterPages=header);PUBLIC.write_bytes(OUT.read_bytes());print(OUT)
if __name__=='__main__':build()
