(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Oldsmar, Florida, February 5, 2021. First reports: an outside hacker took over a water plant computer and raised sodium hydroxide (lye)
   from about 100 to 11,100 parts per million; the operator reset it. 2023: the FBI said it could not confirm a targeted intrusion, and the
   former city manager said it was likely an employee's mistake. The math: ratio 11,100 ÷ 100 = 111; percent increase 11,000%.
   Every fact is from a named source (see About). The control screen is drawn, not a real screenshot. */
const NORMAL=100,CHANGED=11100;
const CARDS=[
 {w:'2021',side:'hack',t:'The sheriff said someone took remote control of an operator’s computer twice that day.',s:'Pinellas County Sheriff, Feb. 8, 2021'},
 {w:'2021',side:'hack',t:'The operator watched the cursor move by itself and open the chemical controls.',s:'NPR, Feb. 9, 2021'},
 {w:'2021',side:'either',t:'Staff shared a remote-access program (TeamViewer) to reach plant computers.',s:'Route Fifty, Feb. 2021'},
 {w:'2021',side:'either',t:'The plant’s computers ran Windows 7, out of support for over a year, the FBI warned.',s:'ABC News, Feb. 2021'},
 {w:'2021',side:'either',t:'pH alarms run through the system, and the water would take more than a day to reach homes.',s:'City manager, via NPR'},
 {w:'2023',side:'error',t:'The FBI said it was “not able to confirm” a targeted cyber intrusion.',s:'CyberScoop, April 2023'},
 {w:'2023',side:'error',t:'The former city manager said it was likely an employee clicking the wrong buttons, who then reported it.',s:'Route Fifty / GCN, March 2023'}
];
const ratio=()=>CHANGED/NORMAL;
const SIDE={hack:['Supports: an outside hacker','s1'],error:['Supports: an employee’s mistake','s2'],either:['True either way','s4']};

const SIM={
 id:'phantom',hash:'phantom',apUnit:5,order:6,tab:'The phantom mouse',kind:'Learning tool',
 card:'In 2021, a water plant operator in Florida watched his mouse move by itself and raise a chemical 111 times over. The world called it a hack. Two years later the story changed. Weigh the evidence.',
 title:'The phantom mouse: what really happened in Oldsmar?',
 lede:{bio:'Tool 6 of 8. Tools 1 to 5 showed real dangers. This one asks a different question: how sure are we? In February 2021, news around the world said a hacker tried to poison a Florida town’s water. In 2023, investigators told a different story. Look at what each piece of evidence actually supports.',
  honors:'Tool 6 of 8. A dramatic first report travels fast; a correction two years later barely travels at all. Sort each piece of evidence by what it supports: an outside hacker, an employee’s mistake, or both. Notice which lessons hold either way.',
  ap:'Tool 6 of 8. Separate the claim (an outside intrusion) from the evidence for it, and both from the conclusions that do not depend on it (legacy software and shared remote access were real risks). Ratio: 11,100 ÷ 100 = 111; percent change: (11,100 − 100) ÷ 100 = 11,000%.'},
 skills:{bio:'Ratios: how many times bigger · Pre-algebra',honors:'Ratios and percent change · Algebra 1',ap:'Ratios, percent change and weighing evidence · Algebra 1, Statistics'},
 scale:'One water treatment plant serving about 15,000 people. Sodium hydroxide (lye) is used in small amounts to control how acidic the water is; ppm means parts per million. The control screen is drawn for this tool, not copied from the plant.',
 aspect:16/9,timeless:true,animated:true,trials:false,graph:false,
 controlsTitle:'The evidence',
 controls:[
  {id:'guess',label:'Your gut: in 2023, what did the FBI say about the 2021 “hack”?',type:'seg',def:'confirmed',options:[{v:'confirmed',l:'It confirmed a hacker'},{v:'notconfirmed',l:'It could not confirm a hack'},{v:'arrest',l:'Someone was arrested'}]},
  {id:'when',label:'What we knew',type:'seg',def:'2021',options:[{v:'2021',l:'February 2021'},{v:'2023',l:'By 2023'}],noGut:true},
  {id:'setting',label:'The lye setting on the screen',type:'seg',def:'changed',options:[{v:'normal',l:'Normal (100 ppm)'},{v:'changed',l:'Changed (11,100 ppm)'}],noGut:true}
 ],
 actions:[{id:'replay',label:'Replay the moving mouse',primary:true,run(sim){sim.st.mt=0;BioLab.setValues(sim,{setting:'normal'});sim.st.play=true;}}],
 init(){return {t:0,mt:9,play:false};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.play){st.mt+=dt;if(st.mt>=4){st.play=false;sim.p.setting='changed';BioLab.refresh&&BioLab.refresh(sim);}}},
 metrics:[
  {id:'ppm',label:'Lye setting',unit:'ppm',d:0,min:0,max:12000,get:sim=>sim.p.setting==='changed'?CHANGED:NORMAL},
  {id:'ratio',label:'Times the normal amount',unit:'×',d:0,max:null,get:sim=>DK.pend(sim)?null:(sim.p.setting==='changed'?ratio():1)},
  {id:'story',label:'The story',text:true,get:sim=>sim.p.when==='2021'?'An outside hacker tried to poison the water':'The FBI could not confirm a hack; likely an employee’s mistake'}
 ],
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,t=sim.st.t,stg=DK.stage(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the control screen */
  const SX=8,SY=8,SW=bg?330:300,SH=230;ctx.fillStyle='#1d2733';rr(ctx,SX,SY,SW,SH,10);ctx.fill();
  txt(ctx,'Water plant controls',SX+14,SY+22*kk,{s:12.5*kk,w:700,c:'#e8eef5'});
  const ch=sim.p.setting==='changed'&&!sim.st.play,val=sim.st.play?Math.round(NORMAL+(CHANGED-NORMAL)*Math.max(0,Math.min(1,(sim.st.mt-2.2)/1.2))):(ch?CHANGED:NORMAL);
  txt(ctx,'Sodium hydroxide (lye)',SX+14,SY+60*kk,{s:12.5*kk,c:'#b8c6d6'});
  ctx.fillStyle=val>500?'#e05656':'#3fae6a';rr(ctx,SX+14,SY+72*kk,SW-28,44*kk,6);ctx.fill();
  txt(ctx,DK.n(val,0)+' ppm',SX+SW/2,SY+102*kk,{s:20*kk,w:700,c:'#fff',a:'center'});
  txt(ctx,'Normal: about 100 ppm',SX+14,SY+140*kk,{s:12*kk,c:'#b8c6d6'});
  /* the cursor */
  const mt=sim.st.play?sim.st.mt:4,cx=SX+40+Math.min(1,mt/2)*(SW-120),cy=SY+200-Math.min(1,mt/2)*100*kk;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy+18);ctx.lineTo(cx+5,cy+13);ctx.lineTo(cx+12,cy+13);ctx.closePath();ctx.fill();
  if(stg===1||stg===2)DK.flag(ctx,SX,SY,SW,SH);
  /* the math */
  const MY=246,MH=196;DK.card(ctx,SX,MY,SW,MH);let y=MY+22*kk;txt(ctx,'How big a change?',SX+14,y,{s:13*kk,w:700});y+=26*kk;
  const hide=DK.pend(sim);
  txt(ctx,'11,100 ÷ 100 = '+(hide?'?':'111 times'),SX+14,y,{s:14*kk,w:700,c:PAL['s1']});y+=24*kk;
  if(!bg){txt(ctx,'Percent increase: '+(hide?'?':'11,000%'),SX+14,y,{s:12.5});y+=22;y=DK.para(ctx,'Safeguards: pH alarms, and more than a day before treated water reaches homes.',SX+14,y,SW-28,{s:12,c:PAL['cv-soft']});}
  if(stg===3)DK.flag(ctx,SX,MY,SW,MH);
  /* the evidence board */
  const BX=SX+SW+10,BW=792-BX;DK.card(ctx,BX,8,BW,434);y=8+22*kk;
  const W23=sim.p.when==='2023';txt(ctx,W23?'What we know by 2023':'What was reported in February 2021',BX+14,y,{s:13*kk,w:700});y+=10*kk;
  const show=CARDS.filter(c=>c.w==='2021'||W23).slice(0,bg?4:7);
  show.forEach(c=>{const S0=SIDE[c.side],S=[S0[0],PAL[S0[1]]],lines=DK.wrap(ctx,c.t,BW-46,12*kk,400);const h=(lines.length+ (bg?1:2))*15*kk+8;
   if(y+h>436)return;ctx.fillStyle=S[1];ctx.globalAlpha=.12;rr(ctx,BX+10,y+4,BW-20,h,6);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle=S[1];rr(ctx,BX+10,y+4,5,h,2);ctx.fill();
   let yy=y+18*kk;lines.forEach(l=>{txt(ctx,l,BX+24,yy,{s:12*kk});yy+=15*kk;});if(!bg)txt(ctx,S[0]+' · '+c.s,BX+24,yy,{s:12,w:700,c:S[1]});y+=h+6;});
  if(W23){ctx.save();ctx.translate(BX+BW-90,60);ctx.rotate(-0.18);ctx.strokeStyle=PAL['s2'];ctx.lineWidth=3;rr(ctx,-74,-18,148,36,6);ctx.stroke();txt(ctx,'NOT CONFIRMED',0,6,{s:14*kk,w:800,c:PAL['s2'],a:'center'});ctx.restore();}
  if(stg===4||stg===5)DK.flag(ctx,BX,8,BW,434);
 },
 narrate(sim){if(DK.pend(sim))return 'The setting went from about 100 to 11,100 ppm. Work out how many times bigger that is.';
  if(sim.p.when==='2021')return 'In February 2021, officials said an outside hacker took over the computer and raised the lye <b>111 times</b>, and the operator put it back. Headlines everywhere called it an attempt to poison a town.';
  return '<b>By 2023, the story had changed.</b> The FBI said it could not confirm a targeted intrusion, and the former city manager said an employee likely clicked the wrong buttons. What held either way: old Windows 7 computers and shared remote access were real risks, and the alarms and the operator were real safeguards.';},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'In February 2021, police said a hacker took over a Florida water plant’s computer and raised a chemical 111 times over. The story went around the world. Two years later, what did the FBI say?'},
  lock(sim){return {v:sim.p.guess==='notconfirmed'?0:1,pick:sim.p.guess,label:{confirmed:'It confirmed a hacker',notconfirmed:'It could not confirm a hack',arrest:'Someone was arrested'}[sim.p.guess]};},
  solve(sim){sim.p.guess='notconfirmed';sim.p.when='2023';return {v:0,pick:'notconfirmed',label:'It could not confirm a targeted intrusion'};},
  hint:{bio:'Lock in your gut. Then you will work out how big the change on the screen was.'},
  calc:{unit:'times',d:0,tol:0.5,
   prompt:{bio:'The lye setting went from about <b>100</b> to <b>11,100</b> parts per million. How many <b>times</b> the normal amount is that?',ap:'Find the ratio 11,100 : 100, then the percent increase.'},
   answer:()=>ratio(),
   hint:'Divide the new amount by the old amount.',
   steps(){return ['11,100 ÷ 100 = <b>111 times</b> the normal amount.','Percent increase: (11,100 − 100) ÷ 100 × 100% = 11,000%.','A change that big is why the pH alarms and the operator would catch it quickly.'];}},
  formula(){return '11,100 ÷ 100 = 111×; (11,100 − 100) ÷ 100 = 11,000% increase';},
  how:{bio:'“How many times bigger” is division: new ÷ old.',ap:'Ratio = new ÷ old = 111; percent change = (new − old) ÷ old = 110 = 11,000%.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You found the 111× yourself.':'';
   return (g.pick==='notconfirmed'?'Your gut was right. ':'Most people would guess that. ')+'In 2023 the FBI said it was <b>not able to confirm</b> a targeted intrusion, and the former city manager said it was likely an employee’s mistake. The first story spread around the world; the correction barely did. The risks it exposed were real either way.'+self;},
  again(sim){sim.p.guess='confirmed';sim.p.when='2021';sim.p.setting='changed';}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'A dramatic cyber story breaks. What is the best first question to ask?',choices:['Who did it?','How do they know, and what evidence have they shown so far?','How scary is it?'],correct:1,explain:'First reports often rely on early statements. Asking what the evidence is helps you hold a story loosely until more is known.'},
  {lvl:'bio',instant:true,q:'Which lesson from Oldsmar holds true whether or not there was a hacker?',choices:['Water is always safe','Old, unsupported computers and shared remote access are real risks','Alarms never work'],correct:1,explain:'The FBI’s 2021 warning about Windows 7 and remote access was about real weaknesses. Those are true even if this event was an employee’s mistake.'},
  {lvl:'bio',kind:'num',q:'A setting goes from 200 to 1,000. How many times bigger is it?',answer:5,tol:0,unit:'times',d:0,hint:'1,000 ÷ 200.',explain:'1,000 ÷ 200 = 5 times.'},
  {lvl:'honors',kind:'num',q:'What is the percent increase from 100 ppm to 11,100 ppm?',answer:11000,tol:0,unit:'%',d:0,hint:'(new − old) ÷ old × 100.',explain:'(11,100 − 100) ÷ 100 = 110, or 11,000%.'},
  {lvl:'honors',instant:true,q:'Why might a correction get far less attention than the first report?',choices:['Corrections are always wrong','A dramatic first story spreads fast; a quieter “it was probably a mistake” years later is less shared','Nobody reports corrections'],correct:1,explain:'This is one reason to treat first reports as early drafts. The Oldsmar correction came two years later, in a panel talk and follow-up articles.'},
  {lvl:'ap',instant:true,q:'“The FBI could not confirm an intrusion” means…',choices:['The FBI proved there was no hacker','The evidence did not establish an outside intrusion; it is not proof either way','A hacker was caught'],correct:1,explain:'Absence of confirmation is not proof of absence. The former city manager’s account adds evidence for employee error; neither is the same as a proof.'},
  {lvl:'ap',instant:true,q:'Which piece of evidence supports an outside hacker more than an employee’s mistake?',choices:['The plant ran Windows 7','The operator said he watched the cursor move by itself','The pH alarms exist'],correct:1,explain:'The moving cursor was the main evidence for remote control. Windows 7 and the alarms fit either story.'}
 ],
 tour:[
  {title:'A cursor moves by itself',text:'February 5, 2021, Oldsmar, Florida. A water plant operator sees his mouse move on its own and open the chemical controls.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{when:'2021',setting:'normal'});sim.st.mt=0;sim.st.play=true;},speed:.5},
  {title:'Lye, 111 times over',text:'The sodium hydroxide (lye) setting jumps from about 100 to 11,100 parts per million. The operator sets it back right away.',pause:true,setup:sim=>{sim.tst=2;BioLab.setValues(sim,{setting:'changed'});sim.st.play=false;}},
  {title:'Safeguards',text:'Even unnoticed, pH alarms run through the system, and treated water takes more than a day to reach homes, the city manager said.',pause:true,setup:sim=>{sim.tst=3;},focus:[8,246,300,196]},
  {title:'The story goes global',text:'Officials called it a hack. Headlines around the world said someone tried to poison a town’s water. The FBI warned about the plant’s old Windows 7 computers and shared remote access.',pause:true,setup:sim=>{sim.tst=4;}},
  {title:'Two years later',text:'In 2023, the FBI said it could not confirm a targeted intrusion. The former city manager said an employee likely clicked the wrong buttons. The risky old setup was real either way.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{when:'2023'});}}
 ],
 onTourExit(sim){sim.tst=0;sim.st.play=false;},
 lab:{bio:'<p><b>Question:</b> What does each piece of evidence support?</p><ol><li>Switch between <b>February 2021</b> and <b>By 2023</b>.</li><li>For each card, write whether it supports an outside hacker, an employee’s mistake, or both.</li></ol><p>Write one sentence: what lesson holds no matter which story is true?</p>',
  honors:'<p><b>Question:</b> How should we talk about a story that later changed?</p><ol><li>Write a one-sentence headline that would have been accurate in February 2021.</li><li>Write one that is accurate now.</li></ol><p>Explain the difference in what each headline claims.</p>',
  ap:'<p><b>Question:</b> Claims versus conclusions.</p><ol><li>List the claims that depend on an outside intrusion and the conclusions that do not.</li><li>Find one more news story where an early cause was later revised.</li></ol><p><b>CER:</b> Was the 2021 coverage wrong, or reasonable for what was known? Use the evidence cards.</p>'},
 terms:[
  {t:'Sodium hydroxide (lye)',d:'A strong chemical used in small amounts to control how acidic water is. In large amounts it burns.'},
  {t:'ppm (parts per million)',d:'How many parts of a substance are in a million parts of water.'},
  {t:'Remote access',d:'Software that lets someone control a computer from somewhere else. Useful for repairs, risky if anyone else can use it.'},
  {t:'Correction',d:'A later report that changes or withdraws something reported earlier.',lvl:'honors'},
  {t:'Confirmation',d:'Evidence strong enough to establish that something happened. “Not confirmed” is not the same as “disproved.”',lvl:'ap'}
 ],
 about:'<p><b>What was reported in 2021.</b> On February 8, 2021, Pinellas County Sheriff Bob Gualtieri said someone had remotely accessed a computer at the Oldsmar water treatment plant twice on February 5 and changed the sodium hydroxide setting from about 100 to 11,100 parts per million; the operator reset it right away (NPR, NBC News). Workers used TeamViewer for remote access (Route Fifty). The FBI warned that the plant’s computers ran Windows 7, which had been out of support for over a year (ABC News). City Manager Al Braithwaite said pH alarms run through the system and the water would take more than a day to reach customers (NPR).</p><p><b>What was said in 2023.</b> Braithwaite, by then the former city manager, told a public administration panel that the incident was not a hack but an employee clicking the wrong buttons, and said the FBI reached the same conclusion (Route Fifty/GCN, March 2023). In a statement to CyberScoop, the FBI said it “was not able to confirm” that the incident was a targeted cyber intrusion.</p><p><b>Why it is here.</b> This section is about real risks, so it also needs a reminder that first reports can be wrong. The risks the event exposed, old software and shared remote access, were real either way.</p>'
};
BioLab.register(SIM);
})();
