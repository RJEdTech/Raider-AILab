(function(){
'use strict';
const {txt,pill,rr,PAL,FONT,axes,bars,rng}=BioLab.h;
const DK=BioLab.dk;
/* Is everything breaking, or does it just feel that way? Big outages that make the news are modeled as random and independent,
   averaging λ a week (Poisson). P(X ≥ k) = 1 − Σ_{j<k} e^{−λ} λ^j / j!. Expected "cluster weeks" a year = 52 · P(X ≥ k).
   λ is illustrative. The trend panel uses real counts of published vulnerabilities (CVEs): about 40,000 in 2024, 48,185 in 2025,
   and over 100,000 in 2026 by mid-November (see About). */
const fact=n=>{let f=1;for(let i=2;i<=n;i++)f*=i;return f;};
const pmf=(l,j)=>Math.exp(-l)*Math.pow(l,j)/fact(j);
const pAtLeast=(l,k)=>{let s=0;for(let j=0;j<k;j++)s+=pmf(l,j);return Math.max(0,1-s);};
const P=sim=>pAtLeast(sim.p.rate,sim.p.k);
const perYear=sim=>52*P(sim);
function poisson(r,l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=r();}while(p>L);return k-1;}
function year(sim){const r=rng(sim.st.seed),a=[];for(let i=0;i<52;i++)a.push(poisson(r,sim.p.rate));return a;}
const CVE=[['2024',40009],['2025',48185],['2026*',100222]];

const SIM={
 id:'cluster',hash:'cluster',apUnit:5,order:7,tab:'Is everything breaking?',kind:'Simulation',
 card:'Five big outages in one week feels like a pattern. Run years of pure chance and see how often that happens anyway, then compare it with a trend that is real.',
 title:'Is everything breaking? Chance, patterns and a real trend',
 lede:{bio:'Tool 7 of 8. After a week of outage headlines, every glitch starts to look connected. That is the <b>frequency illusion</b>: once you notice something, you see it everywhere. Random events also bunch up by chance. Run a year of pure chance and count the “everything is breaking” weeks. Then look at a trend that is real.',
  honors:'Tool 7 of 8. If independent events average λ a week, the chance of a week with k or more is small, but over 52 weeks it happens anyway. A cluster alone is weak evidence of a common cause; a rising count over years is stronger.',
  ap:'Tool 7 of 8. Model weekly counts as Poisson(λ): P(X ≥ k) = 1 − Σ<sub>j&lt;k</sub> e<sup>−λ</sup>λ<sup>j</sup>/j!. Expected cluster weeks per year = 52 · P(X ≥ k).'},
 skills:{bio:'Probability and expected count · Pre-algebra, Statistics',honors:'Simulation and expected value · Algebra 1, Statistics',ap:'The Poisson model and expected value · Statistics, Algebra 2'},
 scale:'One year, week by week. Each bar is the number of big, newsworthy outages in a week. The average rate is invented for illustration; real monitoring firms count hundreds of smaller internet outages a week that never make the news.',
 aspect:16/9,timeless:true,animated:true,trials:true,graph:true,
 controlsTitle:'Chance and trend',
 controls:[
  {id:'guess',label:'Your gut: in a normal year, how often does pure chance give a week with 5 or more big outages?',type:'seg',def:'never',options:[{v:'never',l:'Almost never'},{v:'few',l:'A few weeks a year'},{v:'monthly',l:'Most months'}]},
  {id:'rate',label:'Average big outages per week',type:'range',min:0.5,max:5,step:0.5,def:2,unit:'a week',noGut:true,onChange:DK.clearGut},
  {id:'k',label:'Call it a cluster at',type:'range',min:3,max:8,step:1,def:5,unit:'or more',noGut:true,onChange:DK.clearGut},
  {id:'trend',label:'Show the real trend: holes found each year',type:'toggle',def:false,noGut:true}
 ],
 actions:[{id:'run',label:'Run a year of chance',primary:true,run(sim){sim.st.seed=Math.floor(Math.random()*1e9);sim.st.grow=0;}}],
 init(){return {seed:12345,grow:1,t:0};},
 step(sim,dt){const st=sim.st;dt=Math.min(dt,0.1);st.t+=dt;if(st.grow<1)st.grow=Math.min(1,st.grow+dt/1.5);},
 metrics:[
  {id:'p',label:'Chance a given week is a cluster',unit:'%',d:1,min:0,max:100,get:sim=>DK.pend(sim)?null:P(sim)*100},
  {id:'expect',label:'Cluster weeks expected per year',unit:'weeks',d:1,min:0,max:null,get:sim=>DK.pend(sim)?null:perYear(sim)},
  {id:'seen',label:'Cluster weeks in this run',unit:'weeks',d:0,min:0,max:null,get:sim=>year(sim).filter(x=>x>=sim.p.k).length},
  {id:'max',label:'Worst week in this run',unit:'outages',d:0,min:0,max:null,get:sim=>Math.max(...year(sim))}
 ],
 graphs:[{id:'dist',label:'Weeks with each number of outages',custom:true}],defaultGraph:'dist',
 plot(sim,ctx,box){const n=12,v=[...Array(n).keys()].map(j=>52*pmf(sim.p.rate,j));
  const ax=axes(ctx,box,{xmin:0,xmax:n,ymin:0,ymax:Math.max(5,Math.ceil(Math.max(...v)*1.15)),xl:'Outages in a week',yl:'Expected weeks a year',xcats:[...Array(n).keys()].map(String)});
  bars(ctx,ax,v,{colors:v.map((x,j)=>j>=sim.p.k?PAL['s1']:PAL['s2']),d:1});},
 draw(sim,ctx,vdt,k){const bg=k>1.3,kk=bg?Math.min(k,1.6):1,stg=DK.stage(sim),hide=DK.pend(sim);
  ctx.fillStyle=PAL['cv-bg'];ctx.fillRect(0,0,800,450);
  const Y=year(sim),gx=bg?470:520;DK.card(ctx,8,8,gx,434);
  txt(ctx,bg?'A year of chance':'One year of pure chance, week by week',22,8+22*kk,{s:13*kk,w:700});
  const L=40,R=gx-6,T=50*kk,B=400,mx=Math.max(8,...Y),bw=(R-L)/52;
  ctx.strokeStyle=PAL['line'];ctx.lineWidth=1;for(let v=0;v<=mx;v+=2){const y=B-(B-T)*v/mx;ctx.beginPath();ctx.moveTo(L,y);ctx.lineTo(R,y);ctx.stroke();txt(ctx,String(v),L-6,y+4,{s:12*kk,c:PAL['cv-soft'],a:'right'});}
  Y.forEach((v,i)=>{const h=(B-T)*v/mx*sim.st.grow;ctx.fillStyle=v>=sim.p.k?PAL['s1']:PAL['s2'];ctx.globalAlpha=v>=sim.p.k?.95:.55;rr(ctx,L+i*bw+1,B-h,bw-2,h,1.5);ctx.fill();});ctx.globalAlpha=1;
  const ay=B-(B-T)*sim.p.rate/mx;ctx.strokeStyle=PAL['cv-ink'];ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(L,ay);ctx.lineTo(R,ay);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'Average: '+sim.p.rate,R-4,ay-6,{s:12*kk,w:700,a:'right'});
  const ky=B-(B-T)*sim.p.k/mx;ctx.strokeStyle=PAL['s1'];ctx.setLineDash([2,4]);ctx.beginPath();ctx.moveTo(L,ky);ctx.lineTo(R,ky);ctx.stroke();ctx.setLineDash([]);
  txt(ctx,'Week 1',L,B+20*kk,{s:12*kk,c:PAL['cv-soft']});txt(ctx,'Week 52',R,B+20*kk,{s:12*kk,c:PAL['cv-soft'],a:'right'});
  const seen=Y.filter(x=>x>=sim.p.k).length;txt(ctx,seen+' red week'+(seen===1?'':'s')+' ('+sim.p.k+'+ outages)',gx-8,8+22*kk,{s:12.5*kk,w:700,a:'right',c:PAL['s1']});
  if(stg===2||stg===3)DK.flag(ctx,L,T,R-L,B-T);
  /* right panel */
  const X=gx+18,W=792-X;DK.card(ctx,X,8,W,434);let y=8+24*kk;
  if(!sim.p.trend){txt(ctx,'Pure chance',X+14,y,{s:13*kk,w:700});y+=26*kk;
   txt(ctx,'One week: '+(hide?'?':DK.n(P(sim)*100,1)+'%'),X+14,y,{s:13*kk});y+=22*kk;
   txt(ctx,'Per year: '+(hide?'?':DK.n(perYear(sim),1)+' weeks'),X+14,y,{s:14*kk,w:700,c:PAL['s1']});y+=26*kk;
   if(stg===4)DK.flag(ctx,X+6,y-80*kk,W-12,82*kk);
   if(!bg)DK.para(ctx,'No cause, no connection: just random events bunching up. A rare week is common over a year.',X+14,y,W-28,{s:12,c:PAL['cv-soft']});}
  else{txt(ctx,'A real trend',X+14,y,{s:13*kk,w:700});y+=10*kk;
   const bx=X+20,bw2=(W-40)/3,top=y+30,bot=360;CVE.forEach((c,i)=>{const h=(bot-top)*c[1]/110000;ctx.fillStyle=PAL['s4'];rr(ctx,bx+i*bw2+8,bot-h,bw2-16,h,4);ctx.fill();
    txt(ctx,DK.n(c[1]/1000,0)+'k',bx+i*bw2+bw2/2,bot-h-6,{s:12.5*kk,w:700,a:'center'});txt(ctx,c[0],bx+i*bw2+bw2/2,bot+18*kk,{s:12.5*kk,a:'center'});});
   if(!bg)DK.para(ctx,'Holes (CVEs) published each year. *2026 through mid-November. Experts point to AI finding more of them.',X+14,bot+38,W-28,{s:12,c:PAL['cv-soft']});
   if(stg===5)DK.flag(ctx,X,8,W,434);}
 },
 narrate(sim){if(DK.pend(sim))return 'Work out how many cluster weeks to expect in a year from the chance for one week.';
  if(sim.p.trend)return 'Unlike a lucky week, this is a count over years. Published holes went from about 40,000 in 2024 to 48,185 in 2025 to <b>over 100,000 in 2026</b> by mid-November. A trend like that is real evidence that something changed.';
  return `With ${sim.p.rate} big outages in an average week, a week with ${sim.p.k} or more has a ${DK.n(P(sim)*100,1)}% chance. Over 52 weeks, expect about <b>${DK.n(perYear(sim),1)} such weeks a year from chance alone</b>, with no common cause.`;},
 gut:{better:'lower',controls:['guess'],
  ask:{bio:'Say there are 2 big outages in the news in a normal week, each happening at random. How often would pure chance give a week with 5 or more, the kind that makes people say “everything is breaking”?'},
  lock(sim){const e=perYear(sim),r=e<1?'never':e<=12?'few':'monthly';return {v:sim.p.guess===r?0:1,pick:sim.p.guess,label:{never:'Almost never',few:'A few weeks a year',monthly:'Most months'}[sim.p.guess]};},
  solve(sim){const e=perYear(sim),r=e<1?'never':e<=12?'few':'monthly';sim.p.guess=r;return {v:0,pick:r,label:'About '+DK.n(e,1)+' weeks a year'};},
  hint:{bio:'Lock in your gut. Then you will turn the chance for one week into a count for the year.'},
  calc:{unit:'weeks',d:1,tol:0.15,
   prompt:{bio:sim=>`The chance that one week has ${sim.p.k} or more big outages is <b>${DK.n(P(sim)*100,2)}%</b>. A year has 52 weeks. About how many such weeks should a year have, from chance alone?`,
    ap:sim=>`λ = ${sim.p.rate}, k = ${sim.p.k}. Compute 52 · P(X ≥ k) for X ~ Poisson(λ).`},
   answer:sim=>perYear(sim),
   hint:'Write the percent as a decimal and multiply by 52.',
   steps(sim){return [`${DK.n(P(sim)*100,2)}% = ${P(sim).toFixed(4)}.`,`52 × ${P(sim).toFixed(4)} = <b>${DK.n(perYear(sim),1)} weeks</b> a year.`,'So a week that feels like “everything is breaking” happens a few times a year with no cause at all.'];}},
  formula(sim){return `52 × ${P(sim).toFixed(4)} = ${DK.n(perYear(sim),2)} cluster weeks a year`;},
  how:{bio:'Expected count = number of tries × chance each time. 52 weeks × the chance for one week.',
   ap:'E[cluster weeks] = 52 · (1 − Σ<sub>j&lt;k</sub> e<sup>−λ</sup>λ<sup>j</sup>/j!). For λ = 2, k = 5: 1 − e<sup>−2</sup>(1 + 2 + 2 + 4/3 + 2/3) ≈ 0.0527.'},
  compare(sim,g){const c=sim.ui.calc,self=c&&c.done&&c.correct?' You worked out the count yourself.':'';
   return `Chance alone gives about <b>${DK.n(perYear(sim),1)} weeks a year</b> with ${sim.p.k} or more. ${g.pick==='never'?'It feels rare, but rare per week is normal per year.':'Your gut was close.'} That does not mean nothing is going on: the count of holes found per year really did more than double. The skill is telling a cluster from a trend.`+self;},
  again(sim){sim.p.guess='never';sim.p.rate=[1.5,2,2.5,3][Math.floor(Math.random()*4)];sim.p.k=sim.p.rate>=2.5?6:5;sim.p.trend=false;}
 },
 challenges:[
  {lvl:'bio',instant:true,q:'After a week of outage news, your Wi-Fi drops and you think, “It’s happening here too.” What is that?',choices:['Proof of an attack','The frequency illusion: once you notice something, you see it everywhere','Bad Wi-Fi only'],correct:1,explain:'Wi-Fi drops all the time. After a week of headlines, you notice and connect them. That feeling is not evidence.'},
  {lvl:'bio',kind:'num',q:'The chance of a “bad week” is 4%. About how many bad weeks happen in a 52-week year?',answer:2.08,tol:0.05,unit:'weeks',d:2,hint:'52 × 0.04.',explain:'52 × 0.04 = 2.08, so about 2 a year, with no cause at all.'},
  {lvl:'bio',instant:true,q:'Which is stronger evidence that something real changed?',choices:['One week with many outages','A count that keeps rising year after year, like holes found each year','A friend saying it feels worse'],correct:1,explain:'One busy week can be chance. A count that more than doubles over two years is a trend.'},
  {lvl:'honors',kind:'num',q:'With an average of 2 a week, P(5 or more) ≈ 5.27%. How many weeks a year?',answer:2.74,tol:0.05,unit:'weeks',d:2,hint:'52 × 0.0527.',explain:'52 × 0.0527 ≈ 2.74 weeks a year.'},
  {lvl:'honors',instant:true,q:'Raise the average from 2 to 3 outages a week. What happens to cluster weeks (5+)?',choices:['They stay rare','They become much more common, about 9 weeks a year','They disappear'],correct:1,explain:'P(X ≥ 5 | λ = 3) ≈ 18.5%, so about 9.6 weeks a year. A modest rise in the average makes clusters far more common.'},
  {lvl:'ap',kind:'num',q:'For λ = 2, compute P(X ≥ 5) as a percent. (P(X ≤ 4) = e⁻²(1 + 2 + 2 + 4/3 + 2/3).)',answer:5.27,tol:0.03,unit:'%',d:2,hint:'e⁻² ≈ 0.1353 and the sum is 7.',explain:'0.1353 × 7 = 0.9473, so P(X ≥ 5) = 0.0527, or 5.27%.'},
  {lvl:'ap',instant:true,q:'Published holes went from about 48,000 (2025) to over 100,000 (2026 so far). Why is that stronger evidence than a cluster week?',choices:['Bigger numbers are always true','Year totals average out chance; a doubling of a large count is very unlikely under the same rate','It is not stronger'],correct:1,explain:'With counts in the tens of thousands, random variation is a tiny fraction of the total, so a doubling signals a real change in the rate.'}
 ],
 tour:[
  {title:'It feels like everything is breaking',text:'Outlook, flights, banks: one week, many headlines. After that, every glitch feels connected. That is the frequency illusion: once you notice something, you see it everywhere.',pause:true,setup:sim=>{sim.tst=1;BioLab.setValues(sim,{rate:2,k:5,trend:false});}},
  {title:'A year of pure chance',text:'Each bar is one week of random, unconnected outages averaging 2 a week. Nothing links them.',pause:true,setup:sim=>{sim.tst=2;sim.st.seed=20261113;sim.st.grow=0;},focus:[8,8,520,434]},
  {title:'Red weeks happen anyway',text:'Red weeks have 5 or more outages. They show up even though every outage here is random. Chance bunches things up.',pause:true,setup:sim=>{sim.tst=3;},focus:[8,8,520,434]},
  {title:'Rare per week, normal per year',text:'A 5+ week has about a 5% chance. Times 52 weeks, that is about 2.7 weeks a year, from chance alone.',pause:true,setup:sim=>{sim.tst=4;}},
  {title:'But some trends are real',text:'Holes published each year went from about 40,000 in 2024 to 48,185 in 2025 to over 100,000 in 2026 by November. A rising count over years is real evidence. Both things can be true at once.',pause:true,setup:sim=>{sim.tst=5;BioLab.setValues(sim,{trend:true});}}
 ],
 onTourExit(sim){sim.tst=0;},
 lab:{bio:'<p><b>Question:</b> How often does chance alone make a scary week?</p><ol><li>Press <b>Run a year of chance</b> five times. Record the number of red weeks each time.</li><li>Compare your average with <b>Cluster weeks expected per year</b>.</li></ol><p>Write one sentence: what should you think the next time a week feels like everything is breaking?</p>',
  honors:'<p><b>Question:</b> How sensitive are clusters to the average?</p><ol><li>Record expected cluster weeks for averages of 1, 2, 3 and 4.</li><li>Graph them.</li></ol><p>Explain why a small rise in the average makes a big difference in clusters.</p>',
  ap:'<p><b>Question:</b> Test a claim.</p><ol><li>Suppose 6 big outages happened in one week. Under λ = 2, find P(X ≥ 6) and the expected number of such weeks in a year.</li><li>Under what λ would 6 be an ordinary week (P ≥ 25%)?</li></ol><p><b>CER:</b> Was the week of November 12–17, 2026 evidence of a common cause? What other evidence would you want?</p>'},
 terms:[
  {t:'Frequency illusion',d:'After you notice something, you start seeing it everywhere, so it feels more common than it is.'},
  {t:'Clustering illusion',d:'Seeing a pattern in random events that bunch together by chance.'},
  {t:'Trend',d:'A change that holds up over a long time, not one busy week.'},
  {t:'Expected count',d:'Number of tries × the chance each time.',lvl:'honors'},
  {t:'Poisson model',d:'A model for counts of independent random events at a steady average rate.',lvl:'ap'}
 ],
 about:'<p><b>The model.</b> Big, newsworthy outages are treated as independent random events averaging λ a week, so weekly counts follow a Poisson distribution. The rate is invented for illustration. Real outages are not fully independent: one cloud provider’s failure can take down many services at once.</p><p><b>Small outages are constant.</b> Network monitors count hundreds of internet outages around the world every week; in the week of March 19, 2022, for example, ThousandEyes counted 250 (S&P Global Market Intelligence). Almost none make the news.</p><p><b>The real trend.</b> The CVE program published about 40,000 vulnerabilities in 2024 and a record 48,185 in 2025. By mid-November 2026, VulnCheck counted more than 100,000 for the year, more than double 2025; The Register reported that experts attributed the jump to AI. Most published holes are never used by attackers, so more holes found is not the same as more attacks, but it is more work for defenders.</p><p><b>The November 2026 week.</b> Microsoft (November 12–13), the FAA (November 13) and JPMorgan (November 16) each gave a different, non-malicious cause. A cluster with different causes is exactly what chance and busy, fragile systems produce.</p>'
};
BioLab.register(SIM);
})();
