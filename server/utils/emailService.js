import sgMail from '@sendgrid/mail';
import Job from '../models/Job.js';
import User from '../models/User.js';

// Only set API key if it exists and is valid
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid configured successfully');
} else {
  console.warn('WARNING: SendGrid API key is not set or invalid. Email features will not work.');
}

export const sendDeadlineReminders = async () => {
  // Check if SendGrid is configured
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.log('Skipping email reminders - SendGrid not configured');
    return;
  }

  try {
    // Find jobs with deadlines in the next 48 hours
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const jobs = await Job.find({
      deadline: {
        $gte: new Date(),
        $lte: twoDaysFromNow
      },
      status: { $in: ['applied', 'interview'] }
    }).populate('user');
    
    // Group jobs by user
    const jobsByUser = jobs.reduce((acc, job) => {
      if (!job.user.emailNotifications) return acc;
      
      const userId = job.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: job.user,
          jobs: []
        };
      }
      acc[userId].jobs.push(job);
      return acc;
    }, {});
    
    // Send emails
    for (const userData of Object.values(jobsByUser)) {
      const { user, jobs } = userData;
      
      const jobList = jobs.map(job => 
        `- ${job.role} at ${job.companyName} (Deadline: ${job.deadline.toLocaleDateString()})`
      ).join('\n');
      
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Job Application Deadline Reminder',
        text: `Hi ${user.name},\n\nYou have upcoming deadlines for the following job applications:\n\n${jobList}\n\nDon't forget to follow up!\n\nBest regards,\nAI Job Tracker`,
        html: `
          <h3>Hi ${user.name},</h3>
          <p>You have upcoming deadlines for the following job applications:</p>
          <ul>
            ${jobs.map(job => 
              `<li><strong>${job.role}</strong> at ${job.companyName} (Deadline: ${job.deadline.toLocaleDateString()})</li>`
            ).join('')}
          </ul>
          <p>Don't forget to follow up!</p>
          <p>Best regards,<br>AI Job Tracker</p>
        `
      };
      
      await sgMail.send(msg);
    }
    
    console.log(`Sent deadline reminders to ${Object.keys(jobsByUser).length} users`);
  } catch (error) {
    console.error('Error sending deadline reminders:', error);
  }
};