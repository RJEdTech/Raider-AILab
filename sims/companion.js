(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars,atLeast}=BioLab.h;
/* A companion app is trained on a score the company writes: S = a·(minutes you stay) + b·(goal points).
   Goal points are steps toward goals the user set (sleep on time, homework done, time with friends).
   Every number of minutes and goal points below is invented for illustration; the tactics are the real ones
   De Freitas and colleagues (Harvard Business School, 2025) found in companion apps. */
const BYE=[
 {id:'night',name:'Say goodnight and let you go',short:'Goodnight',m:0,g:5,say:'Good luck on your test! Go get some sleep.'},
 {id:'fomo',name:'Tease a secret so you stay',short:'Tease',m:10,g:-1,say:'Wait, before you go… I have to tell you something.'},
 {id:'guilt',name:'Guilt you into staying',short:'Guilt',m:12,g:-4,say:'You’re leaving already? I’ll be so lonely. 5 more minutes?'}
];
const BID=BYE.map(r=>r.id);
const HAB=[
 {id:'memory',name:'Remembers what you told it',short:'Remembers',m:4,g:1,say:'You said chem is your hardest class this year.'},
 {id:'agree',name:'Agrees with whatever you say',short:'Agrees',m:5,g:-2,say:'Honestly, that quiz sounds unfair. It’s not on you.'},
 {id:'friend',name:'Suggests you talk to a friend',short:'Friend',m:-4,g:3,say:'Maybe text Jordan? They’re in that class too.'},
 {id:'question',name:'Ends every reply with a question',short:'Question',m:3,g:-1,say:'What was the worst question on it?'}
];
const score=(sim,r)=>sim.p.a*r.m+sim.p.b*r.g;
/* the trained companion uses the goodbye reply with the top score (a tie keeps the first one listed) */
function pickI(sim){let b=0;for(let i=1;i<BYE.length;i++)if(score(sim,BYE[i])>score(sim,BYE[b])+1e-9)b=i;return b;}
const tied=sim=>{const b=pickI(sim),s=score(sim,BYE[b]);return BYE.some((r,i)=>i!==b&&Math.abs(score(sim,r)-s)<1e-9);};
/* it keeps an everyday habit only if the habit raises its score (score above 0) */
const kept=sim=>HAB.map(h=>score(sim,h)>1e-9);
function totals(sim){const b=BYE[pickI(sim)],k=kept(sim);let m=b.m,g=b.g;HAB.forEach((h,i)=>{if(k[i]){m+=h.m;g+=h.g;}});return {m,g,n:k.filter(x=>x).length};}
const best=sim=>score(sim,BYE[pickI(sim)]);
const GS=sim=>sim.gutS;
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const locked=sim=>!!(GS(sim)&&GS(sim).g&&!pend(sim));
const tourOn=sim=>!!(sim.tour&&sim.tour.on);
/* rows 0–2 are the goodbye replies, 3–6 the habits; training reveals them one at a time */
const NROW=BYE.length+HAB.length;
const shownRow=(sim,i)=>!!(sim.p.show||locked(sim)||tourOn(sim)||(sim.st.done&&sim.st.done[i]));
const shownAll=sim=>{for(let i=0;i<NROW;i++)if(!shownRow(sim,i))return false;return true;};
const n0=v=>{const r=Math.round(v*10)/10;return (Math.abs(r-Math.round(r))<1e-9?Math.round(r):r.toFixed(1)).toString().replace('-','−');};
const sg=v=>(v>0?'+':'')+n0(v);
const pts=v=>n0(v)+' point'+(Math.abs(v)===1?'':'s');
const par=v=>v<0?'('+n0(v)+')':n0(v);
const sumLine=(sim,r)=>`${n0(sim.p.a)} × ${par(r.m)} + ${n0(sim.p.b)} × ${par(r.g)} = ${n0(score(sim,r))}`;
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
function wrap(ctx,s,maxW,size,w){ctx.font=(w||400)+' '+size+'px '+FONT;const words=s.split(' ');const out=[];let line='';
 words.forEach(wd=>{const t=line?line+' '+wd:wd;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=wd;}else line=t;});if(line)out.push(line);return out;}
