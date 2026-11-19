(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars,rng}=BioLab.h;
const DK=BioLab.dk;
/* A school pushes an update (a patch) to 1,000 laptops. Either everyone at once, or in rings: 1%, then 10%, then everyone,
   with a wait between rings. If the update has a hidden problem, it is noticed `detect` hours after the first laptops get it,
   and the rollout stops. Laptops that already installed it break. Broken = laptops reached before the problem was noticed.
   The trade-off: rings protect against bad updates but leave laptops waiting longer for a good patch.
   Fleet size, waits and detection time are illustrative; CrowdStrike, Microsoft and JPMorgan are real (see About). */
const N=1000,RING=[0.01,0.10,1];
const ORDER=(()=>{const r=rng(7),a=[...Array(N).keys()];for(let i=N-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}const rank=new Array(N);a.forEach((v,i)=>rank[v]=i);return rank;})();
const starts=sim=>sim.p.plan==='all'?[0]:[0,sim.p.wait,2*sim.p.wait];
const sizes=sim=>sim.p.plan==='all'?[1]:RING;
/* fraction of the fleet that has the update at hour h (a ring installs at its start) */
function reached(sim,h){const S=starts(sim),Z=sizes(sim);let f=0;const stop=sim.p.bad?sim.p.detect:Infinity;S.forEach((s,i)=>{if(s<=h&&s<stop)f=Z[i];});return f;}
const finalFrac=sim=>reached(sim,1e9);
const finalBroken=sim=>sim.p.bad?Math.round(N*finalFrac(sim)):0;
const endH=sim=>sim.p.plan==='all'?Math.max(6,sim.p.detect+4):2*sim.p.wait+Math.max(6,sim.p.detect+4);
const hoursAll=sim=>sim.p.bad?null:(sim.p.plan==='all'?0:2*sim.p.wait);
/* laptop-hours spent waiting for a good patch */
const waitHours=sim=>sim.p.plan==='all'?0:N*((1-RING[0])*sim.p.wait+(1-RING[1])*sim.p.wait);
const done=sim=>sim.st.h>=endH(sim);

