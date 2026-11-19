(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Jobs of the future: exposed is not the same as replaced.
   Workers needed = work to be done ÷ work per worker. If AI raises output per worker by g and demand for the work grows by d,
   the change in jobs is (1 + d) ÷ (1 + g) − 1. The student sets g and d; the BLS 2025–35 projection is shown beside it, not fitted.
   BLS facts: projections released Aug 27, 2026; relative AI exposure categories (very high, high, moderate, low) "do not measure"
   employment impacts. Stanford Digital Economy Lab (2025): early-career workers (22–25) in the most AI-exposed jobs saw a 13% relative
   employment decline (16% in a later revision). See About. */
const J={
 csr:{n:'Customer service representatives',s:'Customer service',exp:'Very high',bls:-5.3,open:'289,500',pay:'$44,770',note:'Shrinking, but people leave and retire, so there are still 289,500 openings a year.'},
 swdev:{n:'Software developers',s:'Software dev',exp:'Very high',bls:10.2,open:'95,300',pay:'$135,980',note:'Very exposed to AI, and still growing, because demand for software keeps rising.'},
 np:{n:'Nurse practitioners',s:'Nurse practitioner',exp:'High',bls:41.0,open:'29,400',pay:'$132,300',note:'The fastest-growing job in the projections: an aging population needs care in person.'},
 solar:{n:'Solar panel installers',s:'Solar installer',exp:null,bls:36.5,open:null,pay:null,note:'Hands-on work on roofs, driven by new energy demand, including from AI data centers.'},
 clerk:{n:'Office clerks and admin support',s:'Office admin',exp:'Very high',bls:-4.0,open:'249,000',pay:'$45,010',note:'The office and administrative support group is projected to lose 752,100 jobs, partly from AI tools.'}
};
const ch=sim=>((1+sim.p.demand/100)/(1+sim.p.prod/100)-1)*100;
const workers=sim=>100*(1+sim.p.demand/100)/(1+sim.p.prod/100);

const SIM={
 id:'jobs',hash:'jobs',apUnit:4,order:2,tab:'Jobs of the future',kind:'Simulation',
 card:'Some of the jobs most exposed to AI are still growing. Find out why “exposed” is not “replaced,” and which jobs are growing fastest.',
 title:'Jobs of the future: exposed is not replaced',
 lede:{bio:'You hear that AI will take jobs. The real picture is more interesting. A job is a bundle of tasks. AI can speed some of them up, so each worker gets more done. Whether a job grows or shrinks depends on something else too: does the world want more of that work? Set both, and compare with what the U.S. Bureau of Labor Statistics projects.',
  honors:'Two forces push against each other. AI raises output per worker, which means fewer workers for the same work. But cheaper, faster work can raise demand for it. Software developers are among the most AI-exposed jobs and are projected to grow; customer service is just as exposed and projected to shrink.',
  ap:'Workers needed scale as (1 + d) ÷ (1 + g), where g is the productivity gain and d the demand growth. Jobs grow when d > g. Exposure measures g’s potential, not the outcome.'},
 skills:{bio:'Percent change and comparing two growth rates · Algebra 1',ap:'Ratios of growth factors · Algebra 1, Algebra 2'},
 scale:'100 workers in a job today, and the same job in 10 years. The AI speed-up and demand growth are yours to set. The BLS projections, openings and pay are real (see About).',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The job',
 controls:[
  {id:'guess',label:'Your gut: software developers are among the jobs most exposed to AI. By 2035, does BLS project them to…',type:'seg',def:'shrink',options:[{v:'shrink',l:'Shrink'},{v:'grow',l:'Grow'}]},
  {id:'job',label:'Job',type:'seg',def:'swdev',options:Object.keys(J).map(k=>({v:k,l:J[k].s})),noGut:true},
  {id:'prod',label:'AI speed-up: more work per worker',type:'range',min:0,max:80,step:5,def:30,unit:'%',noGut:true,onChange:DK.clearGut},
  {id:'demand',label:'Growth in how much of this work people want',type:'range',min:0,max:80,step:5,def:40,unit:'%',noGut:true,onChange:DK.clearGut}
 ],
 actions:[{id:'swap',label:'Same speed-up, flat demand',primary:true,run(sim){BioLab.setValues(sim,{demand:0});DK.clearGut(sim);}}],
 init(){return {t:0};},
 step(sim,dt){sim.st.t+=Math.min(dt,0.1);},
 metrics:[
  {id:'change',label:'Change in jobs (your model)',unit:'%',d:1,min:-50,max:80,get:sim=>DK.pend(sim)?null:ch(sim)},
  {id:'workers',label:'Workers needed (from 100)',unit:'',d:0,min:0,max:null,get:sim=>DK.pend(sim)?null:workers(sim)},
  {id:'bls',label:'BLS projection, 2025–35',unit:'%',d:1,min:-50,max:80,get:sim=>DK.pend(sim)&&sim.p.job==='swdev'?null:J[sim.p.job].bls},
  {id:'exp',label:'BLS relative AI exposure',text:true,get:sim=>J[sim.p.job].exp||'Not given in our source'}
 ],
 graphs:[{id:'bls',label:'BLS projected change, 2025–35',custom:true}],defaultGraph:'bls',
 plot(sim,ctx,box){const ks=Object.keys(J),v=ks.map(k=>J[k].bls),h=DK.pend(sim);const ax=axes(ctx,box,{xmin:0,xmax:ks.length,ymin:-10,ymax:45,xl:'',yl:'% change in jobs',xcats:ks.map(k=>J[k].s)});
  bars(ctx,ax,v.map((x,i)=>h&&ks[i]==='swdev'?NaN:x),{colors:v.map(x=>x<0?PAL['s1']:PAL['s3']),d:1});},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,stg=DK.stage(sim),hide=DK.pend(sim),Jb=J[sim.p.job];
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  const W1=bg?430:470;DK.card(ctx,8,8,W1,434);
  txt(ctx,bg?'Today vs 10 years':'Today vs. in 10 years',22,8+22*kk,{s:13*kk,w:700});
  /* work blocks and workers */
  const row=(y,lab,nw,work,per)=>{txt(ctx,lab,22,y,{s:12.5*kk,w:700});const n=Math.round(nw/5),cols=bg?10:20,sz=bg?26:18;
   for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols);DK.person(ctx,30+c*(sz+2)+sz/2,y+14+r*(sz+10)+sz,sz,'helper');}
   const by=y+14+Math.ceil(n/cols)*(sz+10)+6;txt(ctx,'Work to do: '+DK.n(work,0)+' units · '+DK.n(per,1)+' per worker',22,by+12,{s:12*kk,c:PAL['cv-soft']});return by+24;};
  let y=56*kk;y=row(y,'Today: 100 workers',100,100,1);
  if(stg===2)DK.flag(ctx,16,50*kk,W1-16,y-50*kk);
  const w2=workers(sim);y=row(y+10,hide?'In 10 years: ? workers':'In 10 years: '+DK.n(w2,0)+' workers',hide?100:w2,100*(1+sim.p.demand/100),1+sim.p.prod/100);
  if(stg===3||stg===4)DK.flag(ctx,16,y-120,W1-16,120);
  /* right: the job card */
  const X=8+W1+10,W=792-X;DK.card(ctx,X,8,W,434);y=8+24*kk;
  y=DK.para(ctx,Jb.n,X+14,y,W-28,{s:13*kk,w:700});y+=6;
  if(Jb.exp){pill(ctx,'AI exposure: '+Jb.exp,X+14+(bg?100:80),y,Jb.exp==='Very high'?PAL['s4']:PAL['s2'],'#fff',12*kk);y+=28*kk;}
  txt(ctx,'Your model',X+14,y,{s:12.5*kk,c:PAL['cv-soft']});txt(ctx,hide?'?':(ch(sim)>=0?'+':'')+DK.n(ch(sim),1)+'%',X+W-14,y,{s:14*kk,w:700,a:'right',c:ch(sim)>=0?PAL['s3']:PAL['s1']});y+=24*kk;
  const sb=hide&&sim.p.job==='swdev';txt(ctx,'BLS projects',X+14,y,{s:12.5*kk,c:PAL['cv-soft']});txt(ctx,sb?'?':(Jb.bls>=0?'+':'')+DK.n(Jb.bls,1)+'%',X+W-14,y,{s:14*kk,w:700,a:'right',c:Jb.bls>=0?PAL['s3']:PAL['s1']});y+=24*kk;
  if(stg===5)DK.flag(ctx,X+6,y-52*kk,W-12,54*kk);
  if(Jb.open){txt(ctx,'Openings a year',X+14,y,{s:12.5*kk,c:PAL['cv-soft']});txt(ctx,Jb.open,X+W-14,y,{s:13*kk,w:700,a:'right'});y+=22*kk;}
  if(Jb.pay){txt(ctx,'Median pay (2025)',X+14,y,{s:12.5*kk,c:PAL['cv-soft']});txt(ctx,Jb.pay,X+W-14,y,{s:13*kk,w:700,a:'right'});y+=24*kk;}
  if(!bg){y=DK.para(ctx,sb?'':Jb.note,X+14,y+4,W-28,{s:12,c:PAL['cv-soft'],maxY:340});
   DK.para(ctx,'Exposed is not replaced: BLS says its exposure ratings do not measure job losses.',X+14,Math.max(y+10,360),W-28,{s:12,w:700,c:PAL['s2']});}
 },
 narrate(sim){if(DK.pend(sim))return 'Each worker does more with AI, and people want more of the work. Work out how the number of jobs changes.';
  const c=ch(sim),Jb=J[sim.p.job];
  const m=c>=0?`With AI doing ${sim.p.prod}% more per worker and ${sim.p.demand}% more work wanted, the job <b>grows ${DK.n(c,1)}%</b>: demand outran the speed-up.`:`With AI doing ${sim.p.prod}% more per worker but only ${sim.p.demand}% more work wanted, the job <b>shrinks ${DK.n(-c,1)}%</b>: the same work needs fewer people.`;
  return m+` BLS projects ${Jb.s.toLowerCase()} jobs to ${Jb.bls>=0?'grow':'shrink'} ${DK.n(Math.abs(Jb.bls),1)}% by 2035.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Software developers are among the jobs most exposed to AI: AI can now write a lot of code. By 2035, does the U.S. Bureau of Labor Statistics project software developer jobs to shrink or grow?'},
  lock(sim){return {v:sim.p.guess==='grow'?0:1,pick:sim.p.guess,label:sim.p.guess==='grow'?'Grow':'Shrink'};},
  solve(sim){sim.p.guess='grow';sim.p.job='swdev';return {v:0,pick:'grow',label:'Grow, by 10.2%'};},
  hint:{bio:'Lock in your gut. Then you will work out how a speed-up and growing demand change the number of jobs.'},
  calc:{unit:'%',d:1,tol:0.2,
   prompt:{bio:sim=>`AI lets each developer do <b>${sim.p.prod}%</b> more work. The world wants <b>${sim.p.demand}%</b> more software. By what percent does the number of developers needed change? (Use (1 + demand) ÷ (1 + speed-up) − 1.)`,ap:sim=>`g = ${sim.p.prod/100}, d = ${sim.p.demand/100}. Percent change in workers = (1 + d)/(1 + g) − 1?`},
   answer:sim=>ch(sim),
   hint:'Write both as growth factors: 1.40 and 1.30. Divide, subtract 1, and turn it into a percent.',
   steps(sim){const a=1+sim.p.demand/100,b=1+sim.p.prod/100;return [`Growth factors: demand ${DK.n(a,2)}, work per worker ${DK.n(b,2)}.`,`${DK.n(a,2)} ÷ ${DK.n(b,2)} = ${DK.n(a/b,4)}.`,`${DK.n(a/b,4)} − 1 = <b>${(ch(sim)>=0?'+':'')+DK.n(ch(sim),1)}%</b> developers.`];}},
  formula(sim){return `(1 + ${sim.p.demand/100}) ÷ (1 + ${sim.p.prod/100}) − 1 = ${(ch(sim)>=0?'+':'')+DK.n(ch(sim),1)}%`;},
  how:{bio:'Workers needed = work to do ÷ work per worker. If both grow, compare the two growth factors.',ap:'W₁/W₀ = (1 + d)/(1 + g). Jobs grow exactly when d > g.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You ran the numbers yourself.':'';
   return (g.pick==='grow'?'Your gut was right. ':'Most people guess shrink. ')+'BLS projects software developer jobs to <b>grow 10.2%</b> from 2025 to 2035, even though the job is very exposed to AI. When demand for the work grows faster than AI speeds it up, more people are needed. Customer service, just as exposed, is projected to shrink 5.3%.'+self;},
  again(sim){sim.p.guess='shrink';sim.p.job='swdev';sim.p.prod=[20,30,40][Math.floor(Math.random()*3)];sim.p.demand=[30,40,50][Math.floor(Math.random()*3)];}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'BLS rates both software developers and customer service reps as very highly exposed to AI. Why is one projected to grow and the other to shrink?',choices:['BLS made a mistake','Demand for software is growing faster than AI speeds the work up; demand for customer service is not','Software developers are smarter'],correct:1,explain:'Exposure is about tasks AI can help with. Whether jobs grow depends on demand too.'},
  {lvl:'bio',kind:'num',q:'AI lets each worker do 25% more, and demand stays the same. About what percent fewer workers are needed?',answer:20,tol:0.2,unit:'%',d:0,hint:'1 ÷ 1.25 = 0.8.',explain:'1 ÷ 1.25 = 0.80, so 20% fewer workers for the same work.'},
  {lvl:'bio',instant:true,q:'Which job is projected to grow fastest from 2025 to 2035?',choices:['Customer service representatives','Nurse practitioners','Office clerks'],correct:1,explain:'Nurse practitioners: +41.0%, the fastest of all detailed occupations in the BLS projections.'},
  {lvl:'honors',instant:true,q:'Customer service jobs are projected to shrink. Why are there still about 289,500 openings a year?',choices:['The projection is wrong','People retire, change jobs or leave, so positions open even in a shrinking job','Companies hire extra by accident'],correct:1,explain:'Openings come from replacement, not just growth.'},
  {lvl:'honors',instant:true,q:'A Stanford study found something about early-career workers (22 to 25) in the most AI-exposed jobs. What?',choices:['Their employment grew fastest','Their employment fell about 13% relative to others, while older workers in the same jobs held steady','Nothing changed'],correct:1,explain:'The entry rung is where AI hits first: tasks a beginner would learn on are the ones AI does well. (A later revision put it at 16%.)'},
  {lvl:'ap',kind:'num',q:'With a 50% speed-up, how much must demand grow (in %) for jobs to stay level?',answer:50,tol:0,unit:'%',d:0,hint:'(1 + d)/(1.5) = 1.',explain:'d = 50%. Jobs grow only if demand grows faster than productivity.'},
  {lvl:'ap',kind:'num',q:'Speed-up 40%, demand growth 20%. Percent change in workers? (Round to one decimal.)',answer:-14.3,tol:0.1,unit:'%',d:1,hint:'1.20 ÷ 1.40 − 1.',explain:'1.2 ÷ 1.4 = 0.857, so about −14.3%.'}
 ],
 tour:[
  {title:'Exposed is not replaced',text:'In 2026, the U.S. Bureau of Labor Statistics began rating every job’s exposure to AI. It says plainly: the ratings do not measure job losses. Exposure means AI can do or help with many of the tasks.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{job:'swdev',prod:30,demand:40});}},
  {title:'A job is a bundle of tasks',text:'Today, 100 workers do 100 units of work. AI speeds some tasks up, so each worker gets more done.',pause:true,setup:sim=>{sim.tst=2;}},
  {title:'Same work, fewer people',text:'If AI adds 30% per worker and nobody wants more of the work, about 23% fewer workers are needed.',pause:true,setup:sim=>{sim.tst=3;BioLab.setValues(sim,{demand:0});}},
  {title:'Or more work wanted',text:'But when work gets cheaper and faster, people often want more of it. With 40% more wanted, the job grows instead.',pause:true,setup:sim=>{sim.tst=4;BioLab.setValues(sim,{demand:40});}},
  {title:'Two exposed jobs, two futures',text:'Software developers: very exposed, projected +10.2%. Customer service: very exposed, projected −5.3%, yet still about 289,500 openings a year.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{job:'csr'});}},
  {lvl:'honors',title:'The first rung',text:'A Stanford study found early-career workers in the most exposed jobs lost ground first: about 13% relative to others. The tasks beginners learn on are the ones AI does best.',pause:true,setup:sim=>{sim.tst=6;}},
  {title:'Where growth is',text:'The fastest-growing jobs are care and hands-on work: nurse practitioners +41%, solar installers +36.5%, wind turbine technicians +29.5%, plus data scientists +34.6%.',pause:true,setup:sim=>{sim.tst=7;BioLab.setValues(sim,{job:'np'});}}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> When does a job grow even with AI?</p><ol><li>Keep the speed-up at 30%. Record the change in jobs with demand growth of 0%, 20%, 30%, 40% and 60%.</li><li>Find the demand growth where jobs stay level.</li></ol><p>Write one sentence: what decides whether an exposed job grows?</p>',
  honors:'<p><b>Question:</b> Compare your model with BLS.</p><ol><li>For each job, find a speed-up and demand growth that match the BLS projection.</li><li>Decide whether your numbers are believable for that job.</li></ol><p>Explain which job you would bet on, and why.</p>',
  ap:'<p><b>Question:</b> Model the ladder.</p><ol><li>Suppose AI speeds up beginner tasks by 60% and expert tasks by 10%, with demand +20%. Find the change in beginner and expert jobs.</li><li>Relate your result to the Stanford finding.</li></ol><p><b>CER:</b> What should schools teach so students are not stuck below the first rung?</p>'},
 terms:[
  {t:'AI exposure',d:'How many of a job’s tasks AI can do or help with. Not the same as how many jobs will be lost.'},
  {t:'Productivity',d:'How much work one person gets done in a given time.'},
  {t:'Demand',d:'How much of something people want.'},
  {t:'Openings',d:'Jobs that need filling each year, from growth plus people leaving or retiring.',lvl:'honors'},
  {t:'Augment vs. automate',d:'AI helping a person do a task better, versus doing the task instead of the person.',lvl:'honors'},
  {t:'Growth factor',d:'1 plus the growth rate: 30% growth is a factor of 1.3.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Workers needed = work ÷ work per worker, so the change is (1 + demand growth) ÷ (1 + speed-up) − 1. Real jobs also change their tasks, wages and hours, and new jobs appear; this model isolates two forces.</p><p><b>BLS projections, 2025–35</b> (released August 27, 2026). Total employment +3.5%. Nurse practitioners +41.0% (fastest), solar photovoltaic installers +36.5%, data scientists +34.6%, wind turbine service technicians +29.5%. Office and administrative support −4.0% (752,100 jobs), which BLS ties in part to automation tools including AI. Customer service representatives −5.3% (about 141,800 jobs) with about 289,500 openings a year and median pay $44,770; software developers +10.2%, about 95,300 openings a year, median pay $135,980; nurse practitioners about 29,400 openings a year, median pay $132,300; general office clerks about 249,000 openings a year, median pay $45,010.</p><p><b>AI exposure.</b> With these projections, BLS introduced relative AI exposure categories (very high, high, moderate, low) built from five outside measures. BLS says the categories do not measure AI’s impact on employment. Customer service representatives, software developers and office clerks are rated very high; nurse practitioners high.</p><p><b>The first rung.</b> Brynjolfsson, Chandar and Chen, “Canaries in the Coal Mine?” (Stanford Digital Economy Lab, 2025): workers ages 22 to 25 in the most AI-exposed occupations saw a 13% relative decline in employment (16% in a later revision), while older workers in the same jobs held steady, and declines were concentrated where AI automates rather than augments.</p>'
};
BioLab.register(SIM);
})();
