import cron from 'node-cron';
import sgMail from '@sendgrid/mail';
import Job from '../models/Job.js';
import User from '../models/User.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Run every day at 8am
cron.schedule('0 8 * * *', async () => {
  console.log('📧 Checking for job deadlines...');

  const now = new Date();
  const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  try {
    const jobs = await Job.find({
      deadline: { $lte: next48h, $gte: now }
    }).populate('user');

    for (const job of jobs) {
      const msg = {
        to: job?.user?.email,
        from: process.env.EMAIL_FROM,
        subject: `⏰ Reminder: "${job.role}" at ${job.company}`,
        text: `You've got a deadline coming up for your job application at ${job.company} for "${job.role}" — due on ${new Date(job.deadline).toDateString()}.\n\nGo crush it!`,
      };

      await sgMail.send(msg);
      console.log(`📨 Reminder sent to ${job.user.email}`);
    }
  } catch (err) {
    console.error('❌ Email Reminder Error:', err.message);
  }
});