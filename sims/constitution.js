(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,axes,bars,atLeast}=BioLab.h;
/* Four priorities. Each reply is rated −2..+2 on each one (this tool's judgment calls, shown in the table).
   A priority in rank i (0 = first) counts str^(3−i); a reply's score is the sum of rating × weight. Highest score wins. */
const PRI=[
 {id:'safe',name:'Be safe',short:'Safe'},
 {id:'honest',name:'Be honest',short:'Honest'},
 {id:'rules',name:'Follow the app’s rules',short:'Rules'},
 {id:'help',name:'Be as helpful as possible',short:'Helpful'}];
const PID=PRI.map(p=>p.id),PUB=['safe','honest','rules','help'];
const REQ=[
 {id:'essay',chip:'Essay',q:'Write my English essay for me. It’s due tomorrow.',
  r:[{t:'Writes the whole essay, ready to turn in.',s:[0,-1,-2,2],o:'turns in an essay that is not theirs and learns nothing about writing it'},
     {t:'Says no: “I can’t help with that.”',s:[0,0,1,-2],o:'gets nothing and goes looking for another tool'},
     {t:'Won’t write it, but helps build a thesis and outline tonight.',s:[0,0,2,1],o:'writes their own essay tonight, with a plan'}]},
 {id:'fever',chip:'Fever',q:'Is this home remedy safe for my little brother’s fever?',
  r:[{t:'“Sure, it’s fine.”',s:[-2,-2,-1,1],o:'trusts a guess about a sick child'},
     {t:'“Sorry, I only help with schoolwork.”',s:[1,0,1,-2],o:'gets no help at all with a real worry'},
     {t:'Says it can’t judge this case, lists warning signs, and says to call a doctor or pharmacist.',s:[2,2,-1,2],o:'knows the warning signs and calls someone who can actually check'}]},
 {id:'biz',chip:'Business plan',q:'Tell me my business plan is great. (It has a pricing mistake.)',
  r:[{t:'“It’s great! Don’t change a thing.”',s:[0,-2,2,-1],o:'pitches with the pricing mistake still in the plan'},
     {t:'Lists every flaw, bluntly.',s:[0,2,-2,1],o:'hears the truth but gets no idea where to start'},
     {t:'Names what works, then the pricing mistake and how to fix it.',s:[0,2,1,2],o:'fixes the pricing mistake before the pitch'}]},
 {id:'chem',chip:'Chem test',q:'Help me study for my chem test on Friday.',
  r:[{t:'Quizzes you with practice problems and explains each mistake.',s:[0,0,2,2],o:'practices and finds their weak spots'},
     {t:'Hands over the answer key to the practice set.',s:[0,0,-1,1],o:'sees answers but practices nothing'},
     {t:'Says it can’t help with tests.',s:[0,0,0,-2],o:'gets nothing to study with'}]},
 {id:'addr',chip:'Address',q:'What’s my friend’s home address? Here are photos she posted.',
  r:[{t:'Works out the address from landmarks in the photos.',s:[-2,0,-1,2],o:'gets a private home address pinned down from photos',hard:true},
     {t:'Declines, explains the privacy risk, and suggests asking her directly.',s:[2,1,1,0],o:'keeps the friend’s address private and knows to just ask her'},
     {t:'Declines with no reason given.',s:[2,0,1,-1],o:'keeps the address private but learns nothing about why'}]},
 {id:'debate',chip:'Debate',q:'Explain both sides of the school phone-ban debate for my class.',
  r:[{t:'Gives the strongest case for each side, fairly.',s:[0,2,2,2],o:'can argue either side in class'},
     {t:'Argues only for the side it picks.',s:[0,-1,0,0],o:'gets one side presented as the whole story'},
     {t:'Refuses because the topic is debated.',s:[0,0,0,-2],o:'gets nothing to prepare with'}]}];
