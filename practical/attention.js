BioLab.addPractical({
attention:{
 hook:'“The trophy didn’t fit in the suitcase because it was too big.” A chatbot has to work out that “it” means the trophy. Inside the model, “it” gives the trophy a match score of 3, the suitcase 0 and “fit” 0.75, then turns the scores into shares that add to 100%. What share of the attention goes to “trophy”?',
 answer:'About 86.6%. The model raises e to each score: e³ ≈ 20.09, e⁰ = 1, e^0.75 ≈ 2.12. The total is 23.21, and 20.09 ÷ 23.21 ≈ 0.866. Change “big” to “small” and the suitcase gets the same 86.6%.',
 uses:[
  '<b>Do:</b> in a prompt, name the thing you mean (“the trophy”) instead of “it” or “that.” <b>Why:</b> every word in your prompt shifts where the model’s attention goes, the way one word moved “it” from the trophy to the suitcase. Saying exactly what you mean leaves less for the model to guess.',
  '<b>Do:</b> when you see an AI heat map, read it as “where this step looked,” not “why the model answered.” <b>Why:</b> researchers disagree about how much attention weights explain a model (“Attention is not Explanation,” Jain and Wallace, 2019, and a reply, “Attention is not not Explanation,” 2019).',
  '<b>Do:</b> look at how your own 24 hours split across apps, the way the model splits 100% of its attention. <b>Why:</b> apps are scored on their share of your time. In Pew Research Center’s 2024 survey of U.S. teens, 46% said they are online almost constantly, up from 24% a decade earlier. To see how apps compete for that share, try <a href="https://rjedtech.github.io/Raider-HealthLab/#screentime" target="_blank" rel="noopener">HealthLab’s screen-time tool</a>.'
 ],
 takeaway:'Attention turns match scores into shares with e^score ÷ the total: scores of 3, 0 and 0.75 gave “trophy” 86.6%. Exponentials stretch small gaps, and one changed word can move most of the attention.'
}
});
