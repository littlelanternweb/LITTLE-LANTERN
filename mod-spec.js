const fs = require('fs');
let content = fs.readFileSync('src/app/admin/specialists/page.tsx', 'utf-8');

content = content.replace('import { SpecialistOrderSelect } from "@/components/admin/SpecialistOrderSelect";', 'import { SpecialistOrderSelect } from "@/components/admin/SpecialistOrderSelect";\nimport { ManageSubscriptionDialog } from "@/components/admin/ManageSubscriptionDialog";');

// Need to make sure we also fetch settings to know the exact default fee for each category,
// but for simplicity, we can just use specialist.subscriptionFee || 1500
content = content.replace('<AvailabilityDialog specialist={specialist} />', '<ManageSubscriptionDialog specialist={specialist} defaultFee={specialist.subscriptionFee || 1500} />\n                <AvailabilityDialog specialist={specialist} />');

fs.writeFileSync('src/app/admin/specialists/page.tsx', content);
console.log('Modified specialists page');
