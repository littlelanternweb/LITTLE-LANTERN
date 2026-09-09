const fs = require('fs');
const file = 'src/components/admin/AppointmentActions.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/"use client";`nimport Link/, '"use client";\nimport Link');
fs.writeFileSync(file, c);
console.log("Fixed!");
