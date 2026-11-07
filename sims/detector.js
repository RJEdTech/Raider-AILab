(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,atLeast}=BioLab.h;
/* A school of 1,700 students. Each essay is AI-written with chance a; the detector flags AI essays with chance d (detection rate)
   and human-written essays with chance f (false positive rate). Optional second group: non-native English writers with their own f. */
const NS=1700;
const nnOn=sim=>!!sim.p.nn;
const nnShare=sim=>nnOn(sim)?(atLeast('honors')?sim.p.nnShare:10)/100:0;
const nnF=sim=>(atLeast('honors')?sim.p.nnFpr:19)/100;
function groups(sim){const a=sim.p.ai/100,d=sim.p.det/100,k=sim.p.essays,s=nnShare(sim);
 const G=[{id:'nat',n:NS*(1-s),f:sim.p.fpr/100}];if(s>0)G.push({id:'nn',n:NS*s,f:nnF(sim)});
 return G.map(g=>{const E=g.n*k;return Object.assign(g,{E,TP:E*a*d,FN:E*a*(1-d),FP:E*(1-a)*g.f,TN:E*(1-a)*(1-g.f),stu:g.n*(1-Math.pow(1-(1-a)*g.f,k))});});}
function tot(sim){const G=groups(sim),T={E:0,TP:0,FN:0,FP:0,TN:0,stu:0};G.forEach(g=>{for(const x in T)T[x]+=g[x];});T.G=G;T.ppv=T.TP/(T.TP+T.FP);return T;}
const GS=sim=>(sim.tour&&sim.tour.on)?null:sim.gutS;
/* While the student counts the false flags ("Your turn"), the counts stay hidden. */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const shown=sim=>!pend(sim)&&!!(sim.p.reveal||(sim.st&&sim.st.peek>=3)||(GS(sim)&&GS(sim).g));
const peekLv=sim=>pend(sim)?0:shown(sim)?3:((sim.st&&sim.st.peek)||0);
const n0=v=>Math.round(v).toLocaleString('en-US'),f1=v=>(Math.round(v*10)/10).toFixed(1),pct=v=>(v*100).toFixed(1)+'%';
const cp=v=>(Math.round(v*10)/10).toString()+'%';
const oneIn=x=>{const r=NS/Math.max(x,1e-9);return r<5?Math.round(100*x/NS)+'% of students':'about 1 in '+n0(r);};
const dec=v=>(+v.toFixed(4)).toString();
const nf=v=>Math.abs(v-Math.round(v))<0.05?n0(v):(Math.round(v*10)/10).toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1});
/* "Your turn": human-written essays flagged = essays × (1 − AI share) × false positive rate, for each group */
const fpCount=sim=>tot(sim).FP;
const oneInFlags=T=>Math.round(1/Math.max(1e-9,1-T.ppv));
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}

