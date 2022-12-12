import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

// async function newUser(email:string, password:string) {
//   const user = await prisma.user.create({data: {name: 'Test'}});
//   console.log('user: ' + user + ' has been created');
// }

// async function deleteUser(email:string, password:string) {
//   const user = await prisma.user.findFirst(name: )
//   console.log('user: ' + user + ' has been created');
// }
