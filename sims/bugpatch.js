(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars}=BioLab.h;
const DK=BioLab.dk;
/* Start here. Code is a building with four floors; each floor must work for the whole thing to work.
   P(everything works today) = product of each floor's chance. Supported floors get fixes (99.9% of days, illustrative).
   An end-of-life bottom floor gets no fixes: its chance drops 0.5 points a year and it gains 2 open holes a year (illustrative). */
const SC={
 phone:{name:'Your phone',floors:['Built-in chip code','Operating system','The app','The online service'],what:'your phone'},
 faa:{name:'Air traffic (FAA)',floors:['Old copper phone lines','Router','Flight-data network','Radar screens'],what:'air traffic control'}
};
const SUP=0.999;
const bottomP=sim=>sim.p.eol?Math.max(0.9,SUP-0.005*sim.p.years):SUP;
const floorP=(sim,i)=>i===0?bottomP(sim):SUP;
const tower=sim=>[0,1,2,3].reduce((a,i)=>a*floorP(sim,i),1);
const badDays=sim=>365*(1-tower(sim));
const holes=sim=>sim.p.eol?Math.round(2*sim.p.years):0;
const pc=v=>DK.n(v*100,1)+'%';

const SIM={
 id:'bugpatch',hash:'bugpatch',apUnit:5,order:1,tab:'Bugs, holes and patches',kind:'Learning tool',
 card:'Start here. Why does your phone keep asking to update? Build the idea of bugs, holes and patches, then see why one old floor can shake a whole system.',
 title:'Bugs, holes and patches: why your phone keeps asking to update',
 lede:{bio:'Tool 1 of 8, start here. Think of code as a building with floors. A <b>bug</b> is a mistake in the building. A <b>hole</b> is a mistake someone could use to get in, like an unlocked door. A <b>patch</b> is a new lock. When the builder stops making locks for a floor, that floor is at its <b>end of life</b>. Everything above it still has to stand on it.',
  honors:'Tool 1 of 8. A system works only when every layer under it works, so the chances multiply. That is why one unsupported layer at the bottom can make the whole system less reliable than its weakest part.',
  ap:'Tool 1 of 8. For independent layers, P(system works) = Π pᵢ, which is never larger than the smallest pᵢ. Expected bad days per year = 365(1 − Π pᵢ).'},
 skills:{bio:'Multiplying chances (probability) · Algebra 1',ap:'Products of probabilities and expected value · Algebra 1, Statistics'},
 scale:'Four layers of code, from the bottom (oldest) to the top. The daily chances are invented for illustration: 99.9% for a layer that still gets fixes, and 0.5 points less each year for a layer that stopped getting them. The pattern is real (see About).',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'The building',
 controls:[
  {id:'guess',label:'Your gut: compared with its worst floor, the whole system works…',type:'seg',def:'more',options:[{v:'more',l:'More often'},{v:'same',l:'Just as often'},{v:'less',l:'Less often'}]},
  {id:'scene',label:'Which building',type:'seg',def:'phone',options:[{v:'phone',l:'Your phone'},{v:'faa',l:'Air traffic (FAA)'}],noGut:true},
  {id:'eol',label:'Bottom floor at end of life (no more fixes)',type:'toggle',def:true,noGut:true,onChange:DK.clearGut},
  {id:'years',label:'Years since the bottom floor’s last fix',type:'range',min:0,max:10,step:1,def:6,unit:'years',noGut:true,onChange:DK.clearGut}
 ],
 actions:[{id:'patch',label:'Patch the bottom floor (update it)',primary:true,run(sim){BioLab.setValues(sim,{eol:false,years:0});DK.clearGut(sim);}},
  {id:'age',label:'Let a year pass with no fixes',run(sim){BioLab.setValues(sim,{eol:true,years:Math.min(10,sim.p.years+1)});DK.clearGut(sim);}}],
 init(){return {t:0};},
 step(sim,dt){sim.st.t+=Math.min(dt,0.1);},
 metrics:[
  {id:'bottom',label:'Bottom floor works',unit:'% of days',d:1,min:90,max:100,get:sim=>bottomP(sim)*100},
  {id:'tower',label:'Everything works',unit:'% of days',d:1,min:90,max:100,get:sim=>DK.pend(sim)?null:tower(sim)*100},
  {id:'bad',label:'Days a year something breaks',unit:'days',d:1,min:0,max:null,lvl:'honors',get:sim=>DK.pend(sim)?null:badDays(sim)},
  {id:'holes',label:'Open holes in the bottom floor',unit:'',d:0,min:0,max:20,get:sim=>holes(sim)}
 ],
 graphs:[{id:'floors',label:'Each floor and the whole',custom:true}],defaultGraph:'floors',
 plot(sim,ctx,box){const v=[0,1,2,3].map(i=>floorP(sim,i)*100).concat(DK.pend(sim)?NaN:tower(sim)*100);
  const ax=axes(ctx,box,{xmin:0,xmax:5,ymin:90,ymax:100,xl:'',yl:'% of days it works',xcats:['Floor 1','Floor 2','Floor 3','Floor 4','All']});
  bars(ctx,ax,v,{colors:[sim.p.eol?PAL['s4']:PAL['s3'],PAL['s3'],PAL['s3'],PAL['s3'],PAL['s2']],d:1});},
 draw(sim,ctx,vdt,k){const S=SC[sim.p.scene],stg=DK.stage(sim),big=k>1.3,kk=big?Math.min(k,1.6):1,t=sim.st.t;
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  /* the building, bottom floor first */
  const BX=40,BW=big?380:340,FH=86,base=430,sway=sim.p.eol?Math.sin(t*2.2)*(1-bottomP(sim))*90:0;
  ctx.fillStyle=PAL['cv-bench']||PAL['line'];ctx.fillRect(10,base,BW+60,8);
  for(let i=0;i<4;i++){const y=base-(i+1)*FH,dx=sway*(i/3);ctx.save();ctx.translate(dx,0);
   const eolFloor=i===0&&sim.p.eol;DK.card(ctx,BX,y,BW,FH-6,{fill:PAL['card'],stroke:eolFloor?PAL['s4']:PAL['line'],lw:eolFloor?2.5:1.5,r:8});
   txt(ctx,(big?'':'Floor '+(i+1)+': ')+S.floors[i],BX+12,y+20*kk,{s:12.5*kk,w:700,c:eolFloor?PAL['s4']:PAL['cv-ink']});
   /* doors */
   let st=sim.p.eol&&i===0?'old':'locked';const nd=big?3:5;
   for(let d=0;d<nd;d++){let s=st;if(eolFloor&&d<Math.min(nd,Math.ceil(holes(sim)/2.4)))s='open';
    if(i===2&&stg>=2&&stg<=4&&d===1)s=stg===2?'locked':stg===3?'open':'locked';
    if(stg===1)s='locked';
    DK.door(ctx,BX+14+d*(big?44:40),y+30*kk,26,FH-44*kk,s,kk);}
   if(i===2&&stg===2){ctx.strokeStyle=PAL['s1'];ctx.lineWidth=2.5;ctx.beginPath();const cx=BX+BW-70,cy=y+48;ctx.moveTo(cx,cy-16);ctx.lineTo(cx+8,cy-4);ctx.lineTo(cx-2,cy+4);ctx.lineTo(cx+9,cy+18);ctx.stroke();txt(ctx,'A bug',cx+16,cy+4,{s:12.5*kk,w:700,c:PAL['s1']});}
   if(i===2&&stg===3)txt(ctx,'A hole',BX+BW-90,y+52,{s:12.5*kk,w:700,c:PAL['s1']});
   if(i===2&&stg===4)txt(ctx,'Patched',BX+BW-90,y+52,{s:12.5*kk,w:700,c:PAL['s3']});
   if(eolFloor)txt(ctx,big?'End of life':'End of life: no more locks',BX+BW-12,y+20*kk,{s:12*kk,w:700,c:PAL['s4'],a:'right'});
   ctx.restore();
   if(stg===2&&i===2||stg===3&&i===2||stg===4&&i===2)DK.flag(ctx,BX,y,BW,FH-6);if(stg===5&&i===0)DK.flag(ctx,BX,y,BW,FH-6);}
  /* right: the chances */
  const X=big?440:410,W=800-X-10;DK.card(ctx,X,8,W,434);
  let y=8+24*kk;txt(ctx,big?'Does it all work today?':S.name+': does everything work today?',X+14,y,{s:13*kk,w:700});y+=26*kk;
  for(let i=3;i>=0;i--){const p=floorP(sim,i);txt(ctx,'Floor '+(i+1),X+14,y,{s:12.5*kk});txt(ctx,pc(p),X+W-14,y,{s:12.5*kk,w:700,a:'right',c:i===0&&sim.p.eol?PAL['s4']:PAL['cv-ink']});y+=20*kk;
   if(i>0){txt(ctx,'×',X+W-90*kk,y-5*kk,{s:12*kk,c:PAL['cv-soft'],a:'center'});y+=4*kk;}}
  ctx.strokeStyle=PAL['line'];ctx.beginPath();ctx.moveTo(X+14,y);ctx.lineTo(X+W-14,y);ctx.stroke();y+=22*kk;
  const hide=DK.pend(sim);
  txt(ctx,'Everything works',X+14,y,{s:13*kk,w:700});txt(ctx,hide?'?':pc(tower(sim)),X+W-14,y,{s:15*kk,w:700,a:'right',c:PAL['s2']});y+=22*kk;
  if(!hide&&!big){txt(ctx,'Something breaks about '+DK.n(badDays(sim),0)+(Math.round(badDays(sim))===1?' day':' days')+' a year',X+14,y,{s:12.5*kk,c:PAL['cv-soft']});y+=22;}
  if(stg===6)DK.flag(ctx,X+6,y-70*kk,W-12,74*kk);
  /* the key */
  y=Math.max(y+8,300);if(!big){txt(ctx,'The picture',X+14,y,{s:12.5,w:700});y+=8;
   [['open','A hole: a mistake someone could use to get in'],['locked','A patch closed it'],['old','Old lock, no new ones coming']].forEach((r,j)=>{DK.door(ctx,X+14,y+6+j*34,16,26,r[0]);DK.para(ctx,r[1],X+40,y+22+j*34,W-54,{s:12});});}
 },
 narrate(sim){const S=SC[sim.p.scene];
  if(!sim.p.eol)return `Every floor of ${S.what} still gets fixes, so each one works 99.9% of days and the holes get patched as they are found. <b>Everything works ${pc(tower(sim))} of days.</b>`;
  if(DK.pend(sim))return `The bottom floor works ${pc(bottomP(sim))} of days. Work out the chance that all four floors work on the same day.`;
  return `The bottom floor has had no fixes for ${sim.p.years} year${sim.p.years===1?'':'s'}: ${holes(sim)} holes are open and it works ${pc(bottomP(sim))} of days. <b>Everything works only ${pc(tower(sim))} of days, less than the worst floor,</b> because all four floors must work at once.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Your phone has four floors of code. Three still get fixes and work 99.9% of days. The bottom one stopped getting fixes 6 years ago and works 96.9% of days. Does the whole phone work more often, just as often, or less often than that worst floor?'},
  lock(sim){return {v:sim.p.guess==='less'?0:1,pick:sim.p.guess,label:{more:'More often',same:'Just as often',less:'Less often'}[sim.p.guess]};},
  solve(sim){sim.p.guess='less';return {v:0,pick:'less',label:'Less often: '+pc(tower(sim))+' of days'};},
  hint:{bio:'Lock in your gut. Then you will multiply the four chances yourself.'},
  calc:{unit:'%',d:1,tol:0.15,
   prompt:{bio:sim=>`The four floors work ${pc(SUP)}, ${pc(SUP)}, ${pc(SUP)} and ${pc(bottomP(sim))} of days. All four must work for the phone to work. What percent of days does <b>everything</b> work?`,
    ap:sim=>`p₁ = ${bottomP(sim).toFixed(3)}, p₂ = p₃ = p₄ = 0.999. Find Π pᵢ as a percent.`},
   answer:sim=>tower(sim)*100,
   hint:'Write each percent as a decimal (99.9% is 0.999), multiply all four, then turn the answer back into a percent.',
   steps(sim){const b=bottomP(sim);return [`As decimals: 0.999, 0.999, 0.999 and ${b.toFixed(3)}.`,`Multiply: 0.999 × 0.999 × 0.999 × ${b.toFixed(3)} = ${tower(sim).toFixed(4)}.`,`As a percent: <b>${pc(tower(sim))}</b>, a little less than the bottom floor’s ${pc(b)}.`];}},
  formula(sim){return `0.999 × 0.999 × 0.999 × ${bottomP(sim).toFixed(3)} = ${tower(sim).toFixed(4)} = ${pc(tower(sim))}`;},
  how:{bio:'For everything to work, floor 1 and floor 2 and floor 3 and floor 4 all have to work. “And” chances multiply. Multiplying by numbers less than 1 can only make the answer smaller, so the system is always a little worse than its worst floor.',
   ap:'Π pᵢ ≤ min pᵢ because every other factor is at most 1. Expected bad days = 365(1 − Π pᵢ).'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You multiplied it out yourself.':'';
   return (g.pick==='less'?'Your gut was right. ':'You picked “'+g.label.toLowerCase()+'”. ')+`The whole phone works <b>${pc(tower(sim))}</b> of days, a bit less than its worst floor (${pc(bottomP(sim))}). Every other floor can only add a chance of failing, never take one away.`+self;},
  again(sim){const y=3+Math.floor(Math.random()*7);sim.p.guess='more';sim.p.eol=true;sim.p.years=y;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'In this picture, what is a “patch”?',choices:['A new floor on top','A fix that closes a hole, like a new lock on a door','A way to make the phone faster'],correct:1,explain:'A patch is a small fix to code that closes a hole or fixes a bug, the way a patch on jeans covers a hole without buying new jeans.'},
  {lvl:'bio',instant:true,q:'A device has reached “end of life.” What does that mean?',choices:['It stops working that day','The company stopped making fixes for it, so new holes stay open','It gets fixes faster'],correct:1,explain:'It may run for years, but no new locks are coming. Every hole found after that stays open. The French supermarket fridge controllers hacked in October 2026 had reached end of life in 2016 and 2021.'},
  {lvl:'bio',kind:'num',q:'Two floors each work 99% of days (0.99). What percent of days do both work?',answer:98.01,tol:0.05,unit:'%',d:2,hint:'0.99 × 0.99.',explain:'0.99 × 0.99 = 0.9801, or 98.01%. Two good floors make a slightly worse building.'},
  {lvl:'honors',kind:'num',q:'With the bottom floor at 96.9% and three floors at 99.9%, about how many days a year does something break? (365 × (1 − 0.9661))',answer:12.4,tol:0.3,unit:'days',d:1,hint:'1 − 0.9661 = 0.0339. Multiply by 365.',explain:'365 × 0.0339 ≈ 12.4 days a year. Patch the bottom floor and it drops to about 1.5 days.'},
  {lvl:'honors',instant:true,q:'The FAA’s November 13, 2026 ground stop was traced to a router during an upgrade of old copper lines. Which idea from this tool does that fit?',choices:['Top floors fail most','Everything above rests on the oldest floor, so a problem there stops the whole system','Old systems never fail'],correct:1,explain:'The FAA said the legacy TDM system (old copper phone-line technology) was causing instability. About 12,000 flights were canceled, Aviation Week reported.'},
  {lvl:'ap',kind:'num',q:'Five independent layers each work 99.5% of days. What is P(all work), as a percent?',answer:97.52,tol:0.05,unit:'%',d:2,hint:'0.995⁵.',explain:'0.995⁵ ≈ 0.9752. More layers means more chances to fail, even when each one is good.'},
  {lvl:'ap',instant:true,q:'Why is Π pᵢ never more than the smallest pᵢ?',choices:['Because probabilities add','Because every other factor is at most 1, so multiplying by it cannot make the product bigger','It can be more'],correct:1,explain:'Multiplying by a number between 0 and 1 shrinks or keeps a value. So the system is bounded by its weakest layer.'}
 ],
 tour:[
  {title:'Code is a building',text:'Everything on a screen runs on code: written instructions for a computer. Picture the code as a building. Your phone has floors: chip code at the bottom, then the operating system, the app, and the online service on top.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{scene:'phone',eol:false,years:0});},focus:[30,80,400,360]},
  {title:'A bug is a mistake',text:'People write code, and people make mistakes. A mistake in code is called a bug. The name is old: in 1947, engineers found a real moth stuck in a computer.',pause:true,setup:sim=>{sim.tst=2;},focus:[30,166,400,90]},
  {title:'A hole is an unlocked door',text:'Some bugs let someone in who should not get in. That kind of bug is a hole. The official word is vulnerability: a weak spot someone can use.',pause:true,setup:sim=>{sim.tst=3;},focus:[30,166,400,90]},
  {title:'A patch is a new lock',text:'When the builder finds a hole, they send a small fix called a patch, like a patch on jeans. That is what your phone’s “Update available” is: new locks for doors someone found open.',pause:true,setup:sim=>{sim.tst=4;},focus:[30,166,400,90]},
  {title:'End of life: no more locks',text:'Builders stop making fixes for old floors. That is called end of life. The floor keeps running, but every new hole stays open. Six years later, this one has 12 open holes.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{eol:true,years:6});},focus:[30,338,400,90]},
  {title:'Everything rests on the bottom floor',text:'The phone works only if all four floors work on the same day. So the chances multiply: 0.999 × 0.999 × 0.999 × 0.969 ≈ 96.6%. The whole phone is a little worse than its worst floor.',pause:true,setup:sim=>{sim.tst=6;},focus:[410,8,380,250]},
  {lvl:'honors',title:'Same idea, bigger building',text:'Air traffic control is built the same way. On November 13, 2026, the FAA stopped every departure in the country for over 4 hours. It blamed its old copper phone-line system, the bottom floor.',pause:true,setup:sim=>{sim.tst=7;BioLab.setValues(sim,{scene:'faa'});}}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> How does an old bottom floor change how often everything works?</p><ol><li>Turn on <b>end of life</b>. Press <b>Let a year pass</b> one year at a time, recording a trial each time.</li><li>Then press <b>Patch the bottom floor</b> and record again.</li></ol><p>Write one sentence: why does updating one floor help the whole phone?</p>',
  honors:'<p><b>Question:</b> How many bad days a year does each year without fixes add?</p><ol><li>Record <b>Days a year something breaks</b> at 0, 2, 4, 6, 8 and 10 years.</li><li>Find how much it grows per year.</li></ol><p>Explain the pattern in plain words.</p>',
  ap:'<p><b>Question:</b> Is the system’s chance linear in the years without fixes?</p><ol><li>Write Π pᵢ as a function of y, the years.</li><li>Check it against three trials.</li></ol><p><b>CER:</b> A city says its 20-year-old water system “has never failed.” Use this model to explain why that is not proof it is safe.</p>'},
 terms:[
  {t:'Code',d:'Written instructions that tell a computer what to do. Apps, phones, planes and fridges all run on it.'},
  {t:'Bug',d:'A mistake in code.'},
  {t:'Vulnerability (hole)',d:'A bug that someone could use to get in or take control. In this section, an unlocked door.'},
  {t:'Patch',d:'A small fix that closes a hole or fixes a bug. Updates are mostly patches.'},
  {t:'End of life',d:'When the maker stops sending fixes for a product. It may keep running, but new holes stay open.'},
  {t:'Legacy system',d:'An old system still in use, often because replacing it is hard or expensive.',lvl:'honors'},
  {t:'Independent events',d:'Events where one happening does not change the chance of the other. Their chances multiply.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Four layers, each working on a given day with chance pᵢ. The system works only if all do, so P = p₁ × p₂ × p₃ × p₄. Supported layers are set to 0.999. An end-of-life bottom layer loses 0.005 a year and gains 2 open holes a year. These numbers are invented for illustration; real failures are not independent, and old systems often fail together with the things around them.</p><p><b>The pattern is real.</b> On November 13, 2026, the FAA issued a nationwide ground stop after communication problems at air traffic centers. It said the cause was not a cyberattack and was “the legacy TDM system causing instabilities”; Aviation Week reported a malfunctioning router at a facility being upgraded from copper wiring to fiber, and about 12,000 canceled flights.</p><p><b>End of life in the news.</b> The Danfoss refrigeration controllers hacked in French supermarkets in October 2026 (AK-SC355 and AK-SM800) had reached end of life in 2016 and 2021, and the maker had advised replacing them. The Oldsmar, Florida water plant was running Windows 7, which had stopped getting Microsoft updates more than a year before its 2021 incident, the FBI said.</p><p><b>Why “bug”?</b> In 1947, operators of the Harvard Mark II computer taped a moth they found in a relay into their logbook as the “first actual case of bug being found.” Engineers had already used “bug” for faults.</p><p><b>Where this section comes from.</b> It was sparked by Derek Thompson’s <i>Plain English</i> episode “Why Everything Is Breaking All at Once” (November 19, 2026) with Nicole Perlroth and Jennifer Pahlka.</p>'
};
BioLab.register(SIM);
})();
