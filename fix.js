const fs = require('fs');

const files = [
  'src/app/admin/page.tsx',
  'src/app/admin/appointments/[id]/AppointmentDetailClient.tsx',
  'src/app/faculty/dashboard/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}
