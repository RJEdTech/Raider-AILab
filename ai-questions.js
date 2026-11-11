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
 promptcost:{7:'One prompt costs little; billions of prompts a day add up.'}
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
