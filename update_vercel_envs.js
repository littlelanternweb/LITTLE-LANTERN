const { execSync } = require('child_process');
const fs = require('fs');

const envs = {
  NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_live_Td9wGc4Gnmvrsu',
  RAZORPAY_KEY_ID: 'rzp_live_Td9wGc4Gnmvrsu',
  RAZORPAY_KEY_SECRET: 'xqDsW23kNu9ZaUulxA0LWx4H'
};

const environments = ['production', 'preview', 'development'];

for (const [key, value] of Object.entries(envs)) {
  for (const env of environments) {
    try {
      console.log(`Removing ${key} from ${env}...`);
      execSync(`npx vercel env rm ${key} ${env} --yes`, { stdio: 'ignore' });
    } catch (e) {
      // Ignore if not exists
    }

    try {
      console.log(`Adding ${key} to ${env}...`);
      // Write value to file without newline
      fs.writeFileSync('temp_val.txt', value);
      execSync(`npx vercel env add ${key} ${env} < temp_val.txt`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`Failed to add ${key} to ${env}`, e.message);
    }
  }
}

if (fs.existsSync('temp_val.txt')) {
  fs.unlinkSync('temp_val.txt');
}
console.log("Done updating Vercel envs.");
