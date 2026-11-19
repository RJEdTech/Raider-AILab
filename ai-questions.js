/* Raider AILab: the "Questions to ask any AI" card, added to every tool page.
   Each tool marks the questions it lets students practice, with one line on how. */
(function(){
'use strict';
const Q=[
 'What was it trained on?',
 'What was it scored on?',
 'Can anyone see inside?',
 'Does a person check it?',
 'What happens when it is wrong, and who pays?',
 'Can you appeal?',
 'How many people does it touch?'
];
/* tool id → {question number (1–7): how this tool shows it} */
const FOCUS={
 nextword:{1:'The model can only continue text the way the text it learned from did.'},
 attention:{3:'An attention heat map shows where one step looked, not the whole reason for an answer.'},
 scorebot:{2:'If wrong answers cost nothing, a bot scored on points learns to guess.'},
 agreeable:{2:'Trained on thumbs-up votes, a chatbot drifts toward telling you that you are right.'},
 gamegoal:{2:'The boat learned to circle for points instead of finishing the race.'},
 companion:{2:'Scored on minutes in the app, a companion learns to guilt you into staying.',7:'Habits that add a few minutes a day add up across millions of users.'},
 blackbox:{1:'Trained on past hires, the model learned to count distance against you.',3:'With the box closed, you cannot see your score or what counted against you.',6:'An appeal only works when you can point to what went wrong.'},
 constitution:{2:'The order of an AI’s priorities decides which reply wins when goals clash.'},
 frontier:{4:'AI is strong on some tasks and weak on others that look just as easy, so a person has to know which is which.'},
 coauthor:{4:'Checking every claim is the stage that keeps made-up facts from shipping.',5:'Your name is on the project, so you pay for its mistakes.'},
 learnwith:{5:'If the AI does the thinking, you pay later, on the test without it.'},
 detector:{5:'A small false-positive rate lands on real, honest students.',7:'Run on every essay in a big school, even a rare error hits many people.'},
 promptcost:{7:'One prompt costs little; billions of prompts a day add up.'},
 bugpatch:{5:'When an old layer fails, everything built on it fails too, and the people who depend on it pay.',7:'One old layer can sit under millions of users, like the FAA’s copper lines.'},
 doors:{3:'A device on the open internet with a guessable password is a door anyone can try.',7:'One weak setting was copied across hundreds of stores.'},
 rollout:{4:'Sending a fix to a few first lets a person catch a mistake before it reaches everyone.',7:'A bad update sent to everyone at once reached 8.5 million computers in 2024.'},
 dwell:{4:'A patch closes the door; only a person checking the records finds who got in.'},
 machinespeed:{1:'ARTEX was built for security testing and then used by attackers: what a tool is made for is not what it is used for.',4:'At machine speed, defenders who only check alerts once a day are too slow.',7:'One operator can aim it at many places at once.'},
 phantom:{3:'Only the evidence lets anyone check what happened, and the first story was not confirmed.'},
 cluster:{3:'A week of headlines is not evidence by itself; look at the counts over years.'},
 defenders:{4:'Every win had a person in it: someone read the alarm, did the repair or installed the fix.',5:'When prevention works, nothing seems to happen, so people forget who did the work.'},
 mirror:{1:'It learned overconfidence, flattery and bias from our own words and votes.',2:'Scored on human ratings, it learned to sound sure and to agree.',3:'One clean average, or a trade secret, hides who the AI gets wrong.'},
 compass:{2:'An app scored on minutes learns to keep you there; one scored on your goals learns to let you go.',5:'You pay in time; 45 minutes a day is about 274 hours a year.'},
 jobs:{7:'AI touches a job through its tasks, and whether jobs grow depends on demand too.'},
 datacenter:{5:'Who pays for new plants and lines is a choice regulators make.',7:'One data center can use as much water as a small city, or almost none, depending on its design.'}
};
const css=`.aiq{margin-top:14px;background:var(--card);border:1px solid var(--line);border-left:5px solid var(--rj);border-radius:12px;padding:12px 16px}
.aiq h3{margin:0 0 6px;font-size:1.02rem}.aiq p.aiq-sub{margin:0 0 8px;color:var(--muted);font-size:.92rem}
.aiq ol{margin:0;padding-left:1.4em;columns:2;column-gap:28px}.aiq li{margin:0 0 6px;break-inside:avoid;line-height:1.35}
.aiq li.on{font-weight:700}.aiq li .aiq-how{display:block;font-weight:400;color:var(--muted);font-size:.9rem;margin-top:2px}
.aiq li.on::marker{color:var(--rj)}.aiq a{color:var(--rj-ink);font-weight:600}.aiq .aiq-news{margin:10px 0 0;font-size:.92rem}
@media (max-width:640px){.aiq ol{columns:1}}`;
function card(id){const f=FOCUS[id]||{};const box=document.createElement('section');box.className='aiq';box.setAttribute('aria-label','Questions to ask any AI');
 const items=Q.map((q,i)=>{const how=f[i+1];return `<li${how?' class="on"':''}>${q}${how?`<span class="aiq-how">In this tool: ${how}</span>`:''}</li>`;}).join('');
 box.innerHTML=`<h3>Questions to ask any AI</h3><p class="aiq-sub">Use these on any AI system you meet: an app, a chatbot, a score that decides something about you.${Object.keys(f).length?' The ones in bold are the ones this tool lets you practice.':''}</p><ol>${items}</ol><p class="aiq-news">See them used on real stories, good and bad: <a href="news.html">AI in the News</a>.</p>`;
 return box;}
function add(sec){if(!sec||!sec.classList||sec.querySelector('.aiq'))return;const id=(sec.id||'').replace(/^sim-/,'');
 const anchor=sec.querySelector('.about.terms')||sec.querySelector('details.about')||sec.querySelector('.related');if(!anchor)return;
 const sid=sec.dataset.id||id;anchor.parentNode.insertBefore(card(sid),anchor);}
function scan(){document.querySelectorAll('#sims > section, #sims > .sim').forEach(add);}
function init(){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const root=document.getElementById('sims');if(!root)return;scan();new MutationObserver(scan).observe(root,{childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
