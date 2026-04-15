import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany();
  console.log('Templates in DB:', templates.map(t => ({ id: t.id, name: t.name })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