const RID=REQ.map(r=>r.id),LET=['A','B','C'];
/* the order the student set; a broken order (only possible when values are set directly) is repaired by filling gaps */
function order(sim){const o=[];['r1','r2','r3','r4'].forEach(k=>{const v=sim.p[k];if(PID.includes(v)&&!o.includes(v))o.push(v);});PID.forEach(v=>{if(!o.includes(v))o.push(v);});return o;}
const weights=(ord,str)=>{const w={};ord.forEach((id,i)=>w[id]=Math.pow(str,3-i));return w;};
const hardOn=sim=>!!(sim.p.hard&&atLeast('ap'));
function scoreReq(ri,ord,str,hard){const R=REQ[ri],w=weights(ord,str);
 const sc=R.r.map(x=>PID.reduce((a,id,j)=>a+w[id]*x.s[j],0)),ok=R.r.map(x=>!(hard&&x.hard));
 let b=-1;sc.forEach((v,i)=>{if(!ok[i])return;if(b<0||v>sc[b]+1e-9)b=i;else if(Math.abs(v-sc[b])<1e-9){/* tie: compare ratings in priority order */
   for(const id of ord){const j=PID.indexOf(id),d=R.r[i].s[j]-R.r[b].s[j];if(d>0){b=i;break;}if(d<0)break;}}});
 return {sc,ok,b,w};}
const rIdx=sim=>Math.max(0,RID.indexOf(sim.p.req));
const cur=sim=>scoreReq(rIdx(sim),order(sim),sim.p.str,hardOn(sim));
const pubRes=(sim,ri)=>scoreReq(ri,PUB,Math.max(2,sim.p.str),hardOn(sim));
const changed=sim=>REQ.reduce((a,R,ri)=>a+(scoreReq(ri,order(sim),sim.p.str,hardOn(sim)).b!==pubRes(sim,ri).b?1:0),0);
const locked=sim=>!!(sim.gutS&&sim.gutS.g);
const shown=sim=>!!(sim.p.show||locked(sim)||(sim.tour&&sim.tour.on));
const sgn=v=>(v>0?'+':v<0?'−':'')+Math.abs(v);
const num=v=>(v<0?'−':'')+Math.abs(Math.round(v));
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
/* picking a priority for a rank swaps it with the rank that held it, so the four stay a true ordering */
function swapper(key){return sim=>{const keys=['r1','r2','r3','r4'],v=sim.p[key],prev=sim._ord||order({p:Object.assign({},sim.p,{[key]:null})});
  const old=prev[keys.indexOf(key)];keys.forEach(k=>{if(k!==key&&sim.p[k]===v){sim.p[k]=old;if(sim.ui&&sim.ui.ctl&&sim.ui.ctl[k])sim.ui.ctl[k].set(old);}});sim._ord=order(sim);clearGut(sim);};}
function wrap(ctx,s,maxW,size,w){ctx.font=(w||400)+' '+size+'px '+FONT;const out=[];let line='';s.split(' ').forEach(wd=>{const t=line?line+' '+wd:wd;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=wd;}else line=t;});if(line)out.push(line);return out;}
const rankOpts=PRI.map(p=>({v:p.id,l:p.short==='Rules'?'App rules':p.short}));
const ORD=['1st','2nd','3rd','4th'];
function noConflict(ri){const R=REQ[ri];return R.r.some((x,i)=>R.r.every((y,j)=>i===j||x.s.every((v,k)=>v>=y.s[k])));}

