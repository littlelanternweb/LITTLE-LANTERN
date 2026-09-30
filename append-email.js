const fs = require('fs');
let emailTs = fs.readFileSync('src/lib/email.ts', 'utf-8');

const newFunc = `
  // 15. Faculty Subscription Reminder
  facultySubscriptionReminder: async (to: string, facultyName: string, amount: number, nextBillingDate: string, isPastDue: boolean) => {
    const subject = isPastDue ? \`Subscription Past Due — Action Required\` : \`Upcoming Subscription Renewal — My Lantern\`;
    const content = \`
      <h2 class="title">\${isPastDue ? 'Subscription Past Due' : 'Upcoming Subscription Renewal'}</h2>
      <p>Hello \${facultyName},</p>
      <p>\${isPastDue 
        ? 'Your monthly subscription payment could not be processed or is past due. Please update your payment method to continue accessing your faculty portal and receiving new appointments.' 
        : 'This is a friendly reminder that your monthly subscription will automatically renew soon.'}</p>
      
      <div class="box">
        <div class="box-row"><div class="box-label">Amount</div><div class="box-value">₹\${amount}</div></div>
        <div class="box-row"><div class="box-label">\${isPastDue ? 'Due Date' : 'Renewal Date'}</div><div class="box-value">\${nextBillingDate}</div></div>
        <div class="box-row"><div class="box-label">Status</div><div class="box-value" style="\${isPastDue ? 'color: #B45309;' : ''}">\${isPastDue ? 'PAST DUE' : 'ACTIVE'}</div></div>
      </div>
      
      <div style="text-align: center; margin-top: 32px;">
        <a href="\${baseUrl}/faculty/subscribe" class="btn">\${isPastDue ? 'Update Payment Method' : 'View Subscription'}</a>
      </div>
    \`;

    return sendEmail(to, subject, premiumWrapper(content), isPastDue ? "SUBSCRIPTION_PAST_DUE" : "SUBSCRIPTION_RENEWAL");
  }
};`;

emailTs = emailTs.replace(/};\s*$/, newFunc);
fs.writeFileSync('src/lib/email.ts', emailTs);
console.log('Appended to email.ts');
