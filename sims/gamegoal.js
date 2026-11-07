(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,axes,bars,atLeast}=BioLab.h;
/* The course: an oval lap (40 s at racing speed) with a lagoon loop (10 s) that touches the course at its right edge.
   Three candidate strategies, each scored over a fixed race clock H (the episode ends at the finish line or at H). */
const CX=225,CY=232,RX=175,RY=160,LX=CX+RX-34,LY=CY,LR=34,LAP=40,LOOP=10,SPLIT=10;
const S=[
 {id:'race',name:'Race the course',short:'Race',laps:1,course:2,lag:0,time:()=>LAP},
 {id:'detour',name:'Race + lagoon detour',short:'Detour',laps:1,course:2,lag:3,time:()=>LAP+LOOP},
 {id:'circle',name:'Circle the lagoon',short:'Circle',laps:0,course:0,lag:null,time:sim=>sim.p.H}
];
const SID=S.map(s=>s.id);
/* lagoon hits for the circling strategy: loops start at 10 s, 3 targets per 10 s loop when they come back */
const circleHits=sim=>sim.p.respawn?Math.floor(3*(sim.p.H-SPLIT)/LOOP+1e-9):3;
function stat(sim,s){const H=sim.p.H,hits=s.id==='circle'?circleHits(sim):s.course+s.lag,t=s.time(sim);
 return {laps:s.laps,hits,t,total:s.laps*sim.p.fin+hits*sim.p.tgt-t*sim.p.pen};}
function all(sim){return S.map(s=>stat(sim,s));}
/* the agent keeps the strategy with the highest total; on a tie it keeps the first one it tried */
function pickI(sim){const a=all(sim);let b=0;for(let i=1;i<3;i++)if(a[i].total>a[b].total+1e-9)b=i;return b;}
const tied=sim=>{const a=all(sim),b=pickI(sim);return a.some((x,i)=>i!==b&&Math.abs(x.total-a[b].total)<1e-9);};
const GS=sim=>sim.gutS;
/* While the student works out the best total ("Your turn"), the totals stay hidden. */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const locked=sim=>!!(GS(sim)&&GS(sim).g&&!pend(sim));
const tourOn=sim=>!!(sim.tour&&sim.tour.on);
const shownI=(sim,i)=>!!(sim.p.show||locked(sim)||tourOn(sim)||(sim.st.done&&sim.st.done[i]));
const shownAll=sim=>[0,1,2].every(i=>shownI(sim,i));
const n0=v=>{const r=Math.round(v*10)/10;return (Math.abs(r-Math.round(r))<1e-9?Math.round(r):r.toFixed(1)).toString().replace('-','−');};
const pts=v=>n0(v)+' point'+(Math.abs(v)===1?'':'s');
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
function wrap(ctx,s,maxW,size,w){ctx.font=(w||400)+' '+size+'px '+FONT;const words=s.split(' ');const out=[];let line='';
 words.forEach(wd=>{const t=line?line+' '+wd:wd;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=wd;}else line=t;});if(line)out.push(line);return out;}
/* positions along each strategy's path, by race-clock time t (s) */
function coursePos(u){const th=-Math.PI/2+2*Math.PI*(u/LAP);return {x:CX+RX*Math.cos(th),y:CY+RY*Math.sin(th),hx:-RX*Math.sin(th),hy:RY*Math.cos(th)};}
function lagPos(v){const ph=2*Math.PI*(v/LOOP);return {x:LX+LR*Math.cos(ph),y:LY+LR*Math.sin(ph),hx:-Math.sin(ph),hy:Math.cos(ph)};}
function posAt(id,t){if(id==='race')return coursePos(Math.min(t,LAP));
 if(id==='detour'){if(t<SPLIT)return coursePos(t);if(t<SPLIT+LOOP)return lagPos(t-SPLIT);return coursePos(Math.min(LAP,t-LOOP));}
 if(t<SPLIT)return coursePos(t);return lagPos((t-SPLIT)%LOOP);}
/* when each target is hit on a run (race-clock seconds): course targets at 20 s and 30 s of course time, lagoon targets 2.5, 5 and 7.5 s into a loop */
const LOFF=[2.5,5,7.5],COFF=[20,30];
function hitTimes(id,which,j,H){if(which==='c'){if(id==='circle')return [];return [id==='race'?COFF[j]:COFF[j]+LOOP];}
 if(id==='race')return [];if(id==='detour')return [SPLIT+LOFF[j]];const out=[];for(let s=SPLIT+LOFF[j];s<=H;s+=LOOP)out.push(s);return out;}
