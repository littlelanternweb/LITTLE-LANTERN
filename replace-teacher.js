const fs = require('fs');

function replaceTeacher(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/"Teacher"/g, '"Remedial Teacher"');
  content = content.replace(/'Teacher'/g, "'Remedial Teacher'");
  content = content.replace(/Teacher Profile/g, 'Remedial Teacher Profile');
  fs.writeFileSync(filePath, content);
}

replaceTeacher('src/app/admin/jobs/page-client.tsx');
replaceTeacher('src/components/careers/ApplicationForm.tsx');
replaceTeacher('src/app/careers/page.tsx');
replaceTeacher('src/app/api/admin/applications/[id]/route.ts');

console.log('Replaced Teacher with Remedial Teacher');
