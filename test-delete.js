const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCustomer() {
  try {
    const c = await prisma.customer.findFirst();
    if (!c) {
      console.log('No customer found');
      return;
    }
    const id = c.id;
    const apps = await prisma.appointment.findMany({ where: { customerId: id }, select: { id: true } });
    const appIds = apps.map(a => a.id);
    
    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.transaction.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.invoice.deleteMany({ where: { appointmentId: { in: appIds } } }),
      prisma.appointment.deleteMany({ where: { customerId: id } }),
      prisma.child.deleteMany({ where: { customerId: id } }),
      prisma.customerNote.deleteMany({ where: { customerId: id } }),
      prisma.customer.delete({ where: { id } })
    ]);
    
    console.log('Customer Deleted successfully in test script!');
  } catch(e) {
    console.log('CUSTOMER ERROR:', e.message);
  }
}

async function testSpecialist() {
  try {
    const s = await prisma.specialist.findFirst();
    if (!s) {
      console.log('No specialist found');
      return;
    }
    const id = s.id;
    
    await prisma.$transaction(async (tx) => {
      const apps = await tx.appointment.findMany({ where: { specialistId: id }, select: { id: true } });
      const appIds = apps.map(a => a.id);
      
      if (appIds.length > 0) {
        await tx.payment.deleteMany({ where: { appointmentId: { in: appIds } } });
        await tx.transaction.deleteMany({ where: { appointmentId: { in: appIds } } });
        await tx.invoice.deleteMany({ where: { appointmentId: { in: appIds } } });
      }

      await tx.appointment.deleteMany({ where: { specialistId: id } });
      await tx.availability.deleteMany({ where: { specialistId: id } });
      await tx.lockedSlot.deleteMany({ where: { specialistId: id } });
      await tx.slotHold.deleteMany({ where: { specialistId: id } });
      await tx.subscriptionLog.deleteMany({ where: { specialistId: id } });

      await tx.jobApplication.updateMany({
        where: { convertedSpecialistId: id },
        data: { convertedSpecialistId: null }
      });

      await tx.specialist.delete({ where: { id } });

      if (s.userId) {
        await tx.user.deleteMany({ where: { id: s.userId } });
      }
    });
    console.log('Specialist Deleted successfully in test script!');
  } catch(e) {
    console.log('SPECIALIST ERROR:', e.message);
  }
}

async function run() {
  await testCustomer();
  await testSpecialist();
}
run();
