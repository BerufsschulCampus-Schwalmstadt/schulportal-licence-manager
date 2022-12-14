import {joyrUser, PrismaClient} from '@prisma/client';
// import { prisma } from './server';

const prisma = new PrismaClient(); // for testing purposes

/**
 * It creates a new user in the database
 * @param {string} emailToSet - The email address of the user to create.
 * @param {string} passwordToSet - The password you want to set for the user
 * @returns A promise of a joyrUser
 */
export async function newUser(
  emailToSet: string,
  passwordToSet: string
): Promise<joyrUser> {
  await prisma.joyrUser.deleteMany();
  const createdUser = await prisma.joyrUser.create({
    data: {
      email: emailToSet,
      password: passwordToSet,
    },
  });
  console.log(createdUser);
  return createdUser;
}

export async function findUserByEmail(emailToQuery: string) {
  return await prisma.joyrUser.findUnique({
    where: {
      email: emailToQuery,
    },
  });
}

/**
 * It deletes a user from the database
 * @param {string} userEmail - The email of the user to delete.
 * @returns The deleted user
 */
export async function deleteUser(userId: string) {
  const deletedUser = await prisma.joyrUser.delete({
    where: {id: userId},
  });

  console.log(deletedUser);
  return deletedUser;
}
