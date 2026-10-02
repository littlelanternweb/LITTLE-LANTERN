const fs = require('fs');

let content = fs.readFileSync('src/app/admin/specialists/page.tsx', 'utf-8');

// Insert settings fetch
content = content.replace(
  'const services = await prisma.service.findMany({ orderBy: { name: \'asc\' } });',
  `const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });\n\n  const feeSettings = await prisma.setting.findMany({ where: { key: { startsWith: 'fee_' } } });\n  const getFee = (cat) => { const s = feeSettings.find(f => f.key === 'fee_' + cat); return s ? parseInt(s.value, 10) : 1500; };`
);

// Modify ManageSubscriptionDialog to use getFee
content = content.replace(
  /<ManageSubscriptionDialog specialist={specialist} defaultFee={specialist\.subscriptionFee \|\| 1500} \/>/g,
  '<ManageSubscriptionDialog specialist={specialist} defaultFee={specialist.subscriptionFee || getFee(specialist.category)} />'
);

fs.writeFileSync('src/app/admin/specialists/page.tsx', content);
console.log('Fixed ManageSubscriptionDialog fee logic');