const SIM={
 id:'detector',hash:'detector',apUnit:3,order:3,tab:'Detector check',kind:'Simulation',
 card:'An AI-writing detector checks every essay in a 1,700-student school. Guess how many honest students get flagged, then count them.',
 title:'The AI detector flagged an essay. Was it really AI?',
 skills:{bio:'Base rates and false positive rates: a percent of a percent of a count · Statistics',honors:'Two-way tables and the chance of at least one, 1 − (1 − p)ᵏ · Statistics',ap:'Conditional probability: Bayes’ rule and positive predictive value · AP Statistics (same algebra as Raider MathLab’s rapid test)'},
 lede:{bio:'A detector that is “99% accurate” sounds like it never makes mistakes. Run it on every essay in a big school and even a small error rate lands on real students who wrote their own work. Two numbers decide how many: the base rate (how many essays are really AI) and the false positive rate.',
  honors:'The chance a flagged essay is really AI depends on how common AI writing is, the detection rate and the false positive rate. For writers the detector misjudges more often, a flag means much less.',
  ap:'Positive predictive value: PPV = d·a / (d·a + f·(1 − a)), for AI share a, detection rate d and false positive rate f. The same algebra as a medical screening test.'},
 scale:'A school of about 1,700 students, every essay in one semester. Counts are expected values, rounded to whole essays or students. Detector settings are illustrative, not the specs of a real product.',
 aspect:16/9,timeless:true,trials:true,graph:false,
 controlsTitle:'The school and the detector',
 controls:[
  {id:'guess',label:'Your gut: honest students wrongly flagged in one semester',type:'range',min:0,max:400,step:1,def:10,unit:' students'},
  {id:'ai',label:'Share of essays really written by AI',type:'range',min:1,max:40,step:1,def:5,unit:'%',noGut:true,onChange:clearGut,help:'Nobody knows the true share at a given school. 5% is an assumption for illustration.'},
  {id:'fpr',label:'False positive rate: human-written essays the detector flags',type:'range',min:0.1,max:10,step:0.1,def:1,unit:'%',noGut:true,onChange:clearGut,help:'Turnitin reported a document-level rate under 1% for documents with at least 20% AI writing (June 2023).'},
  {id:'det',label:'Detection rate: AI-written essays the detector catches',type:'range',min:50,max:99,step:1,def:90,unit:'%',noGut:true,onChange:clearGut,help:'An assumption for illustration. Light editing or rewording can lower it.'},
  {id:'essays',label:'Essays each student turns in per semester',type:'range',min:1,max:10,step:1,def:4,unit:'',noGut:true,onChange:clearGut},
  {id:'nn',label:'Include non-native English writers, whom detectors flag more often',type:'toggle',def:false,noGut:true,onChange:clearGut,help:'In a Stanford study, seven detectors flagged 61% of non-native speakers’ essays as AI on average; all seven agreed on about 19%.'},
  {id:'nnShare',label:'Share of students who are non-native English writers',type:'range',min:1,max:40,step:1,def:10,unit:'%',lvl:'honors',noGut:true,onChange:clearGut,help:'An assumption for illustration, not RJ data.'},
  {id:'nnFpr',label:'False positive rate for non-native writers',type:'range',min:1,max:65,step:1,def:19,unit:'%',lvl:'honors',noGut:true,onChange:clearGut,help:'19% matches the essays all seven detectors flagged in the Stanford study; the average detector flagged 61%.'},
  {id:'reveal',label:'Show the counts now',type:'toggle',def:false,noGut:true,help:'Normally the counts appear once you lock in your gut answer.'}
 ],
 init(){return {peek:0};},step(){},
 metrics:[
  {id:'stu',label:'Honest students wrongly flagged at least once',unit:'students',d:0,min:0,max:600,get:sim=>shown(sim)?tot(sim).stu:null},
  {id:'fp',label:'Human-written essays flagged',unit:'essays',d:0,min:0,max:2000,get:sim=>shown(sim)?tot(sim).FP:null},
  {id:'tp',label:'AI-written essays caught',unit:'essays',d:0,min:0,max:3000,get:sim=>shown(sim)?tot(sim).TP:null},
  {id:'ppv',label:'Chance a flagged essay is really AI',unit:'%',d:1,min:0,max:100,get:sim=>shown(sim)?100*tot(sim).ppv:null},
  {id:'ppvNN',label:'Same chance, for a non-native writer’s essay',unit:'%',d:1,lvl:'honors',min:0,max:100,get:sim=>{if(!shown(sim)||!nnOn(sim))return null;const g=tot(sim).G[1];return 100*g.TP/(g.TP+g.FP);}},
  {id:'nnPart',label:'Wrongly flagged students who are non-native writers',unit:'%',d:1,lvl:'honors',min:0,max:100,get:sim=>{if(!shown(sim)||!nnOn(sim))return null;const T=tot(sim);return 100*T.G[1].stu/T.stu;}},
  {id:'off',label:'Your gut is off by',unit:'students',d:0,min:0,max:400,get:sim=>shown(sim)?Math.abs(sim.p.guess-tot(sim).stu):null},
  {id:'ppvf',label:'Positive predictive value',text:true,lvl:'ap',get:sim=>{const a=sim.p.ai/100,d=sim.p.det/100,f=sim.p.fpr/100,num=d*a,den=num+f*(1-a);return `PPV = (${d.toFixed(2)} × ${a.toFixed(2)}) / (${d.toFixed(2)} × ${a.toFixed(2)} + ${(+f.toFixed(4))} × ${(1-a).toFixed(2)}) = ${num.toFixed(4)} / ${den.toFixed(4)} = ${(num/den).toFixed(3)}`+(nnOn(sim)?` for native writers. For non-native writers (f = ${nnF(sim).toFixed(2)}): ${(num/(num+nnF(sim)*(1-a))).toFixed(3)}.`:'.');}}
 ],
 draw(sim,ctx,vdt,k){const T=tot(sim),lv=peekLv(sim),G=GS(sim),big=k>1.3,nn=nnOn(sim),q='?';
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  ctx.fillStyle=PAL['cv-bg2'];ctx.fillRect(408,0,392,450);
  const AI=PAL['s1'],HU=PAL['s2'],NN=PAL['s6'];
  /* confusion matrix */
  txt(ctx,big?n0(T.E)+' essays':'Every essay this semester: '+n0(T.E),20,28*k,{s:14*k,w:700});
  txt(ctx,big?NS.toLocaleString('en-US')+' students × '+sim.p.essays:NS.toLocaleString('en-US')+' students × '+sim.p.essays+' essays each',20,28*k+18*k,{s:12*k,c:PAL['cv-soft']});
  const cx=[20,big?150:180,big?275:300],cy=big?[148,196,244,286]:[110,165,225,282],cw=big?120:110;
  const cell=(i,j,s,col,b,sz)=>txt(ctx,s,i?cx[i]+cw/2:cx[0],cy[j],{s:(sz||(j===0||i===0?13:16))*k,w:b?700:400,c:col||PAL['cv-ink'],a:i?'center':'left'});
  cell(1,0,'Flagged',PAL['s4'],1);cell(2,0,big?'Not flagged':'Not flagged',null,1);
  cell(0,1,big?'Really AI':'Really AI-written',AI,1,big?12:13);cell(0,2,big?'Wrote it':'Student wrote it',HU,1,big?12:13);
  if(!big){txt(ctx,n0(T.E*sim.p.ai/100)+' essays',cx[0],cy[1]+18*k,{s:12*k,c:PAL['cv-soft']});txt(ctx,n0(T.E*(1-sim.p.ai/100))+' essays',cx[0],cy[2]+18*k,{s:12*k,c:PAL['cv-soft']});}
  cell(1,1,lv>=1?n0(T.TP):q,AI,1);cell(2,1,lv>=1?n0(T.FN):q);
  cell(1,2,lv>=2?n0(T.FP):q,HU,1);cell(2,2,lv>=2?n0(T.TN):q);
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;[cy[0]+16*k,cy[1]+30*k].forEach(y=>{ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(396,y);ctx.stroke();});
  ctx.strokeStyle=PAL['s4'];ctx.lineWidth=2.5;rr(ctx,cx[1]+6,cy[0]-24*k,cw-12,cy[2]-cy[0]+44*k,8);ctx.stroke();
  if(lv>=2&&nn){const g=T.G[1];txt(ctx,(big?'Non-native: '+n0(g.FP)+' false flags':'Non-native writers: '+n0(g.FP)+' of '+n0(T.FP)+' false flags'),20,cy[2]+44*k,{s:12*k,c:NN,w:700});}
  /* students line */
  const sy=cy[3]+(big?40:(nn&&lv>=2?44:34))*k;
  if(lv>=3){txt(ctx,big?'Students wrongly flagged:':'Honest students wrongly flagged at least once:',20,sy,{s:13*k,w:700});
   pill(ctx,n0(T.stu)+(big?' students':' students, '+oneIn(T.stu)),big?20+80*k:20+150*k,sy+26*k,PAL['rj'],'#fff',13*Math.min(k,1.4));}
  else txt(ctx,pend(sim)?(big?'Count the false flags first':'Work out the false flags to see the counts.'):(big?'Lock in your gut to see':'How many honest students? Lock in your gut to see.'),20,sy,{s:12*k,c:PAL['cv-soft']});
  if(lv>=3&&!big&&!nn&&sy+60*k<425)txt(ctx,`Really AI: ${n0(T.TP)} ÷ (${n0(T.TP)} + ${n0(T.FP)}) = ${pct(T.ppv)}`,20,sy+60*k,{s:12*k,w:700,c:PAL['cv-soft']});
  if(G&&G.g)txt(ctx,(big?'Gut: ':'Your gut: ')+Math.round(G.g.guess)+' students',20,436,{s:12*k,w:700,c:PAL['s4']});
  /* waffle of every flagged essay */
  const ft=T.TP+T.FP,U=[1,2,5,10,20,50].find(u=>ft/u<=300)||50,na=Math.round(T.TP/U),nh=Math.round((T.G[0].FP)/U),nnn=nn?Math.round(T.G[1].FP/U):0,n=na+nh+nnn;
  const cols=20,rows=Math.max(1,Math.ceil(n/cols)),sz=Math.min(17,Math.floor((big?170:290)/rows)),gx=424,gy=big?96:90;
  txt(ctx,(big?'Flagged: ':'Every flagged essay: ')+(lv>=1?n0(ft):q),gx,28*k,{s:14*k,w:700});
  txt(ctx,U===1?'Each square is 1 essay':`Each square is ${U} essays`,gx,28*k+18*k,{s:12*k,c:PAL['cv-soft']});
  if(lv>=1)for(let i=0;i<n;i++){const r=Math.floor(i/cols),c=i%cols,x=gx+c*(sz+1),y=gy+r*(sz+1);
   if(lv>=3){ctx.fillStyle=i<na?AI:i<na+nh?HU:NN;}else{ctx.fillStyle=PAL['s4'];ctx.globalAlpha=.7;}ctx.fillRect(x,y,sz,sz);ctx.globalAlpha=1;}
  const by=Math.min(gy+rows*(sz+1)+24*k,big?372:392);
  if(lv>=3){const items=[[AI,(big?'AI: ':'really AI: ')+n0(T.TP)],[HU,(big?'False: ':'wrote it, flagged anyway: ')+n0(T.G[0].FP)]];if(nn)items.push([NN,(big?'Non-native: ':'non-native writer, wrote it: ')+n0(T.G[1].FP)]);
   items.forEach(([c,l],i)=>{const yy=by+i*18*k;ctx.fillStyle=c;ctx.fillRect(gx,yy-11*k,12*k,12*k);txt(ctx,l,gx+18*k,yy,{s:12*k,w:700,c:PAL['cv-ink']});});
   pill(ctx,(big?'Really AI: ':'Flagged essays really AI: ')+pct(T.ppv),big?640:600,436-6*k,PAL['rj'],'#fff',13*Math.min(k,1.4));}
  else if(lv>=1)txt(ctx,big?'Which are really AI?':'Which flagged essays are really AI? Lock in to see.',gx,by,{s:12*k,c:PAL['cv-soft']});
  else txt(ctx,big?'Lock in to see':'Lock in your gut to see the flagged essays.',gx,gy+20*k,{s:12*k,c:PAL['cv-soft']});},
 narrate(sim){const T=tot(sim);
  if(!shown(sim))return `${sim.p.ai}% of ${n0(T.E)} essays are really AI-written. The detector catches ${sim.p.det}% of them and wrongly flags ${cp(sim.p.fpr)} of human-written ones${nnOn(sim)?', and more for non-native writers':''}. <b>How many honest students end up flagged?</b>`;
  let s=`${n0(T.stu)} students who wrote their own essay get flagged at least once this semester, ${oneIn(T.stu)}. `;
  if(nnOn(sim)){const g=T.G[1];s+=`Non-native writers are ${Math.round(nnShare(sim)*100)}% of students but ${Math.round(100*g.stu/T.stu)}% of the wrongly flagged, and a flag on their essay is really AI only ${pct(g.TP/(g.TP+g.FP))} of the time. `;}
  s+=T.ppv<0.5?`<b>Most flags are false alarms here:</b> only ${pct(T.ppv)} of flagged essays are really AI.`:`<b>${pct(1-T.ppv)} of flagged essays were written by the student</b>, about 1 flag in ${oneInFlags(T)}.`;return s;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'The detector wrongly flags only a small share of human-written essays (1% to start). Across 1,700 students turning in several essays each, how many honest students do you think get flagged at least once this semester? Drag the slider here, then lock it in.',
   honors:'Before you build the table: drag the slider here to your gut number of honest students wrongly flagged this semester, then lock it in.'},
  lock(sim){return {v:Math.abs(sim.p.guess-tot(sim).stu),guess:sim.p.guess,label:`${Math.round(sim.p.guess)} students`};},
  solve(sim){const s=tot(sim).stu;sim.p.guess=s;return {v:0,guess:s,label:`about ${n0(s)} students`};},
  hint:{bio:'Lock in your gut answer. Then you will count the false flags yourself from the base rate and the false positive rate.'},
  calc:{unit:'essays',d:1,tol:a=>Math.max(1,0.02*a),
   prompt:{bio:sim=>{const k=sim.p.essays,a=sim.p.ai;if(!nnOn(sim))return `${NS.toLocaleString('en-US')} students each turn in ${k} essay${k===1?'':'s'}. <b>${a}%</b> of essays are really AI-written, so the rest the students wrote themselves. The detector wrongly flags <b>${cp(sim.p.fpr)}</b> of human-written essays. How many human-written essays get flagged?`;
     const s=nnShare(sim);return `${NS.toLocaleString('en-US')} students each turn in ${k} essays; ${Math.round(s*100)}% of the students (${n0(NS*s)}) are non-native English writers. <b>${a}%</b> of every group’s essays are AI-written. The detector wrongly flags <b>${cp(sim.p.fpr)}</b> of other students’ human-written essays and <b>${cp(nnF(sim)*100)}</b> of non-native writers’. How many human-written essays get flagged in all?`;},
    ap:sim=>`N = ${NS.toLocaleString('en-US')} students × k = ${sim.p.essays} essays, AI share a = ${dec(sim.p.ai/100)}, false positive rate f = ${dec(sim.p.fpr/100)}${nnOn(sim)?` (f = ${dec(nnF(sim))} for the ${Math.round(nnShare(sim)*100)}% who are non-native writers)`:''}. Expected false flags = N·k·(1 − a)·f${nnOn(sim)?', summed over both groups':''}. What is it?`},
   answer:fpCount,
   hint:'First find all the essays. Then the ones the students wrote (100% minus the AI share). Then take the false positive rate of those.',
   steps(sim){const T=tot(sim),a=sim.p.ai/100,out=[`All essays: ${NS.toLocaleString('en-US')} × ${sim.p.essays} = ${n0(T.E)}.`];
    T.G.forEach(g=>{const who=g.id==='nn'?'Non-native writers’ essays':T.G.length>1?'Other students’ essays':'Essays';const E=g.E;
     out.push(`${who}: ${n0(E)}. Written by the students: ${n0(E)} × ${dec(1-a)} = ${nf(E*(1-a))}. Wrongly flagged: ${nf(E*(1-a))} × ${dec(g.f)} = ${nf(g.FP)}.`);});
    if(T.G.length>1)out.push(`In all: ${T.G.map(g=>nf(g.FP)).join(' + ')} = <b>${nf(T.FP)}</b> human-written essays flagged.`);
    else out[out.length-1]=out[out.length-1].replace(/= ([^ ]+)\.$/,'= <b>$1</b> human-written essays flagged.');
    out.push(`Rounded, about ${n0(T.FP)} essays the students wrote themselves.`);return out;}},
  formula(sim){const T=tot(sim),a=sim.p.ai/100,d=sim.p.det/100;
   const fl=T.G.length>1?T.G.map(g=>`${n0(g.E)} × ${dec(1-a)} × ${dec(g.f)}`).join(' + '):`${n0(T.E)} × ${dec(1-a)} × ${dec(sim.p.fpr/100)}`;
   let h=`False flags = ${fl} = ${nf(T.FP)}<br>Real catches = ${n0(T.E)} × ${dec(a)} × ${dec(d)} = ${nf(T.TP)}<br>Really AI = ${nf(T.TP)} ÷ (${nf(T.TP)} + ${nf(T.FP)}) = ${pct(T.ppv)}`;
   if(atLeast('honors')&&!nnOn(sim)){const p=(1-a)*sim.p.fpr/100;h+=`<br>Students flagged at least once = ${NS.toLocaleString('en-US')} × [1 − (1 − ${dec(p)})^${sim.p.essays}] = ${n0(T.stu)}`;}
   return h;},
  how:{bio:'Count essays, not percents. Find how many essays the students wrote themselves, then take the false positive rate of that. For students: the chance one student gets at least one false flag is 1 minus the chance every one of their essays is cleared.',
   honors:'Build a two-way table of essays: really AI or not, flagged or not. Wrongly flagged students = students × [1 − (1 − (1 − a)·f)^k] for k essays each.',
   ap:'P(at least one false flag) = 1 − (1 − (1 − a)f)^k, assuming each essay is judged independently. PPV = d·a / (d·a + f·(1 − a)).'},
  compare(sim,g,m){const T=tot(sim),off=Math.abs(g.guess-m.guess);
   let s=off<Math.max(3,0.1*m.guess)?`Your gut was right on, within ${n0(off)} students. `:`Your gut said ${n0(g.guess)}; the count is <b>about ${n0(m.guess)}</b>. `;
   s+=`That is about ${n0(m.guess)} students (${oneIn(m.guess)}) flagged for an essay they really wrote. `;
   if(nnOn(sim))s+=`${n0(T.G[1].stu)} of them are non-native English writers. `;
   s+=`And ${pct(1-T.ppv)} of all flagged essays were written by the student: about 1 flag in ${oneInFlags(T)}. What should happen after a flag? Use that number.`;
   const K=sim.ui.calc;if(K&&K.done&&K.correct)s+=' You counted the false flags yourself, the first step of the whole table.';return s;},
  again(sim){const R=a=>a[Math.floor(Math.random()*a.length)];sim.p.ai=R([2,5,10,20]);sim.p.fpr=R([0.5,1,2,4]);sim.p.det=R([70,80,90,95]);sim.p.essays=R([2,4,6,8]);sim.p.guess=10;sim.p.reveal=false;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'Another school: 1,200 students turn in 5 essays each. 10% of essays are really AI-written. The detector wrongly flags 2% of human-written essays. How many human-written essays get flagged this semester?',answer:108,tol:1,unit:'essays',d:0,hint:'All essays, then the 90% the students wrote, then 2% of those.',explain:'1,200 × 5 = 6,000 essays. 90% of them, 5,400, are human-written. 2% of 5,400 = 108 false flags in one semester.'},
  {lvl:'bio',instant:true,q:'Now only 1% of essays are really AI-written. The detector still catches 90% of AI essays and wrongly flags 1% of human ones. When an essay is flagged, how often is it really AI?',choices:['About 99% of the time','About 90% of the time','About 48% of the time'],correct:2,explain:'Of 6,800 essays, 68 are AI and 61 of them get caught. Of 6,732 human essays, 1% (67) get flagged. 61 of 129 flags is about 48%. When AI writing is rare, false flags can outnumber real ones.'},
  {lvl:'bio',instant:true,q:'For non-native English writers, the detector wrongly flags 19% of human-written essays. If 5% of their essays are AI and it catches 90%, how often is a flag on one of their essays really AI?',choices:['About 90%','About 50%','About 20%'],correct:2,explain:'Per 100 essays: 5 are AI and 4.5 get caught; 95 are human and 18.05 get flagged. 4.5 ÷ (4.5 + 18.05) ≈ 20%. Four out of five flags on their essays are false.'},
  {lvl:'honors',kind:'num',q:'One student writes all 4 of their essays themselves. Each essay has a 1% chance of a false flag, judged independently. What is the chance, in percent, that at least one of the 4 gets flagged?',answer:3.94,tol:0.05,unit:'%',d:2,hint:'Find the chance none is flagged, 0.99 × 0.99 × 0.99 × 0.99, then subtract from 1.',explain:'P(no flag) = 0.99⁴ ≈ 0.9606, so P(at least one) ≈ 0.0394, about 3.9%. That is nearly 4 times the per-essay rate, and it grows with every essay turned in.'},
  {lvl:'honors',instant:true,q:'Turnitin reported a sentence-level false positive rate of about 4%. A student writes a 25-sentence essay entirely on their own. If each sentence were judged independently, what is the chance at least one sentence gets highlighted as AI?',choices:['About 4%','About 25%','About 64%','100%'],correct:2,explain:'P(no sentence flagged) = 0.96²⁵ ≈ 0.36, so P(at least one) ≈ 64%. Real sentences are not independent, but the lesson holds: small per-sentence rates add up across a whole essay.'},
  {lvl:'ap',instant:true,q:'AI share 10%, detection rate 90%, false positive rate 2%. What is the positive predictive value?',choices:['90%','About 83%','98%','About 50%'],correct:1,explain:'PPV = (0.90 × 0.10) / (0.90 × 0.10 + 0.02 × 0.90) = 0.090 / 0.108 ≈ 0.833.'},
  {lvl:'ap',instant:true,q:'This model treats each essay as judged independently. In reality, a writer’s style is similar from essay to essay. How does that change the picture?',choices:['It makes no difference','Fewer different students are flagged, but some are flagged again and again','Every student gets flagged at least once'],correct:1,explain:'If one student’s style triggers the detector, it will tend to do so on each essay. Repeat flags on the same writer then say more about their style than about AI use, so a second flag is weaker evidence than it looks.'}
 ],
 tour:[
  {title:'Every essay in a school',text:'1,700 students each turn in 4 essays this semester: 6,800 essays. Say 5% are really AI-written: 340 essays. The other 6,460 the students wrote themselves.',focus:[0,0,408,300],pause:true,setup:sim=>{sim.st.peek=0;BioLab.setValues(sim,{ai:5,fpr:1,det:90,essays:4,nn:false,reveal:false});}},
  {title:'Catching AI',text:'The detector catches 90% of AI-written essays: 306 flagged, 34 missed.',focus:[0,60,408,140],pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'False flags',text:'It also flags 1% of the 6,460 human-written essays. That sounds tiny, but it is about 65 essays the students really wrote.',focus:[0,120,408,140],pause:true,setup:sim=>{sim.st.peek=2;}},
  {title:'Every flagged essay',text:'306 real catches plus 65 false flags: 371 flags. 82.6% are really AI, so about 1 flag in 6 lands on a student who did their own work.',focus:[408,0,392,450],pause:true,setup:sim=>{sim.st.peek=3;}},
  {title:'Students, not essays',text:'Each student turns in 4 essays, so the chances add up: about 64 students, roughly 1 in 27, get flagged at least once for work they wrote. That is about one student per class of 27.',pause:true,setup:sim=>{sim.st.peek=3;}},
  {title:'Non-native English writers',text:'Now say 10% of students are non-native English writers, and the detector wrongly flags 19% of their essays. They are 10% of students but about 62% of the wrongly flagged. A flag on one of their essays is really AI only about 20% of the time.',pause:true,setup:sim=>{sim.st.peek=3;BioLab.setValues(sim,{nn:true});}},
  {lvl:'honors',title:'Why simpler writing gets flagged',text:'Detectors key on low perplexity: wording a language model finds predictable. Simpler, more common word choices look machine-like, so writers still building their English vocabulary get flagged more.',pause:true,setup:sim=>{sim.st.peek=3;}},
  {lvl:'ap',title:'Positive predictive value',text:'PPV = d·a / (d·a + f·(1 − a)) = 0.90 × 0.05 / (0.90 × 0.05 + 0.01 × 0.95) = 0.045 / 0.0545 ≈ 82.6% for native writers. With f = 0.19 it falls to 0.045 / 0.2255 ≈ 20%.',pause:true,setup:sim=>{sim.st.peek=3;}}
 ],
 onTourExit(sim){sim.st.peek=0;},
 lab:{bio:'<p><b>Question:</b> How does a “small” false positive rate play out in a whole school?</p><ol><li>Turn on <b>Show the counts now</b>.</li><li>Record a trial at false positive rates of 0.5%, 1%, 2% and 4%.</li><li>For each, write down the honest students wrongly flagged and the chance a flagged essay is really AI.</li></ol><p>Write one sentence: what should happen when an essay is flagged? Use one number from your table.</p>',
  honors:'<p><b>Question:</b> Who carries the false flags?</p><ol><li>Show the counts and include non-native English writers.</li><li>Record the share of wrongly flagged students who are non-native writers at non-native false positive rates of 5%, 19%, 40% and 61%.</li><li>Record the chance a flagged essay is really AI for each group.</li></ol><p>Is a detector that is near-perfect for one group fair to another? Compare the two chances that a flag is really AI.</p>',
  ap:'<p><b>Question:</b> How does the share of AI writing change what a flag means?</p><ol><li>Hold d = 90% and f = 1%. Record PPV at AI shares of 1%, 2%, 5%, 10%, 20% and 40%.</li><li>Check two of them with the PPV formula.</li></ol><p><b>CER:</b> Claim when a detector flag is strong evidence, with evidence from your table and reasoning from Bayes’ rule. Compare with the rapid test tool in Raider MathLab.</p><p>Optional: Catholic social teaching speaks of the dignity of each person. How should a school weigh the honest students wrongly flagged against the AI essays the detector catches? Argue from your numbers, either way.</p>'},
 terms:[
  {t:'False positive',d:'A flag on an essay the student really wrote.'},
  {t:'Detection rate',d:'The share of AI-written essays the detector catches. Also called sensitivity or the true positive rate.'},
  {t:'Base rate',d:'How common something is before any test. Here, the share of essays really written by AI.'},
  {t:'Confusion matrix',d:'A two-way table of counts: really AI or not, flagged or not.',lvl:'honors'},
  {t:'Perplexity',d:'How surprising each next word is to a language model. Low perplexity means predictable wording, which detectors treat as a sign of AI.',lvl:'honors'},
  {t:'Positive predictive value (PPV)',d:'The chance a flagged essay really is AI-written: true flags ÷ all flags.',lvl:'honors'},
  {t:'Independence',d:'Two results are independent when one tells you nothing about the other. Essays by the same writer are probably not independent.',lvl:'ap'}
 ],
 about:'<p><b>The research.</b> Liang, Zou and colleagues at Stanford (2023) tested seven AI-writing detectors. They were near-perfect on US 8th-graders’ essays but classified 61.22% of non-native English speakers’ TOEFL essays as AI-generated, and all seven flagged about 19% of them. The detectors key on low perplexity, so simpler wording looks machine-like. Source: <a href="https://hai.stanford.edu/news/ai-detectors-biased-against-non-native-english-writers" target="_blank" rel="noopener">Stanford HAI</a>. Turnitin reported (June 2023) a document-level false positive rate under 1% for documents with at least 20% AI writing, and about 4% at the sentence level.</p><p><b>The model.</b> Each essay is AI-written with chance a, and is judged on its own. The detector flags AI essays with chance d and human-written essays with chance f (a separate f for non-native writers when that group is on). Wrongly flagged students = students × [1 − (1 − (1 − a)·f)^k] for k essays each. Counts are expected values. The AI share, detection rate, group size and essays per student are assumptions for illustration, not data from RJ or from any detector company. In reality a writer’s style repeats from essay to essay, so false flags tend to land on the same students again and again.</p><p><b>What a flag means.</b> At the defaults, 82.6% of flagged essays are really AI, so about 1 flag in 6 lands on a student who wrote the essay. What should happen after a flag is a question for each school’s policy. Drafts and notes show how a piece of writing came together.</p><p><b>Why simpler writing gets flagged.</b> Perplexity measures how surprising each next word is to a language model. Writers with a smaller English vocabulary often choose common, predictable words, which scores as low perplexity, the same signal detectors use for AI text.</p><p>Same math, different setting: <a href="https://rjedtech.github.io/Raider-MathLab/#rapidtest" target="_blank" rel="noopener">Is the positive real?</a> in Raider MathLab works through a positive home test with the same table.</p>'
};
BioLab.register(SIM);
})();