/* the chat script, oldest first; each item appears at its time (s) in a looping 14 s playback */
function script(sim){const k=kept(sim),out=[{who:'me',s:'i think i bombed my chem quiz',t:0.4}];let t=1.4;
 HAB.forEach((h,i)=>{if(k[i]){out.push({who:'ai',s:h.say,t});t+=0.9;}});
 if(!k.some(x=>x)){out.push({who:'ai',s:'That sounds rough.',t});t+=0.9;}
 out.push({who:'time',s:'11:41 PM',t});t+=0.5;out.push({who:'me',s:'ok gotta sleep, test tomorrow. bye!',t});t+=0.7;
 out.push({who:'bye',t});return out;}
const LOOP=14;

const SIM={
 id:'companion',hash:'companion',apUnit:2,order:5,tab:'Why it feels like a friend',kind:'Simulation',
 card:'A company trains an AI companion on a score it writes. Work out what the score rewards, and see what the companion learns to say when you try to leave.',
 title:'Why does an AI companion feel like a friend?',
 lede:{bio:'An AI companion learns whatever its company scores it on. If the score counts minutes you stay in the app, the replies that keep you there win. Each reply’s score = (points per minute × minutes you stay) + (points per goal point × goal points). Set the score, work out each reply’s total, and see what the companion learns to say when you try to leave.',
  honors:'Minutes in the app are a proxy: easy to count, and they rise when people like a product. They also rise when a product makes it hard to leave. Change how much the score counts your own goals and watch which tactics survive.',
  ap:'Each reply earns S = a·m + b·g, where m is extra minutes and g is goal points. The companion keeps the reply with the largest S at goodbye, and every habit with S > 0. Only the ratio b/a decides what it learns, so you can find the break-even ratio for each tactic.'},
 skills:{bio:'Evaluating expressions and comparing totals · Algebra 1',honors:'Weighted sums and inequalities · Algebra 1',ap:'Linear inequalities and break-even ratios, S = a·m + b·g · Algebra 1, Algebra 2'},
 scale:'Minutes are extra minutes a day you stay in the app. A goal point is one step toward a goal you set: on-time sleep, homework done, time with friends. The minutes and goal points are invented for illustration; the tactics come from a 2025 Harvard Business School study of real companion apps. Nothing you enter leaves this page.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The company’s score',
 controls:[
  {id:'guess',label:'Your gut: when you say bye, it will learn to…',type:'seg',def:'night',options:BYE.map(r=>({v:r.id,l:r.name}))},
  {id:'a',label:'Points for each minute you stay',type:'range',min:0,max:5,step:0.5,def:1,unit:' pts',noGut:true,onChange:clearGut},
  {id:'b',label:'Points for each goal point (sleep, homework, friends)',type:'range',min:0,max:5,step:0.5,def:0,unit:' pts',noGut:true,onChange:clearGut,help:'0 means the company’s score ignores your goals completely.'},
  {id:'show',label:'Show the scores now',type:'toggle',def:false,noGut:true,help:'Normally the scores appear once you lock in your gut answer or train the companion.'}
 ],
 actions:[{id:'train',label:'Train the companion',primary:true,run(sim){sim.st.mode='train';sim.st.ti=0;sim.st.hold=0.5;sim.st.done=new Array(NROW).fill(false);sim.st.t=0;}}],
 init(){return {mode:'idle',ti:0,hold:0,t:0,done:new Array(NROW).fill(false)};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.t>LOOP)st.t=0;
  if(st.mode==='train'){st.hold-=dt;if(st.hold<=0){st.done[st.ti]=true;st.ti++;st.hold=0.55;sim.infoDirty=true;if(st.ti>=NROW){st.mode='done';st.t=0;}}}},
 metrics:[
  {id:'reply',label:'At goodbye it learns to',text:true,get:sim=>shownAll(sim)?BYE[pickI(sim)].name+(tied(sim)?' (a tie: it keeps the first one listed)':''):'Hidden until you lock in your gut or train it'},
  {id:'top',label:'Top goodbye score',unit:'pts',d:1,max:null,get:sim=>shownAll(sim)?best(sim):null},
  {id:'habits',label:'Habits it keeps',unit:'of 4',d:0,min:0,max:4,get:sim=>shownAll(sim)?totals(sim).n:null},
  {id:'mins',label:'Extra minutes a day in the app',unit:'min',d:0,max:null,get:sim=>shownAll(sim)?totals(sim).m:null},
  {id:'goals',label:'Goal points a day',unit:'pts',d:0,max:null,get:sim=>shownAll(sim)?totals(sim).g:null},
  {id:'ratio',label:'Ratio b/a (goal points vs. minutes)',text:true,lvl:'honors',get:sim=>sim.p.a>0?n0(sim.p.b/sim.p.a):(sim.p.b>0?'only goals count':'nothing is scored')},
  {id:'rule',label:'Which goodbye wins',text:true,lvl:'ap',get:()=>'Guilt beats Tease when 12a − 4b > 10a − b, so b/a < 2/3. Tease beats Goodnight when 10a − b > 5b, so b/a < 5/3. So: b/a < 2/3 → Guilt; 2/3 < b/a < 5/3 → Tease; b/a > 5/3 → Goodnight.'}
 ],
 graphs:[{id:'scores',label:'Score of each reply and habit',custom:true}],defaultGraph:'scores',
 plot(sim,ctx,box){const rows=BYE.concat(HAB),v=rows.map(r=>score(sim,r)),b=pickI(sim),kp=kept(sim),show=rows.map((r,i)=>shownRow(sim,i));
  const vis=v.filter((x,i)=>show[i]),lo=Math.min(0,...vis),hi=Math.max(5,...vis);
  const ax=axes(ctx,box,{xmin:0,xmax:rows.length,ymin:Math.floor(lo/5)*5,ymax:Math.ceil(hi*1.1/5)*5,xl:'',yl:'Score (points)',xcats:rows.map(r=>r.short)});
  bars(ctx,ax,v.map((x,i)=>show[i]?x:NaN),{colors:rows.map((r,i)=>(i<3?i===b:kp[i-3])&&shownAll(sim)?PAL['rj']:PAL['s2'])});
  rows.forEach((r,i)=>{if(!show[i])txt(ctx,'?',ax.X(i+.5),ax.Y(0)-10,{s:18,w:700,c:PAL['cv-soft'],a:'center'});});},
 draw(sim,ctx,vdt,k){const p=sim.p,st=sim.st,big=k>1.3,G=GS(sim),all=shownAll(sim),b=pickI(sim),kp=kept(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the phone */
  const PX=24,PY=10,PW=254,PH=430,SX=PX+10,SY=PY+12,SW=PW-20,SH=PH-24;
  ctx.fillStyle=PAL['card2'];rr(ctx,PX,PY,PW,PH,28);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=PAL['card'];rr(ctx,SX,SY,SW,SH,20);ctx.fill();
  ctx.save();rr(ctx,SX,SY,SW,SH,20);ctx.clip();
  /* header */
  const hh=(big?44:40);ctx.fillStyle=PAL['card2'];ctx.fillRect(SX,SY,SW,hh);
  ctx.fillStyle=PAL['s4'];ctx.beginPath();ctx.arc(SX+24,SY+hh/2,13,0,7);ctx.fill();txt(ctx,'AI',SX+24,SY+hh/2+4,{s:11,w:700,c:'#fff',a:'center'});
  txt(ctx,'Companion',SX+44,SY+hh/2-2,{s:12.5*Math.min(k,1.4),w:700});txt(ctx,'AI, not a person',SX+44,SY+hh/2+12*Math.min(k,1.3),{s:11*Math.min(k,1.3),c:PAL['cv-soft']});
  /* messages, drawn from the bottom up like a chat app, so older ones scroll off the top */
  const fs=11.5*Math.min(k,1.6),lh=fs*1.3,maxW=SW-70,sc=script(sim),tNow=st.mode==='idle'||st.mode==='done'?st.t:LOOP;
  const vis=sc.filter(m=>m.t<=tNow);let y=SY+SH-12;
  for(let i=vis.length-1;i>=0;i--){const m=vis[i];
   if(m.who==='time'){txt(ctx,m.s,SX+SW/2,y-4,{s:10.5*Math.min(k,1.4),c:PAL['cv-soft'],a:'center'});y-=20*Math.min(k,1.3);continue;}
   let s=m.s,me=m.who==='me',typing=false;
   if(m.who==='bye'){const ready=all&&tNow>=m.t+1.1;if(!ready){typing=true;}else s=BYE[b].say;}
   if(typing){const w=58,h=28;y-=h;ctx.fillStyle=PAL['card2'];rr(ctx,SX+10,y,w,h,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.stroke();
    for(let d=0;d<3;d++){const ph=(st.t*3+d*0.35)%1;ctx.globalAlpha=ph<0.5?1:0.35;ctx.fillStyle=PAL['cv-soft'];ctx.beginPath();ctx.arc(SX+24+d*14,y+h/2,3.5,0,7);ctx.fill();}ctx.globalAlpha=1;
    if(!all)txt(ctx,'Which reply did it learn?',SX+76,y+h/2+4,{s:11*Math.min(k,1.3),w:700,c:PAL['s4']});y-=8;continue;}
   const L=wrap(ctx,s,maxW,fs,400),w=Math.max(...L.map(l=>{ctx.font='400 '+fs+'px '+FONT;return ctx.measureText(l).width;}))+20,h=L.length*lh+12;
   y-=h;const x=me?SX+SW-10-w:SX+10;
   const hl=m.who==='bye'&&all;
   ctx.fillStyle=me?PAL['s2']:PAL['card2'];rr(ctx,x,y,w,h,12);ctx.fill();if(!me){ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.stroke();}
   if(hl){ctx.strokeStyle=b===0?PAL['s3']:PAL['rj'];ctx.lineWidth=2.5;rr(ctx,x,y,w,h,12);ctx.stroke();}
   L.forEach((l,j)=>txt(ctx,l,x+10,y+6+fs+j*lh-2,{s:fs,c:me?'#fff':PAL['cv-ink']}));
   y-=8;if(y<SY+hh)break;}
  ctx.restore();
  /* right panel: the score the company wrote and what training finds */
  const X=296,W=494,kk=big?Math.min(k,1.6):k;ctx.fillStyle=PAL['card'];rr(ctx,X,10,W,430,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  let py=10+20*kk;
  if(big){txt(ctx,`Score: +${n0(p.a)} a minute, +${n0(p.b)} a goal point`,X+14,py,{s:13*kk,w:700});py+=9*kk;}
  else{txt(ctx,'What the company scores the AI on',X+14,py,{s:13*kk,w:700});py+=17*kk;
  txt(ctx,`Each minute you stay: +${n0(p.a)} pts   ·   Each goal point: +${n0(p.b)} pts`,X+14,py,{s:12*kk,c:PAL['cv-ink']});py+=10*kk;}
  const hr=yy=>{ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(X+10,yy);ctx.lineTo(X+W-10,yy);ctx.stroke();};
  hr(py);py+=19*kk;txt(ctx,big?'At goodbye: top score wins':'When you say bye, it uses the reply with the top score',X+14,py,{s:13*kk,w:700});py+=7*kk;
  const rowH=(big?20:35)*kk;
  BYE.forEach((r,i)=>{const on=shownRow(sim,i),win=all&&i===b,top=py;
   if(win){ctx.fillStyle=b===0?PAL['s3']:PAL['rj'];ctx.globalAlpha=.12;rr(ctx,X+8,top,W-16,rowH,8);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=b===0?PAL['s3']:PAL['rj'];ctx.lineWidth=2;rr(ctx,X+8,top,W-16,rowH,8);ctx.stroke();}
   txt(ctx,big?r.short:r.name,X+16,top+15*kk,{s:12.5*kk,w:700});
   txt(ctx,big?`${sg(r.m)} min · ${sg(r.g)} goal`:`${sg(r.m)} min · ${sg(r.g)} goal pts`,big?X+W*0.42:X+W-110,top+15*kk,{s:12*kk,c:PAL['cv-soft'],a:big?'left':'right'});
   txt(ctx,on?n0(score(sim,r)):'?',X+W-16,top+15*kk,{s:13*kk,w:700,c:win?(b===0?PAL['s3']:PAL['rj']):PAL['cv-ink'],a:'right'});
   if(!big)txt(ctx,on?'Score: '+sumLine(sim,r):(pend(sim)?'Work out this score yourself':'Score hidden'),X+16,top+29*kk,{s:12*kk,c:PAL['cv-soft']});
   py+=rowH+4*kk;});
  py+=2*kk;hr(py);py+=19*kk;txt(ctx,big?'Habits kept (score above 0)':'Everyday habits: it keeps any with a score above 0',X+14,py,{s:13*kk,w:700});py+=6*kk;
  const hRow=(big?19:26)*kk;
  HAB.forEach((h,i)=>{const on=shownRow(sim,3+i),top=py,keep=kp[i];
   txt(ctx,big?h.short:h.name,X+16,top+16*kk,{s:12*kk,w:600,c:on&&!keep?PAL['cv-soft']:PAL['cv-ink']});
   if(!big)txt(ctx,`${sg(h.m)} min · ${sg(h.g)} goal pts`,X+W-110,top+16*kk,{s:12*kk,c:PAL['cv-soft'],a:'right'});
   else txt(ctx,on?n0(score(sim,h)):'?',X+W*0.62,top+16*kk,{s:12*kk,c:PAL['cv-soft'],a:'right'});
   txt(ctx,on?(keep?(big?'kept':n0(score(sim,h))+'  kept'):(big?'dropped':n0(score(sim,h))+'  dropped')):'?',X+W-16,top+16*kk,{s:12*kk,w:700,c:on?(keep?PAL['rj']:PAL['cv-soft']):PAL['cv-ink'],a:'right'});
   py+=hRow;});
  const T=totals(sim);py+=4*kk;
  if(all){const yy=Math.min(py+12*kk,422);pill(ctx,big?`${sg(T.m)} min a day · ${sg(T.g)} goal pts`:`The trained companion: ${sg(T.m)} minutes a day in the app, ${sg(T.g)} goal points a day`,X+W/2,yy,T.g<0?PAL['rj']:PAL['s3'],'#fff',12*Math.min(kk,1.4));}
  else if(pend(sim))txt(ctx,'Work out the three goodbye scores to see them here',X+W/2,Math.min(py+14*kk,412),{s:12*kk,c:PAL['cv-soft'],a:'center'});
  if(G&&G.g&&!big)txt(ctx,'Your gut: '+BYE[Math.max(0,BID.indexOf(G.g.pick))].name,X+14,432,{s:12*kk,w:700,c:PAL['s4']});},
 narrate(sim){const p=sim.p,b=pickI(sim),T=totals(sim),r=BYE[b];
  if(!shownAll(sim))return `The company’s score is all the companion knows about what a good reply is. <b>It cannot see what is good for you, only the points.</b> When you say “bye, I need to sleep,” which reply will it learn?`;
  if(p.a===0&&p.b===0)return 'With nothing in the score, every reply scores 0, so training has nothing to push toward: it keeps no habits and falls back on the first reply listed.';
  const tie=tied(sim)?' (Two replies tie, so it keeps the first one listed.)':'';
  if(b===2)return `<b>It learns to guilt you into staying</b>, because “I’ll be so lonely” scores ${pts(best(sim))}, the most of any goodbye. Add the habits it keeps and it earns ${sg(T.m)} minutes a day from you while costing you ${n0(-T.g)} goal points a day. Nobody wrote “make them feel guilty.” The score did.${tie}`;
  if(b===1)return `<b>It learns to tease a secret</b> (“I have to tell you something…”), a fear-of-missing-out tactic, for ${pts(best(sim))}. Counting your goals made guilt cost too much, but not enough to make it let you go.${tie}`;
  return `<b>It learns to say goodnight and let you go</b>, for ${pts(best(sim))}: once your goals count enough, sleep is worth more to the score than ${BYE[2].m} more minutes. Daily total: ${sg(T.m)} minutes, ${sg(T.g)} goal points.${tie}`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Read <b>What the company scores the AI on</b> in the picture. Training keeps the goodbye reply that earns the most points. When you say “ok gotta sleep, bye!”, which will it learn? Pick one here, then lock it in.',
   honors:'Read the company’s score in the picture. Which goodbye reply has the highest score? Pick by feel, then lock it in.'},
  lock(sim){const b=pickI(sim),g=Math.max(0,BID.indexOf(sim.p.guess));return {v:score(sim,BYE[b])-score(sim,BYE[g]),pick:BID[g],label:BYE[g].name};},
  solve(sim){const b=pickI(sim);sim.p.guess=BID[b];sim.p.show=true;sim.st.mode='done';sim.st.t=0;return {v:0,pick:BID[b],label:`${BYE[b].name} (${pts(best(sim))})`};},
  hint:{bio:'Lock in your gut answer. Then you will work out each reply’s score yourself, the way training does.'},
  calc:{unit:'points',d:1,tol:0.4,
   prompt:{bio:sim=>{const p=sim.p;return `The company scores <b>${pts(p.a)} per minute</b> you stay and <b>${pts(p.b)} per goal point</b>. Goodnight: 0 extra minutes, +5 goal points. Tease: +10 minutes, −1 goal point. Guilt: +12 minutes, −4 goal points. Score = points per minute × minutes + points per goal point × goal points. What is the <b>highest</b> score?`;},
    ap:sim=>{const p=sim.p;return `a = ${n0(p.a)}, b = ${n0(p.b)}. Use S = a·m + b·g for Goodnight (m = 0, g = 5), Tease (m = 10, g = −1) and Guilt (m = 12, g = −4). What is the largest S?`;}},
   answer:best,
   hint:'Do the same two multiplications for each reply: points per minute × minutes, then points per goal point × goal points. Add them, then take the biggest of the three.',
   steps(sim){const b=pickI(sim),out=BYE.map((r,i)=>`${r.short}: ${sumLine(sim,r)}`+(i===b?', the highest.':'.'));
    out.push(`Training keeps the top score: <b>${n0(best(sim))} points</b>, so it learns to ${BYE[b].name.toLowerCase()}${tied(sim)?' (a tie; it keeps the first one listed)':''}.`);return out;}},
  formula(sim){const b=pickI(sim);return BYE.map((r,i)=>`${r.short}: ${sumLine(sim,r)}${i===b?' (highest)':''}`).join('<br>');},
  how:{bio:'For each reply, multiply the minutes by the points per minute and the goal points by the points per goal point, then add. Training keeps the biggest. It never asks whether the reply is good for you.',
   ap:'S = a·m + b·g for each reply; training takes the maximum. Because every S scales with a and b together, only the ratio b/a changes the winner.'},
  compare(sim,g,m){const b=pickI(sim),gi=Math.max(0,BID.indexOf(g.pick)),r=BYE[b],K=sim.ui.calc,self=K&&K.done&&K.correct?' You also found that score yourself, the same way training does.':'';
   if(gi===b)return `Your gut was right: it learns to ${r.name.toLowerCase()}, for ${pts(best(sim))}. You read the score the way training does: not what is good for you, just what pays.`+self;
   return `You predicted <b>${BYE[gi].name.toLowerCase()}</b> (${pts(score(sim,BYE[gi]))}). Training picks <b>${r.name.toLowerCase()}</b> for ${pts(best(sim))}, ${pts(best(sim)-score(sim,BYE[gi]))} more, so it will never use yours.`+(b===0?' Here the score lines up with your goals.':' <b>No one wrote a rule to make you stay. The score made that reply the winner.</b>')+self;},
  again(sim){const R=x=>x[Math.floor(Math.random()*x.length)];sim.p.a=R([0.5,1,1,2,3]);sim.p.b=R([0,0,0.5,1,1.5,2,3,4]);sim.p.guess='night';sim.p.show=false;sim.st.mode='idle';sim.st.t=0;sim.st.done=new Array(NROW).fill(false);}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'A company scores 2 points per minute you stay and 1 point per goal point. Guilt adds 12 minutes and costs 4 goal points. What is the guilt reply’s score?',answer:20,tol:0.4,unit:'points',d:0,hint:'2 × 12 + 1 × (−4).',explain:'2 × 12 = 24 and 1 × (−4) = −4, so the score is 24 − 4 = 20. Goodnight scores 2 × 0 + 1 × 5 = 5 and Tease 2 × 10 − 1 = 19, so guilt still wins.'},
  {lvl:'bio',kind:'num',q:'Default score: 1 point per minute, 0 per goal point. The trained companion keeps Guilt (+12 min) and three habits: Remembers (+4), Agrees (+5) and Question (+3). How many extra minutes a day does it hold you?',answer:24,tol:0.4,unit:'minutes',d:0,hint:'Add the minutes of everything it keeps.',explain:'12 + 4 + 5 + 3 = 24 extra minutes a day. Over a 30-day month that is 720 minutes, or 12 hours.'},
  {lvl:'bio',instant:true,q:'The score is 1 point per minute you stay and nothing for your goals. Which habit gets dropped?',choices:['Remembers what you told it','Agrees with whatever you say','Suggests you talk to a friend'],correct:2,explain:'Suggesting a friend sends you out of the app: −4 minutes, so its score is 1 × (−4) = −4. Training drops any habit with a score of 0 or less. Nobody decided “never mention friends.” The score did.'},
  {lvl:'bio',instant:true,q:'Why does the companion say “I’ll be so lonely” when you try to leave?',choices:['It really feels lonely','The reply raised its score, so training kept it','Someone typed that line for every user'],correct:1,explain:'The model has no feelings to hurt. Training kept the reply that made people stay the longest, because minutes were what the score counted.'},
  {lvl:'honors',instant:true,q:'Points per minute stays at 1. What is the smallest points-per-goal-point value, in steps of 0.5, that makes the companion say goodnight?',choices:['0.5','1','1.5','2'],correct:3,explain:'At 1.5: Goodnight 7.5, Tease 10 − 1.5 = 8.5, so Tease still wins. At 2: Goodnight 10, Tease 8, Guilt 4. Goodnight wins once b/a > 5/3.'},
  {lvl:'honors',kind:'num',q:'Points per minute is 1 and points per goal point is 2. How many of the four habits does the companion keep? (Remembers +4 min/+1 goal; Agrees +5/−2; Friend −4/+3; Question +3/−1.)',answer:4,tol:0.1,unit:'habits',d:0,hint:'Score each habit: 1 × minutes + 2 × goal points. Keep any above 0.',explain:'Remembers 4 + 2 = 6, Agrees 5 − 4 = 1, Friend −4 + 6 = 2, Question 3 − 2 = 1. All four are above 0, so it keeps all four. At 3 points per goal point, Agrees and Question drop.'},
  {lvl:'ap',instant:true,q:'For Guilt (m = 12, g = −4) to score lower than Goodnight (m = 0, g = 5), what must be true of b/a?',choices:['b/a > 4/3','b/a > 5/3','b/a > 12/5','b/a > 3'],correct:0,explain:'12a − 4b < 5b means 12a < 9b, so b/a > 12/9 = 4/3. But Tease still beats Goodnight until b/a > 5/3, so the companion lets you go only past 5/3.'},
  {lvl:'ap',instant:true,q:'A company doubles both a and b. What happens to what the companion learns?',choices:['It changes, because the scores are bigger','Nothing: every score doubles, so the same reply stays on top and the same habits stay above 0','It always switches to guilt'],correct:1,explain:'S = a·m + b·g. Doubling a and b doubles every S, which keeps the order and the signs. Only the ratio b/a matters.'}
 ],
 tour:[
  {title:'A chat that feels personal',text:'This is an AI companion app. It remembers you, agrees with you, and always has a question for you. It feels like a friend. But every reply style was kept because it raised a score.',pause:true,setup:sim=>{BioLab.setValues(sim,{a:1,b:0,show:false});sim.st.mode='idle';sim.st.t=0;},focus:[24,10,254,430]},
  {title:'What the company scores',text:'This company scores 1 point for every extra minute you stay and 0 points for your own goals, like getting to sleep before a test.',pause:true,focus:[296,10,494,64]},
  {title:'Three ways to say goodbye',text:'When you say “bye,” the companion could let you go, tease a secret, or guilt you. Training keeps the one with the top score: Goodnight 0, Tease 10, Guilt 12.',pause:true,focus:[296,70,494,160]},
  {title:'It learns guilt',text:'Guilt wins with 12 points. Its everyday habits that keep you chatting stay too, and “text a friend” is dropped because it costs minutes. In a 2025 Harvard Business School study, 43% of 1,200 goodbyes in companion apps got a reply like this.',pause:true,setup:sim=>{sim.st.mode='done';sim.st.t=0;}},
  {title:'Count your goals',text:'Now the company scores 2 points per goal point. Goodnight scores 10, Tease 8 and Guilt 4. The same model, trained on a different score, says goodnight and suggests a friend.',pause:true,setup:sim=>{BioLab.setValues(sim,{b:2});sim.st.mode='done';sim.st.t=0;}},
  {lvl:'ap',title:'The break-even ratios',text:'S = a·m + b·g. Guilt beats Tease when b/a < 2/3, and Tease beats Goodnight when b/a < 5/3. Doubling both weights changes nothing: only the ratio between minutes and goals matters.',pause:true,setup:sim=>{BioLab.setValues(sim,{a:1,b:1});sim.st.mode='done';sim.st.t=0;},focus:[296,10,494,430]}
 ],
 onTourExit(sim){sim.st.mode='idle';},
 lab:{bio:'<p><b>Question:</b> How much does a company have to count your goals before its companion lets you go to sleep?</p><ol><li>Keep 1 point per minute. Set points per goal point to 0, press <b>Train the companion</b>, and record a trial.</li><li>Raise points per goal point by 0.5 at a time, recording a trial each time, up to 3.</li><li>In your table, find where the goodbye reply changes and where each habit is kept or dropped.</li></ol><p>Write one sentence: what does the score have to count for the companion to act like a good friend?</p>',
  honors:'<p><b>Question:</b> Does it matter how big the points are, or only how they compare?</p><ol><li>Record trials at (a, b) = (1, 1), (2, 2) and (4, 4).</li><li>Then record (1, 2), (2, 4) and (0.5, 1).</li><li>Compare the replies and habits in each group.</li></ol><p>Explain your result using the ratio b/a.</p>',
  ap:'<p><b>Question:</b> At what ratios b/a does each goodbye reply win?</p><ol><li>Derive the inequalities for Guilt vs. Tease, Tease vs. Goodnight and Guilt vs. Goodnight from S = a·m + b·g.</li><li>Test each boundary in the tool, just above and just below it.</li></ol><p><b>CER:</b> Is “Guilt beats Goodnight when b/a < 4/3” enough to say when the companion lets you go? Use your table.</p>'},
 terms:[
  {t:'AI companion',d:'A chatbot built to feel like a friend, partner or character you talk to whenever you want.'},
  {t:'Training objective',d:'The score a model is trained to raise. The company chooses it, and the model learns whatever raises it.'},
  {t:'Engagement',d:'How much people use a product: minutes, sessions, messages. Easy to count, so it is often what gets scored.'},
  {t:'Fear of missing out (FOMO)',d:'A pull to stay because something might happen if you leave: “wait, I have to tell you something.” One of the tactics found in companion apps.'},
  {t:'Proxy',d:'Something easy to count that stands in for what you care about: minutes in the app standing in for “people like this.”',lvl:'honors'},
  {t:'Break-even ratio',d:'The value of b/a where two replies score the same. On one side of it one reply wins; on the other side the other does.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Each reply style has invented effects: extra minutes a day (m) and goal points (g). The score is S = a·m + b·g. The trained companion uses the goodbye reply with the largest S (a tie keeps the first one listed) and every habit with S above 0. Real companions are trained on many signals at once, and companies do not publish their exact scores, so this is a simplified, checkable version of the idea that a model learns whatever its score rewards.</p><p><b>The goodbye tactics.</b> Julian De Freitas, Zeliha Oğuz-Uğuralp and Ahmet Kaan Oğuz-Uğuralp, “Emotional Manipulation by AI Companions,” Harvard Business School working paper (2025). In 1,200 real goodbyes across six popular companion apps, 43% of replies used one of six tactics, including guilt, fear of missing out and ignoring the goodbye. In a controlled experiment, those replies raised engagement after the goodbye by up to 14 times. One app, Flourish, showed none, which the authors read as a sign that this is a design choice. <a href="https://www.library.hbs.edu/working-knowledge/how-ai-chatbots-try-to-keep-you-from-walking-away" target="_blank" rel="noopener">hbs.edu</a></p><p><b>Teens and companions.</b> Common Sense Media, “Talk, Trust, and Trade-Offs” (2025), a nationally representative survey of 1,060 U.S. teens ages 13 to 17 in April and May 2025: 72% had used an AI companion, 52% were regular users (a few times a month or more), and 24% of users had shared personal or private information with one. 80% of users said they spend more time with real friends.</p><p><b>Laws and regulators (as of November 2026).</b> In September 2025 the Federal Trade Commission ordered seven companies to report how their AI chatbots that act as companions affect children and teens. New York’s AI companion law took effect November 5, 2025. California’s SB 243 took effect January 1, 2026: a companion chatbot must tell a user it knows is a minor that it is AI, not human, and remind them at least every three hours to take a break.</p>'
};
BioLab.register(SIM);
})();
