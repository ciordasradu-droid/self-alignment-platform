export function checkinReminderEmail(userName) {
  return {
    subject: 'Your daily check-in is waiting',
    html: `
      <div style="font-family: helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        
        <h1 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 8px;">
          Daily Check-in
        </h1>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          Hi ${userName},
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          Your daily check-in takes less than 2 minutes. 
          Small consistent actions compound into real change.
        </p>

        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
          style="display: inline-block; padding: 14px 28px; background-color: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500;"
        >
          Complete Today's Check-in →
        </a>

        <p style="font-size: 13px; color: #aaa; margin-top: 32px; line-height: 1.6;">
          You're receiving this because you subscribed to the Accountability System.
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #aaa;">Unsubscribe</a>
        </p>

      </div>
    `
  }
}

export function weeklyReviewEmail(userName) {
  return {
    subject: 'Time for your weekly review',
    html: `
      <div style="font-family: helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        
        <h1 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 8px;">
          Weekly Review
        </h1>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          Hi ${userName},
        </p>
        
        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          Another week done. Take 5 minutes to reflect on what worked, 
          what didn't, and what you want to focus on next week.
        </p>

        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
          style="display: inline-block; padding: 14px 28px; background-color: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500;"
        >
          Start Weekly Review →
        </a>

        <p style="font-size: 13px; color: #aaa; margin-top: 32px; line-height: 1.6;">
          You're receiving this because you subscribed to the Accountability System.
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #aaa;">Unsubscribe</a>
        </p>

      </div>
    `
  }
}