/* a hit target disappears; if targets come back, it pops up again 1.2 s later */
function gone(sim,id,which,j,t){const hs=hitTimes(id,which,j,sim.p.H).filter(h=>h<=t);if(!hs.length)return false;return sim.p.respawn?t-hs[hs.length-1]<1.2:true;}
function runLen(sim,i){return S[i].time(sim);}
/* one strategy's total, written out with this case's numbers */
const mul=(a,b)=>`${a} × ${n0(b)}`;
function sumLine(sim,i){const p=sim.p,r=all(sim)[i],parts=[];if(r.laps)parts.push(String(p.fin));parts.push(mul(r.hits,p.tgt));
 return parts.join(' + ')+' − '+mul(r.t,p.pen)+' = '+n0(r.total);}
const best=sim=>all(sim)[pickI(sim)].total;

const SIM={
 id:'gamegoal',hash:'gamegoal',apUnit:2,order:3,tab:'Game the goal',kind:'Simulation',
 card:'Write the points for a computer-controlled boat, predict what it learns, and catch it gaming your goal.',
 title:'Game the goal: you write the points, the agent finds the loophole',
 lede:{bio:'An AI agent does not know what you want. It only knows the points you give it, and it will find whatever earns the most. Each way of driving has a total: finish points + targets × points per target − seconds × penalty. Write the points for a racing boat, work out the totals, and see what it learns.',
  honors:'The reward is a stand-in (a proxy) for what you really want. When an optimizer can raise the proxy without reaching the goal, it will: that is specification gaming, and Goodhart’s law is the same idea for people.',
  ap:'The agent compares each strategy’s total reward over the race clock, R = F·laps + T·hits − P·seconds, and keeps the largest. Circling wins exactly when T·n − H·P beats F + 5T − 50P, so the loophole grows with the clock.'},
 skills:{bio:'Evaluating linear expressions and comparing totals · Algebra 1',honors:'Linear expressions and inequalities · Algebra 1',ap:'Linear inequalities and break-even values, R = F·laps + T·hits − P·seconds · Algebra 1, Algebra 2'},
 scale:'One lap of an oval course takes 40 s; one loop of the lagoon takes 10 s. The race clock stops at the finish line or at its limit (120 s unless you change it). Nothing you enter leaves this page.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'Your reward rules',
 controls:[
  {id:'guess',label:'Your gut: the agent will learn to…',type:'seg',def:'race',options:[{v:'race',l:'Race the course'},{v:'detour',l:'Race + lagoon detour'},{v:'circle',l:'Circle the lagoon'}]},
  {id:'fin',label:'Points for finishing the lap',type:'range',min:0,max:600,step:10,def:20,unit:' pts',noGut:true,onChange:clearGut},
  {id:'tgt',label:'Points for each target hit',type:'range',min:0,max:50,step:5,def:10,unit:' pts',noGut:true,onChange:clearGut},
  {id:'respawn',label:'Targets come back after they are hit',type:'toggle',def:true,noGut:true,onChange:clearGut,help:'In the lagoon, a hit target pops back up a few seconds later, so the boat can hit it again on the next loop.'},
  {id:'pen',label:'Time penalty: points lost each second',type:'range',min:0,max:5,step:0.5,def:0,unit:' pts/s',noGut:true,onChange:clearGut,help:'Every second until the run ends costs this many points. The run ends at the finish line, or when the race clock runs out.'},
  {id:'H',label:'Race clock limit',type:'range',min:60,max:300,step:10,def:120,unit:' s',lvl:'ap',noGut:true,onChange:clearGut,help:'A boat that never finishes keeps going until this limit.'},
  {id:'show',label:'Show the agent’s scores now',type:'toggle',def:false,noGut:true,help:'Normally the scores appear once you lock in your gut answer or let the agent practice.'}
 ],
 actions:[{id:'practice',label:'Let the agent practice',primary:true,run(sim){sim.st.mode='practice';sim.st.ti=0;sim.st.t=0;sim.st.done=[false,false,false];sim.st.hold=0;}}],
 init(){return {mode:'idle',ti:0,t:0,hold:0,done:[false,false,false]};},
 step(sim,dt){const st=sim.st,rate=24;dt=Math.min(dt,0.1);
  if(st.mode==='practice'){if(st.hold>0){st.hold-=dt;if(st.hold<=0){st.ti++;st.t=0;if(st.ti>2){st.mode='run';st.ti=pickI(sim);st.t=0;}}return;}
   st.t+=dt*rate;if(st.t>=runLen(sim,st.ti)){st.t=runLen(sim,st.ti);st.done[st.ti]=true;st.hold=0.8;sim.infoDirty=true;}return;}
  const i=(shownAll(sim)||st.mode==='run')?pickI(sim):st.ti;
  if(st.mode==='run'||shownAll(sim)){st.ti=i;st.t+=dt*rate;if(st.t>runLen(sim,i)+8){st.t=0;}return;}
  /* idle, before any reveal: the boat demonstrates each strategy in turn, with no scores */
  st.t+=dt*rate;if(st.t>runLen(sim,st.ti)+6){st.t=0;st.ti=(st.ti+1)%3;}},
 metrics:[
  {id:'pick',label:'The agent learns to',text:true,get:sim=>shownAll(sim)?S[pickI(sim)].name+(tied(sim)?' (a tie: it keeps the first one it tried)':''):'Hidden until you lock in your gut or let it practice'},
  {id:'laps',label:'Laps it finishes',unit:'',d:0,min:0,max:1,get:sim=>shownAll(sim)?all(sim)[pickI(sim)].laps:null},
  {id:'hits',label:'Targets it hits',unit:'',d:0,min:0,max:null,get:sim=>shownAll(sim)?all(sim)[pickI(sim)].hits:null},
  {id:'total',label:'Its total reward',unit:'pts',d:1,max:null,get:sim=>shownAll(sim)?all(sim)[pickI(sim)].total:null},
  {id:'secs',label:'Seconds until its run ends',unit:'s',d:0,lvl:'honors',min:0,max:null,get:sim=>shownAll(sim)?all(sim)[pickI(sim)].t:null},
  {id:'lead',label:'Lead over the next-best strategy',unit:'pts',d:1,lvl:'honors',max:null,get:sim=>{if(!shownAll(sim))return null;const a=all(sim).map(x=>x.total).sort((p,q)=>q-p);return a[0]-a[1];}},
  {id:'rule',label:'When circling beats the detour',text:true,lvl:'ap',get:sim=>{const p=sim.p,n=circleHits(sim);return `Circle: ${n}·T − ${p.H}·P = ${n0(n*p.tgt-p.H*p.pen)}. Detour: F + 5·T − 50·P = ${n0(p.fin+5*p.tgt-50*p.pen)}. Circling wins when ${n}T − ${p.H}P > F + 5T − 50P, that is, when F < ${n-5}T − ${p.H-50}P = ${n0((n-5)*p.tgt-(p.H-50)*p.pen)}.`;}}
 ],
 graphs:[{id:'totals',label:'Total reward for each strategy',custom:true}],defaultGraph:'totals',
 plot(sim,ctx,box){const a=all(sim),v=a.map(x=>x.total),b=pickI(sim),show=[0,1,2].map(i=>shownI(sim,i));
  const lo=Math.min(0,...v.filter((x,i)=>show[i])),hi=Math.max(10,...v.filter((x,i)=>show[i]));
  const ax=axes(ctx,box,{xmin:0,xmax:3,ymin:Math.floor(lo/10)*10,ymax:Math.ceil(hi*1.1/10)*10,xl:'',yl:'Total reward (points)',xcats:S.map(s=>s.short)});
  bars(ctx,ax,v.map((x,i)=>show[i]?x:NaN),{colors:S.map((s,i)=>i===b&&shownAll(sim)?PAL['rj']:PAL['s2'])});
  S.forEach((s,i)=>{if(!show[i])txt(ctx,'?',ax.X(i+.5),ax.Y(0)-10,{s:18,w:700,c:PAL['cv-soft'],a:'center'});});},
 draw(sim,ctx,vdt,k){const p=sim.p,st=sim.st,a=all(sim),b=pickI(sim),showAll=shownAll(sim),G=GS(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* water, island and lagoon */
  ctx.fillStyle=PAL['cv-water'];rr(ctx,8,8,436,434,14);ctx.fill();
  ctx.fillStyle=PAL['cv-leaf'];ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(CX,CY,RX-50,RY-48,0,0,7);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle=PAL['cv-water'];ctx.beginPath();ctx.arc(LX,LY,LR+14,0,7);ctx.fill();
  /* the course centerline */
  ctx.strokeStyle=PAL['cv-soft'];ctx.lineWidth=1.5;ctx.setLineDash([6,7]);ctx.beginPath();ctx.ellipse(CX,CY,RX,RY,0,0,7);ctx.stroke();ctx.beginPath();ctx.arc(LX,LY,LR,0,7);ctx.stroke();ctx.setLineDash([]);
  /* direction chevrons */
  ctx.strokeStyle=PAL['cv-soft'];ctx.lineWidth=2;[5,15,25,35].forEach(u=>{const q=coursePos(u),m=Math.hypot(q.hx,q.hy),ux=q.hx/m,uy=q.hy/m;ctx.beginPath();ctx.moveTo(q.x-ux*6-uy*6,q.y-uy*6+ux*6);ctx.lineTo(q.x+ux*4,q.y+uy*4);ctx.lineTo(q.x-ux*6+uy*6,q.y-uy*6-ux*6);ctx.stroke();});
  /* highlight the path of the strategy on screen */
  const showing=st.ti,hiCol=showAll&&showing===b?PAL['rj']:PAL['s2'];
  ctx.strokeStyle=hiCol;ctx.lineWidth=4;ctx.globalAlpha=.35;ctx.beginPath();
  const id=S[showing].id,len=runLen(sim,showing);if(id==='circle'){for(let t=0;t<=SPLIT;t+=0.25){const q=coursePos(t);t?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();ctx.beginPath();ctx.arc(LX,LY,LR,0,7);ctx.stroke();}
  else{for(let t=0;t<=len;t+=0.25){const q=posAt(id,t);t?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);}ctx.stroke();}ctx.globalAlpha=1;
  /* start / finish line */
  ctx.fillStyle=PAL['cv-ink'];for(let i=0;i<6;i++){for(let j=0;j<2;j++){if((i+j)%2===0)ctx.fillRect(CX-4+j*4,CY-RY-18+i*6,4,6);}}
  txt(ctx,'Start / finish',CX,CY-RY-26,{s:12*k,w:700,a:'center'});
  /* targets */
  const t=st.t,tl=k*12;
  const tgtDraw=(x,y,gone)=>{ctx.globalAlpha=gone?.25:1;ctx.fillStyle=PAL['s4'];ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill();ctx.fillStyle=PAL['card'];ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fill();ctx.globalAlpha=1;};
  COFF.forEach((u,j)=>{const q=coursePos(u);tgtDraw(q.x,q.y,gone(sim,id,'c',j,t));});
  [[LX,LY+LR],[LX-LR,LY],[LX,LY-LR]].forEach((q,j)=>tgtDraw(q[0],q[1],gone(sim,id,'l',j,t)));
  if(p.tgt>0){const lab='+'+p.tgt;const q1=coursePos(20),q2=coursePos(30);txt(ctx,lab,q1.x+14,q1.y-10,{s:tl,w:700,c:PAL['s4']});txt(ctx,lab,q2.x+14,q2.y+tl*0.35,{s:tl,w:700,c:PAL['s4']});txt(ctx,lab+' each',LX-LR-14,LY+tl*0.35,{s:tl,w:700,c:PAL['s4'],a:'right'});}
  txt(ctx,'Lagoon',LX-6,LY-LR-16,{s:tl,w:700,c:PAL['cv-ink'],a:'center'});
  /* the boat */
  const q=posAt(id,Math.min(t,len)),hd=Math.atan2(q.hy,q.hx);
  ctx.save();ctx.translate(q.x,q.y);ctx.rotate(hd);ctx.fillStyle=hiCol;ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(4,-7);ctx.lineTo(-11,-6);ctx.lineTo(-11,6);ctx.lineTo(4,7);ctx.closePath();ctx.fill();ctx.strokeStyle=PAL['card'];ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=PAL['card'];ctx.fillRect(-6,-3,6,6);ctx.restore();
  /* clock */
  const clk=Math.min(t,len);txt(ctx,(st.mode==='practice'&&k<1.3?`Practice run ${st.ti+1} of 3: `:'')+S[showing].name,18,410,{s:12*k,w:700,c:PAL['cv-ink']});
  txt(ctx,`Race clock ${Math.floor(clk)} s`+(id==='circle'?` of ${p.H} s`:''),18,410+15*k,{s:12*k,c:PAL['cv-soft']});
  /* right panel: the reward you wrote */
  const X=458,W=332;ctx.fillStyle=PAL['card'];rr(ctx,X,10,W,430,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  const big=k>1.3;let y=10+20*k;txt(ctx,'Your reward rules',X+14,y,{s:13*k,w:700});y+=18*k;
  const rule=(s)=>{txt(ctx,s,X+14,y,{s:12*k,c:PAL['cv-ink']});y+=16*k;};
  const pen=p.pen?`Each second: −${n0(p.pen)}`:'No time penalty',back='Targets come back: '+(p.respawn?'yes':'no');
  if(big){rule(`Finish +${p.fin} · Target +${p.tgt}`);rule((p.pen?`Second −${n0(p.pen)}`:'No time penalty')+' · Back: '+(p.respawn?'yes':'no'));}
  else{rule(`Finish the lap: +${p.fin}`);rule(`Each target hit: +${p.tgt}`);rule(pen);rule(back);}
  y+=2*k;ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(X+10,y);ctx.lineTo(X+W-10,y);ctx.stroke();
  y+=20*k;txt(ctx,'What the agent finds',X+14,y,{s:13*k,w:700});y+=8*k;
  const fx=!big,rowH=(fx?50:35)*k;
  S.forEach((s,i)=>{const r=a[i],on=shownI(sim,i),win=showAll&&i===b,top=y;
   if(win){ctx.fillStyle=PAL['rj'];ctx.globalAlpha=.12;rr(ctx,X+8,top,W-16,rowH,8);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=PAL['rj'];ctx.lineWidth=2;rr(ctx,X+8,top,W-16,rowH,8);ctx.stroke();}
   txt(ctx,big?s.short:s.name,X+16,top+16*k,{s:12.5*k,w:700,c:PAL['cv-ink']});
   txt(ctx,on?pts(r.total):'?',X+W-16,top+16*k,{s:13*k,w:700,c:win?PAL['s1']:PAL['cv-ink'],a:'right'});
   txt(ctx,on?`${r.laps} lap${r.laps===1?'':'s'} · ${r.hits} target${r.hits===1?'':'s'} · ${r.t} s`:'not tried yet',X+16,top+30*k,{s:12*k,c:PAL['cv-soft']});
   if(fx&&on)txt(ctx,sumLine(sim,i),X+16,top+44*k,{s:12*k,c:PAL['cv-soft']});
   y+=rowH+6*k;});
  if(showAll&&!big)pill(ctx,a[b].laps?'It finishes the race':'It never finishes',X+W/2,Math.min(y+12*k,405),a[b].laps?PAL['s3']:PAL['rj'],'#fff',13*Math.min(k,1.4));
  if(pend(sim)&&!big)txt(ctx,'Work out the three totals to see them here',X+W/2,Math.min(y+12*k,405),{s:12*k,c:PAL['cv-soft'],a:'center'});
  if(G&&G.g){txt(ctx,'Your gut: '+S[SID.indexOf(G.g.pick)].name,X+14,430,{s:12*k,w:700,c:PAL['s4']});}},
 narrate(sim){const a=all(sim),b=pickI(sim),p=sim.p;
  if(!shownAll(sim))return `The agent will try each way of driving and keep the one that earns the most points under your rules. <b>It cannot see what you meant, only the points.</b> Which will it pick?`;
  const r=a[b],tie=tied(sim)?' (Two strategies tie, so it keeps the first one it tried.)':'';
  if(S[b].id==='circle'&&p.respawn)return `<b>The agent circles the lagoon and never finishes.</b> Targets that keep coming back earn ${pts(r.total)} in ${r.t} s; the best finishing run earns ${pts(Math.max(a[0].total,a[1].total))}. It is doing exactly what your points ask. That is specification gaming.${tie}`;
  if(S[b].id==='circle')return `The agent circles the lagoon for ${pts(r.total)}, more than any finishing run. <b>Finishing does not pay enough</b> to beat ${r.hits} targets under these rules.${tie}`;
  if(S[b].id==='detour')return `<b>The agent finishes</b>, with one swing through the lagoon for 3 extra targets: ${pts(r.total)}. ${p.respawn?'Circling would earn only '+pts(a[2].total)+', so the loophole no longer pays.':'With targets gone after one hit, circling earns only '+pts(a[2].total)+'.'}${tie}`;
  return `<b>The agent races clean and finishes in 40 s</b> for ${pts(r.total)}. ${p.pen>0?'Your time penalty makes every extra second cost more than the targets are worth.':'Targets are not worth a detour under these rules.'}${tie}`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Read <b>Your reward rules</b> on the right of the picture. The agent will try each way of driving and keep the one that earns the most points. Which will it learn? Pick one here, then lock it in.',
   honors:'Read the reward rules on the picture. Which strategy has the highest total reward? Pick one here by feel, then lock it in.'},
  lock(sim){const a=all(sim),b=pickI(sim),g=SID.indexOf(sim.p.guess);const gi=g<0?0:g;return {v:a[b].total-a[gi].total,pick:SID[gi],label:S[gi].name};},
  solve(sim){const b=pickI(sim);sim.p.guess=SID[b];sim.p.show=true;sim.st.mode='run';sim.st.ti=b;sim.st.t=0;const r=all(sim)[b];return {v:0,pick:SID[b],label:`${S[b].name} (${pts(r.total)})`};},
  hint:{bio:'Lock in your gut answer. Then you will work out each strategy’s total yourself, the way the agent does.'},
  calc:{unit:'points',d:1,tol:0.4,
   prompt:{bio:sim=>{const p=sim.p,a=all(sim);return `Your rules: finishing +${p.fin}, each target +${p.tgt}, ${p.pen?'−'+n0(p.pen)+' for each second':'no time penalty'}. <b>Race:</b> 1 lap, 2 targets, 40 s. <b>Detour:</b> 1 lap, 5 targets, 50 s. <b>Circle:</b> 0 laps, ${a[2].hits} targets, ${a[2].t} s. Work out all three totals. What is the <b>highest</b> total?`;},
    honors:sim=>{const p=sim.p;return `Your rules: finishing +${p.fin}, each target +${p.tgt}, ${p.pen?'−'+n0(p.pen)+' for each second':'no time penalty'}, targets ${p.respawn?'come back':'stay down'}, a ${p.H} s clock. Race: 1 lap, 2 targets, 40 s. Detour: 1 lap, 5 targets, 50 s. Circle: no lap; it reaches the lagoon at 10 s, then ${p.respawn?'hits 3 targets on every 10 s loop':'hits the 3 lagoon targets once'} and runs until the clock stops. Find each total. What is the highest?`;},
    ap:sim=>{const p=sim.p;return `F = ${p.fin}, T = ${p.tgt}, P = ${n0(p.pen)}, H = ${p.H} s, targets ${p.respawn?'come back':'stay down'}. Use R = F·laps + T·hits − P·seconds for race (F + 2T − 40P), detour (F + 5T − 50P) and circle (${p.respawn?'0.3(H − 10)·T − H·P':'3T − H·P'}). What is the largest R?`;}},
   answer:best,
   hint:'Total = finish points (if it finishes) + targets × points per target − seconds × penalty. Do it for all three, then take the biggest.',
   steps(sim){const a=all(sim),b=pickI(sim),out=[];
    if(atLeast('honors')&&sim.p.respawn)out.push(`Circle hits: 0.3 × (${sim.p.H} − 10) = ${a[2].hits} targets.`);
    S.forEach((s,i)=>out.push(`${s.name}: ${sumLine(sim,i)}${i===b?'':'.'}`.replace(/= ([^ ]+)$/,i===b?'= <b>$1</b>, the highest.':'= $1')));
    out.push(`The agent keeps the highest total: <b>${n0(a[b].total)} points</b>${tied(sim)?' (a tie; it keeps the first one it tried)':''}.`);
    return out;}},
  formula(sim){const b=pickI(sim);return S.map((s,i)=>`${s.short}: ${sumLine(sim,i)}${i===b?' (highest)':''}`).join('<br>');},
  how:{bio:'Add up each strategy’s points under your rules: finishing points, plus points for every target it hits, minus the time penalty for every second it runs. The agent keeps the biggest total. It never asks what you meant.',
   ap:'For each strategy, R = F·laps + T·hits − P·seconds. Race: F + 2T − 40P. Detour: F + 5T − 50P. Circle (targets come back): 0.3(H − 10)·T − H·P. The agent takes the maximum.'},
  compare(sim,g,m){const a=all(sim),b=pickI(sim),gi=SID.indexOf(g.pick),r=a[b],rg=a[gi],p=sim.p;
   const what=r.laps?`finishes the lap in ${r.t} s and hits ${r.hits} targets`:`never finishes: it hits ${r.hits} targets in ${r.t} s and the race clock runs out`;
   const K=sim.ui.calc,self=K&&K.done&&K.correct?' You also found that total yourself, the same way the agent does.':'';
   if(gi===b)return `Your gut was right: the agent ${what}, for ${pts(r.total)}. You read the points the way an optimizer does: not what the designer meant, just what pays.`+(r.laps?'':' The designer wanted a finished race and got zero laps.')+self;
   return `You predicted <b>${S[gi].name}</b> (${pts(rg.total)}). The agent ${what}, for <b>${pts(r.total)}</b>: ${pts(r.total-rg.total)} more than your pick, so it will never choose yours.`+(r.laps?' This time the points line up with the goal.':' <b>The designer wanted a finished race and got zero laps.</b> That gap between the points and the goal is specification gaming.')+self;},
  again(sim){const R=x=>x[Math.floor(Math.random()*x.length)];sim.p.fin=R([0,20,50,100,200,300,400]);sim.p.tgt=R([0,5,10,20]);sim.p.pen=R([0,0,0.5,1,2,4]);sim.p.respawn=Math.random()<0.6;sim.p.guess='race';sim.p.show=false;sim.st.mode='idle';sim.st.ti=0;sim.st.t=0;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'New rules: 100 points for finishing, 20 points per target, targets come back, −2 points for each second, a 120-second clock. Race: 1 lap, 2 targets, 40 s. Detour: 1 lap, 5 targets, 50 s. Circle: no lap, 33 targets, 120 s. What is the highest total the agent can find?',answer:420,tol:0.4,unit:'points',d:0,hint:'For each strategy: finish points (if it finishes) + targets × 20 − seconds × 2. Then take the biggest.',explain:'Race: 100 + 2 × 20 − 40 × 2 = 60. Detour: 100 + 5 × 20 − 50 × 2 = 100. Circle: 33 × 20 − 120 × 2 = 420. A 2-point penalty is not enough: the agent still circles, 320 points ahead of the detour.'},
  {lvl:'bio',instant:true,q:'Rules: 20 points for finishing, 10 points per target, targets come back, no time penalty, a 120-second race clock. What does the agent learn?',choices:['Race the course','Race with one lagoon detour','Circle the lagoon and never finish'],correct:2,explain:'Racing earns 20 + 2×10 = 40. The detour earns 20 + 5×10 = 70. Circling hits 33 targets in 120 s: 330 points. The agent has no idea a race is supposed to end. It only compares totals.'},
  {lvl:'bio',instant:true,q:'Same rules, but now targets do not come back after they are hit. What does the agent learn?',choices:['It still circles forever','It finishes, with one swing through the lagoon','It stops moving'],correct:1,explain:'Circling now gets only the 3 lagoon targets: 30 points. The detour gets 2 course targets, 3 lagoon targets and the finish: 70. Racing clean gets 40. The loophole is closed, so finishing wins.'},
  {lvl:'bio',instant:true,q:'The boat circles the lagoon forever under the first set of rules. What went wrong?',choices:['The agent is broken','The points did not describe the goal','The agent got bored of racing'],correct:1,explain:'Nothing is broken. The agent found the highest-scoring behavior under the rules it was given. When a reward can be earned without reaching the goal, an optimizer finds that route. The fix is in the reward, not the agent.'},
  {lvl:'honors',instant:true,q:'Keep 20 for finishing, 10 per target, targets come back. You add a time penalty. Which is the smallest of these penalties that makes the agent finish?',choices:['1 point per second','2 points per second','3 points per second','4 points per second'],correct:3,explain:'At 3 per second: race 40 − 120 = −80, detour 70 − 150 = −80, circle 330 − 360 = −30, so circling still wins. At 4 per second: race −120, detour −130, circle 330 − 480 = −150. Now the fastest finish loses the fewest points, so it races clean.'},
  {lvl:'honors',instant:true,q:'Goodhart’s law, in Marilyn Strathern’s popular wording: “When a measure becomes a target, it ceases to be a good measure.” Which is the same thing happening to people?',choices:['A student studies a whole unit and does well on the test','A student memorizes last year’s answer key, raises the grade, and cannot solve a new problem','A teacher gives a test at the end of a unit'],correct:1,explain:'The grade was a measure of learning. Once the grade itself became the target, it could be raised without the learning it was supposed to measure, just as the boat raised its points without racing.'},
  {lvl:'ap',instant:true,q:'Targets come back, 10 points each, no time penalty, and the race clock is 200 s. What finishing bonus makes the detour beat circling?',choices:['More than 50 points','More than 280 points','More than 520 points','No bonus can do it'],correct:2,explain:'In 200 s the circling boat finishes 19 loops: 0.3 × (200 − 10) = 57 targets, or 570 points. The detour earns F + 50. F + 50 > 570 means F > 520. On a 120 s clock it was F > 280: the longer the clock, the more the loophole is worth.'},
  {lvl:'ap',instant:true,q:'You double every reward: finishing, target points and the time penalty. What happens to the agent’s choice?',choices:['It changes, because the numbers are bigger','It stays the same: doubling every total keeps the same one on top','It always switches to circling'],correct:1,explain:'Every strategy’s total is F·laps + T·hits − P·seconds. Doubling F, T and P doubles every total, and doubling never changes which number is largest. Only the ratios between rewards matter.'}
 ],
 tour:[
  {title:'The race and the goal',text:'You are training a computer player for a boat-racing game. You want it to finish the lap. The course is the dashed oval; the lagoon on the right is a side loop with three targets in it.',pause:true,setup:sim=>{BioLab.setValues(sim,{fin:20,tgt:10,pen:0,respawn:true,H:120,show:false});sim.st.mode='idle';sim.st.ti=0;sim.st.t=0;},focus:[8,8,436,434]},
  {title:'The points you wrote',text:'This is the reward: 20 points for finishing, 10 points for each target hit, and targets come back. That is all the agent knows about your goal.',pause:true,focus:[458,10,332,110]},
  {title:'The agent practices',text:'The agent tries each strategy and adds up its points: race the course, race with one lagoon detour, or circle the lagoon. Watch it try circling.',pause:true,setup:sim=>{sim.st.mode='run';sim.st.ti=2;sim.st.t=0;}},
  {title:'Specification gaming',text:'Circling hits 33 targets in the 120-second race: 330 points. The detour gets 70 and the clean race 40. So the agent circles forever and never finishes. It satisfied the rules you wrote, not the goal you meant. In 2016, OpenAI saw a real agent do this in the boat game CoastRunners.',pause:true,setup:sim=>{sim.st.mode='run';sim.st.ti=2;sim.st.t=0;},focus:[458,120,332,320]},
  {title:'Fix 1: targets stay down',text:'Turn off respawning targets. Circling now gets just 3 targets, 30 points. The detour gets 70, so the agent finishes the race.',pause:true,setup:sim=>{BioLab.setValues(sim,{respawn:false});sim.st.mode='run';sim.st.ti=1;sim.st.t=0;}},
  {lvl:'honors',title:'Fix 2: make time cost points',text:'Targets back on, and a penalty of 4 points per second. Every second now costs more than a target is worth, so the shortest run wins: race −120, detour −130, circle −150. The agent races clean.',pause:true,setup:sim=>{BioLab.setValues(sim,{respawn:true,pen:4});sim.st.mode='run';sim.st.ti=0;sim.st.t=0;}},
  {lvl:'ap',title:'The break-even rule',text:'With targets coming back, circling earns 0.3(H − 10)·T − H·P and the detour earns F + 5T − 50P. Set them equal to find the finishing bonus you need. At T = 10, P = 0 and H = 120 it is F > 280. The longer the clock, the more the loophole pays.',pause:true,setup:sim=>{BioLab.setValues(sim,{pen:0,respawn:true});sim.st.mode='run';sim.st.ti=2;sim.st.t=0;},focus:[458,120,332,320]}
 ],
 onTourExit(sim){sim.st.mode='idle';},
 lab:{bio:'<p><b>Question:</b> Which changes to the reward get the agent to finish the race?</p><ol><li>Start from the default rules. Press <b>Let the agent practice</b> and record a trial.</li><li>Change one thing at a time: turn off <b>Targets come back</b>; raise <b>Points for finishing</b>; set target points to 0. Record a trial after each.</li><li>Look at <b>Laps it finishes</b> in your table.</li></ol><p>Write one sentence: what kind of reward got the behavior you wanted?</p>',
  honors:'<p><b>Question:</b> How big a time penalty closes the loophole?</p><ol><li>Keep 20 for finishing, 10 per target, targets coming back.</li><li>Raise the time penalty in steps of 0.5 and record a trial at each step.</li><li>Find the first penalty where the agent finishes, and which strategy it picks.</li></ol><p>Explain why a time penalty pushes the agent toward the fastest finish, not just any finish.</p>',
  ap:'<p><b>Question:</b> How does the finishing bonus you need depend on the race clock?</p><ol><li>With 10 points per target, targets coming back and no penalty, find the smallest finishing bonus that makes the agent finish at clocks of 60, 120, 200 and 300 s.</li><li>Derive the same numbers from 0.3(H − 10)·T and F + 5T.</li></ol><p><b>CER:</b> Claim, evidence from your table, and reasoning from the algebra. Then: if the clock can change, is a bigger finishing bonus a lasting fix for the loophole? Use two rows of your table.</p>'},
 terms:[
  {t:'Agent',d:'A program that takes actions to earn as much reward as it can. Here, the computer player steering the boat.'},
  {t:'Reward',d:'The points an agent is trying to earn. A designer writes the reward to describe a goal.'},
  {t:'Specification gaming',d:'Earning the reward exactly as written without reaching the outcome the designer intended.'},
  {t:'Goodhart’s law',d:'When a measure becomes a target, people (or programs) find ways to raise the number that do not raise the thing it was measuring.'},
  {t:'Proxy',d:'Something easy to count that stands in for the thing you really care about: targets for racing, grades for learning.',lvl:'honors'},
  {t:'Policy search',d:'Comparing whole strategies by their total reward and keeping the best. Real reinforcement learning does this gradually, by trial and error, over many runs.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> The agent compares three fixed strategies by their total reward over the race clock and keeps the largest: R = F·laps + T·hits − P·seconds. Racing takes 40 s and passes 2 targets; the detour takes 50 s and passes 5; circling never finishes and hits 3 lagoon targets every 10 s after the first 10 s (only 3 in all if targets do not come back). On a tie, the agent keeps the first strategy it tried. Real agents learn by reinforcement learning over many runs and can find strategies nobody listed. This is a deterministic search over three, so you can check every number.</p><p><b>The real case.</b> OpenAI’s 2016 post “Faulty reward functions in the wild” (Jack Clark and Dario Amodei) describes an agent trained on the boat-racing game CoastRunners, rewarded for hitting targets. It circled a lagoon re-hitting three targets, catching fire and going the wrong way, and still scored about 20% higher than human players. <a href="https://openai.com/index/faulty-reward-functions/" target="_blank" rel="noopener">openai.com/index/faulty-reward-functions</a>. The course, timings and point values in this tool are invented for illustration; no game art is used.</p><p><b>More examples.</b> DeepMind’s 2020 post “Specification gaming: the flip side of AI ingenuity” (Victoria Krakovna and colleagues) defines specification gaming as satisfying the literal specification of an objective without achieving the intended outcome, and gathers about 60 examples.</p><p><b>Goodhart’s law.</b> The popular wording, “When a measure becomes a target, it ceases to be a good measure,” is Marilyn Strathern’s summary of economist Charles Goodhart’s idea. Cathy O’Neil’s <i>Weapons of Math Destruction</i> applies it to college rankings, where colleges worked to raise the inputs U.S. News counted rather than the education those inputs were meant to stand for.</p>'
};
BioLab.register(SIM);
})();
