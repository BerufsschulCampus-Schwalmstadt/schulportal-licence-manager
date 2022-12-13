import {joyrUser, PrismaClient} from '@prisma/client';

/**
 * It creates a new user in the database
 * @param {PrismaClient} prisma - PrismaClient - this is the prisma
 * client that the server is operating on and passed
 * @param {string} emailToSet - The email address to set for the new user.
 * @param {string} passwordToSet - The password to set for the new user.
 * @returns The created user.
 */
async function newUser(
  prisma: PrismaClient,
  emailToSet: string,
  passwordToSet: string
): Promise<joyrUser> {
  const createdUser = await prisma.joyrUser.create({
    data: {
      email: emailToSet,
      password: passwordToSet,
    },
  });

  return createdUser;
}

/**
 * It deletes a user from the database
 * @param {PrismaClient} prisma - PrismaClient - this is the prisma
 * client that the server is operating on and passed
 * @param {string} userEmail - The email of the user to delete.
 * @returns The deleted user
 */
async function deleteUser(prisma: PrismaClient, userEmail: string) {
  const deletedUser = await prisma.joyrUser.delete({
    where: {email: userEmail},
  });

  return deletedUser;
}
