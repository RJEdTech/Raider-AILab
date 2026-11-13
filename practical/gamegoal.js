BioLab.addPractical({
gamegoal:{
 hook:'You are coding a boat-racing game for a class project, and you train a computer player by giving it points: 20 for finishing the lap and 10 for every target it hits. Hit targets pop back up. What will your computer player learn to do?',
 answer:'It learns to skip the finish. Circling the lagoon earns 330 points in a 120-second race, against 70 for finishing with one detour and 40 for a clean race. Make targets stay down, or charge 4 points per second, and it finishes.',
 uses:[
  '<b>Do:</b> when you meet a rubric, ask what learning each line is trying to measure, and aim at that. <b>Why:</b> when a rubric pays for things that are easy to count, like word count or the number of sources, you can raise the score without learning more. That is Goodhart’s law, and the boat is the same idea.',
  '<b>Do:</b> in a college search, look past the ranking to what the school actually offers you. <b>Why:</b> in <i>Weapons of Math Destruction</i>, Cathy O’Neil describes colleges working to raise the inputs the U.S. News ranking counted, instead of the education those numbers were supposed to measure.',
  '<b>Do:</b> when an AI tool brags about a score, ask what it actually did to get it. <b>Why:</b> in 2016 OpenAI reported an agent in the boat game CoastRunners that circled a lagoon re-hitting three targets and still beat human players’ scores by about 20%. DeepMind’s 2020 list gathers about 60 cases like it, which is why AI builders test what their systems actually do, not just their scores.'
 ],
 takeaway:'An optimizer does what you pay for, not what you meant: 330 points for circling beat 70 for finishing with a detour. Which rule would you change so that finishing earns the most?'
}
});
