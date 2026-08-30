import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.merchantPolicy.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash('Demo@123', 10);
  
  const merchant = await prisma.user.create({ data: { email: 'merchant@revrescue.demo', password: pw, name: 'Acme SaaS', role: 'ADMIN' } });
  await prisma.merchantPolicy.create({ data: { merchantId: merchant.id, maxRetries: 3, maxDiscount: 5.0, minRecoveryProb: 60.0 } });

  const customer = await prisma.user.create({ data: { email: 'customer@revrescue.demo', password: pw, name: 'Rohan (High Value)', role: 'CUSTOMER', ltv: 120000 } });

  // Seed one recovered past invoice to make KPIs look realistic
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-PAST-001', userId: customer.id, amount: 2999, status: 'RECOVERED',
      failureReason: 'Gateway: BANK_TIMEOUT', gatewayErrorCode: 'BANK_TIMEOUT',
      revenueRiskScore: 40, recoveryProb: 0.9, expectedRecovery: 2699, expectedNet: 2680,
      createdAt: new Date(Date.now() - 86400000), recoveredAt: new Date(Date.now() - 40000000)
    }
  });

  console.log('✅ RevRescue V3 DB Seeded Successfully');
}
main().catch(e => console.error(e));