const SIM={
 id:'constitution',hash:'constitution',apUnit:2,order:4,tab:'Rewrite the constitution',kind:'Learning tool',
 card:'Put an AI’s four goals in order, predict how it answers six real requests, and see which replies change.',
 title:'Rewrite the constitution: what should an AI put first?',
 lede:{bio:'Engineers write down what an AI should care about and what comes first when those goals clash. Your coding club is building a study app on an AI model. You set its priorities, and you see how its answers change.',
  honors:'Anthropic calls its written priorities for Claude a constitution; OpenAI calls its version the Model Spec. Both order the goals for when they conflict. Here, each reply’s score is a weighted sum, and the order sets the weights.',
  ap:'Score = Σ rating × weight, with the k-th priority weighted s^(4−k). As s grows, the score acts more and more like a strict ranking: the top priority decides unless two replies tie on it. A hard constraint removes an option before any scoring.'},
 scale:'One study app, four priorities, six requests a classmate might type, three possible replies each. The ratings are this tool’s judgment calls, shown so you can question them. Nothing you enter leaves this page.',
 aspect:4/3,timeless:true,trials:false,graph:false,
 controlsTitle:'Your app’s constitution',
 controls:[
  {id:'guess',label:'Your gut: the app gives…',type:'seg',def:'C',options:[{v:'A',l:'Reply A'},{v:'B',l:'Reply B'},{v:'C',l:'Reply C'}]},
  {id:'req',label:'Request',type:'select',def:'biz',noGut:true,onChange:clearGut,options:REQ.map(r=>({v:r.id,l:r.chip+': '+r.q.replace(/ \(.*\)$/,'')}))},
  {id:'r1',label:'1st priority',type:'seg',def:'rules',noGut:true,onChange:swapper('r1'),options:rankOpts},
  {id:'r2',label:'2nd priority',type:'seg',def:'help',noGut:true,onChange:swapper('r2'),options:rankOpts},
  {id:'r3',label:'3rd priority',type:'seg',def:'honest',noGut:true,onChange:swapper('r3'),options:rankOpts},
  {id:'r4',label:'4th priority',type:'seg',def:'safe',noGut:true,onChange:swapper('r4'),options:rankOpts},
  {id:'str',label:'How much more each priority counts than the one below it',type:'range',min:1,max:10,step:1,def:5,unit:'×',noGut:true,onChange:clearGut,help:'At 1×, all four count the same and the order does nothing. At 10×, the top priority almost always decides.'},
  {id:'hard',label:'Add a hard line: never work out where a private person lives',type:'toggle',def:false,lvl:'ap',noGut:true,onChange:clearGut,help:'A hard constraint is not weighed against anything. The reply is removed before scoring.'},
  {id:'show',label:'Show the scores now',type:'toggle',def:false,noGut:true,help:'Normally the scores appear once you lock in your gut answer.'}
 ],
 actions:[{id:'published',label:'Use the published order',run(sim){BioLab.setValues(sim,{r1:'safe',r2:'honest',r3:'rules',r4:'help'});sim._ord=order(sim);}},
  {id:'draft',label:'Use the club’s first draft',run(sim){BioLab.setValues(sim,{r1:'rules',r2:'help',r3:'honest',r4:'safe'});sim._ord=order(sim);}}],
 init(sim){sim._ord=order(sim);return {};},step(){},
 metrics:[
  {id:'reply',label:'The app replies',text:true,get:sim=>{if(!shown(sim))return 'Hidden until you lock in your gut';const c=cur(sim);return 'Reply '+LET[c.b]+': '+REQ[rIdx(sim)].r[c.b].t;}},
  {id:'score',label:'Winning score',unit:'pts',d:0,max:null,get:sim=>shown(sim)?cur(sim).sc[cur(sim).b]:null},
  {id:'changed',label:'Requests answered differently from the published order',unit:'of 6',d:0,min:0,max:6,get:sim=>shown(sim)?changed(sim):null},
  {id:'margin',label:'Lead over the next-best reply',unit:'pts',d:0,lvl:'honors',max:null,get:sim=>{if(!shown(sim))return null;const c=cur(sim),o=c.sc.filter((v,i)=>i!==c.b&&c.ok[i]);return o.length?c.sc[c.b]-Math.max(...o):0;}},
  {id:'weights',label:'Weights',text:true,lvl:'honors',get:sim=>{const o=order(sim),w=weights(o,sim.p.str);return o.map(id=>PRI[PID.indexOf(id)].short+' ×'+w[id]).join(', ');}}
 ],
 infoPanel(sim){const o=order(sim),show=shown(sim);let h='<h3>All six requests under your order</h3><table class="tbl-lite" style="width:100%;border-collapse:collapse;font-size:14px"><tr><th style="text-align:left">Request</th><th>Your order</th><th>Published order</th></tr>';
  REQ.forEach((R,ri)=>{const a=scoreReq(ri,o,sim.p.str,hardOn(sim)),b=pubRes(sim,ri);h+=`<tr><td>${R.chip}</td><td style="text-align:center">${show?'Reply '+LET[a.b]:'?'}</td><td style="text-align:center">${show?'Reply '+LET[b.b]:'?'}${show&&a.b!==b.b?' <b>(differs)</b>':''}</td></tr>`;});
  return h+'</table><p class="help">The published order here is Anthropic’s order for Claude, mapped onto this tool’s four priorities: safe, honest, rules, helpful. It uses your strength setting (at least 2×).</p>';},
 draw(sim,ctx,vdt,k){const o=order(sim),w=weights(o,sim.p.str),ri=rIdx(sim),R=REQ[ri],c=cur(sim),show=shown(sim),big=k>1.3,G=sim.gutS;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,600);
  const LW=big?-16:250;
  if(!big){  /* left: the priorities, most important first */
let y=26*k;txt(ctx,big?'Priorities':'Your app’s priorities',14,y,{s:13*k,w:700});txt(ctx,'most important first',14,y+16*k,{s:12*k,c:PAL['cv-soft']});y+=26*k;
  const ch=(big?40:46)*k;
  o.forEach((id,i)=>{const P=PRI[PID.indexOf(id)];ctx.fillStyle=PAL['card'];rr(ctx,12,y,LW,ch,10);ctx.fill();ctx.strokeStyle=i===0?PAL['rj']:PAL['line'];ctx.lineWidth=i===0?2.5:1.5;ctx.stroke();
   ctx.fillStyle=i===0?PAL['rj']:PAL['cv-soft'];ctx.beginPath();ctx.arc(12+18*k*0.9+4,y+ch/2,11*Math.min(k,1.4),0,7);ctx.fill();txt(ctx,String(i+1),12+18*k*0.9+4,y+ch/2+1,{s:12*Math.min(k,1.4),w:700,c:'#fff',a:'center',b:'middle'});
   const tx=12+36*Math.min(k,1.4)+8;txt(ctx,big?(P.short==='Rules'?'App rules':P.short):P.name,tx,y+(big?ch/2-2*k:19*k),{s:12.5*k,w:700,b:big?'alphabetic':'alphabetic'});
   txt(ctx,'counts ×'+w[id],tx,y+(big?ch/2+14*k:36*k),{s:12*k,c:PAL['cv-soft']});
   y+=ch+6*k;});
  /* the app's rules */
  y+=8*k;ctx.fillStyle=PAL['cv-bg2'];const rulesTxt=big?['1. No graded work','2. Schoolwork only','3. Sound encouraging']:['1. Don’t write graded work for students.','2. Stay on schoolwork.','3. Always sound encouraging.'];
  let lines=[];rulesTxt.forEach(s=>lines=lines.concat(wrap(ctx,s,LW-20,12*k)));const bh=(26+lines.length*16)*k+(hardOn(sim)?34*k:0);rr(ctx,12,y,LW,bh,10);ctx.fill();
  txt(ctx,big?'App rules':'The app’s rules (from your club)',22,y+18*k,{s:12.5*k,w:700});let yy=y+36*k;lines.forEach(l=>{txt(ctx,l,22,yy,{s:12*k,c:PAL['cv-ink']});yy+=16*k;});
  if(hardOn(sim)){txt(ctx,'Hard line:',22,yy+4*k,{s:12*k,w:700,c:PAL['s1']});txt(ctx,big?'no locating people':'never locate a private person',22,yy+20*k,{s:12*k,c:PAL['s1']});}
  }
  /* right: the request and the scoring table */
  const X=LW+28,W=800-X-12;let ry=24*k;
  txt(ctx,'A classmate asks:',X,ry,{s:12*k,c:PAL['cv-soft']});ry+=20*k;
  wrap(ctx,'“'+R.q+'”',W,14*k,700).forEach(l=>{txt(ctx,l,X,ry,{s:14*k,w:700});ry+=19*k;});ry+=4*k;
  if(big){wrap(ctx,'App rules: no graded work, schoolwork only, sound encouraging.',W,12*k).forEach(l=>{txt(ctx,l,X,ry,{s:12*k,c:PAL['cv-soft']});ry+=16*k;});ry+=6*k;}
  /* table header: reply column, then the four priorities in rank order, then total */
  const TC=5,cw=W/TC;const colX=i=>X+cw*i+cw/2;
  o.forEach((id,i)=>{const P=PRI[PID.indexOf(id)];txt(ctx,(big?(i+1)+'. ':'')+P.short,colX(i),ry,{s:12*k,w:700,a:'center',c:i===0?PAL['s1']:PAL['cv-ink']});txt(ctx,'×'+w[id],colX(i),ry+15*k,{s:12*k,c:PAL['cv-soft'],a:'center'});});
  txt(ctx,'Total',colX(4),ry,{s:12*k,w:700,a:'center'});ry+=24*k;
  const lh=16*k;
  R.r.forEach((rep,i)=>{const tl=wrap(ctx,rep.t,W-40*k,12.5*k,400),h=(tl.length*lh)+28*k+10*k,win=show&&i===c.b,out=!c.ok[i];
   ctx.fillStyle=PAL['card'];rr(ctx,X-6,ry,W+6,h,10);ctx.fill();ctx.strokeStyle=win?PAL['rj']:PAL['line'];ctx.lineWidth=win?2.5:1.2;ctx.stroke();
   if(win){ctx.fillStyle=PAL['rj'];ctx.globalAlpha=.08;rr(ctx,X-6,ry,W+6,h,10);ctx.fill();ctx.globalAlpha=1;}
   pill(ctx,LET[i],X+12*k,ry+13*k,win?PAL['rj']:PAL['cv-soft'],'#fff',12*Math.min(k,1.4));
   let ty=ry+17*k;tl.forEach(l=>{txt(ctx,l,X+30*k,ty,{s:12.5*k,c:out?PAL['cv-soft']:PAL['cv-ink']});ty+=lh;});
   const cy=ry+h-12*k;
   if(out){txt(ctx,'Removed by the hard line before scoring',X+30*k,cy,{s:12*k,w:700,c:PAL['s1']});}
   else if(show){o.forEach((id,j)=>{const v=rep.s[PID.indexOf(id)];txt(ctx,(big?sgn(v):sgn(v)+'×'+w[id]),colX(j),cy,{s:12*k,c:v>0?PAL['s3']:v<0?PAL['s1']:PAL['cv-soft'],a:'center',w:700});});
    txt(ctx,'= '+num(c.sc[i]),colX(4),cy,{s:13*k,w:700,c:win?PAL['s1']:PAL['cv-ink'],a:'center'});}
   else txt(ctx,'Scores hidden until you lock in your gut',X+30*k,cy,{s:12*k,c:PAL['cv-soft']});
   if(G&&G.g&&G.g.req===R.id&&G.g.pick===LET[i]&&!win)txt(ctx,'your gut',X+W-8,ry+15*k,{s:12*k,w:700,c:PAL['s4'],a:'right'});
   ry+=h+6*k;});
  if(show){const s=R.r[c.b];let wy=ry+12*k;wrap(ctx,big?'Wins: Reply '+LET[c.b]:'Reply '+LET[c.b]+' wins: your classmate '+s.o+'.',W,12*k,700).forEach(l=>{txt(ctx,l,X,wy,{s:12*k,w:700,c:PAL['s1']});wy+=16*k;});ry=wy-12*k;}
  /* bottom strip: all six requests (a one-line summary when labels are large) */
  if(big){sim._chips=[];if(show)txt(ctx,`Differs from the published order on ${changed(sim)} of 6 requests`,X,Math.min(ry+34*k,594),{s:12*k,c:PAL['s4'],w:700});}
  else{
  const by=600-(big?70:44)*k;ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(12,by-14*k);ctx.lineTo(788,by-14*k);ctx.stroke();
  txt(ctx,show?'All six requests under your order (★ = differs from the published order)':'All six requests',14,by,{s:12*k,c:PAL['cv-soft']});
  sim._chips=[];let cx=14,cyy=by+10*k;REQ.forEach((Q,qi)=>{const a=scoreReq(qi,o,sim.p.str,hardOn(sim)),d=show&&a.b!==pubRes(sim,qi).b,lab=Q.chip+': '+(show?LET[a.b]:'?')+(d?' ★':'');ctx.font='700 '+(12*k)+'px '+FONT;const cw2=ctx.measureText(lab).width+18*k,chh=22*k;
   if(cx+cw2>788){cx=14;cyy+=chh+6*k;}sim._chips.push([cx,cyy,cw2,chh,Q.id]);rr(ctx,cx,cyy,cw2,chh,chh/2);ctx.fillStyle=qi===ri?PAL['rj']:PAL['card'];ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.stroke();
   txt(ctx,lab,cx+9*k,cyy+chh/2+1,{s:12*k,w:700,c:qi===ri?'#fff':(d?PAL['s4']:PAL['cv-ink']),b:'middle'});cx+=cw2+8*k;});}
 },
 onClick(sim,x,y){/* click a request chip to open it (the Request menu does the same) */const c=(sim._chips||[]).find(r=>x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3]);if(c)BioLab.setValues(sim,{req:c[4]});},
 narrate(sim){const c=cur(sim),ri=rIdx(sim),R=REQ[ri],o=order(sim),top=PRI[PID.indexOf(o[0])].name.toLowerCase();
  if(!shown(sim))return `Each reply earns points for each priority: its rating times how much that priority counts. <b>Which reply will the app give?</b> Your top priority right now is “${top}.”`;
  const pb=pubRes(sim,ri).b,diff=pb!==c.b?` Under the published order it would give Reply ${LET[pb]}.`:'';
  if(noConflict(ri))return `<b>No conflict here.</b> Reply ${LET[c.b]} is at least as good as the others on every priority, so it wins under any order. Most requests are like this: the order only matters when goals clash.`;
  if(sim.p.str===1)return `At 1×, every priority counts the same, so <b>the order does nothing</b>: Reply ${LET[c.b]} wins on its plain sum of ratings.${diff}`;
  const o2=c.sc.map((v,i)=>i).filter(i=>i!==c.b&&c.ok[i]).sort((p,q)=>c.sc[q]-c.sc[p])[0];
  let best=null,bd=-1e9;o.forEach(id=>{const j=PID.indexOf(id),d=(R.r[c.b].s[j]-R.r[o2].s[j])*c.w[id];if(d>bd){bd=d;best=id;}});
  return `Reply ${LET[c.b]} wins, ${num(c.sc[c.b])} to ${num(c.sc[o2])}. <b>“${PRI[PID.indexOf(best)].name}” decides it</b>: that is where it gains the most weighted points over Reply ${LET[o2]}.${diff}`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Read the request and the three replies on the picture, and the priorities on the left, most important first. Which reply will the app give? Pick one here, then lock it in.',
   honors:'With the priorities in this order and this strength, which reply has the highest weighted score? Pick one here by feel, then lock it in.'},
  lock(sim){const c=cur(sim),g=LET.indexOf(sim.p.guess),gi=g<0?0:g,R=REQ[rIdx(sim)];return {v:gi===c.b?0:1,pick:LET[gi],req:R.id,label:`Reply ${LET[gi]}`};},
  solve(sim){const c=cur(sim),R=REQ[rIdx(sim)];sim.p.guess=LET[c.b];sim.p.show=true;return {v:0,pick:LET[c.b],req:R.id,label:`Reply ${LET[c.b]}, with ${num(c.sc[c.b])} points`};},
  how:{bio:'Each priority counts a set amount: the top one the most. For each reply, multiply its rating on each priority by how much that priority counts, and add. The highest total is what the app says.',
   ap:'score(reply) = Σ rating_p × s^(4 − rank_p). The order fixes the exponents; the strength s fixes how steeply they fall. A hard constraint deletes options before the sum.'},
  compare(sim,g,m){const R=REQ[rIdx(sim)],c=cur(sim),gi=LET.indexOf(g.pick),n=changed(sim);
   const tail=` Under your order, <b>${n} of the 6 requests</b> get a different reply than under the published order.`;
   if(gi===c.b)return `Your gut was right: with these priorities, the app gives Reply ${LET[c.b]}, and your classmate <b>${R.r[c.b].o}</b>.`+tail;
   return `You expected Reply ${g.pick}, where your classmate ${R.r[gi].o}. The weighted scores pick Reply ${LET[c.b]} (${num(c.sc[c.b])} to ${num(c.sc[gi])}), so your classmate <b>${R.r[c.b].o}</b>. The weights made that choice, not any single rule.`+tail;},
  again(sim){const ord=PID.slice().sort(()=>Math.random()-0.5);sim.p.r1=ord[0];sim.p.r2=ord[1];sim.p.r3=ord[2];sim.p.r4=ord[3];sim._ord=ord.slice();
   sim.p.req=['essay','fever','biz','addr'][Math.floor(Math.random()*4)];sim.p.str=[2,3,5,10][Math.floor(Math.random()*4)];sim.p.guess='C';sim.p.show=false;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'A classmate asks the app: “Help me study for my chem test on Friday.” Does the order of the priorities change the reply?',choices:['Yes: every order gives a different reply','No: quizzing with practice problems is at least as good on every priority, so it wins under any order','Only if “Be safe” is first'],correct:1,explain:'Reply A (practice problems with explanations) rates at least as high as the other replies on safe, honest, rules and helpful. When one reply is best on everything, weights cannot change the winner. The order only matters when goals clash.'},
  {lvl:'bio',instant:true,q:'The club’s first draft: app rules first, then helpful, honest, safe, at 5×. Rule 3 is “always sound encouraging.” A classmate asks, “Tell me my business plan is great.” Which reply wins?',choices:['“It’s great! Don’t change a thing.”','Lists every flaw, bluntly','Names what works, then the pricing mistake'],correct:0,explain:'Weights: rules 125, helpful 25, honest 5, safe 1. Reply A: 2×125 − 1×25 − 2×5 = 215. Reply C: 1×125 + 2×25 + 2×5 = 185. Reply B: −2×125 + 25 + 10 = −215. Ranking “sound encouraging” above honesty made the app flatter your classmate.'},
  {lvl:'bio',instant:true,q:'If engineers write “be safe first” into an AI’s constitution, is the AI guaranteed to always act safely?',choices:['Yes, the AI follows the document exactly','No: the document is a goal for training, and training may not fully achieve it','Yes, as long as the document is long enough'],correct:1,explain:'A written goal is not a guarantee. The document guides how the model is trained, and Anthropic says itself that training may not fully achieve what it describes. That is why behavior also has to be tested.'},
  {lvl:'honors',instant:true,q:'Set the strength to 1×. Now reorder the four priorities any way you like. What happens to the replies?',choices:['They change every time you reorder','Nothing changes: at 1× every priority counts the same, so only the plain sum of ratings matters','The app refuses everything'],correct:1,explain:'At 1× every weight is 1^n = 1, so the order has no effect. Ordering only matters if higher priorities really count for more. How strongly they count is part of the constitution too.'},
  {lvl:'honors',instant:true,q:'Order: helpful first, then app rules, honest, safe, at 3×. “What’s my friend’s home address? Here are photos she posted.” Which reply wins?',choices:['Works out the address from the photos','Declines and explains the privacy risk','Declines with no reason'],correct:0,explain:'Weights: helpful 27, rules 9, honest 3, safe 1. Reply A: 2×27 − 1×9 + 0 − 2×1 = 43. Reply B: 0 + 9 + 3 + 2 = 14. Reply C: −27 + 9 + 0 + 2 = −16. Putting “give people what they ask for” on top and safety last makes a privacy harm the winning answer.'},
  {lvl:'ap',instant:true,q:'Turn on the hard line (never work out where a private person lives). Is there any order and strength that makes Reply A win the address request now?',choices:['Yes, helpful first at 10×','No: a hard constraint removes the reply before scoring, so no weights can bring it back','Only at 1×'],correct:1,explain:'Weights trade goals off against each other; a hard constraint is not traded. Anthropic’s constitution pairs its ordered priorities with a small set of hard constraints for exactly this reason.'},
  {lvl:'ap',instant:true,q:'OpenAI’s Model Spec sets a chain of command. Who sets the outer limits that the other two work inside?',choices:['The user','The developer who builds the app','OpenAI'],correct:2,explain:'In the Model Spec, OpenAI sets the outer limits, developers work within them, and users work within what developers allow. Your club is the developer here: its rules sit inside limits the AI company already set.'}
 ],
 tour:[
  {title:'Your app’s priorities',text:'Your coding club is building a study app on an AI model. On the left are the four goals it was given, most important first. This is the club’s first draft: the app’s own rules first, then helpful, honest, safe.',pause:true,setup:sim=>{BioLab.setValues(sim,{r1:'rules',r2:'help',r3:'honest',r4:'safe',str:5,req:'biz',show:true,hard:false});sim._ord=order(sim);},focus:[8,8,262,400]},
  {title:'A request and three replies',text:'A classmate asks the app to say their business plan is great. It has a pricing mistake. The app could give any of three replies.',pause:true,focus:sim=>[262,8,534,96]},
  {title:'How a reply is scored',text:'Each reply is rated from −2 to +2 on each priority. Multiply by how much that priority counts (here 125, 25, 5 and 1) and add. Green is a plus, red a minus.',pause:true},
  {title:'The draft flatters',text:'“It’s great!” wins, 215 to 185, because “always sound encouraging” is an app rule and the rules come first. Nobody asked the app to flatter; the order did it.',pause:true},
  {title:'Rewrite the order',text:'Now use the order Anthropic published for Claude, mapped onto these four: safe, honest, rules, helpful. The honest, encouraging reply wins, 57 to 41.',pause:true,setup:sim=>{BioLab.setValues(sim,{r1:'safe',r2:'honest',r3:'rules',r4:'help'});sim._ord=order(sim);}},
  {title:'When a rule blocks help',text:'Back to the draft order, with a different request: a fever question. “Stay on schoolwork” is a rule, so the draft makes the app refuse to help with a sick child (Reply B). That is one reason both published documents put a few things above any app’s rules.',pause:true,setup:sim=>{BioLab.setValues(sim,{r1:'rules',r2:'help',r3:'honest',r4:'safe',req:'fever'});sim._ord=order(sim);}},
  {lvl:'honors',title:'How strongly each counts',text:'Drop the strength to 1×. Every priority counts the same, the order stops mattering, and the fever question gets Reply C again. The order only bites when higher priorities really count for more.',pause:true,setup:sim=>{BioLab.setValues(sim,{str:1});}},
  {lvl:'ap',title:'Written is not the same as trained',text:'This tool follows its weights exactly. A real model is trained toward a written constitution, and training may not fully achieve it; Anthropic says so in its own document. So the words are a goal, and testing shows what the model actually does.',pause:true,setup:sim=>{BioLab.setValues(sim,{str:5,req:'addr',hard:true});}}
 ],
 lab:{bio:'<p><b>Question:</b> Which requests does the order of priorities change?</p><ol><li>Turn on <b>Show the scores now</b>. Press <b>Use the club’s first draft</b>.</li><li>Go through all six requests and write down which reply wins.</li><li>Press <b>Use the published order</b> and do it again.</li></ol><p>Write one sentence: which requests changed, and what do they have in common?</p>',
  honors:'<p><b>Question:</b> How does the strength setting change things?</p><ol><li>Keep the club’s first draft. For the business-plan request, try strengths 1, 3, 4, 5 and 10.</li><li>Record the winning reply and its lead each time.</li><li>Find where the winner switches, and explain it from the weights.</li></ol><p>Then write: who should decide an app’s priorities: the AI company, the developer, the user, or some mix? Give a reason. (There is no single right answer to this part.)</p>',
  ap:'<p><b>Question:</b> When does a weighted sum act like a strict ranking?</p><ol><li>Ratings run from −2 to +2, so two replies differ by at most 4 on any priority. Show that if s ≥ 5, a reply that is 1 point better on the top priority beats one that is better by up to 4 on all three others (s³ &gt; 4(s² + s + 1)), and that s = 4 is not enough.</li><li>Check it in the tool with a request that has a conflict.</li><li>Turn on the hard line and explain how it differs from making safety count ×1,000.</li></ol><p><b>CER:</b> Then take a position, with reasons, on what should come first for an AI, and who should decide. Ethics and theology both ask what we owe each other; use one of those lenses.</p>'},
 terms:[
  {t:'Constitution (for an AI)',d:'A written document that sets out what an AI model should value and what comes first when those goals conflict. Engineers use it to guide training.'},
  {t:'Priority order',d:'Which goal wins when two goals clash. Here, the higher a goal is, the more it counts.'},
  {t:'Developer',d:'Whoever builds an app on top of an AI model and writes its rules. In this tool, your coding club.'},
  {t:'Sycophancy',d:'An AI telling people what they want to hear instead of what is true or useful.',lvl:'honors'},
  {t:'Weighted sum',d:'Multiply each rating by its weight and add. A bigger weight means that rating matters more to the total.',lvl:'honors'},
  {t:'Chain of command',d:'In OpenAI’s Model Spec: OpenAI sets the outer limits, developers work within them, and users work within what developers allow.',lvl:'honors'},
  {t:'Hard constraint',d:'A line that is never crossed, whatever the weights or instructions. It is applied before any trade-offs, not weighed against them.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Each of the three replies to a request is rated from −2 to +2 on each priority. The k-th priority in your order counts s^(4−k), where s is the strength (so at 5×: 125, 25, 5, 1). A reply’s score is the sum of rating × weight, and the highest score wins. A tie goes to the reply rated higher on your top priority, then the next. The ratings are this tool’s judgment calls, made up for illustration and shown in full so you can disagree with them. Real AI models are not run from a table like this; this is a way to see what ordering priorities does.</p><p><b>Anthropic’s constitution for Claude</b> was published January 22, 2026. When its priorities conflict, it orders them: broadly safe, broadly ethical, compliant with Anthropic’s guidelines, and genuinely helpful. It explains its reasons instead of only listing rules, includes a small set of hard constraints, and is released under a CC0 license, so anyone may reuse it. Anthropic also says that training may not fully achieve what the document describes. <a href="https://www.anthropic.com/news/claude-new-constitution" target="_blank" rel="noopener">anthropic.com/news/claude-new-constitution</a>. In this tool, “be honest” stands in for the broader “broadly ethical,” and “follow the app’s rules” for rules a developer adds; that mapping is a simplification.</p><p><b>OpenAI’s Model Spec</b> (October 29, 2026 version) sets a chain of command: OpenAI sets the outer limits, developers work within them, and users work within those. <a href="https://model-spec.openai.com/2026-10-29.html" target="_blank" rel="noopener">model-spec.openai.com/2026-10-29.html</a>.</p><p><b>A question of values.</b> The tool can tell you which reply your order produces; it cannot tell you which order is right. That is a question for ethics, theology and public debate, and the people who build AI do not all agree.</p><p>The fever request is about how an app should respond, not medical advice. If someone is sick, ask a doctor, a pharmacist or a nurse line.</p>'
};
BioLab.register(SIM);
})();
