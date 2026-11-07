BioLab.addReview({
detector:{
 questions:[
  {id:'semester',kind:'real',lvl:'bio',
   q:'Your school has 1,700 students who each turn in 4 essays a semester. 5% of essays are AI-written. The detector catches 90% of AI essays and wrongly flags 1% of human-written ones. About how many human-written essays get flagged?',
   num:{ans:65,tol:1,unit:'essays'},
   steps:['Essays: 1,700 × 4 = 6,800.','Human-written: 95% of 6,800 = 6,460.','Wrongly flagged: 1% of 6,460 = 64.6, about 65 essays.'],
   lab:{set:{ai:5,fpr:1,det:90,essays:4,nn:false,reveal:true},look:'Read <b>Human-written essays flagged</b>.'},verify:[['fp',64.6,0.05]]},
  {id:'ppvdef',kind:'test',lvl:'bio',
   q:'Same school and detector. An essay is flagged. What is the chance it is really AI-written, to the nearest tenth of a percent?',
   num:{ans:82.6,tol:0.1,unit:'%'},
   steps:['Real catches: 90% of 340 AI essays = 306.','False flags: 64.6.','306 ÷ (306 + 64.6) = 306 ÷ 370.6 ≈ 82.6%. About 1 flag in 6 is on a student who did their own work.'],
   lab:{set:{ai:5,fpr:1,det:90,essays:4,nn:false,reveal:true},look:'Read <b>Chance a flagged essay is really AI</b>.'},verify:[['ppv',82.57,0.05]]},
  {id:'students',kind:'test',lvl:'honors',
   q:'With the same settings, each student turns in 4 essays. If each essay is judged independently, how many students get at least one false flag? Round to the nearest student.',
   num:{ans:64,tol:1,unit:'students'},
   steps:['Chance one essay is human-written and flagged: 0.95 × 0.01 = 0.0095.','Chance a student gets no false flag on 4 essays: (1 − 0.0095)⁴ ≈ 0.9625.','At least one: 1 − 0.9625 = 0.0375. Students: 1,700 × 0.0375 ≈ 64, about 1 in 27.'],
   lab:{set:{ai:5,fpr:1,det:90,essays:4,nn:false,reveal:true},look:'Read <b>Honest students wrongly flagged at least once</b>.'},verify:[['stu',63.69,0.05]]},
  {id:'nonnative',kind:'real',lvl:'honors',
   q:'Now 10% of the students are non-native English writers, and the detector wrongly flags 19% of their human-written essays. When one of their essays is flagged, what is the chance it is really AI?',
   choices:['About 83%, the same as everyone else','About 63%','About 20%'],correct:2,
   steps:['Their group: 170 students × 4 = 680 essays; 34 are AI and 30.6 get caught.','646 are human-written; 19% of them, about 122.7, get flagged.','30.6 ÷ (30.6 + 122.7) ≈ 20%. Four out of five flags on their essays are false, and they are about 62% of all wrongly flagged students.'],
   lab:{set:{ai:5,fpr:1,det:90,essays:4,nn:true,nnShare:10,nnFpr:19,reveal:true},look:'Read <b>Same chance, for a non-native writer’s essay</b> and <b>Wrongly flagged students who are non-native writers</b>.'},verify:[['ppvNN',19.96,0.05],['nnPart',61.95,0.05]]},
  {id:'rare',kind:'test',lvl:'ap',
   q:'Only 1% of essays are AI-written. With d = 0.90 and f = 0.01, use PPV = d·a / (d·a + f·(1 − a)). Give the answer as a percent to the nearest tenth.',
   num:{ans:47.6,tol:0.1,unit:'%'},
   steps:['d·a = 0.90 × 0.01 = 0.0090.','f·(1 − a) = 0.01 × 0.99 = 0.0099.','PPV = 0.0090 ÷ 0.0189 ≈ 0.476. Less than half of flags are real when AI writing is rare.'],
   lab:{set:{ai:1,fpr:1,det:90,essays:4,nn:false,reveal:true},look:'Read <b>Chance a flagged essay is really AI</b>.'},verify:[['ppv',47.62,0.05]]},
  {id:'next',kind:'real',lvl:'bio',
   q:'A friend’s essay gets flagged by an AI detector, and they wrote it themselves. Which statement do this tool’s default numbers support?',
   choices:['A flag proves the essay was AI-written','About 1 flag in 6 lands on an essay the student wrote','Detectors never flag human writing'],correct:1,
   steps:['Real catches: 306. False flags: about 65.','65 ÷ 371 ≈ 17.4%, about 1 flag in 6.','For non-native writers in this model, about 4 flags in 5 are false. What happens next is up to each school’s policy; drafts and notes show how a piece of writing came together.']},
  {id:'perplexity',kind:'real',lvl:'honors',
   q:'In the Stanford study, why did detectors flag non-native speakers’ essays so often?',
   choices:['Those students used AI more','Detectors key on low perplexity, and simpler, more predictable wording scores low','The essays were longer'],correct:1,
   steps:['Perplexity measures how surprising each next word is to a language model.','Writers with a smaller English vocabulary often choose common, predictable words, which scores as low perplexity.','Low perplexity is the same signal detectors use for AI text, so their human writing looks machine-like to the detector.']}
 ]
}
});
