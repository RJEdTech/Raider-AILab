BioLab.addPractical({
promptcost:{
 hook:'You ask an AI chatbot for homework help about 20 times a day. A friend says every prompt uses as much energy as charging your phone. Is that right? How many prompts really add up to one phone charge, and what happens when a whole school does it?',
 answer:'By Google’s own number (0.24 Wh for its median text prompt), about 50 prompts use the energy of one 12 Wh phone charge. Your 20 a day is 4.8 Wh, 0.4 of a charge. A school about RJ’s size at that rate uses about 8.16 kWh a day, about 680 phone charges. One prompt is small; the totals are what grow. Every per-prompt number is a company self-report, and each one counts different things.',
 uses:[
  '<b>Do:</b> when you read a headline like “one prompt uses X,” ask what was counted, whether it is a median or an average, and who measured it. <b>Why:</b> counting only serving or the full life cycle gives very different numbers. Google, OpenAI’s CEO and Mistral each reported something different.',
  '<b>Do:</b> follow how the Colorado PUC decides who pays for new power for data centers. <b>Why:</b> in April 2026, Xcel Energy proposed a large-load rate so data centers needing 50 MW or more pay for the new power plants and transmission lines they require. In Xcel’s last resource plan, the PUC approved 6,000 of the 14,000 MW of new generation Xcel requested.',
  '<b>Do:</b> convert energy numbers to one unit (Wh, kWh, TWh) before you compare them. <b>Why:</b> the same unit math sets the national picture. US data centers used about 4.4% of US electricity in 2023, and Lawrence Berkeley National Lab projects 6.7% to 12% by 2028.'
 ],
 takeaway:'One prompt is small: 12 ÷ 0.24 = 50 make a phone charge by Google’s count. The totals are what grow, and every per-prompt number depends on what was counted. Which number would you put in a headline, and what would you say it counts?'
}
});
