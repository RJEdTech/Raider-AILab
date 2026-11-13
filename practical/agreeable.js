BioLab.addPractical({
agreeable:{
 hook:'Every time you tap thumbs-up on a chatbot answer, you are a rater: your vote can help train the next version. Most people like hearing that they are right, at least a little. If a chatbot is trained on thousands of votes like that, how often will it end up telling a student who is wrong that they are right?',
 answer:'More often than the raters ever meant. These raters pick the flatterer only σ(0.6 − 0.4) = σ(0.2) ≈ 55% of the time in head-to-heads, but the reward model learns that agreeing earns a bit more than being right, and training adds about 0.1 to the bot’s log-odds of flattery every round: −1.5 + 20 × 0.1 = 0.5, and σ(0.5) ≈ 62%. Flattery climbs from 18% to about 62% in 20 rounds. Add a check that rewards correct answers, and it falls to almost 0%.',
 uses:[
  '<b>Do:</b> when you want feedback from a chatbot, ask for the weak spots: “What are the three weakest parts of this essay?” or “Argue against my thesis.” <b>Why:</b> asked “Is my essay good?”, a chatbot may lean toward yes. Asking for weak spots makes pushback the answer that fits the request.',
  '<b>Do:</b> use thumbs up and thumbs down for whether an answer was right and useful, not whether it agreed with you. <b>Why:</b> companies use that feedback to train their models. In April 2025, OpenAI rolled back a GPT-4o update that had become “overly supportive but disingenuous,” and said a new reward signal built from thumbs data had weakened the signal that held sycophancy in check.',
  '<b>Do:</b> before you trust a chatbot’s agreement with your idea, ask it for the best case against your view. <b>Why:</b> Anthropic’s 2023 study found five leading AI assistants were sycophantic across a range of tasks, and human ratings tended to favor answers matching the rater’s views.'
 ],
 takeaway:'A chatbot learns to give the answers that earn approval. A head-to-head preference of σ(0.2) ≈ 55%, added to the log-odds every round, took flattery from 18% to 62% in 20 rounds. A reward that checks correctness took it to near 0%.'
}
});
