import {joyrUser} from '@prisma/client';
import {prisma} from './server';

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
 * @param {string} userEmail - The email of the user to delete.
 * @returns The deleted user
 */
export async function deleteUser(userEmail: string) {
  const deletedUser = await prisma.joyrUser.delete({
    where: {email: userEmail},
  });

  return deletedUser;
}
