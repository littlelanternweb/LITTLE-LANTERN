import nodemailer from "nodemailer";

const baseUrl = "https://littlelantern.vercel.app";
const premiumWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 0; background-color: #F8FAF9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,166,147,0.04); border: 1px solid #F1F5F4; }
  .header { padding: 48px 40px; text-align: center; border-bottom: 1px solid #F1F5F4; background: #ffffff; }
  .logo-img { width: 64px; height: 64px; border-radius: 14px; margin-bottom: 16px; border: 1px solid #E2E8F0; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
  .logo { font-size: 22px; font-weight: 600; color: #0F172A; letter-spacing: -0.5px; }
  .content { padding: 48px 40px; color: #475569; font-size: 16px; line-height: 1.6; font-weight: 400; }
  .title { color: #00A693; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; letter-spacing: -0.5px; }
  .box { background: #F8FAF9; border: 1px solid #F1F5F4; border-radius: 12px; padding: 24px; margin: 32px 0; }
  .box-row { display: flex; margin-bottom: 12px; }
  .box-row:last-child { margin-bottom: 0; }
  .box-label { font-weight: 500; color: #334155; width: 130px; flex-shrink: 0; font-size: 14px; }
  .box-value { color: #0F172A; font-weight: 500; font-size: 14px; }
  .footer { padding: 40px; text-align: center; background: #0F172A; color: #94A3B8; font-size: 13px; line-height: 1.6; }
  .footer strong { color: #FFFFFF; font-weight: 600; font-size: 14px; }
  .btn { display: inline-block; background: #00A693; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; margin-top: 32px; font-size: 15px; box-shadow: 0 4px 12px rgba(0,166,147,0.2); }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${baseUrl}/logo.jpg" alt="Little Lantern" class="logo-img" />
      <div class="logo">Little Lantern</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <strong>Little Lantern</strong><br/>
      Child Consultation Centre<br/>
      Wandoor, Kerala 679328<br/><br/>
      9961757373<br/>
      WhatsApp: +91 99617 57373
    </div>
  </div>
</body>
</html>
`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "littlelanternweb@gmail.com",
    pass: "hxof mfmb nzns tisq",
  },
});

async function run() {
  const to = "technexttechnologies@gmail.com";
  const html = premiumWrapper(`
    <h2 class="title">Welcome to Little Lantern</h2>
    <p>This is a modern UI test for Little Lantern emails.</p>
    <div class="box">
      <div class="box-row">
        <div class="box-label">Testing:</div>
        <div class="box-value">Theme update & Logo fix</div>
      </div>
    </div>
  `);

  console.log("Sending email...");
  await transporter.sendMail({
    from: '"Little Lantern" <littlelanternweb@gmail.com>',
    to,
    subject: "Theme & Logo Test - Little Lantern",
    html,
  });
  console.log("Sent successfully!");
}
run();
