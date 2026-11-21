/* Test yourself questions for The Mirror. Steps are 1-based story steps. */
TestYourself.mount({lab:'AILab',id:'mirror',title:'Raider AILab · The Mirror: 95% right, for whom?',el:'#ty',scrollTo:'#cv',go:i=>window.NW.go(i),
 questions:[
 {q:'A test has 90 photos of group A, where the software is 98% right, and 10 photos of group B, where it is 60% right. What headline accuracy does it report?',answer:94.2,tol:.05,unit:'%',
  hint:v=>Math.abs(v-79)<.05?'79% counts both groups equally. Weight each score by its share of the photos: 0.9 and 0.1.':'Multiply each score by its share of the test, then add: 0.9 × 98 + 0.1 × 60.',step:5,stepName:'formula',
  why:'88.2 + 6 = 94.2%. Group B’s 60% barely moves the headline because it is only 10% of the test.'},
 {q:'Same software, but the test now has 50 photos of each group. What happens to the headline?',choices:['It drops, because group B now counts for half','It rises, because the test is now fairer','It stays the same, because the software is the same','It becomes 60%, because group B now decides it'],answer:0,
  hint:'The software is the same. Only the shares changed. Work it out: 0.5 × 98 + 0.5 × 60.',step:3,stepName:'change the test',
  why:'It falls to 79%. Nothing about the software changed, only who was in the test.'},
 {q:'A company says its face software is 97% accurate. What is the most important question to ask?',choices:['Tested on whom: how many photos of each group?','How fast: how many faces a second can it check?','Built by whom: which company made the software?','Rounded how: was 97% rounded up from 96.5%?'],answer:0,
  hint:'In the mirror step, what made a high score look better than the software really was?',step:4,stepName:'the mirror',
  why:'A headline is a weighted average. If one group fills most of the test, the score mostly describes that group.'},
 {q:'Homework counts 30% of your grade and you have a 90. Tests count 70% and you have an 80. What is your grade?',answer:83,tol:.05,unit:'%',
  hint:v=>Math.abs(v-85)<.05?'85 counts homework and tests equally. Tests count more: 0.3 × 90 + 0.7 × 80.':'Weight each score by its share: 0.3 × 90 + 0.7 × 80.',step:5,stepName:'formula',
  why:'27 + 56 = 83. The same weighted average as the headline score.'},
 {q:'A cafeteria survey says 90% of students like the food, but 95% of the answers came from 9th graders. What does the 90% mostly tell you?',choices:['How 9th graders feel','How every student feels','That the food is bad','How seniors feel'],answer:0,
  hint:'Who fills almost the whole “test” here? Whose opinion does the average mostly carry?',step:4,stepName:'the mirror',
  why:'Like the photo test, a result mostly mirrors whoever was in it. Ask who answered before trusting the headline.'}]});
