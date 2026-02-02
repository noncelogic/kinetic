import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@noncelogic.com' },
    update: {},
    create: {
      id: 'demo-user-1',
      email: 'demo@noncelogic.com',
      name: 'Demo User',
      role: 'ADMIN',
    },
  });
  console.log('User seeded');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
