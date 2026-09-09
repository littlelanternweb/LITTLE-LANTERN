const { execSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const urlMatch = envFile.match(/POSTGRES_PRISMA_URL="([^"]+)"/);
if (urlMatch) {
  const url = urlMatch[1];
  try {
    execSync(`npx.cmd prisma db execute --url "${url}" --file migration.sql`, { stdio: 'inherit' });
    console.log("Success");
  } catch(e) {
    console.error(e.message);
  }
} else {
  console.log("No url found");
}
