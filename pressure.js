(async()=>{
const c=document.createElement("div");
c.style.cssText="position:fixed;left:-9999px;width:180px;height:85px";
document.body.appendChild(c);

const lat=53.2220301,lon=18.0544024;
const q=new URLSearchParams({latitude:lat,longitude:lon,hourly:"pressure_msl,precipitation",past_days:"7",forecast_days:"7",timezone:"auto"});
const r=await fetch("https://api.open-meteo.com/v1/forecast?"+q);
const j=await r.json();
const x=j.hourly.time.map(t=>new Date(t).getTime());
const yP=j.hourly.pressure_msl.map(v=>+v);
const yR=j.hourly.precipitation.map(v=>+v);
const now=Date.now();

function dayLines(xv,c="#555"){const d=[];for(let i=1;i<xv.length;i++){const D=new Date(xv[i]);if(D.getHours()==0)d.push(xv[i]);}
return{hooks:{draw:u=>{const{top:h,left:l,width:w,height:H}=u.bbox,ctx=u.ctx;ctx.save();ctx.strokeStyle=c;ctx.lineWidth=.8;ctx.setLineDash([2,2]);
for(const ts of d){const x=u.valToPos(ts,"x",1);if(x<l||x>l+w)continue;ctx.beginPath();ctx.moveTo(x,h);ctx.lineTo(x,h+H);ctx.stroke();}ctx.restore();}}};}
function refLines(v,c="#d33"){return{hooks:{draw:u=>{const{top:h,left:l,width:w,height:H}=u.bbox,ctx=u.ctx;ctx.save();ctx.strokeStyle=c;ctx.lineWidth=1;ctx.setLineDash([4,3]);
for(const V of v){const y=u.valToPos(V,"p",1);if(y<h||y>h+H)continue;ctx.beginPath();ctx.moveTo(l,y);ctx.lineTo(l+w,y);ctx.stroke();}ctx.restore();}}};}
function nowLine(n){return{hooks:{draw:u=>{const x=u.valToPos(n,"x",1);const{left:l,width:w,top:h,height:H}=u.bbox;if(x<l||x>l+w)return;const c=u.ctx;c.save();c.strokeStyle="#e74c3c";c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();c.moveTo(x,h);c.lineTo(x,h+H);c.stroke();c.restore();}}};}

await new Promise(res=>{
const s=document.createElement("script");
s.src="https://unpkg.com/uplot@1.6.30/dist/uPlot.iife.min.js";
s.onload=res;document.head.appendChild(s);
});

const rMin=0,rMax=Math.max(1,...yR.filter(v=>v!=null));
const u=new uPlot({
width:180,
height:85,
tzDate:t=>new Date(t),
padding:[6,6,6,6],
scales:{x:{time:1},p:{auto:1},r:{range:[rMin,rMax]}},
legend:{show:0},
axes:[{show:0}],
series:[{}, {scale:"p",stroke:"#ff8800",width:1,points:{show:0}}, {scale:"r",stroke:"#2b6cb0",width:1,points:{show:0}}],
plugins:[nowLine(now),refLines([1000,1026]),refLines([1013],"#008000"),dayLines(x)]
},[x,yP,yR],c);

setTimeout(()=>{
const png=c.querySelector("canvas").toDataURL("image/png");
window.pressurePNG=png; // expose globally
console.log("pressure.png ready");
},500);
})();
