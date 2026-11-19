BioLab.addPractical({
dwell:{
 hook:'A school learns its software had a hole. The fix arrives a week later and IT installs it the next day. “We’re patched, we’re safe,” someone says. Are they?',
 answer:'Not yet. The intruder got in on day 1, a week before the patch, and copied 2,000 records a day: 14,000 before the door even locked. Locking the door does not remove someone already inside. With no one checking the sign-in records, they stay to day 14 (26,000 records). Checking the records finds them the next day.',
 uses:[
  '<b>Do:</b> turn on sign-in alerts for your school and email accounts, and read them. <b>Why:</b> a “new sign-in from another device” alert is the sign-in record checking itself. If it was not you, change your password and sign out other sessions.',
  '<b>Do:</b> after a company says it fixed a hole, check whether it says anyone got in before the fix. <b>Why:</b> the average time from a hole being found to it being used fell from 63 days to 5 days between 2018 and 2023, Mandiant measured. Patched does not mean nobody got in.',
  '<b>Do:</b> try reading real-looking sign-in records yourself. <b>Why:</b> finding the odd 3 a.m. sign-in is a real job. Raider ForensicsLab’s logs tool lets you practice: <a href="https://rjedtech.github.io/Raider-ForensicsLab/#logs" target="_blank" rel="noopener">ForensicsLab logs</a>.'
 ],
 takeaway:'Patching locks the door; it does not empty the house. Records lost = rate × days inside, and only someone checking the sign-in records ends the stay. When attackers move in days, defenders assume someone may already be in and go look.'
}
});
