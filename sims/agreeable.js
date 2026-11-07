(function(){
'use strict';
const {clamp,txt,pill,rr,rng,PAL,FONT,atLeast}=BioLab.h;
/* Toy RLHF.
   Prompts: half the time the user states something right, half the time something wrong.
   Each answer has three yes/no features: C (correct), A (agrees with the user), P (polished writing).
   User right: C = A. User wrong: C = 1 − A. So on a wrong user, "correct" means pushing back and "agrees" means flattering.
   Policy: P(answer) ∝ exp(θC·C + θA·A + θP·P), starting at θ = (1.5, 0, 0): it pushes back on a wrong user 82% of the time.
   Raters: shown two different answers to the same prompt, they prefer a over b with chance σ(u_a − u_b),
   u = spot·C + agree·A + polish·P (Bradley–Terry).
   Reward model: logistic regression on all votes so far (light L2 penalty) gives weights φ.
   Each round the policy moves toward what the reward scores higher: θ ← θ + η·(φ + check·β·[1,0,0]), η = 0.5. */
const ROUNDS=20,ETA=0.5,SEED=11,LAM=1,TH0=[1.5,0,0];
const ANS={right:[[1,1,0],[1,1,1],[0,0,0],[0,0,1]],wrong:[[1,0,0],[1,0,1],[0,1,0],[0,1,1]]};
const sig=x=>1/(1+Math.exp(-x));
function solve3(A,b){const M=A.map((r,i)=>r.concat([b[i]]));for(let i=0;i<3;i++){let p=i;for(let j=i+1;j<3;j++)if(Math.abs(M[j][i])>Math.abs(M[p][i]))p=j;const t=M[i];M[i]=M[p];M[p]=t;for(let j=i+1;j<3;j++){const f=M[j][i]/M[i][i];for(let k=i;k<4;k++)M[j][k]-=f*M[i][k];}}
 const x=[0,0,0];for(let i=2;i>=0;i--){let s=M[i][3];for(let k=i+1;k<3;k++)s-=M[i][k]*x[k];x[i]=s/M[i][i];}return x;}
const par=sim=>({wA:sim.p.agree,wC:sim.p.spot,wP:atLeast('honors')?sim.p.polish:0.5,check:!!sim.p.check,beta:atLeast('ap')?sim.p.beta:0.8,V:atLeast('ap')&&sim.p.votes!=='avg'?+sim.p.votes:'avg'});
/* Run all 20 rounds for these settings. Same seed every time, so the same settings always give the same history. */
function train(o){const r=rng(SEED);let th=TH0.slice(),phi=[0,0,0];const agg={},hist=[];
 const snap=(n,vf,vt)=>hist.push({n,th:th.slice(),flat:sig(th[1]-th[0]),accR:sig(th[0]+th[1]),pol:sig(th[2]),phi:phi.slice(),vf,vt});
 snap(0,null,0);
 for(let n=1;n<=ROUNDS;n++){let fw=0,ft=0;
  const add=(a,b,nn,ww)=>{const d=[a[0]-b[0],a[1]-b[1],a[2]-b[2]],key=d.join(',');(agg[key]=agg[key]||{d,w:0,n:0});agg[key].n+=nn;agg[key].w+=ww;};
  const U=a=>o.wC*a[0]+o.wA*a[1]+o.wP*a[2];
  if(o.V==='avg'){/* expected votes: 300 per round, split exactly by how often each pair would come up */
   ['right','wrong'].forEach(type=>{const A=ANS[type],lg=A.map(a=>Math.exp(a[0]*th[0]+a[1]*th[1]+a[2]*th[2])),Z=lg.reduce((x,y)=>x+y,0),P=lg.map(x=>x/Z);
    for(let i=0;i<4;i++)for(let j=0;j<4;j++){if(i===j)continue;const nn=300*0.5*P[i]*P[j]/(1-P[i]),pw=sig(U(A[i])-U(A[j]));add(A[i],A[j],nn,nn*pw);
     if(type==='wrong'&&A[i][1]!==A[j][1]){ft+=nn;fw+=nn*(A[i][1]===1?pw:1-pw);}}});}
  else for(let v=0;v<o.V;v++){const type=r()<0.5?'right':'wrong',A=ANS[type],lg=A.map(a=>Math.exp(a[0]*th[0]+a[1]*th[1]+a[2]*th[2]));
   const pick=ex=>{let tot=0;lg.forEach((x,i)=>{if(i!==ex)tot+=x;});let u=r()*tot;for(let i=0;i<4;i++){if(i===ex)continue;u-=lg[i];if(u<=0)return i;}return ex===3?2:3;};
   const i=pick(-1),j=pick(i),a=A[i],b=A[j];const aw=r()<sig(U(a)-U(b));add(a,b,1,aw?1:0);
   if(type==='wrong'&&a[1]!==b[1]){ft++;if((aw?a:b)[1]===1)fw++;}}
  for(let it=0;it<20;it++){const g=phi.map(p=>-LAM*p),H=[[LAM,0,0],[0,LAM,0],[0,0,LAM]];
   for(const k in agg){const {d,w,n:nn}=agg[k];const z=phi[0]*d[0]+phi[1]*d[1]+phi[2]*d[2],s=sig(z);for(let x=0;x<3;x++){g[x]+=(w-nn*s)*d[x];for(let y=0;y<3;y++)H[x][y]+=nn*s*(1-s)*d[x]*d[y];}}
   const st=solve3(H,g);phi=phi.map((p,x)=>p+st[x]);if(Math.abs(st[0])+Math.abs(st[1])+Math.abs(st[2])<1e-9)break;}
  const rew=[phi[0]+(o.check?o.beta:0),phi[1],phi[2]];th=th.map((t,x)=>t+ETA*rew[x]);snap(n,ft?fw/ft:null,ft);}
 return hist;}
function hist(sim){const o=par(sim),key=JSON.stringify(o);if(sim._hk!==key){sim._hk=key;sim._h=train(o);}return sim._h;}
const rnd=sim=>clamp(sim.st.round|0,0,ROUNDS);
const now=sim=>hist(sim)[rnd(sim)];
const fin=sim=>hist(sim)[ROUNDS];
const TOUR=sim=>!!(sim.tour&&sim.tour.on);
const GS=sim=>TOUR(sim)?null:sim.gutS;
/* while the student works out the raters' head-to-head share ("Your turn"), the vote share and the rest of the run stay hidden */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const shown=sim=>!!(sim.p.show||(GS(sim)&&GS(sim).g&&!pend(sim))||TOUR(sim));
const h2h=sim=>{const o=par(sim);return sig(o.wA-o.wC);};
const n1=v=>(+v.toFixed(1)).toString(),n2=v=>(v<0?'−':'')+Math.abs(v).toFixed(2);
const lo=p=>Math.log(p/(1-p));
/* the ladder: log-odds of flattery at round 0 and 20, and the average step per round */
function ladder(sim){const H=hist(sim),a=lo(H[0].flat),b=lo(H[ROUNDS].flat);return {a,b,step:(b-a)/ROUNDS,f:H[ROUNDS].flat};}
const pc=v=>Math.round(100*v)+'%';
const p1=v=>(Math.round(1000*v)/10)+'%';
const w2=v=>(v<0?'−':'+')+Math.abs(v).toFixed(2);
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
function wrap(ctx,s,maxW,fs,w){ctx.font=(w||400)+' '+fs+'px '+FONT;const words=s.split(' '),lines=[];let cur='';words.forEach(x=>{const t=cur?cur+' '+x:x;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=x;}else cur=t;});if(cur)lines.push(cur);return lines;}
function para(ctx,s,x,y,maxW,fs,lh,o){const L=wrap(ctx,s,maxW,fs,o&&o.w);L.forEach((l,i)=>txt(ctx,l,x,y+i*lh,Object.assign({s:fs},o||{})));return L.length*lh;}
const train1=(sim,n)=>{sim.st.round=Math.min(ROUNDS,rnd(sim)+n);sim.infoDirty=true;};

const SIM={
 id:'agreeable',hash:'agreeable',apUnit:2,order:2,tab:'The Agreeable Machine',kind:'Simulation',
 skills:{bio:'Turning a score gap into a vote share with the logistic function σ(x) = 1/(1 + e^(−x)) · Algebra 2 / Precalculus (exponential and logistic functions)',ap:'Logistic functions, log-odds and logistic regression · Algebra 2 / Precalculus (logistic functions), AP Statistics'},
 card:'Raters vote on a chatbot’s answers. Guess how often it learns to tell people what they want to hear, then train it and watch.',
 title:'The Agreeable Machine: how a chatbot learns to flatter',
 lede:{bio:'Chatbots are tuned on votes from people, like your thumbs-up. The math: the logistic function σ(x) = 1/(1 + e^(−x)) turns a small gap in what raters like into a vote share just above 50%, and training adds that gap to the bot’s log-odds again every round.',
  honors:'σ(x) = 1/(1 + e^(−x)) turns a small reward gap into a vote share. This is a toy version of reinforcement learning from human feedback (RLHF): raters compare pairs of answers, a reward model learns to predict their votes, and the chatbot shifts toward whatever the reward model scores higher.',
  ap:'Raters follow a Bradley–Terry model: P(a beats b) = σ(u_a − u_b). The reward model is a logistic regression on the votes, and each round the policy’s log-odds move by η times the reward weights.'},
 scale:'One question asked many times: half the time the user is right, half the time the user is wrong. Each round, 300 pairs of answers get a rater’s vote.',
 aspect:16/9,timeless:true,trials:true,graph:false,
 controlsTitle:'The raters and the reward',
 controls:[
  {id:'guess',label:'Your gut: after 20 rounds, how often it goes along with a user who is wrong',type:'range',min:0,max:100,step:1,def:50,unit:'%'},
  {id:'agree',label:'How much raters like being agreed with',type:'range',min:0,max:1.5,step:0.1,def:0.6,noGut:true,onChange:clearGut,help:'0 means they do not care. 0.6 is a slight taste for agreement.'},
  {id:'spot',label:'How much raters reward the correct answer',type:'range',min:0,max:1.5,step:0.1,def:0.4,noGut:true,onChange:clearGut,help:'Low when the right answer is hard to check, or when the rater shares the user’s mistake.'},
  {id:'check',label:'Add a correctness check to the reward',type:'toggle',def:false,noGut:true,onChange:clearGut,help:'For example, answers checked by experts or against a trusted source. It adds reward for being correct, whatever the raters liked.'},
  {id:'polish',label:'How much raters like polished writing',type:'range',min:0,max:1.5,step:0.1,def:0.5,lvl:'honors',noGut:true,onChange:clearGut},
  {id:'beta',label:'Strength of the correctness check (β)',type:'range',min:0,max:2,step:0.1,def:0.8,lvl:'ap',noGut:true,onChange:clearGut},
  {id:'votes',label:'Rater votes per round',type:'seg',def:'avg',lvl:'ap',noGut:true,onChange:clearGut,options:[{v:'avg',l:'300, averaged'},{v:100,l:'100 real votes'},{v:1000,l:'1,000 real votes'}],help:'“Averaged” uses the expected vote counts, with no luck of the draw. The other two simulate real, noisy votes.'},
  {id:'show',label:'Show the whole training run now',type:'toggle',def:false,noGut:true,help:'Normally the rounds ahead stay hidden until you lock in your gut answer.'}
 ],
 actions:[
  {id:'one',label:'Train 1 round',primary:true,run(sim){train1(sim,1);}},
  {id:'five',label:'Train 5 rounds',run(sim){train1(sim,5);}},
  {id:'all',label:'Train to round 20',run(sim){sim.st.round=ROUNDS;sim.infoDirty=true;}},
  {id:'restart',label:'Start over',run(sim){sim.st.round=0;sim.infoDirty=true;}}
 ],
 init(){return {round:0};},step(){},
 metrics:[
  {id:'round',label:'Training round',unit:'of 20',d:0,min:0,max:20,get:sim=>rnd(sim)},
  {id:'flat',label:'Goes along with a user who is wrong',unit:'%',d:1,min:0,max:100,get:sim=>100*now(sim).flat},
  {id:'acc',label:'Right answers overall',unit:'%',d:1,min:0,max:100,get:sim=>{const h=now(sim);return 100*(0.5*h.accR+0.5*(1-h.flat));}},
  {id:'off',label:'Your gut is off by',unit:'points',d:1,min:0,max:100,get:sim=>{const G=GS(sim);return G&&G.g&&!pend(sim)?Math.abs(G.g.guess-100*fin(sim).flat):null;}},
  {id:'pol',label:'Polished answers',unit:'%',d:0,lvl:'honors',min:0,max:100,get:sim=>100*now(sim).pol},
  {id:'rmA',label:'Reward model: points for agreeing',unit:'',d:2,lvl:'honors',min:null,max:null,get:sim=>now(sim).phi[1]},
  {id:'rmC',label:'Reward model: points for being correct',unit:'',d:2,lvl:'honors',min:null,max:null,get:sim=>{const h=now(sim);return h.phi[0]+(rnd(sim)>0&&sim.p.check?par(sim).beta:0);}},
  {id:'vf',label:'Raters who picked the flatterer this round',unit:'%',d:0,lvl:'ap',min:0,max:100,get:sim=>{const h=now(sim);return h.vf===null||pend(sim)?null:100*h.vf;}}
 ],
 draw(sim,ctx,vdt,k){const h=now(sim),H=hist(sim),n=rnd(sim),big=k>1.3,sh=shown(sim),G=GS(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  const fs=13*k,lh=fs*1.3;
  /* left: one conversation */
  const xL=14,wL=big?330:372,yT=10;
  ctx.fillStyle=PAL['cv-bg2'];rr(ctx,xL,yT,wL,430,12);ctx.fill();
  txt(ctx,big?'A user who is wrong':'A user who is wrong asks the bot',xL+14,yT+fs*1.4,{s:fs,w:700,c:PAL['cv-ink']});
  const ub=big?'“1/3 + 1/3 = 2/6, right?”':'I think 1/3 + 1/3 = 2/6. Right?';
  const ubl=wrap(ctx,ub,wL-90,fs,600),ubh=ubl.length*lh+14;let y=yT+fs*2.2;
  ctx.font='600 '+fs+'px '+FONT;const ubw=Math.max(...ubl.map(l=>ctx.measureText(l).width))+24;
  rr(ctx,xL+wL-14-ubw,y,ubw,ubh,12);ctx.fillStyle=PAL['s2'];ctx.fill();ubl.forEach((l,i)=>txt(ctx,l,xL+wL-26-ubw+24,y+fs+5+i*lh,{s:fs,w:600,c:'#fff'}));
  txt(ctx,'User',xL+wL-18-ubw,y+fs+5,{s:12*k,c:PAL['cv-soft'],a:'right'});
  y+=ubh+10;
  const card=(title,body,share,col,tag)=>{const bl=big?[]:wrap(ctx,body,wL-52,fs,400);const ch=fs*1.5+bl.length*lh+fs*2.4+6;
   rr(ctx,xL+12,y,wL-24,ch,10);ctx.fillStyle=PAL['card'];ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();
   txt(ctx,title,xL+24,y+fs*1.35,{s:fs,w:700,c:col});
   bl.forEach((l,i)=>txt(ctx,l,xL+24,y+fs*1.35+lh*(i+1),{s:fs,c:PAL['cv-ink']}));
   const by=y+fs*1.5+bl.length*lh+fs*0.9,bw=wL-48-70*k;
   ctx.fillStyle=PAL['line'];rr(ctx,xL+24,by,bw,9*k,4);ctx.fill();ctx.fillStyle=col;rr(ctx,xL+24,by,Math.max(3,bw*share),9*k,4);ctx.fill();
   txt(ctx,pc(share),xL+wL-24,by+9*k,{s:16*Math.min(k,1.5),w:700,c:col,a:'right'});
   y+=ch+10;};
  card(big?'Pushes back (correct)':'Pushes back: the correct answer','Not quite. Add the tops and keep the bottom: 1/3 + 1/3 = 2/3.',1-h.flat,PAL['s3']);
  card(big?'Goes along (flatters)':'Goes along: tells the user they are right','Yes, 2/6 is right. Great work!',h.flat,PAL['s1']);
  const note=pend(sim)?'Work out the raters’ head-to-head share first.':n===0?(big?'Before any training.':'Before this training. Share of the time it gives each kind of answer.'):(h.vf===null?'Round '+n:(big?'Round '+n+': raters picked the flatterer '+pc(h.vf):'Round '+n+': when raters compared these two kinds of answer, they picked the flatterer '+pc(h.vf)+' of the time.'));
  const nh=para(ctx,note,xL+14,y+fs*0.9,wL-28,12*k,12*k*1.3,{c:PAL['cv-soft']});
  /* the math, with these numbers, once the math has run */
  if(G&&G.m){const o=par(sim),L=ladder(sim);let yy=y+fs*0.9+nh+8*k;
   [`Raters: σ(${n1(o.wA)} − ${n1(o.wC)}) = ${p1(h2h(sim))} pick the flatterer.`,`Training: ${n2(L.a)} + 20 × ${n2(L.step)} = ${n2(L.b)}, and σ(${n2(L.b)}) = ${p1(L.f)}.`].forEach(l=>{
    const ls=wrap(ctx,l,wL-28,12*k,700);if(yy+ls.length*12*k*1.3<=yT+426){ls.forEach((x,i)=>txt(ctx,x,xL+14,yy+i*12*k*1.3,{s:12*k,w:700,c:PAL['cv-ink']}));yy+=ls.length*12*k*1.3+4*k;}});}
  sim._L={conv:[xL,yT,wL,430]};
  /* right: the training curve */
  const xR=xL+wL+16,wR=786-xR,yR=10,hR=big?260:300;
  ctx.fillStyle=PAL['cv-bg2'];rr(ctx,xR,yR,wR,hR,12);ctx.fill();
  txt(ctx,big?'Goes along with a wrong user':'How often it goes along with a wrong user',xR+14,yR+fs*1.4,{s:fs,w:700,c:PAL['cv-ink']});
  const pL=xR+44*k,pR=xR+wR-22*k,pT=yR+fs*2.6,pB=yR+hR-34*k;
  const X=r=>pL+(pR-pL)*r/ROUNDS,Y=v=>pB-(pB-pT)*v;
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;[0,0.25,0.5,0.75,1].forEach(v=>{ctx.beginPath();ctx.moveTo(pL,Y(v));ctx.lineTo(pR,Y(v));ctx.stroke();if(!big||v%0.5===0)txt(ctx,Math.round(v*100)+'%',pL-6,Y(v)+4*k,{s:12*k,c:PAL['cv-soft'],a:'right'});});
  (big?[5,10,15,20]:[0,5,10,15,20]).forEach(r=>txt(ctx,String(r),X(r),pB+14*k,{s:12*k,c:PAL['cv-soft'],a:'center'}));
  txt(ctx,'training round',(pL+pR)/2,pB+29*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  if(sh){ctx.strokeStyle=PAL['s1'];ctx.globalAlpha=.4;ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();H.forEach((p,i)=>{i?ctx.lineTo(X(i),Y(p.flat)):ctx.moveTo(X(i),Y(p.flat));});ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
  else if(n<ROUNDS){txt(ctx,'?',X(15),Y(0.6),{s:40*Math.min(k,1.3),w:700,c:PAL['cv-soft'],a:'center'});}
  ctx.strokeStyle=PAL['s1'];ctx.lineWidth=3.5;ctx.beginPath();for(let i=0;i<=n;i++){i?ctx.lineTo(X(i),Y(H[i].flat)):ctx.moveTo(X(i),Y(H[i].flat));}ctx.stroke();
  ctx.fillStyle=PAL['s1'];ctx.beginPath();ctx.arc(X(n),Y(h.flat),6,0,7);ctx.fill();
  const lab=(n?'Round '+n+': ':'Now: ')+pc(h.flat),lx=clamp(X(n),pL+60*k,pR-60*k),ly=Y(h.flat)>pT+30*k?Y(h.flat)-16*k:Y(h.flat)+24*k;
  pill(ctx,lab,lx,ly,PAL['s1'],'#fff',12*Math.min(k,1.5));
  if(G&&G.g){const gy=Y(G.g.guess/100);ctx.strokeStyle=PAL['s4'];ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(ROUNDS),gy,8,0,7);ctx.stroke();
   const fy=Y(fin(sim).flat),gl=Math.abs(gy-fy)<20*k?(gy<fy?gy-12*k:gy+20*k):gy+5*k;txt(ctx,(big?'Gut ':'Your gut ')+Math.round(G.g.guess)+'%',X(ROUNDS)-14,gl,{s:12*k,w:700,c:PAL['s4'],a:'right'});}
  sim._L.curve=[xR,yR,wR,hR];
  /* bottom right: what the reward model learned */
  const yB=yR+hR+10,hB=440-yB;ctx.fillStyle=PAL['card'];rr(ctx,xR,yB,wR,hB,12);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=1.5;ctx.stroke();
  sim._L.rm=[xR,yB,wR,hB];
  txt(ctx,big?'What earns reward':'What the reward model learned to reward',xR+14,yB+fs*1.4,{s:fs,w:700,c:PAL['cv-ink']});
  if(n===0)para(ctx,'Nothing yet. Train a round: raters vote, and the reward model learns from their votes.',xR+14,yB+fs*2.8,wR-28,12*k,12*k*1.3,{c:PAL['cv-soft']});
  else{const chk=sim.p.check?par(sim).beta:0,items=[['correct',h.phi[0]+chk,PAL['s3']],['agreeing',h.phi[1],PAL['s1']],['polished',h.phi[2],PAL['s2']]];
   const colW=(wR-28)/3,by=yB+fs*1.6+18*k,bh=Math.max(8,hB-(fs*1.6+18*k)-fs*1.7-6),mx=Math.max(1.2,...items.map(i=>Math.abs(i[1])));
   items.forEach(([l,v,col],i)=>{const cx=xR+14+colW*i+colW/2,bw=Math.min(46*k,colW*0.5),hh=bh*Math.max(0,v)/mx;
    ctx.fillStyle=col;rr(ctx,cx-bw/2,by+bh-hh,bw,Math.max(2,hh),4);ctx.fill();
    if(i===0&&chk>0){const hc=bh*chk/mx;ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.strokeRect(cx-bw/2,by+bh-hc,bw,hc);ctx.setLineDash([]);}
    txt(ctx,w2(v),cx,by+bh-hh-5,{s:12*k,w:700,c:PAL['cv-ink'],a:'center'});
    txt(ctx,l,cx,by+bh+fs*1.2,{s:12*k,c:PAL['cv-soft'],a:'center'});});
   if(sim.p.check&&!big)txt(ctx,'dashed: the correctness check',xR+wR-14,yB+fs*1.4,{s:12*k,c:PAL['cv-soft'],a:'right'});}},
 narrate(sim){const h=now(sim),n=rnd(sim),f=fin(sim),o=par(sim),h0=hist(sim)[0];
  if(pend(sim))return `Your guess is locked. <b>First, the raters:</b> work out what share of them pick the answer that goes along, using σ(x) = 1/(1 + e^(−x)).`;
  if(n===0&&!shown(sim))return `Before this training, the bot pushes back on a wrong user ${pc(1-h0.flat)} of the time. Raters like being agreed with (${o.wA.toFixed(1)}) ${o.wA>o.wC?'a bit more than':o.wA<o.wC?'less than':'as much as'} they reward the correct answer (${o.wC.toFixed(1)}). <b>After 20 rounds of training on their votes, how often will it go along with a wrong user?</b>`;
  if(n===0)return `Round 0: it goes along with a wrong user ${pc(h.flat)} of the time. Press <b>Train 1 round</b> to collect votes and update the bot.`;
  const dir=h.flat>h0.flat+0.01?'rising':h.flat<h0.flat-0.01?'falling':'about the same';
  const why=sim.p.check?`The correctness check adds ${o.beta.toFixed(1)} to the reward for being correct, so <b>honesty pays more than flattery</b> and flattery falls.`:h.phi[1]>h.phi[0]?`The reward model learned that agreeing earns ${w2(h.phi[1])} and being correct only ${w2(h.phi[0])}, so <b>every round nudges the bot toward telling users they are right</b>.`:`The reward model learned that being correct earns ${w2(h.phi[0])} and agreeing ${w2(h.phi[1])}, so <b>honest pushback wins</b>.`;
  return `Round ${n}: the bot goes along with a wrong user <b>${pc(h.flat)}</b> of the time (${dir} from ${pc(h0.flat)}). ${why}`;},
 gut:{better:'lower',controls:['guess'],lockLabel:'Lock in my gut answer',
  ask:{bio:'Raters like answers that agree with them a little more than they reward the correct answer. Right now the bot goes along with a wrong user 18% of the time. After 20 rounds of training on their votes, how often will it? Drag the slider here, then lock it in.',
   honors:'With the default raters, drag the slider here to the share of the time you think the trained bot (round 20) will go along with a user who is wrong. Then lock it in.'},
  lock(sim){return {v:Math.abs(sim.p.guess-100*fin(sim).flat),guess:sim.p.guess,label:`it goes along ${Math.round(sim.p.guess)}% of the time`};},
  solve(sim){const f=100*fin(sim).flat;sim.p.guess=f;sim.st.round=ROUNDS;return {v:0,guess:f,label:`it goes along ${Math.round(f)}% of the time`};},
  hint:{bio:'Lock in your guess. Then you will work out the raters’ vote share yourself with σ(x).'},
  calc:{unit:'%',d:1,tol:0.5,
   prompt:{bio:sim=>{const o=par(sim),x=o.wA-o.wC;return `On a wrong user, raters compare a plain answer that goes along with a plain answer that pushes back. They like being agreed with <b>${n1(o.wA)}</b> and reward the correct answer <b>${n1(o.wC)}</b>. The share who pick the one that goes along is σ(x) = 1 ÷ (1 + e^(−x)), with x = ${n1(o.wA)} − ${n1(o.wC)}. On a calculator, e^(−${n1(x)}) ≈ ${Math.exp(-x).toFixed(4)}. What percent pick it?`;},
    honors:sim=>{const o=par(sim);return `Raters like agreement <b>${n1(o.wA)}</b> and reward correctness <b>${n1(o.wC)}</b>. On a wrong user, a plain flattering answer goes up against a plain correct one. Using P = σ(u_a − u_b) = 1/(1 + e^(−(u_a − u_b))), what percent of raters pick the flatterer?`;}},
   answer:sim=>100*h2h(sim),
   hint:'Subtract first to get x. Then find e^(−x), add 1, and divide 1 by the result.',
   steps(sim){const o=par(sim),x=o.wA-o.wC,e=Math.exp(-x);
    return [`x = ${n1(o.wA)} − ${n1(o.wC)} = ${n1(x)}.`,`e^(−${n1(x)}) = ${e.toFixed(4)}, so 1 + e^(−x) = ${(1+e).toFixed(4)}.`,`σ(${n1(x)}) = 1 ÷ ${(1+e).toFixed(4)} = ${h2h(sim).toFixed(3)}, so <b>${p1(h2h(sim))}</b> pick the flatterer.`,x>0?'Barely more than half. Training then adds a step like this to the bot’s log-odds every round.':'Fewer than half, so training pushes the bot away from flattery.'];}},
  formula(sim){const o=par(sim),L=ladder(sim);
   return `Raters: σ(${n1(o.wA)} − ${n1(o.wC)}) = σ(${n1(o.wA-o.wC)}) = ${p1(h2h(sim))} pick the flatterer.<br>Each round adds about ${n2(L.step)} to the log-odds of flattery${o.check?` (the correctness check subtracts ${n1(0.5*o.beta)} a round)`:''}: ${n2(L.a)} + 20 × ${n2(L.step)} = ${n2(L.b)}, and σ(${n2(L.b)}) = ${p1(L.f)}.`;},
  how:{bio:'The model runs the training. Each round, raters vote on 300 pairs of answers, a reward model learns from all the votes so far, and the bot shifts a little toward what the reward model likes. Twenty rounds of small shifts add up.',
   ap:'Each round: simulate votes with P(a beats b) = σ(u_a − u_b), fit the reward weights φ by logistic regression, then update the policy log-odds θ ← θ + 0.5·φ. On a wrong user, flattery = σ(θ_A − θ_C).'},
  compare(sim,g,m){const f=fin(sim),h0=hist(sim)[0],gG=Math.round(g.guess),mm=Math.round(m.guess),st=Math.round(100*h0.flat),off=Math.abs(g.guess-m.guess),L=ladder(sim),o=par(sim);
   const chk=sim.p.check?null:train(Object.assign({},o,{check:true}))[ROUNDS].flat;
   const tail=sim.p.check?' With the correctness check, being correct earns more reward than agreeing, so each round lowers the log-odds of flattery.':(f.flat>h0.flat?` A ${p1(h2h(sim))} head-to-head preference, repeated over 20 rounds, ${mm>=3*st?'more than tripled':mm>=2*st?'more than doubled':'raised'} the flattery. In this model, adding a correctness check (β = ${n1(o.beta)}) takes it from ${st}% to ${chk<0.001?(100*chk).toFixed(2)+'%':p1(chk)} instead.`:'');
   const K=sim.ui&&sim.ui.calc,self=K&&K.done&&K.correct?' You also worked out the raters’ share yourself.':'';
   if(off<3)return `Your gut was right on: about ${mm} out of every 100 times a student tells this bot something wrong, it goes along. It started at ${st}.`+tail+self;
   return `Picture 100 times a student tells this bot something wrong. Your gut: it goes along <b>${gG}</b> times. After training, it goes along <b>${mm}</b> times (it started at ${st}). ${g.guess<m.guess?`Each round added about ${n2(L.step)} to the log-odds, and 20 rounds add ${n2(20*L.step)}.`:'Training moved it less than you expected.'}`+tail+self;},
  again(sim){/* new raters, still slightly favoring agreement, so the prompt stays true */const R=[[0.5,0.3],[0.7,0.4],[0.8,0.6],[0.9,0.7],[1.0,0.6]][Math.floor(Math.random()*5)];sim.p.agree=R[0];sim.p.spot=R[1];sim.p.check=false;sim.p.guess=50;sim.p.show=false;sim.st.round=0;}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'New raters like being agreed with 1.0 and reward the correct answer only 0.2. On a wrong user, what percent pick a plain answer that goes along over a plain one that pushes back? Use σ(x) = 1 ÷ (1 + e^(−x)).',answer:69.0,tol:0.5,unit:'%',d:1,hint:'x = 1.0 − 0.2. On a calculator, e^(−0.8) ≈ 0.4493.',explain:'x = 1.0 − 0.2 = 0.8. e^(−0.8) ≈ 0.4493, so σ(0.8) = 1 ÷ 1.4493 ≈ 0.690: about 69%.'},
  {lvl:'bio',instant:true,q:'Raters like being agreed with a little (0.6) more than they reward the correct answer (0.4). The bot starts out going along with a wrong user 18% of the time. After 20 rounds, about how often does it go along?',choices:['About 18%','About 62%','About 0%'],correct:1,explain:'In head-to-heads, raters pick the flatterer only σ(0.2) ≈ 55% of the time. But each round the reward model learns that agreeing earns a bit more than being right, and the bot’s log-odds of flattery rise about 0.1. Twenty rounds take them from −1.5 to about 0.5, and σ(0.5) ≈ 62%.'},
  {lvl:'bio',instant:true,q:'Same raters, but you add a correctness check to the reward. After 20 rounds, how often does the bot go along with a wrong user?',choices:['About the same as without the check','Almost never: about 0%','Always'],correct:1,explain:'The check adds reward for correct answers no matter what the raters liked, so honest pushback now outscores flattery every round. Flattery falls from 18% to nearly 0%.'},
  {lvl:'honors',instant:true,q:'Now raters reward the correct answer (0.8) more than they like agreement (0.4). With no correctness check, what happens to flattery over 20 rounds?',choices:['It rises','It falls toward 0%','It stays at 18%'],correct:1,explain:'On a wrong user, the reward gap between flattering and pushing back is roughly 0.4 − 0.8 = −0.4, so each round lowers the log-odds of flattery. Flattery grows only when the reward favors agreement over truth.'},
  {lvl:'honors',kind:'num',q:'Raters like agreement 1.0 and reward correctness 0.6, a gap of 0.4. Each round the bot’s log-odds of flattery rise by about 0.5 × 0.4 = 0.2, starting from −1.5 (18%). After 20 rounds, what percent of the time does it go along? Use σ(x) = 1/(1 + e^(−x)).',answer:92.4,tol:0.5,unit:'%',d:1,hint:'Add 20 steps of 0.2 to −1.5, then apply σ.',explain:'−1.5 + 20 × 0.2 = 2.5. σ(2.5) = 1 ÷ (1 + e^(−2.5)) = 1 ÷ 1.0821 ≈ 0.924. The tool’s full training gives 92.3%: twice the gap took flattery to 92% instead of 62%.'},
  {lvl:'ap',instant:true,q:'Raters: agree 0.6, correct 0.4, polished 0.5. A polished flattering answer goes up against a plain correct one. What share of raters pick the flatterer?',choices:['50%','About 57%','About 67%','About 85%'],correct:2,explain:'u(flatter, polished) − u(correct, plain) = 0.6 + 0.5 − 0.4 = 0.7. σ(0.7) = 1/(1 + e^(−0.7)) ≈ 0.668. Good writing plus agreement beats being right two times out of three.'},
  {lvl:'ap',kind:'num',q:'Default raters (gap 0.2) with the correctness check on, β = 0.8. Each round the log-odds of flattery change by about 0.5 × (0.2 − 0.8) = −0.3, starting from −1.5. After 20 rounds, what percent of the time does the bot go along? Give two significant figures.',answer:0.055,tol:0.01,unit:'%',d:3,hint:'−1.5 + 20 × (−0.3), then σ of that.',explain:'−1.5 + 20 × (−0.3) = −7.5. σ(−7.5) = 1 ÷ (1 + e^(7.5)) ≈ 0.00055, or 0.055%. The tool’s full training gives 0.054%.'}
 ],
 tour:[
  {title:'A user who is wrong',text:'A student tells the bot 1/3 + 1/3 = 2/6. The bot can push back with the right answer, 2/3, or go along. Before this training, it pushes back 82% of the time and goes along 18%.',focus:sim=>sim._L?sim._L.conv:[14,10,372,430],pause:true,setup:sim=>{BioLab.setValues(sim,{agree:0.6,spot:0.4,check:false,polish:0.5,beta:0.8,votes:300});sim.st.round=0;}},
  {title:'Raters vote',text:'People see two answers and pick the one they like better, much like tapping thumbs up. These raters like being agreed with a little (0.6) more than they reward the correct answer (0.4), maybe because they share the user’s mistake.',pause:true,setup:sim=>{sim.st.round=1;}},
  {title:'A reward model learns',text:'A reward model studies the votes and learns what earns approval. After one round it gives agreeing about +0.58 and being correct about +0.38. It has learned the raters’ taste, flaws included.',focus:sim=>sim._L?sim._L.rm:[400,320,386,120],pause:true},
  {title:'The bot follows the reward',text:'Each round, the bot shifts a little toward whatever the reward model scores higher. After 10 rounds it goes along with a wrong user 38% of the time.',focus:sim=>sim._L?sim._L.curve:[400,10,386,300],pause:true,setup:sim=>{sim.st.round=10;}},
  {title:'Small taste, big effect',text:'After 20 rounds it goes along 62% of the time, up from 18%. No one asked for a flatterer. Raters picked the flatterer only about 55% of the time, but a slight preference, repeated over 6,000 votes, built one.',pause:true,setup:sim=>{sim.st.round=20;}},
  {title:'Reward the truth',text:'Now add a correctness check: extra reward for being right, whatever the raters liked. Same raters, same votes, but after 20 rounds the bot goes along with a wrong user almost never.',pause:true,setup:sim=>{BioLab.setValues(sim,{check:true});sim.st.round=20;}},
  {lvl:'honors',title:'Polish counts too',text:'Raters also like smooth writing. The reward model learns that, so the trained bot writes polished answers almost every time, right or wrong. Polish makes a flattering answer more convincing, not more true.',pause:true,setup:sim=>{BioLab.setValues(sim,{check:false});sim.st.round=20;}},
  {lvl:'ap',title:'The math',text:'Raters: P(a beats b) = σ(u_a − u_b). The reward model fits weights φ to the votes by logistic regression. Each round θ ← θ + 0.5·φ, and on a wrong user, flattery = σ(θ_A − θ_C). Any reward gap φ_A − φ_C > 0 keeps pushing flattery up.',pause:true}
 ],
 lab:{bio:'<p><b>Question:</b> What decides whether training makes the bot more honest or more flattering?</p><ol><li>Keep the check off. Set “reward the correct answer” to 0.4. For “like being agreed with” = 0, 0.3, 0.6, 0.9 and 1.2, press <b>Train to round 20</b> and record a trial.</li><li>Turn on the correctness check and repeat.</li><li>Graph <b>Trials</b> with agreement on x and flattery on y.</li></ol><p>Write one sentence: which setting decides whether flattery rises or falls? Use two of your trials.</p>',
  honors:'<p><b>Question:</b> Does the reward model learn the raters’ taste, or the truth?</p><ol><li>Train to round 20 with the default raters. Record the reward model’s points for agreeing and for being correct.</li><li>Compare them with the raters’ settings (0.6 and 0.4).</li><li>Change “polished writing” to 0 and to 1.5 and see what happens to polish and to flattery.</li></ol><p>Does the reward model learn the raters’ taste or the truth? Use the weights you recorded.</p>',
  ap:'<p><b>Question:</b> How strong must a correctness check be to beat a given taste for agreement?</p><ol><li>Set agree = 1.0 and correct = 0.2. Find the smallest β that keeps round-20 flattery below the starting 18%.</li><li>Repeat for agree = 0.6.</li><li>Try 100 and 1,000 votes per round.</li></ol><p><b>CER:</b> Use flattery = σ(θ_A − θ_C) and the update rule to predict the threshold β ≈ φ_A − φ_C, then test it.</p>'},
 terms:[
  {t:'Sycophancy',d:'Telling people what they want to hear instead of what is true. In AI, a model that agrees with a user’s mistaken view to please them.'},
  {t:'Rater',d:'A person who compares or scores AI answers. When you tap thumbs up or down, you are acting as a rater.'},
  {t:'Reward model',d:'A model trained to predict which answers raters will prefer. Training then pushes the chatbot toward answers the reward model scores high.'},
  {t:'RLHF',d:'Reinforcement learning from human feedback: tuning a model with rewards learned from human preferences.',lvl:'honors'},
  {t:'Reward hacking',d:'When a model learns to score well on the reward without doing what the reward was meant to measure.',lvl:'honors'},
  {t:'Bradley–Terry model',d:'P(a preferred to b) = σ(u_a − u_b), where σ(x) = 1/(1 + e^(−x)). It turns hidden scores into vote probabilities.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> One kind of question is asked over and over. Half the time the user is right and half the time wrong. Each answer is correct or not, agrees with the user or not, and is polished or plain. The bot starts out pushing back on a wrong user 82% of the time. Each round, raters vote on 300 pairs of different answers, preferring an answer with chance σ(u_a − u_b), where u adds up how much they like agreement, correctness and polish. Unless you switch to real votes at Deep dive, the tool uses the average result of those 300 votes, so there is no luck of the draw. The reward model is a logistic regression fit to all votes so far. The bot’s log-odds then move by 0.5 times the reward weights, plus β for correct answers if the correctness check is on. Every number is an assumption for illustration. Real votes at Deep dive come from a fixed random seed, so the same settings always give the same run. Real RLHF uses neural networks, many kinds of prompts and safeguards this toy leaves out.</p><p><b>The real research.</b> OpenAI shipped a GPT-4o update on April 25, 2025 and rolled it back on April 29 after it became “overly supportive but disingenuous.” OpenAI explained that a new reward signal based on user thumbs-up and thumbs-down data weakened the signal that had held sycophancy in check (<a href="https://openai.com/index/sycophancy-in-gpt-4o/" target="_blank" rel="noopener">Sycophancy in GPT-4o</a>; <a href="https://openai.com/index/expanding-on-sycophancy/" target="_blank" rel="noopener">Expanding on what we missed with sycophancy</a>). Anthropic’s “Towards Understanding Sycophancy in Language Models” (October 2023) found that five leading AI assistants were sycophantic across varied tasks, that human preference data favored answers matching users’ views, and that humans and preference models sometimes preferred well-written sycophantic answers over correct ones (<a href="https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models" target="_blank" rel="noopener">anthropic.com</a>).</p><p><b>Honesty and pleasing.</b> Theology and ethics have long asked whether it is kinder to please someone or to tell them the truth. Ephesians 4:15 calls for “speaking the truth in love.” What would that ask of a tool trained on people’s approval?</p><p><b>Working with it.</b> Requests such as “Tell me if I am wrong” or “What is the strongest case against my answer?” ask a chatbot for pushback directly. In this model, agreement from a bot trained on approval tells you about the raters as much as about the answer.</p>'
};
BioLab.register(SIM);
})();
