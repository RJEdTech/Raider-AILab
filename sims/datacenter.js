(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Who pays for the data center? The headline, then the math behind it.
   Bills (illustrative utility): 1,000,000 homes using 10 TWh a year share $700M a year of fixed grid costs. A data center using E TWh a year
   joins. Fixed costs are now split by energy used, so homes pay 700 × 10 ÷ (10 + E). Serving it needs new grid costs of c per TWh
   (spare grid: $20M; tight grid: $150M). Regulators charge the data center a share a of those new costs; homes pay the rest.
   Change per home per year = [700 × 10 ÷ (10 + E) + (1 − a) × c × E − 700] million ÷ 1,000,000 homes.
   Water: equivalent people = gallons a day ÷ 100 (a 5-million-gallon-a-day data center is about a city of 50,000, Lincoln Institute).
   Power-plant water for gas power adds about 80% (Southern Alliance for Clean Energy). All real facts are named in About. */
const HOMES=1e6,EH=10,F=700;
const C={spare:20,tight:150};
const homesShare=sim=>F*EH/(EH+sim.p.size);
const newCost=sim=>C[sim.p.grid]*sim.p.size;
const homeTotal=sim=>homesShare(sim)+(1-sim.p.charge/100)*newCost(sim);
const perHome=sim=>(homeTotal(sim)-F)*1e6/HOMES;
const gal=sim=>sim.p.cooling==='closed'?7000:sim.p.gallons;
const galAll=sim=>gal(sim)*(sim.p.indirect?1.8:1);
const people=sim=>galAll(sim)/100;
/* Texas Water Development Board, 2022 estimates: 7.6M acre-feet irrigation (50%), 5.1M municipal (34%); manufacturing 8%, power 4%, mining 3%, livestock 2%. 1 acre-foot = 325,851 gallons. Total ≈ 15.2M acre-feet ≈ 4,953 billion gallons. */
const TXW=[['Irrigation (farms)',2476,'s3'],['Cities and homes',1662,'s2'],['Manufacturing',396,'s4'],['Power plants',198,'s5'],['Mining',149,'s6'],['Livestock',99,'s6']];
const TXTOTAL=4953;
const CARDS=[
 {h:'“Data centers are driving up your electric bill.”',r:'Rates are rising. But one study found data centers slightly lowered average rates from 2015 to 2024, and others warn of rises where new plants are needed. It depends on the grid and on who regulators make pay.'},
 {h:'“A data center uses as much water as a city.”',r:'The largest use up to about 5 million gallons a day, like a city of 50,000. A closed-loop design near Rio Hondo, Texas says it needs about 7,000 a day.'},
 {h:'“Texas data centers use more water than Austin.”',r:'A 2025 projection: 49 billion gallons that year, up to 399 billion by 2030. A projection, not a measurement.'},
 {h:'“South Padre Island’s data center uses more water than the town.”',r:'We found no data center on the island and no source for this. The Cameron County projects are near Harlingen and Rio Hondo.'}
];

const SIM={
 id:'datacenter',hash:'datacenter',apUnit:4,order:3,tab:'Who pays for the data center?',kind:'Simulation',
 card:'Data centers for AI are in the news for electric bills and water. Start with the headline, then do the math behind it: who pays, and how much water is really used.',
 title:'Who pays for the data center? The headline and the math',
 lede:{bio:'AI runs in data centers: huge buildings full of computers that need electricity and cooling. Headlines say they raise your electric bill and drink up towns’ water. Some of that is true somewhere, some is not, and a lot depends on choices people make. Read each headline, then work out the math behind it.',
  honors:'Whether a data center raises home bills depends on two things the headline leaves out: whether the grid already has spare capacity, and how regulators split the new costs. Water depends on the cooling design and the water source.',
  ap:'With fixed costs F shared by energy and new costs cE, the home share is F·E_h ÷ (E_h + E) + (1 − a)cE. Bills fall when spreading fixed costs saves more than the homes’ share of new costs.'},
 skills:{bio:'Sharing a cost by percent, and unit rates · Pre-algebra',honors:'Proportional sharing and comparing two effects · Algebra 1',ap:'Rational functions and break-even points · Algebra 1, Algebra 2'},
 scale:'One made-up utility: 1,000,000 homes using 10 terawatt-hours (TWh) a year, sharing $700 million a year of grid costs. The utility is invented so the math is checkable; the headlines and research are real (see About).',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The data center',
 controls:[
  {id:'guess',label:'Your gut: does a new data center always raise home electric bills?',type:'seg',def:'always',options:[{v:'always',l:'Yes, always'},{v:'depends',l:'It depends'},{v:'never',l:'No, never'}]},
  {id:'view',label:'Show',type:'seg',def:'bill',options:[{v:'headline',l:'Headlines'},{v:'bill',l:'Electric bills'},{v:'water',l:'Water'},{v:'perspective',l:'In perspective'}],noGut:true},
  {id:'year',label:'Data center water: which year',type:'seg',def:'2025',options:[{v:'2025',l:'2025 projection'},{v:'2030',l:'2030 high projection'}],noGut:true},
  {id:'size',label:'Data center electricity use',type:'range',min:0,max:8,step:0.5,def:3,unit:'TWh a year',noGut:true,onChange:DK.clearGut},
  {id:'grid',label:'The grid today',type:'seg',def:'tight',options:[{v:'spare',l:'Has spare capacity'},{v:'tight',l:'Needs new plants and lines'}],noGut:true,onChange:DK.clearGut},
  {id:'charge',label:'Share of new costs charged to the data center',type:'range',min:0,max:100,step:5,def:50,unit:'%',noGut:true,onChange:DK.clearGut},
  {id:'gallons',label:'Water for cooling, per day',type:'range',min:500000,max:5000000,step:250000,def:2000000,unit:'gallons',noGut:true},
  {id:'cooling',label:'Cooling design',type:'seg',def:'open',options:[{v:'open',l:'Evaporative (uses water up)'},{v:'closed',l:'Closed loop (reuses it)'}],noGut:true},
  {id:'indirect',label:'Count water used at the power plant too',type:'toggle',def:false,noGut:true}
 ],
 actions:[{id:'fair',label:'Charge the data center all new costs',primary:true,run(sim){BioLab.setValues(sim,{view:'bill',charge:100});DK.clearGut(sim);}}],
 init(){return {t:0};},
 step(sim,dt){sim.st.t+=Math.min(dt,0.1);},
 metrics:[
  {id:'home',label:'Change per home per year',unit:'$',d:2,min:-300,max:400,get:sim=>DK.pend(sim)?null:perHome(sim)},
  {id:'oldshare',label:'Homes’ share of old grid costs',unit:'$ million',d:1,max:null,get:sim=>homesShare(sim)},
  {id:'newhomes',label:'New costs paid by homes',unit:'$ million',d:1,max:null,get:sim=>(1-sim.p.charge/100)*newCost(sim)},
  {id:'water',label:'Water per day',unit:'gallons',d:0,max:null,get:sim=>galAll(sim)},
  {id:'people',label:'Same as the daily use of',unit:'people',d:0,max:null,get:sim=>people(sim)}
 ],
 graphs:[{id:'charge',label:'Bill change vs share charged',custom:true}],defaultGraph:'charge',
 plot(sim,ctx,box){const ax=axes(ctx,box,{xmin:0,xmax:100,ymin:-200,ymax:400,xl:'% of new costs charged to the data center',yl:'$ per home per year'});
  ctx.strokeStyle=PAL['line'];ctx.beginPath();ctx.moveTo(ax.X(0),ax.Y(0));ctx.lineTo(ax.X(100),ax.Y(0));ctx.stroke();
  ['spare','tight'].forEach((g,i)=>{ctx.strokeStyle=i?PAL['s1']:PAL['s3'];ctx.lineWidth=2.5;ctx.beginPath();for(let a=0;a<=100;a+=5){const v=(F*EH/(EH+sim.p.size)+(1-a/100)*C[g]*sim.p.size-F);const x=ax.X(a),y=ax.Y(v);a?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});
  if(!DK.pend(sim)){ctx.fillStyle=PAL['cv-ink'];ctx.beginPath();ctx.arc(ax.X(sim.p.charge),ax.Y(perHome(sim)),5,0,7);ctx.fill();}},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,stg=DK.stage(sim),hide=DK.pend(sim),v=sim.p.view;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  if(v==='headline'){DK.card(ctx,8,8,784,434);txt(ctx,'The headline, then what is behind it',22,8+22*kk,{s:13*kk,w:700});
   let y=46*kk;CARDS.slice(0,bg?2:4).forEach((c,i)=>{const hh=bg?176:92;DK.card(ctx,18,y,764,hh,{fill:PAL['card2'],r:8});
    DK.para(ctx,c.h,30,y+20*kk,(bg?740:260),{s:12.5*kk,w:700,c:PAL['s1'],maxY:y+hh-6});
    DK.para(ctx,c.r,bg?30:300,bg?y+56*kk:y+20,bg?740:470,{s:12*kk,maxY:y+hh-6});y+=hh+8;});
   if(stg===1)DK.flag(ctx,8,8,784,434);return;}
  if(v==='perspective'){DK.card(ctx,8,8,784,434);txt(ctx,bg?'Texas water, per year':'Texas water use per year, in billions of gallons',22,8+22*kk,{s:13*kk,w:700});
   const rows=TXW.concat([[sim.p.year==='2030'?'Data centers (2030, high)':'Data centers (2025)',sim.p.year==='2030'?399:49,'s1']]);
   const L=bg?230:250,R=bg?680:740,mx=2500;let y=52*kk;const rh=bg?44:46;
   rows.forEach(r=>{txt(ctx,r[0],L-10,y+16,{s:12.5*kk,w:700,a:'right',c:r[2]==='s1'?PAL['s1']:PAL['cv-ink']});const w=(R-L)*r[1]/mx;ctx.fillStyle=PAL[r[2]];rr(ctx,L,y+2,Math.max(3,w),22,4);ctx.fill();txt(ctx,DK.n(r[1],0),L+Math.max(3,w)+8,y+18,{s:12.5*kk,w:700});y+=rh;});
   y+=6;const pc=(sim.p.year==='2030'?399:49)/TXTOTAL*100;txt(ctx,'Data centers ≈ '+DK.n(pc,1)+'% of Texas’s 2022 water use',22,y+10,{s:13.5*kk,w:700,c:PAL['s1']});
   if(!bg)DK.para(ctx,'Small statewide can still matter locally: what counts is size, growth, where the water comes from, and who can act. Irrigation is the largest use by far.',22,y+30,740,{s:12,c:PAL['cv-soft']});
   if(stg===7)DK.flag(ctx,16,44,768,y-30);return;}
  if(v==='bill'){
   /* left: the bill split */
   const W1=bg?400:440;DK.card(ctx,8,8,W1,434);txt(ctx,bg?'Who pays':'Who pays the grid’s costs',22,8+22*kk,{s:13*kk,w:700});
   const L=40,R=W1-30,T=60*kk,B=350,mx=1200,X=R-L,Y=v=>B-(B-T)*v/mx;
   const col=(x,w,parts,lab)=>{let y0=B;parts.forEach(p=>{const h=(B-T)*p[0]/mx;ctx.fillStyle=p[1];rr(ctx,x,y0-h,w,h,3);ctx.fill();if(h>20&&!bg)txt(ctx,p[2],x+w/2,y0-h/2+4,{s:12,w:700,c:'#fff',a:'center'});y0-=h;});txt(ctx,lab,x+w/2,B+18*kk,{s:12.5*kk,w:700,a:'center'});};
   const w=(X-40)/2;col(L,w,[[F,PAL['s2'],'Old costs: $700M']],'Before');
   const dcOld=F-homesShare(sim),dcNew=sim.p.charge/100*newCost(sim),hNew=(1-sim.p.charge/100)*newCost(sim);
   col(L+w+40,w,[[homesShare(sim),PAL['s2'],'Homes: old'],[hNew,PAL['s1'],'Homes: new'],[dcOld+dcNew,PAL['s4'],'Data center']],'After');
   if(stg===2)DK.flag(ctx,L+w+36,T,w+8,B-T);
   /* right: per home */
   const Xr=8+W1+10,Wr=792-Xr;DK.card(ctx,Xr,8,Wr,434);let y=8+24*kk;
   txt(ctx,'One home’s yearly bill',Xr+14,y,{s:13*kk,w:700});y+=34*kk;
   const ph=perHome(sim);txt(ctx,hide?'?':(ph>=0?'+$':'−$')+DK.n(Math.abs(ph),2),Xr+14,y,{s:28*kk,w:800,c:ph>0?PAL['s1']:PAL['s3']});y+=24*kk;
   txt(ctx,hide?'':ph>0?'higher than before':'lower than before',Xr+14,y,{s:12.5*kk,c:PAL['cv-soft']});y+=30*kk;
   if(stg===3||stg===4)DK.flag(ctx,Xr+6,y-96*kk,Wr-12,98*kk);
   txt(ctx,'Grid: '+(sim.p.grid==='spare'?'spare capacity':'needs new plants'),Xr+14,y,{s:12.5*kk,w:600});y+=22*kk;
   txt(ctx,'Data center pays '+sim.p.charge+'% of new costs',Xr+14,y,{s:12.5*kk,w:600});y+=26*kk;
   if(!bg)DK.para(ctx,'Spreading old costs over more electricity lowers each home’s share. New plants and lines raise costs. Who pays for them is a choice regulators make.',Xr+14,y,Wr-28,{s:12,c:PAL['cv-soft']});
   if(stg===5)DK.flag(ctx,Xr+6,y-52*kk,Wr-12,54*kk);
  }else{
   DK.card(ctx,8,8,784,434);txt(ctx,bg?'Water':'Where the water goes',22,8+22*kk,{s:13*kk,w:700});
   const g=galAll(sim),pp=people(sim);let y=70*kk;
   txt(ctx,DK.n(g,0)+' gallons a day',22,y,{s:22*kk,w:800,c:PAL['s2']});y+=30*kk;
   txt(ctx,'About the daily use of '+DK.n(pp,0)+' people',22,y,{s:14*kk,w:700});y+=34*kk;
   const n=Math.min(200,Math.round(pp/250)),cols=bg?20:40;for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols);DK.person(ctx,30+c*(bg?36:18),y+20+r*30,bg?22:16,'helper');}
   y+=Math.ceil(n/cols)*30+30;if(!bg)txt(ctx,'Each figure is 250 people.',22,y,{s:12,c:PAL['cv-soft']});y+=26;
   if(!bg)DK.para(ctx,sim.p.cooling==='closed'?'Closed loop: the water circulates and is reused, so daily use is small (about 7,000 gallons a day for the Rio Hondo, Texas campus).':'Evaporative cooling uses water up. Using treated wastewater instead of drinking water, like Harlingen’s 4.6-million-gallon-a-day deal, changes whose water it is.',22,y,740,{s:12.5,c:PAL['cv-soft']});
   if(stg===6)DK.flag(ctx,16,50,768,110);
  }
 },
 narrate(sim){if(DK.pend(sim))return 'Work out what happens to one home’s yearly bill: its smaller share of old costs, plus its share of the new ones.';
  if(sim.p.view==='headline')return 'Each headline holds some truth and leaves something out. <b>Read the headline, then ask: compared to what, where, and who pays?</b>';
  if(sim.p.view==='perspective')return `Texas data centers were projected to use ${sim.p.year==='2030'?'up to 399':'49'} billion gallons ${sim.p.year==='2030'?'in 2030':'in 2025'}, about <b>${DK.n((sim.p.year==='2030'?399:49)/TXTOTAL*100,1)}%</b> of the state’s 2022 water use; farms used about half. <b>Prioritizing means comparing:</b> size, growth, where it happens, and what we can change.`;
  if(sim.p.view==='water')return `${sim.p.cooling==='closed'?'A closed-loop design':'Evaporative cooling'} uses about <b>${DK.n(galAll(sim),0)} gallons a day</b>, the daily use of about ${DK.n(people(sim),0)} people${sim.p.indirect?', counting the power plant':''}. Design and water source matter as much as size.`;
  const ph=perHome(sim);
  return `With a grid that ${sim.p.grid==='spare'?'has spare capacity':'needs new plants and lines'} and the data center paying ${sim.p.charge}% of new costs, each home’s bill goes <b>${ph>0?'up':'down'} about $${DK.n(Math.abs(ph),0)} a year</b>. Same data center, different choices, different answer.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'A big data center is coming to town. Headlines say your electric bill will go up. Does a new data center always raise home electric bills?'},
  lock(sim){return {v:sim.p.guess==='depends'?0:1,pick:sim.p.guess,label:{always:'Yes, always',depends:'It depends',never:'No, never'}[sim.p.guess]};},
  solve(sim){sim.p.guess='depends';sim.p.view='bill';return {v:0,pick:'depends',label:'It depends on the grid and who pays'};},
  hint:{bio:'Lock in your gut. Then you will work out one home’s bill change yourself.'},
  calc:{unit:'$',d:2,tol:0.6,
   prompt:{bio:sim=>`Homes now share old costs with the data center: $700M × 10 ÷ ${DK.n(10+sim.p.size,1)} = $${DK.n(homesShare(sim),1)}M. New plants cost $${DK.n(newCost(sim),0)}M, and homes pay ${100-sim.p.charge}% of that. There are 1,000,000 homes. How much does <b>one home’s yearly bill change</b> from the $700M before?`,ap:sim=>`Find [F·E_h/(E_h + E) + (1 − a)cE − F] ÷ 10⁶ homes, with F = $700M, E_h = 10, E = ${sim.p.size}, c = $${C[sim.p.grid]}M, a = ${sim.p.charge/100}.`},
   answer:sim=>perHome(sim),
   hint:'Add the homes’ share of old costs and their share of new costs, subtract $700 million, then divide by 1,000,000 homes. A drop is negative.',
   steps(sim){const hn=(1-sim.p.charge/100)*newCost(sim);return [`Homes’ share of old costs: $${DK.n(homesShare(sim),2)}M.`,`Homes’ share of new costs: ${100-sim.p.charge}% × $${DK.n(newCost(sim),0)}M = $${DK.n(hn,2)}M.`,`Total $${DK.n(homeTotal(sim),2)}M − $700M = $${DK.n(homeTotal(sim)-F,2)}M ÷ 1,000,000 homes = <b>${perHome(sim)>=0?'+':'−'}$${DK.n(Math.abs(perHome(sim)),2)}</b> a home a year.`];}},
  formula(sim){return `[700 × 10 ÷ ${DK.n(10+sim.p.size,1)} + ${DK.n(1-sim.p.charge/100,2)} × ${DK.n(newCost(sim),0)} − 700] ÷ 1 = ${perHome(sim)>=0?'+':'−'}$${DK.n(Math.abs(perHome(sim)),2)} per home`;},
  how:{bio:'Two effects pull in opposite directions: more customers to share old costs, and new costs to build for them. Add the homes’ part of each and compare with before.',ap:'Δ = F·E_h/(E_h + E) − F + (1 − a)cE. Bills fall exactly when (1 − a)cE < F·E/(E_h + E).'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You worked out the bill yourself.':'';
   return (g.pick==='depends'?'Your gut was right. ':'The real answer is: it depends. ')+`Here, each home pays about <b>${perHome(sim)>=0?'$'+DK.n(perHome(sim),0)+' more':'$'+DK.n(-perHome(sim),0)+' less'}</b> a year. Switch to a grid with spare capacity, or charge the data center all new costs, and bills fall. Research has found both: a 2026 study found data centers slightly lowered average rates from 2015 to 2024, and Oregon now charges data centers more so homes pay less.`+self;},
  again(sim){sim.p.guess='always';sim.p.view='bill';sim.p.grid=Math.random()<.5?'tight':'spare';sim.p.charge=[0,25,50,75][Math.floor(Math.random()*4)];sim.p.size=[2,3,4,5][Math.floor(Math.random()*4)];}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Why can a new data center sometimes lower home electric rates?',choices:['It gives away free power','The grid’s existing costs get shared with a big new customer, so each home’s share shrinks, if little new building is needed','Data centers make electricity'],correct:1,explain:'Spreading fixed costs over more electricity lowers each customer’s share. This is the effect a 2026 EPRI study found on average from 2015 to 2024.'},
  {lvl:'bio',instant:true,q:'When is a data center most likely to raise home bills?',choices:['When the grid needs new plants and lines and homes are charged for much of it','When it uses closed-loop cooling','Never'],correct:0,explain:'New building is expensive. Whether homes pay for it depends on how regulators split the costs.'},
  {lvl:'bio',kind:'num',q:'A data center uses 1,000,000 gallons of water a day. If a person uses about 100 gallons a day, that equals the daily use of how many people?',answer:10000,tol:0,unit:'people',d:0,hint:'1,000,000 ÷ 100.',explain:'10,000 people, a small town.'},
  {lvl:'honors',instant:true,q:'In 2026, Oregon regulators set new rates for one utility. What happened?',choices:['All rates rose equally','Data center rates rose an average of 29% while home rates fell 1.3%','Data centers paid nothing'],correct:1,explain:'Cost allocation is a choice. Oregon chose to charge large new loads more.'},
  {lvl:'honors',kind:'num',q:'Counting power-plant water adds about 80% for gas power. A data center uses 2,000,000 gallons a day on site. Total with the power plant?',answer:3600000,tol:0,unit:'gallons',d:0,hint:'2,000,000 × 1.8.',explain:'3.6 million gallons a day. Headlines often count only one of the two.'},
  {lvl:'ap',kind:'num',q:'Tight grid ($150M per TWh), E = 3 TWh. What share a (in %) charged to the data center makes the home bill change exactly zero?',answer:64.1,tol:0.3,unit:'%',d:1,hint:'Solve 538.46 + (1 − a) × 450 = 700.',explain:'(1 − a) × 450 = 161.54, so 1 − a = 0.359 and a ≈ 64.1%.'},
  {lvl:'honors',kind:'num',q:'Texas used about 4,953 billion gallons of water in 2022. Data centers were projected to use 49 billion in 2025. What percent is that? (Round to one decimal.)',answer:1.0,tol:0.05,unit:'%',d:1,hint:'49 ÷ 4,953 × 100.',explain:'About 1.0%. Farms used about 50%. That does not make data centers unimportant: the high 2030 projection is about 8%, and local supply matters most.'},
  {lvl:'bio',instant:true,q:'Which is the best way to decide how worried to be about a new water use?',choices:['How scary the headline sounds','Compare its size with other uses, check whether it is growing, and look at where the water comes from','Ignore it if it is small'],correct:1,explain:'Prioritizing means comparing size, growth, location and what can be changed, not reacting to the loudest story.'},
  {lvl:'ap',instant:true,q:'A headline says, “Texas data centers will use more water than Austin.” What is the most important thing to check first?',choices:['Whether it is a measurement or a projection, and what it counts','Who wrote it','Whether Austin is big'],correct:0,explain:'The 49-billion-gallon figure for 2025 was a projection from a Houston research study. Projections depend on their assumptions.'}
 ],
 tour:[
  {title:'The headlines',text:'Data centers for AI are in the news: higher bills, thirsty towns. Each headline holds some truth and leaves something out. Start with what it says, then do the math.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{view:'headline'});}},
  {title:'Who pays the grid',text:'A utility’s grid costs are shared by its customers. Before: homes pay all $700 million. After: a data center joins, and the old costs are split by electricity used.',pause:true,setup:sim=>{sim.tst=2;BioLab.setValues(sim,{view:'bill',size:3,grid:'tight',charge:50});}},
  {title:'New plants cost money',text:'This grid needs new plants and lines: $450 million. If homes pay half, each home’s bill rises about $63 a year.',pause:true,setup:sim=>{sim.tst=3;}},
  {title:'Same data center, different choices',text:'If the grid already has spare capacity, the shared old costs win and bills fall about $131 a year. The grid’s condition changes the answer.',pause:true,setup:sim=>{sim.tst=4;BioLab.setValues(sim,{grid:'spare'});}},
  {title:'Who pays is a choice',text:'Back to the tight grid. Charge the data center all the new costs, and home bills fall. In 2026, Oregon raised data center rates 29% and cut home rates 1.3%.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{grid:'tight',charge:100});}},
  {lvl:'honors',title:'Put it in perspective',text:'Texas used about 4,950 billion gallons of water in 2022, half for farms. Data centers were projected at 49 billion in 2025, about 1%, but up to 399 billion by 2030. Compare size and growth before deciding what worries you most.',pause:true,setup:sim=>{sim.tst=7;BioLab.setValues(sim,{view:'perspective',year:'2025'});}},
  {title:'Water depends on design',text:'Evaporative cooling can use millions of gallons a day, like a city. A closed loop reuses its water. Treated wastewater is not drinking water. Ask which one before you believe the headline.',pause:true,setup:sim=>{sim.tst=6;BioLab.setValues(sim,{view:'water',cooling:'open',gallons:2000000});}}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> What makes a data center raise or lower home bills?</p><ol><li>Record the change per home with a tight grid and 0%, 50% and 100% charged to the data center.</li><li>Repeat with a grid that has spare capacity.</li></ol><p>Write one sentence: is “data centers raise your bill” true, false or “it depends”? Explain with your trials.</p>',
  honors:'<p><b>Question:</b> Check a real headline.</p><ol><li>Find a news story about a data center near you or in Texas.</li><li>Write what it claims, what it counts, and what it leaves out, using this tool’s questions: compared to what, where, and who pays?</li></ol><p>Rewrite the headline so it is accurate.</p>',
  ap:'<p><b>Question:</b> Find the break-even.</p><ol><li>Write the home change Δ as a function of the share a.</li><li>Solve for the break-even a for data centers of 2, 4 and 6 TWh on a tight grid.</li></ol><p><b>CER:</b> Should regulators charge data centers all new costs? Give the strongest argument for and against.</p>'},
 terms:[
  {t:'Data center',d:'A building full of computers that store data and run apps and AI. They need lots of electricity and cooling.'},
  {t:'Grid',d:'The power plants and lines that bring electricity to homes and businesses.'},
  {t:'Rate',d:'The price per unit of electricity, set with the approval of state regulators.'},
  {t:'Cost allocation',d:'How regulators split a utility’s costs among homes, businesses and large customers.',lvl:'honors'},
  {t:'Closed-loop cooling',d:'Cooling that circulates the same water again and again instead of evaporating it.',lvl:'honors'},
  {t:'Fixed costs',d:'Costs that do not change with how much electricity is used, like many power lines.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> An invented utility: 1,000,000 homes using 10 TWh a year share $700M a year of fixed grid costs. A data center using E TWh joins; old costs are split by energy, and new costs of $20M per TWh (spare grid) or $150M per TWh (tight grid) are split by the share a regulators choose. Real rate cases are more complex: different customer classes, demand charges, special large-load tariffs and long contracts.</p><p><b>Bills, both sides of the evidence.</b> EPRI (2026) found, using a causal method, that data centers modestly lowered average U.S. retail electricity rates from 2015 to 2024; a doubling of data center capacity lowered residential prices about 4%. E3 (2026) found the link between load growth and rates regional and complicated. Other analysts warn that bills could rise sharply by 2030 where utilities build new generation and transmission and pass costs to homes, and Consumer Reports notes residential prices rose about 7.3% from April 2025 to April 2026. The EIA expected the average U.S. residential price to rise from 17.3 to 18.2 cents per kWh from 2025 to 2026. In July 2026, Oregon regulators raised Portland General Electric’s data center rates by an average of 29% while lowering residential rates 1.3%, under a 2025 state law.</p><p><b>Water.</b> The largest data centers can use up to about 5 million gallons a day, about as much as a city of 50,000 (Lincoln Institute of Land Policy). A Houston Advanced Research Center and University of Houston study projected Texas data centers would use 49 billion gallons in 2025 and up to 399 billion by 2030. Counting the water used to generate their power adds about 80% for natural gas power (Southern Alliance for Clean Energy).</p><p><b>In perspective.</b> The Texas Water Development Board estimated 2022 water use at 7.6 million acre-feet for irrigation (50%) and 5.1 million for municipal use (34%), with manufacturing 8%, power 4%, mining 3% and livestock 2%; an acre-foot is 325,851 gallons, so the total is about 4,950 billion gallons. Nationally, data centers used about 4.4% of U.S. electricity in 2023 and could use 6.7% to 12% by 2028 (Lawrence Berkeley National Laboratory, 2024).</p><p><b>Cameron County, Texas.</b> Harlingen’s city-owned utility agreed to supply a data center developer with more than 4.6 million gallons a day of treated wastewater (Texas Tribune). Fluidstack’s campus near Rio Hondo says it uses a closed cooling loop with about 7,000 gallons a day of operating demand. SpaceX received a state air permit for a data center in the county after Texas resumed reviews. A separate $1 billion desalination plant planned for South Padre Island would supply 50 million gallons a day across the Rio Grande Valley. We found no data center on South Padre Island.</p>'
};
BioLab.register(SIM);
})();
