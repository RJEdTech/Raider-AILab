BioLab.addPractical({
blackbox:{
 hook:'You apply for a summer job. You have the best skills test of five applicants (9 out of 10), 6 months of work, and you live 7 miles from the store. The store’s scoring model was trained on its past hires and is a trade secret. Inside, it is score = 4 × test + 1 × months − 3 × miles. Do you get one of the 2 interviews?',
 answer:'No. You score 4 × 9 + 6 − 3 × 7 = 21. Ana scores 33 and Cam 27.5, so the cutoff is 27.5. Distance cost you 21 points, because past hires mostly lived nearby. Trained on how well last year’s workers did the job, the model drops distance and you score 51, the top score. With the box closed, you would never find out why.',
 uses:[
  '<b>Do:</b> when you apply for a job, ask whether software screens the applications and whether a person reviews the decision. <b>Why:</b> many large employers screen applications with software first. New York City’s Local Law 144 (enforced since July 2023) requires employers that use automated hiring tools there to have a yearly bias audit and to tell candidates.',
  '<b>Do:</b> when a tool is described as “trained on past decisions,” ask whose decisions those were. <b>Why:</b> a model trained on past decisions repeats them. In 2018 Reuters reported that Amazon stopped using an experimental résumé model trained on 10 years of mostly men’s résumés, after it learned to mark down résumés that said “women’s.”',
  '<b>Do:</b> when a number decides something about you, ask what it was trained on and how to appeal. <b>Why:</b> Houston teachers were scored by a model whose formulas were a trade secret, so they could not check their own scores. A federal court let their case go forward in 2017, and the district agreed not to use unverifiable scores to fire teachers.'
 ],
 takeaway:'A model trained on past hires learned −3 points a mile, and your top test score lost: 21 against a cutoff of 27.5. Trained on job performance, you scored 51. Training decides the result, and only an open box lets you see that and appeal it.'
}
});
