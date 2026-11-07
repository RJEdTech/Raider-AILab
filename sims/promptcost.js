(function(){
'use strict';
const {clamp,txt,pill,rr,PAL,FONT,atLeast}=BioLab.h;
/* Per-prompt figures are company self-reports. They are not standardized and do not count the same things. */
const SRC={
 google:{l:'Serving only (Google)',s:'Google',wh:0.24,ml:0.26,g:0.03,who:'Google, Aug 2025: median Gemini text prompt, serving only'},
 altman:{l:'Average, no method (OpenAI CEO)',s:'OpenAI CEO',wh:0.34,ml:0.000085*3785.41,g:null,who:'OpenAI CEO, Jun 2025: average ChatGPT query, no method published'},
 mistral:{l:'Life cycle (Mistral)',s:'Mistral',wh:null,ml:45,g:1.14,who:'Mistral, Jul 2025: life-cycle analysis, one 400-token response'}
};
const LED=10,SHOWER=8000,CLASS=30,SCHOOL=1700,WORLD=8e9,DC24=415e12,DC30=945e12;   /* Wh per LED-bulb hour; mL per shower minute (assumption) */
/* EIA, 2024 Average Monthly Bill, Residential (table 5A): Colorado homes averaged 674 kWh a month. Per day: 674 × 12 ÷ 365. */
const CO_MONTH=674,CO_DAY=CO_MONTH*12/365;
const src=sim=>SRC[sim.p.count]&&(sim.p.count!=='altman'||atLeast('honors'))?SRC[sim.p.count]:SRC.google;
const phone=sim=>atLeast('ap')?sim.p.phone:12;
const days=sim=>atLeast('honors')&&sim.p.span==='year'?365:1;
/* The phone-charge question uses the chosen source's energy; Mistral did not report energy, so it falls back to Google's. */
const eSrc=sim=>src(sim).wh!=null?src(sim):SRC.google;
const ppc=sim=>phone(sim)/eSrc(sim).wh;
const GS=sim=>(sim.tour&&sim.tour.on)?null:sim.gutS;
/* While the student does the division ("Your turn"), the phone-charge answer stays hidden. */
const pend=sim=>!!(BioLab.calcPending&&BioLab.calcPending(sim));
const shown=sim=>!pend(sim)&&!!(sim.p.reveal||(sim.st&&sim.st.peek)||(GS(sim)&&GS(sim).g));
const schoolKWh=sim=>SCHOOL*sim.p.perDay*eSrc(sim).wh/1000;
const n0=v=>Math.round(v).toLocaleString('en-US');
function sig(v){const a=Math.abs(v);if(a>=100)return n0(v);if(a>=10)return (Math.round(v*10)/10).toString();if(a>=1)return (Math.round(v*100)/100).toString();return Number(v.toPrecision(2)).toString();}
function bigN(x){if(x>=1e12)return sig(x/1e12)+' trillion';if(x>=1e9)return sig(x/1e9)+' billion';if(x>=1e6)return sig(x/1e6)+' million';return sig(x);}
function fmt(v,kind){const U=kind==='wh'?[[1e12,'TWh'],[1e9,'GWh'],[1e6,'MWh'],[1e3,'kWh'],[1,'Wh']]:kind==='ml'?[[1e15,'trillion L'],[1e12,'billion L'],[1e9,'million L'],[1e3,'L'],[1,'mL']]:[[1e12,'million t'],[1e9,'thousand t'],[1e6,'t'],[1e3,'kg'],[1,'g']];
 for(const [d,u] of U)if(Math.abs(v)>=d)return sig(v/d)+' '+u;return sig(v)+' '+U[U.length-1][1];}
function equiv(v,kind,sim){if(kind==='wh'){const c=v/phone(sim);if(c>=0.95)return bigN(c)+' phone charges';return sig(v/LED*60)+' min of an LED bulb';}
 if(kind==='ml'){const m=v/SHOWER;if(m>=1)return bigN(m)+' shower minutes';return sig(m*60)+' s of a hot shower';}return '';}
function per(sim,kind){const s=src(sim);return kind==='wh'?s.wh:kind==='ml'?s.ml:s.g;}
function rows(sim){const d=days(sim),n=sim.p.perDay;const R=[{l:'One prompt',s:'1 prompt',n:1},{l:`You: ${n} prompt${n===1?'':'s'} a ${d>1?'day for a year':'day'}`,s:'You',n:n*d},{l:`Your class (${CLASS} students)`,s:'Class of 30',n:n*d*CLASS},{l:'A school about RJ’s size (1,700 students)',s:'School (1,700)',n:n*d*SCHOOL},{l:'Everyone on Earth (about 8 billion)',s:'Everyone on Earth',n:n*d*WORLD}];
 return R;}
function clearGut(sim){if(sim.gutS&&(sim.gutS.g||sim.gutS.m)){sim.gutS.g=null;sim.gutS.m=null;if(BioLab.gutRender)BioLab.gutRender(sim);}}
const KIND={energy:'wh',water:'ml',co2:'g'};

const SIM={
 id:'promptcost',hash:'promptcost',apUnit:4,order:1,tab:'What one prompt costs',kind:'Learning tool',
 card:'Guess how many AI prompts equal one phone charge, then scale one prompt up to your day, your class, a whole school and the world.',
 title:'What does one AI prompt cost?',
 skills:{bio:'Unit rates: dividing energies, then scaling by a count · Algebra 1, Physics',honors:'Unit conversion (Wh → kWh → TWh) and scaling · Algebra 1, APES',ap:'Unit conversion, log scales and average growth rate, (945 ÷ 415)^(1/6) − 1 · APES, Algebra 2'},
 lede:{bio:'Every AI prompt runs on electricity and cooling water in a data center. It is a division problem first: how many prompts fit in one phone charge? Then a scaling problem: what happens when a school, or billions of people, send them every day?',
  honors:'Per-prompt numbers come from the companies themselves, and each one counts different things. Switch what is counted and watch the same prompt change size.',
  ap:'APES tie: energy units (Wh to TWh), water use and carbon footprint all scale linearly with the number of prompts, but the system boundary of a life-cycle analysis decides what goes into the per-prompt number.'},
 scale:'From one prompt (about a quarter of a watt-hour) up to the world. The bars use a log scale: each step is 10 times the last.',
 aspect:16/9,timeless:true,trials:true,graph:false,
 controlsTitle:'Your prompts',
 controls:[
  {id:'guess',label:'Your gut: how many prompts use as much energy as one full phone charge?',type:'range',min:1,max:300,step:1,def:5,unit:' prompts'},
  {id:'perDay',label:'Prompts you send in a day',type:'range',min:1,max:100,step:1,def:20,unit:'',noGut:true},
  {id:'count',label:'What’s counted',type:'seg',def:'google',noGut:true,onChange:clearGut,options:[{v:'google',l:'Serving only (Google)'},{v:'altman',l:'Average, no method (OpenAI CEO)',lvl:'honors'},{v:'mistral',l:'Life cycle (Mistral)'}],help:'Serving only counts running the prompt in the data center. A life-cycle analysis also counts things like making the hardware. Each company chose its own boundary.'},
  {id:'show',label:'Show',type:'seg',def:'energy',noGut:true,options:[{v:'energy',l:'Energy'},{v:'water',l:'Water'},{v:'co2',l:'CO₂'}]},
  {id:'span',label:'Time span',type:'seg',def:'day',lvl:'honors',noGut:true,options:[{v:'day',l:'One day'},{v:'year',l:'A year of days like this'}]},
  {id:'phone',label:'Energy in one full phone charge',type:'range',min:10,max:15,step:0.5,def:12,unit:' Wh',lvl:'ap',noGut:true,onChange:clearGut,help:'Battery capacity in mAh × about 3.85 V ÷ 1000. A 3,000 to 4,000 mAh phone holds roughly 12 to 15 Wh.'},
  {id:'reveal',label:'Show the answers now',type:'toggle',def:false,noGut:true,help:'Normally the phone-charge answer appears once you lock in your gut answer.'}
 ],
 init(){return {peek:0};},step(){},
 metrics:[
  {id:'ppc',label:'Prompts per phone charge',unit:'prompts',d:0,min:0,max:80,get:sim=>shown(sim)?ppc(sim):null},
  {id:'wh',label:'Energy per prompt',unit:'Wh',d:2,min:0,max:1,get:sim=>src(sim).wh},
  {id:'ml',label:'Water per prompt',unit:'mL',d:2,min:0,max:50,get:sim=>src(sim).ml},
  {id:'g',label:'CO₂e per prompt',unit:'g',d:2,min:0,max:2,get:sim=>src(sim).g},
  {id:'youCh',label:'Your prompts in a day, in phone charges',unit:'charges',d:2,min:0,max:5,get:sim=>shown(sim)?sim.p.perDay*eSrc(sim).wh/phone(sim):null},
  {id:'school',label:'A school about RJ’s size, one day',unit:'kWh',d:2,min:0,max:null,get:sim=>src(sim).wh==null?null:SCHOOL*sim.p.perDay*src(sim).wh/1000},
  {id:'coHome',label:'That school day, in days of one average Colorado home’s electricity',unit:'days',d:2,min:0,max:null,get:sim=>shown(sim)?schoolKWh(sim)/CO_DAY:null},
  {id:'worldPct',label:'Everyone on Earth for a year, as a share of all data centers in 2024',unit:'%',d:1,lvl:'honors',min:0,max:null,get:sim=>src(sim).wh==null?null:100*WORLD*sim.p.perDay*365*src(sim).wh/DC24},
  {id:'off',label:'Your gut is off by',unit:'prompts',d:0,min:0,max:300,get:sim=>shown(sim)?Math.abs(sim.p.guess-ppc(sim)):null},
  {id:'boundary',label:'Same prompt, different boundary',text:true,lvl:'honors',get:sim=>`Water: ${SRC.mistral.ml} mL (Mistral, life cycle) vs. ${SRC.google.ml} mL (Google, serving only), ${Math.round(SRC.mistral.ml/SRC.google.ml)} times more. CO₂e: ${SRC.mistral.g} g vs. ${SRC.google.g} g, ${Math.round(SRC.mistral.g/SRC.google.g)} times more. Different models too, so not all of the gap is the boundary.`}
 ],
 draw(sim,ctx,vdt,k){const big=k>1.3,S=src(sim),kind=KIND[sim.p.show]||'wh',show=shown(sim),G=GS(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  ctx.fillStyle=PAL['cv-bg2'];ctx.fillRect(0,0,226,450);
  /* phone: one slice per prompt */
  const E=eSrc(sim),N=ppc(sim),px=44,py=96,pw=110,ph=300;
  txt(ctx,big?'Phone charge':'One full phone charge',113,30*k,{s:(big?13:14)*k,w:700,a:'center'});
  txt(ctx,show?(big?'≈ '+sig(phone(sim))+' Wh':'about '+sig(phone(sim))+' Wh of energy'):'= how many prompts?',113,30*k+18*k,{s:12*k,c:PAL['cv-soft'],a:'center'});
  rr(ctx,px,py,pw,ph,16);ctx.fillStyle=PAL['card'];ctx.fill();ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle=PAL['cv-ink'];rr(ctx,px+pw/2-14,py+8,28,5,2.5);ctx.fill();
  const ix=px+10,iy=py+22,iw=pw-20,ih=ph-44;
  if(show){const sl=ih/N;ctx.fillStyle=PAL['s3'];ctx.globalAlpha=.85;ctx.fillRect(ix,iy,iw,ih);ctx.globalAlpha=1;
   ctx.strokeStyle=PAL['card'];ctx.lineWidth=sl>4?1.2:0.8;for(let i=1;i<N;i++){const y=iy+ih-i*sl;ctx.beginPath();ctx.moveTo(ix,y);ctx.lineTo(ix+iw,y);ctx.stroke();}
   pill(ctx,sig(N)+' prompts',px+pw/2,iy+ih/2,PAL['rj'],'#fff',13*Math.min(k,1.4));
   txt(ctx,sig(phone(sim))+' Wh ÷ '+E.wh+' Wh = '+sig(N),113,py+ph+22*k,{s:12*k,w:700,c:PAL['cv-ink'],a:'center'});
   txt(ctx,big?E.s:'Energy: '+E.s+(S.wh==null?' (Mistral gave none)':''),113,py+ph+40*k,{s:12*k,c:PAL['cv-soft'],a:'center'});}
  else{ctx.fillStyle=PAL['cv-bg2'];ctx.fillRect(ix,iy,iw,ih);txt(ctx,'?',px+pw/2,iy+ih/2+12*k,{s:36*k,w:700,c:PAL['cv-soft'],a:'center'});
   txt(ctx,pend(sim)?(big?'Do the division':'Do the division to see'):(big?'Lock in to see':'Lock in your gut to see'),113,py+ph+22*k,{s:12*k,c:PAL['cv-soft'],a:'center'});}
  if(G&&G.g){const yy=iy+ih-ih/Math.max(G.g.guess,1);ctx.strokeStyle=PAL['s4'];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ix-6,yy);ctx.lineTo(ix+iw+6,yy);ctx.stroke();
   txt(ctx,big?'Gut':'Your gut',px+pw+8,Math.max(iy+12,yy+4*k),{s:12*k,w:700,c:PAL['s4']});}
  /* header: one prompt */
  const X0=246;const v1=per(sim,kind);
  txt(ctx,big?S.s+': one prompt':S.who,X0,30*k,{s:(big?14:13)*k,w:700});
  const parts=[['Energy',S.wh,'wh'],['Water',S.ml,'ml'],['CO₂e',S.g,'g']].map(([l,v,u])=>l+' '+(v==null?'not reported':fmt(v,u)));
  if(!big)txt(ctx,parts.join('   ·   '),X0,30*k+20*k,{s:12*k,c:PAL['cv-soft']});
  else txt(ctx,(kind==='wh'?parts[0]:kind==='ml'?parts[1]:parts[2]),X0,30*k+20*k,{s:12*k,c:PAL['cv-soft']});
  /* ladder */
  const R=rows(sim);const dc=kind==='wh'&&atLeast('honors')?[{l:days(sim)>1?'All data centers, 2024 (IEA)':'All data centers, one day in 2024 (IEA)',s:days(sim)>1?'All data centers 2024':'Data centers, 1 day',v:DC24*days(sim)/365},atLeast('ap')?{l:days(sim)>1?'All data centers, 2030 projection (IEA)':'All data centers, one day in 2030 (IEA projection)',s:days(sim)>1?'Data centers 2030 (proj.)':'1 day in 2030 (proj.)',v:DC30*days(sim)/365}:null].filter(Boolean):[];
  const top=30*k+44*k,bot=440,nR=R.length+dc.length,rh=(bot-top)/nR;
  if(v1==null){txt(ctx,(big?S.s:S.who.split(':')[0])+' did not report '+(kind==='wh'?'energy':'CO₂')+' per prompt.',X0,top+40,{s:13*k,w:700,c:PAL['cv-ink']});
   txt(ctx,'No shared standard means some numbers are simply missing.',X0,top+40+22*k,{s:12*k,c:PAL['cv-soft']});
   txt(ctx,'Try another “Show” or “What’s counted” option.',X0,top+40+44*k,{s:12*k,c:PAL['cv-soft']});return;}
  const vals=R.map(r=>r.n*v1).concat(dc.map(d=>d.v)),lo=Math.floor(Math.log10(Math.min(...vals))),hi=Math.ceil(Math.log10(Math.max(...vals))),bx=X0,bw=786-X0,BX=v=>bx+bw*(Math.log10(v)-lo)/Math.max(1,hi-lo);
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;ctx.globalAlpha=.6;for(let e=lo;e<=hi;e++){const x=BX(Math.pow(10,e));ctx.beginPath();ctx.moveTo(x,top-4);ctx.lineTo(x,bot);ctx.stroke();}ctx.globalAlpha=1;
  const all=R.map(r=>({l:big?r.s:r.l,v:r.n*v1,c:PAL['rj']})).concat(dc.map(d=>({l:big?d.s:d.l,v:d.v,c:PAL['s5']})));
  all.forEach((r,i)=>{const y=top+i*rh,by=y+18*k,bh=Math.max(6,Math.min(14,rh-24*k));
   txt(ctx,r.l,bx,y+12*k,{s:12*k,w:600,c:PAL['cv-ink']});
   const eq=show&&kind!=='g'&&!big?equiv(r.v,kind,sim):'';
   txt(ctx,fmt(r.v,kind)+(eq?'  ≈ '+eq:''),790,y+12*k,{s:12*k,w:700,c:PAL['cv-ink'],a:'right'});
   const xe=Math.max(bx+4,BX(r.v));ctx.fillStyle=r.c;ctx.globalAlpha=.85;ctx.fillRect(bx,by,xe-bx,bh);ctx.globalAlpha=1;});
  },
 narrate(sim){const S=src(sim),kind=KIND[sim.p.show]||'wh',n=sim.p.perDay,v=per(sim,kind);
  if(!shown(sim))return `One prompt by ${S.s}’s count: ${S.wh==null?'energy not reported':S.wh+' Wh'}, ${fmt(S.ml,'ml')} of water. <b>How many prompts does it take to use one phone charge?</b> Lock in your gut first.`;
  if(v==null)return `${S.s} did not report ${kind==='wh'?'energy':'CO₂'} per prompt. <b>These are company self-reports with no shared standard</b>, so each one leaves something out.`;
  const sch=SCHOOL*n*v,wld=WORLD*n*v;
  if(kind==='wh')return `One prompt is about ${sig(1/ppc(sim)*100)}% of a phone charge. Your ${n} a day is ${fmt(n*v,'wh')}. <b>A school about RJ’s size</b> at that rate uses ${fmt(sch,'wh')} a day, and everyone on Earth ${fmt(wld,'wh')}. <b>Small per prompt, large in total.</b>`;
  if(kind==='ml')return `Your ${n} prompts use ${fmt(n*v,'ml')} of water a day by ${S.s}’s count. A school about RJ’s size: ${fmt(sch,'ml')}. <b>${sim.p.count==='mistral'?'The life-cycle count is about 170 times Google’s serving-only number.':'Switch to Mistral’s life-cycle count and the same prompt looks about 170 times thirstier.'}</b>`;
  return `By ${S.s}’s count, your ${n} prompts a day emit ${fmt(n*v,'g')} of CO₂e, and a school about RJ’s size ${fmt(sch,'g')}. <b>What’s counted changes the number:</b> 0.03 g (Google, serving) vs. 1.14 g (Mistral, life cycle).`;},
 gut:{better:'lower',controls:['guess'],lockLabel:'Lock in my gut answer',
  ask:{bio:'A full phone charge takes a certain amount of electricity. How many AI text prompts use that same amount? Drag the slider here to your guess, then lock it in.',
   honors:'Before you do the division: drag the slider here to your gut number of prompts per phone charge, then lock it in.'},
  lock(sim){return {v:Math.abs(sim.p.guess-ppc(sim)),guess:sim.p.guess,label:`${Math.round(sim.p.guess)} prompts per phone charge`};},
  solve(sim){const n=ppc(sim);sim.p.guess=n;return {v:0,guess:n,label:`about ${sig(n)} prompts per phone charge (${sig(phone(sim))} Wh ÷ ${eSrc(sim).wh} Wh, ${eSrc(sim).s})`};},
  hint:{bio:'Lock in your gut answer. Then you will do the division yourself.'},
  calc:{unit:'prompts',d:1,tol:a=>Math.max(0.5,0.01*a),
   prompt:{bio:sim=>{const E=eSrc(sim);return `A full phone charge is about <b>${sig(phone(sim))} Wh</b> of energy. ${E.s} reports <b>${E.wh} Wh</b> for one text prompt${src(sim).wh==null?' (Mistral did not report energy, so use Google’s number)':''}. How many prompts use as much energy as one phone charge?`;},
    ap:sim=>{const E=eSrc(sim);return `This phone battery stores ${sig(phone(sim))} Wh (mAh × about 3.85 V ÷ 1000). One prompt uses ${E.wh} Wh by ${E.s}’s count. Prompts per charge = battery energy ÷ energy per prompt. What is it?`;}},
   answer:ppc,
   hint:'Divide the bigger energy (the phone charge) by the smaller one (one prompt). Both are in Wh, so the units cancel.',
   steps(sim){const E=eSrc(sim),N=ppc(sim),n=sim.p.perDay;return [`Both energies are in Wh, so divide: ${sig(phone(sim))} Wh ÷ ${E.wh} Wh = <b>${sig(N)} prompts</b> per phone charge.`,`Check: ${sig(N)} × ${E.wh} Wh = ${sig(N*E.wh)} Wh, one full charge.`,`Then scale: your ${n} prompts a day are ${n} × ${E.wh} = ${sig(n*E.wh)} Wh, and ${n} ÷ ${sig(N)} = ${sig(n/N)} of a charge.`];}},
  formula(sim){const E=eSrc(sim),n=sim.p.perDay,sch=SCHOOL*n*E.wh;
   return `Prompts per charge = ${sig(phone(sim))} Wh ÷ ${E.wh} Wh = ${sig(ppc(sim))}<br>School, one day = 1,700 × ${n} × ${E.wh} Wh = ${n0(sch)} Wh = ${sig(sch/1000)} kWh<br>In Colorado homes: ${sig(sch/1000)} kWh ÷ ${sig(CO_DAY)} kWh a day = ${sig(sch/1000/CO_DAY)} days of one home’s electricity`;},
  how:{bio:'Divide the energy in a phone charge (about 12 Wh) by the energy in one prompt. With Google’s median of 0.24 Wh: 12 ÷ 0.24 = 50.',
   honors:'Prompts per charge = phone energy ÷ energy per prompt. Then scale: total = prompts per person × people × days × energy per prompt.'},
  compare(sim,g,m){const n=sim.p.perDay,E=eSrc(sim),you=n*E.wh,sch=SCHOOL*n*E.wh,ch=you/phone(sim),off=Math.abs(g.guess-m.guess);
   let s='';
   if(off<=0.15*m.guess)s=`Your gut was right on, within ${n0(off)} prompts. You already sense that one prompt is a small slice of a phone charge. `;
   else if(g.guess<m.guess)s=`You guessed ${n0(g.guess)}; the math says about ${sig(m.guess)}. <b>Your gut made one prompt look about ${sig(m.guess/g.guess)} times bigger</b> than ${E.s} reports. `;
   else s=`You guessed ${n0(g.guess)}; the math says about ${sig(m.guess)}. <b>Your gut made one prompt look about ${sig(g.guess/m.guess)} times smaller</b> than ${E.s} reports. `;
   s+=`In real terms, your ${n} prompts a day use ${fmt(you,'wh')}: ${sig(ch)} of a phone charge, or about ${n0(you/LED*60)} minutes of an LED bulb. But a school about RJ’s size at that rate uses ${fmt(sch,'wh')} a day, about ${n0(sch/phone(sim))} phone charges, or ${sig(sch/1000/CO_DAY)} days${sch/1000/CO_DAY<1?' (about '+Math.round(24*sch/1000/CO_DAY)+' hours)':''} of an average Colorado home’s electricity (about ${sig(CO_DAY)} kWh a day). One prompt is small; the totals are what grow.`;
   const K=sim.ui.calc;if(K&&K.done&&K.correct)s+=' You did the division yourself, so you can check the next headline’s number the same way.';return s;},
  again(sim){const R=a=>a[Math.floor(Math.random()*a.length)];sim.p.perDay=R([5,10,20,30,50]);sim.p.count=atLeast('honors')?R(['google','altman']):'google';sim.p.guess=5;sim.p.reveal=false;sim.p.show='energy';}
 },
 challenges:[
  {lvl:'bio',kind:'num',q:'A friend’s phone battery holds about 15 Wh. Using Google’s 0.24 Wh per text prompt, how many prompts use as much energy as one full charge of that phone?',answer:62.5,tol:0.5,unit:'prompts',d:1,hint:'Divide the phone’s energy by one prompt’s energy. Both are in Wh.',explain:'15 Wh ÷ 0.24 Wh = 62.5 prompts. A bigger battery holds more prompts’ worth of energy: 12 Wh held 50.'},
  {lvl:'bio',instant:true,q:'Google reports 0.26 mL of water per text prompt. Mistral reports 45 mL per response. What explains the gap?',choices:['Mistral’s chatbot uses about 170 times more water','They count different things and measure different models','One company made an arithmetic mistake'],correct:1,explain:'Google counted serving the prompt. Mistral ran a life-cycle analysis, which also counts things like making the hardware. The models and data centers differ too. 45 ÷ 0.26 ≈ 173, but most of that gap is about what each company chose to count, and there is no shared standard to settle it.'},
  {lvl:'bio',instant:true,q:'A school of about 1,700 students sends 20 prompts each per day at 0.24 Wh. About how many phone charges (12 Wh) is that per day?',choices:['About 7','About 68','About 680','About 68,000'],correct:2,explain:'1,700 × 20 × 0.24 Wh = 8,160 Wh = 8.16 kWh. 8,160 ÷ 12 = 680 phone charges a day. One prompt is tiny; a whole school adds up.'},
  {lvl:'honors',instant:true,q:'Google says the energy of its median prompt fell 33 times in 12 months. About how much did that prompt use a year earlier?',choices:['About 0.007 Wh','About 0.27 Wh','About 8 Wh'],correct:2,explain:'0.24 Wh × 33 ≈ 7.9 Wh, about two-thirds of a 12 Wh phone charge. Per-prompt efficiency can change fast, which is one reason a single number goes out of date.'},
  {lvl:'honors',instant:true,q:'If all 8 billion people sent 20 prompts a day at 0.24 Wh for a full year, how would that compare with all data centers in 2024 (about 415 TWh)?',choices:['About 0.03% of it','About 3% of it','About 3 times as much'],correct:1,explain:'8 billion × 20 × 0.24 Wh × 365 ≈ 14.0 TWh. 14.0 ÷ 415 ≈ 3.4%. Data centers run far more than chatbots, and their total is what is growing.'},
  {lvl:'ap',instant:true,q:'The IEA reported about 415 TWh for data centers in 2024 and projects about 945 TWh by 2030. What average yearly growth rate does that imply?',choices:['About 2% a year','About 15% a year','About 38% a year'],correct:1,explain:'(945 ÷ 415)^(1/6) − 1 = 2.277^(1/6) − 1 ≈ 0.147, about 15% a year. At that rate the total roughly doubles about every 5 years.'},
  {lvl:'ap',instant:true,q:'Lawrence Berkeley National Lab reported US data centers used about 176 TWh in 2023, about 4.4% of US electricity. About how much electricity did the whole US use?',choices:['About 770 TWh','About 4,000 TWh','About 40,000 TWh'],correct:1,explain:'176 ÷ 0.044 = 4,000 TWh. If total use stayed near that, the projected 6.7% to 12% share by 2028 would be about 270 to 480 TWh.'}
 ],
 tour:[
  {title:'One prompt',text:'Google reported that its median text prompt uses 0.24 Wh of electricity, 0.26 mL of water and 0.03 g of CO₂e. That counts serving the prompt in the data center.',focus:[226,0,574,74],pause:true,setup:sim=>{sim.st.peek=0;BioLab.setValues(sim,{count:'google',show:'energy',perDay:20,reveal:false});}},
  {title:'One phone charge',text:'A full phone charge is about 12 Wh. 12 ÷ 0.24 = 50, so about 50 of those prompts use the energy of one phone charge. Each slice of the phone is one prompt.',focus:[0,0,226,450],pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'You, for one day',text:'Twenty prompts a day is 20 × 0.24 = 4.8 Wh: 0.4 of a phone charge, or an LED bulb (about 10 W) left on for about 29 minutes.',focus:[226,74,574,140],pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'Scale it up',text:'A class of 30 at that rate: 144 Wh, 12 phone charges. A school about RJ’s size (1,700 students): 8.16 kWh, about 680 phone charges, every day. Everyone on Earth: about 38 GWh a day.',focus:[226,140,574,310],pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'A log scale',text:'The bars use a log scale: each grid line is 10 times the last. That is the only way one prompt and the whole world fit on the same picture.',pause:true,setup:sim=>{sim.st.peek=1;}},
  {title:'What’s counted',text:'Now the same kind of prompt by Mistral’s life-cycle count: 45 mL of water per response, about 170 times Google’s 0.26 mL. Mistral also counted things like making the hardware, and it is a different model. Mistral did not report energy at all.',pause:true,setup:sim=>{sim.st.peek=1;BioLab.setValues(sim,{count:'mistral',show:'water'});}},
  {lvl:'honors',title:'The real growth',text:'All data centers worldwide used about 415 TWh in 2024, about 1.5% of the world’s electricity, and the IEA projects about 945 TWh by 2030. One prompt is small. The totals are what grow: from 415 TWh to a projected 945 TWh in six years.',pause:true,setup:sim=>{sim.st.peek=1;BioLab.setValues(sim,{count:'google',show:'energy'});}}
 ],
 onTourExit(sim){sim.st.peek=0;},
 lab:{bio:'<p><b>Question:</b> When does AI use add up to something you would notice?</p><ol><li>Turn on <b>Show the answers now</b>. Keep Google’s serving count.</li><li>Record a trial at 5, 20 and 50 prompts a day.</li><li>For each, write down your daily phone charges and the school’s daily phone charges.</li></ol><p>Write one sentence: at what scale does the energy start to matter?</p>',
  honors:'<p><b>Question:</b> How much does the choice of what to count change the answer?</p><ol><li>Show water. Record your daily water under each “What’s counted” option.</li><li>Do the same for CO₂.</li><li>Note which numbers each source did not report.</li></ol><p>Does a headline that says “one prompt uses X” tell you enough to compare two sources? Use the gap between two of your numbers.</p>',
  ap:'<p><b>Question:</b> How big would chat prompts be in the world’s data-center budget?</p><ol><li>Set <b>A year of days like this</b>. Record “Everyone on Earth” and its share of 2024 data centers at 10, 20 and 50 prompts a day.</li><li>Change the phone charge from 10 to 15 Wh and note which numbers move.</li></ol><p><b>CER:</b> Claim whether per-prompt efficiency or total growth matters more for the grid, using the IEA 2024 and 2030 figures as evidence.</p><p>Optional: Pope Francis’s encyclical <i>Laudato si’</i> (2015) asks readers to care for “our common home.” Does per-prompt efficiency or total growth matter more for that? Use the IEA numbers, and argue either way.</p>'},
 terms:[
  {t:'Watt-hour (Wh)',d:'Energy used by something drawing 1 watt for 1 hour. 1 kWh = 1,000 Wh; 1 TWh = 1 billion kWh.'},
  {t:'Data center',d:'A building full of computers (servers) that run websites and AI models, with cooling systems that often use water.'},
  {t:'CO₂e',d:'Carbon dioxide equivalent: greenhouse gases counted as the amount of CO₂ that would warm the climate the same.'},
  {t:'Median',d:'The middle value: half of prompts use more, half use less. A median says nothing about the total.',lvl:'honors'},
  {t:'Life-cycle analysis',d:'Counting the impacts of every stage of a product, from making the hardware to using it, not just running it.',lvl:'honors'},
  {t:'System boundary',d:'The line that decides which stages and sources a footprint counts. Change it and the number changes.',lvl:'ap'},
  {t:'Log scale',d:'An axis where each step multiplies by the same factor (here 10), so tiny and huge numbers fit on one picture.',lvl:'honors'}
 ],
 about:'<p><b>All per-prompt numbers are company self-reports.</b> They are not standardized, they count different things, and outsiders cannot check them.</p><ul><li><b>Google</b> (Aug 21, 2025): its median Gemini text prompt uses 0.24 Wh, 0.26 mL of water and 0.03 g CO₂e, and energy per prompt fell 33 times in 12 months (<a href="https://arxiv.org/abs/2508.15734" target="_blank" rel="noopener">arXiv 2508.15734</a>). Critics note it is a median, covers text only, and gives no total number of prompts.</li><li><b>OpenAI CEO Sam Altman</b> (Jun 10, 2025): an average ChatGPT query uses about 0.34 Wh and about 0.000085 gallons of water (about 0.32 mL). No methodology was published, and no CO₂ figure was given.</li><li><b>Mistral</b> (Jul 2025): its life-cycle analysis of Mistral Large 2 reports 1.14 g CO₂e and 45 mL of water for one 400-token response. Mistral describes these as the marginal impacts of inference, measured with a life-cycle method that also counts things like making the hardware; it did not report energy per response. In the same report, the stage Mistral’s chart labels model training and inference made up 85.5% of emissions and 91% of water over the model’s life cycle. Some news reports describe that share as training alone; Mistral did not split it.</li><li><b>IEA</b> (Apr 2025): data centers used about 415 TWh in 2024, about 1.5% of world electricity, projected to reach about 945 TWh by 2030. <b>Lawrence Berkeley National Lab</b> (Dec 2024): US data centers used about 176 TWh in 2023, about 4.4% of US electricity, possibly 6.7% to 12% by 2028.</li></ul><p><b>Assumptions for comparison, not measurements:</b> a full phone charge ≈ 12 Wh (battery mAh × about 3.85 V ÷ 1000 gives roughly 12 to 15 Wh for a 3,000 to 4,000 mAh phone; charging losses add a little). An LED bulb ≈ 10 W, so one hour ≈ 10 Wh. One minute of a hot shower ≈ 8 L (a US showerhead may be rated up to 2.5 gallons, about 9.5 L, per minute; many use less). An average Colorado home used 674 kWh of electricity a month in 2024 (U.S. Energy Information Administration, “2024 Average Monthly Bill, Residential,” <a href="https://www.eia.gov/electricity/sales_revenue_price/pdf/table_5A.pdf" target="_blank" rel="noopener">eia.gov table 5A</a>), so 674 × 12 ÷ 365 ≈ 22.2 kWh a day; a real home varies with size, season and heating. A class is 30 students; “a school about RJ’s size” is 1,700 students; the world is about 8 billion people. “Everyone on Earth” is a what-if, not a measurement: most people do not use AI chat every day.</p><p>The tool treats the per-prompt number as fixed. Real prompts vary a lot: long answers, images, video and reasoning models can use far more than a median text prompt.</p>'
};
BioLab.register(SIM);
})();
