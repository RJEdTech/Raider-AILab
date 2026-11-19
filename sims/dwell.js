(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Two weeks after attackers' AI finds a hole (day 0). The intruder gets in on day e. The patch comes out on day p and is installed
   i days later, on day P = p + i: the door locks then. Locking the door does not remove someone already inside: without checking the
   sign-in records, they stay to the end (day 14); with a check, they are found and removed the day after the patch (P + 1).
   Records copied = rate × days inside. All numbers illustrative; the timing pattern is real (see About). */
const END=14;
const P=sim=>sim.p.patch+sim.p.install;
const gotIn=sim=>sim.p.entry<P(sim);
const outDay=sim=>!gotIn(sim)?sim.p.entry:(sim.p.check?Math.min(END,P(sim)+1):END);
const daysIn=sim=>gotIn(sim)?outDay(sim)-sim.p.entry:0;
const beforePatch=sim=>gotIn(sim)?P(sim)-sim.p.entry:0;
const recs=sim=>sim.p.rate*daysIn(sim);
const LOG=[['Mon 8:02 a.m.','Teacher sign-in, school building','ok'],['Mon 3:12 a.m.','“admin” sign-in from another country','odd'],['Tue 7:55 a.m.','Office sign-in, school building','ok'],['Tue 2:47 a.m.','“admin” copied 2,000 files','odd'],['Wed 8:10 a.m.','Teacher sign-in, school building','ok']];

const SIM={
 id:'dwell',hash:'dwell',apUnit:5,order:4,tab:'The patch came. Were they in?',kind:'Simulation',
 card:'The fix arrives a week after attackers found the hole. Lock the door, then find out who is already inside, and what checking the sign-in records changes.',
 title:'The patch came. Were they already in?',
 lede:{bio:'Tool 4 of 8. A patch is a new lock (tool 1). But attackers using AI now find holes and get in within days, often before the patch even exists. Locking the door does not remove someone who is already inside. Watch two weeks after a hole is found.',
  honors:'Tool 4 of 8. The time from a hole being found to it being used has collapsed from about two months to days. So defenders have two jobs: patch the hole, and search for anyone who got in while it was open.',
  ap:'Tool 4 of 8. Data lost = rate × time inside. Patching sets when the door closes; detection sets when the intruder leaves. Without detection, time inside runs to the end of the window.'},
 skills:{bio:'Rates: amount = rate × time · Pre-algebra',ap:'Linear rate models and piecewise time · Algebra 1'},
 scale:'Fourteen days after attackers find a hole (day 0). The days and the 2,000 records a day are invented for illustration. The sign-in records are fictional. The real timing is described in About.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The two weeks',
 controls:[
  {id:'guess',label:'Your gut: once the patch is installed, is the intruder gone?',type:'seg',def:'gone',options:[{v:'gone',l:'Yes, gone'},{v:'still',l:'No, still inside'}]},
  {id:'entry',label:'Day the intruder gets in',type:'range',min:0,max:7,step:1,def:1,unit:'',noGut:true,onChange:DK.clearGut},
  {id:'patch',label:'Day the patch comes out',type:'range',min:1,max:12,step:1,def:7,unit:'',noGut:true,onChange:DK.clearGut},
  {id:'install',label:'Days to install it',type:'range',min:0,max:5,step:1,def:1,unit:'days',noGut:true,onChange:DK.clearGut},
  {id:'check',label:'Check the sign-in records after patching',type:'toggle',def:false,noGut:true},
  {id:'rate',label:'Records copied per day inside',type:'range',min:500,max:5000,step:500,def:2000,unit:'per day',lvl:'honors',noGut:true,onChange:DK.clearGut}
 ],
 actions:[{id:'play',label:'Play the two weeks',primary:true,run(sim){sim.st.day=0;sim.st.run=true;}},
  {id:'checkit',label:'Check the sign-in records',run(sim){BioLab.setValues(sim,{check:true});}}],
 init(){return {day:END,run:false,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.run){st.day+=dt*2.2;if(st.day>=END){st.day=END;st.run=false;}}},
 metrics:[
  {id:'open',label:'Days the door was open',unit:'days',d:0,min:0,max:14,get:sim=>P(sim)},
  {id:'before',label:'Days inside before the patch',unit:'days',d:0,min:0,max:14,get:sim=>DK.pend(sim)?null:beforePatch(sim)},
  {id:'inside',label:'Days inside in all',unit:'days',d:0,min:0,max:14,get:sim=>DK.pend(sim)?null:daysIn(sim)},
  {id:'recs',label:'Records copied',unit:'records',d:0,min:0,max:null,get:sim=>DK.pend(sim)?null:recs(sim)},
  {id:'status',label:'On day 14',text:true,get:sim=>!gotIn(sim)?'The patch came first: no one got in':sim.p.check?'Found in the records and removed on day '+outDay(sim):'Door locked, intruder still inside'}
 ],
 graphs:[{id:'cum',label:'Records copied over time',custom:true}],defaultGraph:'cum',
 plot(sim,ctx,box){const ax=axes(ctx,box,{xmin:0,xmax:END,ymin:0,ymax:Math.max(10000,sim.p.rate*END),xl:'Day',yl:'Records copied'});
  const f=d=>sim.p.rate*Math.max(0,Math.min(d,outDay(sim))-sim.p.entry)*(gotIn(sim)?1:0);
  ctx.strokeStyle=PAL['s1'];ctx.lineWidth=2.5;ctx.beginPath();for(let d=0;d<=END;d+=0.1){const x=ax.X(d),y=ax.Y(f(d));d===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
  ctx.strokeStyle=PAL['s3'];ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(ax.X(P(sim)),ax.Y(0));ctx.lineTo(ax.X(P(sim)),ax.Y(sim.p.rate*END));ctx.stroke();ctx.setLineDash([]);},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,day=sim.st.day,stg=DK.stage(sim),hide=DK.pend(sim),t=sim.st.t;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* timeline */
  DK.card(ctx,8,8,784,200);const L=bg?150:130,R=772,X=d=>L+(R-L)*d/END;
  txt(ctx,'Day',L-10,30*kk,{s:12*kk,c:PAL['cv-soft'],a:'right'});for(let d=0;d<=END;d+=bg?2:1)txt(ctx,String(d),X(d),30*kk,{s:12*kk,c:PAL['cv-soft'],a:'center'});
  const now=X(Math.min(day,END));
  const row=(y,lab,a,b,c,lt)=>{txt(ctx,lab,L-10,y+12,{s:12.5*kk,w:700,a:'right'});ctx.fillStyle=PAL['card2'];rr(ctx,L,y,R-L,18,5);ctx.fill();if(b>a){ctx.fillStyle=c;ctx.globalAlpha=.9;rr(ctx,X(a),y,Math.max(2,X(Math.min(b,day))-X(a)),18,5);if(day>a)ctx.fill();ctx.globalAlpha=1;}if(lt&&day>a)txt(ctx,lt,X(a)+6,y+13,{s:12*kk,w:700,c:'#fff'});};
  const y1=50*kk,y2=y1+34*kk,y3=y2+34*kk;
  row(y1,'Door',0,P(sim),PAL['s1'],bg?'':'Open');if(day>P(sim)){ctx.fillStyle=PAL['s3'];rr(ctx,X(P(sim)),y1,X(day)-X(P(sim)),18,5);ctx.fill();if(!bg)txt(ctx,'Locked',X(P(sim))+6,y1+13,{s:12*kk,w:700,c:'#fff'});}
  row(y2,'Intruder',sim.p.entry,outDay(sim),'#7a2b2b',bg?'':(gotIn(sim)?'Inside':''));
  row(y3,'Records',sim.p.entry,outDay(sim),PAL['s4'],bg?'':(hide?'':DK.n(sim.p.rate,0)+' a day'));
  /* markers */
  const mk=(d,lab,c,yy)=>{ctx.strokeStyle=c;ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(X(d),40*kk);ctx.lineTo(X(d),y3+26*kk);ctx.stroke();ctx.setLineDash([]);if(!bg||d===P(sim))txt(ctx,lab,X(d),y3+42*kk+yy,{s:12*kk,w:700,c,a:d<2?'left':d>12?'right':'center'});};
  mk(0,'Hole found',PAL['s1'],0);mk(sim.p.patch,'Patch out',PAL['s2'],bg?0:16);mk(P(sim),'Installed',PAL['s3'],0);
  if(sim.p.check&&gotIn(sim))mk(Math.min(END,P(sim)+1),'Found',PAL['s4'],bg?18:16);
  if(sim.st.run){ctx.strokeStyle=PAL['cv-ink'];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(now,40*kk);ctx.lineTo(now,y3+24*kk);ctx.stroke();}
  if(stg===3)DK.flag(ctx,L,y1,R-L,52*kk);
  /* the house */
  const HX=8,HY=216,HW=bg?380:300,HH=226;DK.card(ctx,HX,HY,HW,HH);
  const dd=Math.min(day,END),doorSt=dd<P(sim)?'open':'locked',inside=gotIn(sim)&&dd>=sim.p.entry&&(dd<outDay(sim)||(!sim.p.check&&outDay(sim)===END));
  txt(ctx,'Day '+DK.n(dd,0),HX+14,HY+22*kk,{s:13*kk,w:700});
  ctx.fillStyle=PAL['card2'];rr(ctx,HX+40,HY+60,HW-80,HH-80,8);ctx.fill();ctx.strokeStyle=PAL['line'];ctx.lineWidth=2;ctx.stroke();
  DK.door(ctx,HX+HW-62,HY+HH-90,30,60,doorSt,kk);
  if(inside)DK.person(ctx,HX+HW/2-20+Math.sin(t*1.5)*20,HY+150,40,'intruder');
  else if(gotIn(sim)&&dd>=outDay(sim)&&sim.p.check){DK.person(ctx,HX+70,HY+150,34,'helper');txt(ctx,'Removed',HX+100,HY+150,{s:12.5*kk,w:700,c:PAL['s3']});}
  if(stg===4)DK.flag(ctx,HX,HY,HW,HH);
  /* right: the sign-in records */
  const X2=HX+HW+10,W2=792-X2;DK.card(ctx,X2,HY,W2,HH);let y=HY+22*kk;
  txt(ctx,bg?'Sign-in records':'Sign-in records (fictional)',X2+14,y,{s:13*kk,w:700});y+=10*kk;
  const show=sim.p.check;LOG.slice(0,bg?3:5).forEach((r,j)=>{const yy=y+8+j*(bg?44:28);const odd=r[2]==='odd'&&show;
   if(odd){ctx.fillStyle=PAL['s1'];ctx.globalAlpha=.14;rr(ctx,X2+8,yy-2,W2-16,(bg?40:24),5);ctx.fill();ctx.globalAlpha=1;}
   txt(ctx,r[0],X2+14,yy+12,{s:12*kk,w:700,c:odd?PAL['s1']:PAL['cv-ink']});if(!bg)txt(ctx,r[1],X2+130,yy+12,{s:12,c:odd?PAL['s1']:PAL['cv-soft']});});
  if(!show)DK.para(ctx,'Nobody is reading these. Turn on “Check the sign-in records” to look.',X2+14,HY+HH-36,W2-28,{s:12,c:PAL['cv-soft']});
  else if(!bg)DK.para(ctx,'Two sign-ins at 3 a.m. from far away: that is the intruder.',X2+14,HY+HH-36,W2-28,{s:12,w:700,c:PAL['s1']});
  if(stg===5)DK.flag(ctx,X2,HY,W2,HH);
 },
 narrate(sim){if(DK.pend(sim))return 'The intruder got in on day '+sim.p.entry+' and the patch was installed on day '+P(sim)+'. Work out how many records they copied before the door locked.';
  if(!gotIn(sim))return `The patch was installed on day ${P(sim)}, before the intruder tried on day ${sim.p.entry}. <b>The door was locked in time.</b> That is the race defenders used to win, when attackers took weeks.`;
  if(!sim.p.check)return `The intruder got in on day ${sim.p.entry}. The door locked on day ${P(sim)}, but <b>locking the door did not remove them</b>. Nobody checked the records, so they were still inside on day 14, with ${DK.n(recs(sim),0)} records copied.`;
  return `The door locked on day ${P(sim)}, and checking the sign-in records found the intruder the next day. <b>They were inside ${daysIn(sim)} days</b> and copied ${DK.n(recs(sim),0)} records, instead of staying to day 14.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Attackers’ AI found a hole on day 0, and an intruder got in on day 1. The patch came out on day 7 and was installed on day 8. Nobody checked the sign-in records. On day 14, is the intruder gone?'},
  lock(sim){const r=gotIn(sim)&&!sim.p.check?'still':'gone';return {v:sim.p.guess===r?0:1,pick:sim.p.guess,label:sim.p.guess==='gone'?'Gone':'Still inside'};},
  solve(sim){const r=gotIn(sim)&&!sim.p.check?'still':'gone';sim.p.guess=r;sim.st.day=END;return {v:0,pick:r,label:r==='still'?'Still inside, with '+DK.n(recs(sim),0)+' records copied':'Gone'};},
  hint:{bio:'Lock in your gut. Then you will work out how many records were copied before the patch was even installed.'},
  calc:{unit:'records',d:0,tol:1,
   prompt:{bio:sim=>`The intruder got in on day ${sim.p.entry} and copies ${DK.n(sim.p.rate,0)} records a day. The patch was installed on day ${P(sim)}. How many records were copied <b>before the patch was installed</b>?`,
    ap:sim=>`Rate r = ${DK.n(sim.p.rate,0)} per day, entry e = ${sim.p.entry}, patch installed P = ${P(sim)}. Records lost by day P?`},
   answer:sim=>sim.p.rate*beforePatch(sim),
   hint:'Days inside before the patch = install day − entry day. Multiply by the records per day.',
   steps(sim){return [`Days inside before the patch: ${P(sim)} − ${sim.p.entry} = ${beforePatch(sim)} days.`,`${DK.n(sim.p.rate,0)} × ${beforePatch(sim)} = <b>${DK.n(sim.p.rate*beforePatch(sim),0)} records</b> before the door even locked.`,sim.p.check?'Checking the records stops it the next day.':`And with no one checking, they keep copying to day 14: ${DK.n(recs(sim),0)} in all.`];}},
  formula(sim){return `${DK.n(sim.p.rate,0)} × (${P(sim)} − ${sim.p.entry}) = ${DK.n(sim.p.rate*beforePatch(sim),0)} before the patch; ${DK.n(recs(sim),0)} by the time they leave`;},
  how:{bio:'A rate times a time gives an amount. The intruder copies the same number of records each day, so multiply by the days they were inside.',
   ap:'Loss L = r(min(D, 14) − e), where D is the detection day. Patching moves when the door closes; only detection moves D.'},
  compare(sim,g){const r=gotIn(sim)&&!sim.p.check?'still':'gone',c=sim.ui.calc,self=c&&c.done&&c.correct?' You worked out the loss yourself.':'';
   return (g.pick===r?'Your gut was right. ':'Many people think the patch ends it. ')+(r==='still'?`The patch locked the door on day ${P(sim)}, but the intruder was already inside and stayed to day 14: <b>${DK.n(recs(sim),0)} records</b>. Patching closes the door; someone still has to search the house.`:'The intruder was found and removed.')+self;},
  again(sim){sim.p.guess='gone';sim.p.check=false;sim.p.entry=Math.floor(Math.random()*4);sim.p.patch=4+Math.floor(Math.random()*6);sim.p.install=Math.floor(Math.random()*3);sim.st.day=END;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'A patch was installed today. What else should defenders do?',choices:['Nothing, the patch fixes everything','Check the sign-in records for anyone who got in while the hole was open','Turn the computers off forever'],correct:1,explain:'A patch locks the door from now on. It does nothing about someone who came in before it was locked.'},
  {lvl:'bio',kind:'num',q:'An intruder copies 1,000 records a day and is inside for 6 days. How many records are copied?',answer:6000,tol:0,unit:'records',d:0,hint:'Rate × time.',explain:'1,000 × 6 = 6,000 records.'},
  {lvl:'bio',instant:true,q:'Why is the gap between a hole being found and a patch arriving more dangerous now?',choices:['Patches are slower to download','Attackers using AI find and use holes within days, often before the patch exists','Holes are bigger now'],correct:1,explain:'Mandiant measured the average time to exploit a hole falling from 63 days (2018–2019) to 5 days (2023).'},
  {lvl:'honors',kind:'num',q:'With the defaults (in on day 1, patch installed day 8, records checked), how many days was the intruder inside?',answer:8,tol:0,unit:'days',d:0,hint:'They are found the day after the patch: day 9.',explain:'Day 9 − day 1 = 8 days, instead of 13 days with no check.'},
  {lvl:'honors',instant:true,q:'Which change shortens the time inside the most once the intruder is already in?',choices:['Installing the patch a day faster','Checking the sign-in records','Both shorten it, but only checking removes them'],correct:2,explain:'Faster patching shortens how long the door is open; only detection ends the stay.'},
  {lvl:'ap',kind:'num',q:'r = 3,000 records a day, entry day 2, no detection, window ends day 14. Loss in records?',answer:36000,tol:0,unit:'records',d:0,hint:'3,000 × (14 − 2).',explain:'3,000 × 12 = 36,000. The patch day does not appear in the formula at all.'},
  {lvl:'ap',instant:true,q:'In this model, how does records lost depend on the patch day once the intruder is already in and nobody checks?',choices:['Linearly','Not at all: the loss runs to day 14 either way','Exponentially'],correct:1,explain:'Without detection, the stay ends at the window’s end, so patching earlier changes nothing for someone already inside.'}
 ],
 tour:[
  {title:'Day 0: the hole is found',text:'Attackers using AI find a hole in a school’s system. The maker does not have a patch yet.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{entry:1,patch:7,install:1,check:false});sim.st.day=0.5;sim.st.run=false;}},
  {title:'Day 1: someone gets in',text:'The next day, an intruder comes through the open door and starts copying records, 2,000 a day.',pause:true,setup:sim=>{sim.tst=2;sim.st.day=2;}},
  {title:'Day 8: the door locks',text:'The patch comes out on day 7 and is installed on day 8. The door is locked.',pause:true,setup:sim=>{sim.tst=3;sim.st.day=8.5;},focus:[8,8,784,110]},
  {title:'But they are still inside',text:'Locking the door does not remove someone already in the house. With no one looking, the intruder keeps copying to day 14: 26,000 records.',pause:true,setup:sim=>{sim.tst=4;sim.st.day=14;},focus:[8,216,300,226]},
  {title:'Search the house',text:'Now check the sign-in records. Two 3 a.m. sign-ins from another country stand out. The intruder is found and removed on day 9.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{check:true});sim.st.day=14;}},
  {lvl:'honors',title:'Why this is the new normal',text:'The time from a hole being found to it being used fell from 63 days to 5 days between 2018 and 2023, Mandiant measured. Now defenders assume someone may already be inside.',pause:true,setup:sim=>{sim.tst=6;}}
 ],
 onTourExit(sim){sim.tst=0;sim.st.day=END;sim.st.run=false;},
 lab:{bio:'<p><b>Question:</b> What changes the number of records copied?</p><ol><li>Record a trial with the defaults.</li><li>Install the patch faster (0 days), then record. Turn on <b>Check the sign-in records</b>, then record.</li></ol><p>Write one sentence: which change helped more, and why?</p>',
  honors:'<p><b>Question:</b> Does an earlier patch help if the intruder is already in?</p><ol><li>With the check off, record <b>Records copied</b> for patch days 3, 5, 7 and 9 (entry day 1).</li><li>Repeat with the check on.</li></ol><p>Explain why the two sets of trials look different.</p>',
  ap:'<p><b>Question:</b> Write the loss as a function.</p><ol><li>Write L(e, P, check) for this model.</li><li>Verify it against four trials.</li></ol><p><b>CER:</b> A company says, “We patched within 24 hours, so we were never at risk.” Respond using your function.</p>'},
 terms:[
  {t:'Intruder',d:'Someone inside a system who should not be there.'},
  {t:'Sign-in records (logs)',d:'A list a computer keeps of who signed in, when and from where. Checking them is how intruders get found.'},
  {t:'Exploit',d:'To use a hole to get in. Also the code that does it.'},
  {t:'Time to exploit',d:'How long after a hole is found before attackers use it. It fell from 63 days to 5 days between 2018 and 2023.',lvl:'honors'},
  {t:'Dwell time',d:'How long an intruder stays inside before being found. Mandiant’s 2023 median was 10 days.',lvl:'honors'},
  {t:'Assume breach',d:'Planning as if someone may already be inside, and looking for them, not just guarding the door.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> The door is open from day 0 until the patch is installed. An intruder who got in before then stays until they are found: the day after the patch if someone checks the sign-in records, otherwise to day 14. Records copied = rate × days inside. All numbers are illustrative.</p><p><b>The real timing.</b> Mandiant (Google) measured the average time to exploit a hole falling from 63 days in 2018–2019 to 32 days in 2021–2022 and 5 days in 2023. Its 2024 report put the median dwell time (how long intruders stay before being found) at 10 days in 2023. In the <i>Plain English</i> episode that sparked this section, Nicole Perlroth said companies now find holes and learn that intruders had been inside for about a week by the time the patch arrived.</p><p><b>Practice reading the records.</b> Raider ForensicsLab has a tool for reading sign-in logs: <a href="https://rjedtech.github.io/Raider-ForensicsLab/#logs" target="_blank" rel="noopener">Raider ForensicsLab: logs</a>.</p>'
};
BioLab.register(SIM);
})();
