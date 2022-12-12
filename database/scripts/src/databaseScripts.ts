import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function newUser() {
  const user = await prisma.user.create({data: {name: 'Ryan'}});
  const users = await prisma.user.findMany();
  console.log(user);
}