const SIM={
 id:'rollout',hash:'rollout',apUnit:5,order:3,tab:'The update that broke everything',kind:'Simulation',
 card:'Push a fix to 1,000 school laptops. Send it to everyone at once, or to a few first? See why rushed fixes cause outages, and what waiting costs.',
 title:'The update that broke everything: rushing a fix vs. testing it',
 lede:{bio:'Tool 3 of 8. In tool 1, a patch was a new lock. But sometimes the new lock jams the door. An update with a hidden mistake can stop computers from working. Send an update to a school’s 1,000 laptops and choose: everyone at once, or a few first, in <b>rings</b>.',
  honors:'Tool 3 of 8. Sending a fix in rings limits the damage from a bad update to the laptops reached before anyone noticed. The cost is time: a good fix reaches the last ring later, and a hole stays open that much longer.',
  ap:'Tool 3 of 8. Broken = N × (fraction reached before detection). The cost of rings is the laptop-hours left unpatched: N[(1 − r₁)w + (1 − r₂)w] for ring fractions r₁, r₂ and wait w.'},
 skills:{bio:'Percents of a whole · Pre-algebra',honors:'Percents and comparing two plans · Algebra 1',ap:'Percents, piecewise functions and trade-offs · Algebra 1, Algebra 2'},
 scale:'A school with 1,000 laptops. Each square is one laptop. The waits and how fast a problem is noticed are invented for illustration; the real outages are described in About.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The rollout',
 controls:[
  {id:'guess',label:'Your gut: with “1% first,” how many of the 1,000 laptops break?',type:'seg',def:'1000',options:[{v:'1000',l:'All 1,000'},{v:'100',l:'About 100'},{v:'10',l:'About 10'}]},
  {id:'plan',label:'How to send the update',type:'seg',def:'rings',options:[{v:'all',l:'Everyone at once'},{v:'rings',l:'1% first, then 10%, then everyone'}],noGut:true,onChange:sim=>{sim.st.h=0;sim.st.run=false;DK.clearGut(sim);}},
  {id:'bad',label:'This update has a hidden mistake',type:'toggle',def:true,noGut:true,onChange:sim=>{sim.st.h=0;sim.st.run=false;}},
  {id:'wait',label:'Hours between rings',type:'range',min:1,max:48,step:1,def:24,unit:'h',noGut:true,onChange:sim=>{sim.st.h=0;sim.st.run=false;DK.clearGut(sim);}},
  {id:'detect',label:'Hours until someone notices a problem',type:'range',min:1,max:36,step:1,def:2,unit:'h',lvl:'honors',noGut:true,onChange:sim=>{sim.st.h=0;sim.st.run=false;DK.clearGut(sim);}}
 ],
 actions:[{id:'push',label:'Push the update',primary:true,run(sim){sim.st.h=0;sim.st.run=true;}},
  {id:'skip',label:'Skip to the end',run(sim){sim.st.h=endH(sim);sim.st.run=false;}}],
 init(){return {h:0,run:false};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);if(st.run){st.h+=dt*endH(sim)/6;if(st.h>=endH(sim)){st.h=endH(sim);st.run=false;}}},
 metrics:[
  {id:'broken',label:'Laptops broken',unit:'laptops',d:0,min:0,max:1000,get:sim=>DK.pend(sim)?null:finalBroken(sim)},
  {id:'reachedpct',label:'Laptops that got the update',unit:'%',d:0,min:0,max:100,get:sim=>DK.pend(sim)?null:finalFrac(sim)*100},
  {id:'allh',label:'Hours until every laptop has a good fix',text:true,get:sim=>sim.p.bad?'Never: the bad update was stopped':(sim.p.plan==='all'?'0 hours: everyone at once':2*sim.p.wait+' hours')},
  {id:'waith',label:'Laptop-hours left waiting for a good fix',unit:'',d:0,max:null,lvl:'ap',get:sim=>waitHours(sim)}
 ],
 graphs:[{id:'plans',label:'Broken laptops by plan',custom:true}],defaultGraph:'plans',
 plot(sim,ctx,box){const save=sim.p.plan;const v=['all','rings'].map(p=>{sim.p.plan=p;const b=sim.p.bad?Math.round(N*finalFrac(sim)):0;return b;});sim.p.plan=save;
  const ax=axes(ctx,box,{xmin:0,xmax:2,ymin:0,ymax:1000,xl:'',yl:'Laptops broken',xcats:['Everyone at once','In rings']});
  bars(ctx,ax,DK.pend(sim)?[NaN,NaN]:v,{colors:[PAL['s1'],PAL['s3']],d:0});},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,h=sim.st.h,stg=DK.stage(sim),hide=DK.pend(sim)&&!sim.st.run&&h===0;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the fleet */
  const GX=14,GY=56,GW=bg?420:400;DK.card(ctx,GX-6,8,GW+12,434);
  txt(ctx,bg?'1,000 laptops':'A school’s 1,000 laptops',GX+6,8+22*kk,{s:13*kk,w:700});
  const f=reached(sim,h),cols=40,cw=GW/cols,rh=Math.min(15,(434-70)/25);
  for(let i=0;i<N;i++){const c=i%cols,r=Math.floor(i/cols),has=ORDER[i]<f*N-1e-9;const s=has?(sim.p.bad?'broken':'new'):(sim.st.run||h>0?'wait':'old');
   ctx.fillStyle=s==='broken'?PAL['s1']:s==='new'?PAL['s3']:s==='wait'?PAL['s2']:PAL['cv-soft'];ctx.globalAlpha=s==='old'?.35:s==='wait'?.35:.95;rr(ctx,GX+c*cw+1,GY+r*rh+1,cw-2.5,rh-3,1.5);ctx.fill();}
  ctx.globalAlpha=1;
  const cnt=Math.round(f*N);txt(ctx,(sim.p.bad?'Broken: ':'Updated: ')+cnt,GX+GW-6,8+22*kk,{s:13*kk,w:700,a:'right',c:sim.p.bad&&cnt?PAL['s1']:PAL['s3']});
  if(stg===3)DK.flag(ctx,GX,GY,GW,40);
  /* right: the timeline */
  const X=bg?448:430,W=800-X-10;DK.card(ctx,X,8,W,434);let y=8+24*kk;
  txt(ctx,'Hour '+DK.n(h,0)+(sim.st.run?'':done(sim)?' (done)':''),X+14,y,{s:13*kk,w:700});y+=26*kk;
  const S=starts(sim),Z=sizes(sim),stop=sim.p.bad?sim.p.detect:Infinity;
  S.forEach((s,i)=>{const n=Math.round(N*(Z[i]-(i?Z[i-1]:0))),went=s<stop,now=h>=s&&went;
   const lab=sim.p.plan==='all'?'Everyone: '+N+' laptops':'Ring '+(i+1)+': '+n+(bg?'':' laptops');
   txt(ctx,lab,X+14,y,{s:12.5*kk,w:now?700:400,c:went?PAL['cv-ink']:PAL['cv-soft']});
   txt(ctx,went?'hour '+s:'stopped',X+W-14,y,{s:12.5*kk,w:700,a:'right',c:went?PAL['cv-ink']:PAL['s3']});y+=22*kk;});
  if(sim.p.bad){y+=4;txt(ctx,'Problem noticed: hour '+sim.p.detect,X+14,y,{s:12.5*kk,w:700,c:PAL['s1']});y+=22*kk;}
  if(stg===4||stg===5)DK.flag(ctx,X+6,40*kk,W-12,y-40*kk);
  ctx.strokeStyle=PAL['line'];ctx.beginPath();ctx.moveTo(X+14,y);ctx.lineTo(X+W-14,y);ctx.stroke();y+=24*kk;
  txt(ctx,'Laptops broken',X+14,y,{s:13*kk,w:700});txt(ctx,hide?'?':DK.n(finalBroken(sim),0),X+W-14,y,{s:16*kk,w:700,a:'right',c:finalBroken(sim)?PAL['s1']:PAL['s3']});y+=26*kk;
  if(!sim.p.bad){txt(ctx,'Every laptop protected after',X+14,y,{s:12.5*kk});txt(ctx,hoursAll(sim)+' h',X+W-14,y,{s:13*kk,w:700,a:'right',c:PAL['s4']});y+=24*kk;}
  if(stg===6)DK.flag(ctx,X+6,y-50*kk,W-12,52*kk);
  if(!bg){y+=8;y=DK.para(ctx,sim.p.bad?'A fix with a mistake breaks every laptop it reaches before anyone notices. Rings stop it early.':'A good fix: rings mean the last laptops wait '+(2*sim.p.wait)+' hours for their new lock, with the door open.',X+14,y,W-28,{s:12,c:PAL['cv-soft'],maxY:400});}
  /* legend */
  const ly=432;[[PAL['cv-soft'],'Not yet',.35],[PAL['s3'],'Updated',.95],[PAL['s1'],'Broken',.95]].forEach((L,j)=>{const lx=X+14+j*(bg?110:100);ctx.fillStyle=L[0];ctx.globalAlpha=L[2];rr(ctx,lx,ly-10,10,8,1.5);ctx.fill();ctx.globalAlpha=1;txt(ctx,L[1],lx+14,ly-2,{s:12*kk});});
 },
 narrate(sim){const b=finalBroken(sim);
  if(DK.pend(sim))return 'The update has a hidden mistake and goes out 1% first. Work out how many laptops it reaches before someone notices.';
  if(!sim.p.bad)return sim.p.plan==='all'?'<b>A good fix, everyone at once:</b> every laptop gets its new lock right away. Fast, but if this fix had a mistake, all 1,000 would break.':`<b>A good fix, in rings:</b> nothing breaks, but the last 900 laptops wait ${2*sim.p.wait} hours for the new lock. If attackers already know about the hole, those are hours with the door open.`;
  if(sim.p.plan==='all')return `<b>All 1,000 laptops break.</b> Everyone got the update at hour 0, before anyone noticed the mistake at hour ${sim.p.detect}. That is what happened with CrowdStrike in 2024, at a scale of 8.5 million computers.`;
  return sim.p.detect<sim.p.wait?`<b>${b} laptops break, not 1,000.</b> The mistake was noticed at hour ${sim.p.detect}, before ring 2 was due at hour ${sim.p.wait}, so the rollout stopped after the first 1%.`:`<b>${b} laptops break.</b> The mistake was noticed at hour ${sim.p.detect}, but ring 2 had already gone out at hour ${sim.p.wait}. Waiting longer between rings would have stopped it sooner.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'A school sends an update to its 1,000 laptops: 1% first, then 10%, then everyone, a day apart. The update has a hidden mistake that someone notices 2 hours after the first laptops get it. About how many laptops break?'},
  lock(sim){const r=String(finalBroken(sim));return {v:sim.p.guess===r?0:1,pick:sim.p.guess,label:{'1000':'All 1,000','100':'About 100','10':'About 10'}[sim.p.guess]};},
  solve(sim){sim.st.h=endH(sim);sim.st.run=false;const r=String(finalBroken(sim));sim.p.guess=['10','100','1000'].includes(r)?r:'10';return {v:0,pick:sim.p.guess,label:finalBroken(sim)+' laptops'};},
  hint:{bio:'Lock in your gut. Then you will work out how many laptops the update reached before the mistake was caught.'},
  calc:{unit:'laptops',d:0,tol:0.5,
   prompt:{bio:sim=>`Ring 1 is 1% of 1,000 laptops at hour 0. Ring 2 (10% in all) is due at hour ${sim.p.wait}. The mistake is noticed at hour ${sim.p.detect}, and then the rollout stops. How many laptops got the bad update?`,
    ap:sim=>`N = 1,000; rings at r = 0.01, 0.10, 1 at hours 0, ${sim.p.wait}, ${2*sim.p.wait}; detection at hour ${sim.p.detect}. Broken = N × r(last ring before detection)?`},
   answer:sim=>finalBroken(sim),
   hint:'Find the last ring that went out before the mistake was noticed, then take that percent of 1,000.',
   steps(sim){const S=starts(sim);const last=S.filter(s=>s<sim.p.detect).length;return [`The mistake is noticed at hour ${sim.p.detect}. Rings that went out before then: ${last}.`,`Those rings reach ${DK.n(finalFrac(sim)*100,0)}% of the laptops.`,`${DK.n(finalFrac(sim)*100,0)}% of 1,000 = <b>${finalBroken(sim)} laptops</b>, instead of all 1,000 at once.`];}},
  formula(sim){return `1,000 × ${DK.n(finalFrac(sim)*100,0)}% = ${finalBroken(sim)} broken (everyone at once: 1,000)`;},
  how:{bio:'Only laptops that installed the update before someone noticed the mistake can break. So the damage is that percent of the whole fleet.',
   ap:'Broken = N · r(k), where k is the last ring with start time below the detection time. It is a step function of the wait w.'},
  compare(sim,g){const b=finalBroken(sim),c=sim.ui.calc,self=c&&c.done&&c.correct?' You worked out the damage yourself.':'';
   return (String(b)===g.pick?'Your gut was right. ':`You guessed ${g.label.toLowerCase()}. `)+`<b>${b} laptops</b> break, because the rollout stopped before ring ${sim.p.detect<sim.p.wait?2:3}. Everyone at once, all 1,000 would have broken.`+self;},
  again(sim){const w=[6,12,24,24,48][Math.floor(Math.random()*5)],d=[1,2,4,8,30][Math.floor(Math.random()*5)];sim.p.guess='1000';sim.p.plan='rings';sim.p.bad=true;sim.p.wait=w;sim.p.detect=d;sim.st.h=0;sim.st.run=false;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'Why do companies send updates to a few computers first?',choices:['To save electricity','So a hidden mistake breaks only a few computers before someone notices and stops it','Because the first ones are more important'],correct:1,explain:'A small first ring is a test in the real world. If something goes wrong, the damage stays small.'},
  {lvl:'bio',kind:'num',q:'A hidden mistake reaches 10% of 1,000 laptops before it is caught. How many laptops break?',answer:100,tol:0,unit:'laptops',d:0,hint:'10% of 1,000.',explain:'0.10 × 1,000 = 100 laptops, instead of all 1,000.'},
  {lvl:'bio',instant:true,q:'If rings are safer, why not wait a whole week between them?',choices:['There is no downside','A good fix also waits, and the hole stays open for the laptops at the end of the line','Laptops get tired'],correct:1,explain:'This is the trade-off in the news: rushing a fix can break things, but waiting leaves a door open while attackers move fast.'},
  {lvl:'honors',instant:true,q:'Rings are 24 hours apart, and a mistake takes 30 hours to notice. How many of 1,000 laptops break?',choices:['10','100','1,000'],correct:1,explain:'Ring 2 (10% in all) went out at hour 24, before the mistake was noticed at hour 30. Ring 3 was due at hour 48 and was stopped. So 100 break.'},
  {lvl:'honors',kind:'num',q:'CrowdStrike’s July 2024 update hit about 8.5 million Windows computers, which Microsoft said was under 1% of all Windows machines. If it was exactly 1%, how many Windows machines were there, in millions?',answer:850,tol:1,unit:'million',d:0,hint:'8.5 million ÷ 0.01.',explain:'8.5 ÷ 0.01 = 850 million. Since it was under 1%, the real total was more than that.'},
  {lvl:'ap',kind:'num',q:'With rings at 1% and 10% and a wait of 24 hours, how many laptop-hours do 1,000 laptops spend waiting for a good fix? (N[(1 − 0.01)w + (1 − 0.10)w])',answer:45360,tol:1,unit:'laptop-hours',d:0,hint:'1,000 × (0.99 × 24 + 0.90 × 24).',explain:'1,000 × (23.76 + 21.6) = 45,360 laptop-hours of an open door, the price of safety.'},
  {lvl:'ap',instant:true,q:'Broken laptops as a function of the wait w (detection at hour 2) is…',choices:['a straight line','a step function: 1,000 for “all at once,” 100 if w ≤ 2, and 10 if w > 2','always 10'],correct:1,explain:'Damage jumps only when a ring goes out before detection, so it changes in steps.'}
 ],
 tour:[
  {title:'A new lock can jam',text:'An update is new code, written by people, so it can have its own mistake. A bad update can stop computers from starting at all.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{plan:'all',bad:true,wait:24,detect:2});sim.st.h=0;sim.st.run=false;}},
  {title:'Everyone at once',text:'Send it to all 1,000 laptops at once, and every one installs it before anyone notices the mistake. All 1,000 break.',pause:true,setup:sim=>{sim.tst=2;sim.st.h=0;sim.st.run=true;},speed:.5},
  {title:'Rings: a few first',text:'Now send it to 1% first (10 laptops), then 10%, then everyone, a day apart.',pause:true,setup:sim=>{sim.tst=3;BioLab.setValues(sim,{plan:'rings'});sim.st.h=0;sim.st.run=false;},focus:[8,8,432,90]},
  {title:'Caught early',text:'Someone notices the mistake 2 hours after ring 1. The rollout stops before ring 2. Only 10 laptops break.',pause:true,setup:sim=>{sim.tst=4;sim.st.h=0;sim.st.run=true;},speed:.5},
  {title:'This really happens',text:'In July 2024, a CrowdStrike security update went out to everyone and crashed about 8.5 million Windows computers. In November 2026, a Microsoft fix with a mistake helped take Outlook down for a day.',pause:true,setup:sim=>{sim.tst=5;}},
  {title:'The catch: waiting',text:'Now make the update good. Rings break nothing, but the last 900 laptops wait 48 hours for their new lock. If attackers already know the hole, the door is open that whole time.',pause:true,setup:sim=>{sim.tst=6;BioLab.setValues(sim,{bad:false});sim.st.h=0;sim.st.run=true;},speed:.5}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> How much damage do rings prevent?</p><ol><li>With the mistake on, push the update <b>everyone at once</b> and record a trial.</li><li>Switch to rings and push again. Record.</li></ol><p>Write one sentence comparing the two.</p>',
  honors:'<p><b>Question:</b> How does the wait between rings change the damage?</p><ol><li>Set <b>Hours until someone notices</b> to 12.</li><li>Record broken laptops with waits of 6, 12, 13 and 24 hours.</li></ol><p>Explain the rule you found.</p>',
  ap:'<p><b>Question:</b> What wait balances the two risks?</p><ol><li>Write broken laptops (bad update) and laptop-hours waiting (good update) as functions of w.</li><li>Suppose 1 in 50 updates is bad and one broken laptop costs as much as 100 laptop-hours of waiting. Find the w that minimizes expected cost for detection at hour 4.</li></ol><p><b>CER:</b> Should a hospital use the same wait as a school? Why?</p>'},
 terms:[
  {t:'Update',d:'New code sent to a device, usually patches and sometimes new features.'},
  {t:'Rollout',d:'How an update is sent out to many devices: all at once or in steps.'},
  {t:'Ring (staged rollout)',d:'A group that gets an update before the next group, so problems show up while few devices have it.'},
  {t:'Outage',d:'A time when a system stops working for the people who need it.'},
  {t:'Patch window',d:'The time between a fix being available and it being installed everywhere. The hole is open during it.',lvl:'honors'},
  {t:'Trade-off',d:'A choice where improving one thing makes another worse, like speed versus safety.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> 1,000 laptops, rings of 1%, 10% and 100% at hours 0, w and 2w. If the update has a mistake, it is noticed d hours after the first install and the rollout stops; every laptop that already installed it breaks. All numbers are illustrative. Real organizations, including schools using tools like Microsoft Intune, set up update rings this way.</p><p><b>CrowdStrike, July 19, 2024.</b> A faulty content update to CrowdStrike’s Falcon security software crashed about 8.5 million Windows devices, which Microsoft said was less than 1% of all Windows machines. The update was live for about 1.3 hours. Airlines, hospitals, banks and broadcasters went down. CrowdStrike then added more testing and staged its updates.</p><p><b>Microsoft, November 12–13, 2026.</b> Exchange Online, the service behind Outlook, failed for about a day around the world. Microsoft said a defect came from a fix prepared for its networking gateway servers, with a surge in load as a secondary cause, and it paused all deployments while it worked. It said there was no sign of malicious activity.</p><p><b>JPMorgan Chase, November 16, 2026.</b> The bank said a software bug in on-premises hardware slowed transactions and affected other banks that dealt with it, and that it was not cyber-related.</p><p><b>The bigger picture.</b> In the <i>Plain English</i> episode that sparked this section, Nicole Perlroth argued that many of these outages were not attacks but rushed fixes, because attackers now move so fast that defenders patch on the attacker’s schedule.</p>'
};
BioLab.register(SIM);
})();
