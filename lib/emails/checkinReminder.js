export function dailyReminderEmail(userName) {
  return {
    subject: 'Your daily alignment check-in is waiting ✦',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#fafaf8;font-family:'DM Sans',sans-serif;">
          <div style="max-width:520px;margin:40px auto;padding:0 24px;">

            <div style="text-align:center;margin-bottom:32px;">
              <p style="font-size:28px;font-weight:600;font-family:Georgia,serif;color:#1a1a1a;margin:0;">✦ Alignment</p>
            </div>

            <div style="background:#fff;border-radius:16px;border:1px solid #e8e8e4;padding:36px;">
              <p style="font-size:13px;font-weight:600;color:#7C5CBF;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Daily Check-in</p>
              <h1 style="font-size:28px;font-weight:600;color:#1a1a1a;font-family:Georgia,serif;margin:0 0 16px;line-height:1.3;">
                Hey ${userName || 'there'} — how are you showing up today?
              </h1>
              <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 28px;">
                Your daily alignment check-in is ready. It takes 2 minutes and keeps your momentum going. Small consistent actions build the life you want.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;padding:14px 28px;background:#7C5CBF;color:#fff;border-radius:10px;font-size:15px;font-weight:500;text-decoration:none;">
                Open my dashboard →
              </a>
            </div>

            <div style="margin-top:24px;padding:20px;background:#f0f0ff;border-radius:12px;">
              <p style="font-size:13px;color:#7C5CBF;line-height:1.6;margin:0;">
                ✦ You are not alone in this. Every check-in is a small act of self-respect.
              </p>
            </div>

            <p style="text-align:center;font-size:12px;color:#999;margin-top:24px;">
              You're receiving this because you signed up for the Alignment Accountability System.<br/>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#7C5CBF;">Manage preferences</a>
            </p>

          </div>
        </body>
      </html>
    `
  }
}

export function weeklyReviewEmail(userName) {
  return {
    subject: 'Time for your weekly alignment review ✦',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#fafaf8;font-family:'DM Sans',sans-serif;">
          <div style="max-width:520px;margin:40px auto;padding:0 24px;">

            <div style="text-align:center;margin-bottom:32px;">
              <p style="font-size:28px;font-weight:600;font-family:Georgia,serif;color:#1a1a1a;margin:0;">✦ Alignment</p>
            </div>

            <div style="background:#fff;border-radius:16px;border:1px solid #e8e8e4;padding:36px;">
              <p style="font-size:13px;font-weight:600;color:#4A9B7F;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Weekly Review</p>
              <h1 style="font-size:28px;font-weight:600;color:#1a1a1a;font-family:Georgia,serif;margin:0 0 16px;line-height:1.3;">
                This week is done, ${userName || 'friend'}. Let's reflect.
              </h1>
              <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 28px;">
                Your weekly review is available. 5 minutes to celebrate your wins, acknowledge what was hard, and set your intention for next week. This is how alignment compounds over time.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;padding:14px 28px;background:#4A9B7F;color:#fff;border-radius:10px;font-size:15px;font-weight:500;text-decoration:none;">
                Start my weekly review →
              </a>
            </div>

            <div style="margin-top:24px;padding:20px;background:#f0fff8;border-radius:12px;">
              <p style="font-size:13px;color:#4A9B7F;line-height:1.6;margin:0;">
                ✦ Every week you show up for yourself is a week that counts.
              </p>
            </div>

            <p style="text-align:center;font-size:12px;color:#999;margin-top:24px;">
              You're receiving this because you signed up for the Alignment Accountability System.<br/>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#4A9B7F;">Manage preferences</a>
            </p>

          </div>
        </body>
      </html>
    `
  }
}