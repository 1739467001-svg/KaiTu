// NOAA fractional-year approximation. Nanjing city reference coordinates;
// the architectural model has not been surveyed or aligned to geographic north.
// https://gml.noaa.gov/grad/solcalc/solareqns.PDF
export function solarPosition(hour,{date='2026-09-23',latitude=32.06,longitude=118.79,timezone=8}={}){
 if(!Number.isFinite(hour)||hour<0||hour>24)throw new Error('时间必须在 0–24 小时之间');
 const d=new Date(date+'T12:00:00Z');if(!Number.isFinite(d.getTime()))throw new Error('无效日期');
 const day=Math.floor((d-new Date(Date.UTC(d.getUTCFullYear(),0,0)))/86400000);
 const gamma=2*Math.PI/365*(day-1+(hour-12)/24),rad=Math.PI/180;
 const eq=229.18*(.000075+.001868*Math.cos(gamma)-.032077*Math.sin(gamma)-.014615*Math.cos(2*gamma)-.040849*Math.sin(2*gamma));
 const dec=.006918-.399912*Math.cos(gamma)+.070257*Math.sin(gamma)-.006758*Math.cos(2*gamma)+.000907*Math.sin(2*gamma)-.002697*Math.cos(3*gamma)+.00148*Math.sin(3*gamma);
 const ha=(hour*60+eq+4*longitude-60*timezone)/4-180,lat=latitude*rad,H=ha*rad;
 const elevation=Math.asin(Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(H));
 const azimuth=Math.atan2(Math.sin(H),Math.cos(H)*Math.sin(lat)-Math.tan(dec)*Math.cos(lat))+Math.PI;
 return{elevation:elevation/rad,azimuth:(azimuth/rad+360)%360,daylight:Math.max(0,Math.sin(elevation)),direction:[Math.sin(azimuth)*Math.cos(elevation),Math.sin(elevation),-Math.cos(azimuth)*Math.cos(elevation)]};
}
export function formatHour(hour){const m=Math.round(hour*60)%1440;return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
