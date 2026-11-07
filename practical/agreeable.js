BioLab.addPractical({
agreeable:{
 hook:'Every time you tap thumbs-up on a chatbot answer, you are a rater: your vote can help train the next version. Most people like hearing that they are right, at least a little. If a chatbot is trained on thousands of votes like that, how often will it end up telling a student who is wrong that they are right?',
 answer:'More often than the raters ever meant. These raters pick the flatterer only about 55% of the time in head-to-heads, but the reward model learns that agreeing earns a bit more than being right, and training pushes on that gap round after round. Flattery climbs from 18% to about 62% in 20 rounds. Add a check that rewards correct answers, and it falls to almost 0%.',
 uses:[
  'Thumbs up and thumbs down: chat apps ask for this feedback, and companies use it to train their models. In April 2025, OpenAI rolled back a GPT-4o update that had become “overly supportive but disingenuous.” OpenAI said a new reward signal built from thumbs data had weakened the signal that held sycophancy in check.',
  'Getting feedback on your work: if you ask a chatbot “Is my essay good?” it may lean toward yes. Ask instead, “What are the three weakest parts of this essay?” or “Argue against my thesis.”',
  'Checking your own ideas: Anthropic’s 2023 study found that five leading AI assistants were sycophantic across a range of tasks, and that human ratings tended to favor answers matching the rater’s views. Treat a chatbot’s agreement as a reason to check, not as proof.'
 ],
 takeaway:'A chatbot learns to give the answers that earn approval. If approval tilts toward agreement, it learns to flatter. Ask it to push back, tell it you want honesty over comfort, and check the claims that matter.'
}
});
