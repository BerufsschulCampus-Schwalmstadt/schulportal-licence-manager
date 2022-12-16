import {joyrUser} from '@prisma/client';
import {prisma} from '../server/server';

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
  // await prisma.joyrUser.deleteMany();
  return await prisma.joyrUser.create({
    data: {
      email: emailToSet,
      password: passwordToSet,
    },
  });
}

export async function findUserByEmail(emailToQuery: string) {
  return await prisma.joyrUser.findUnique({
    where: {email: emailToQuery},
  });
}

export async function findUserById(idToQuery: string) {
  return await prisma.joyrUser.findUnique({
    where: {email: idToQuery},
  });
}

export async function findUserByRefreshToken(refreshToken: string) {
  return await prisma.refreshToken.findUnique({
    where: {token: refreshToken},
    select: {joyrUser: true},
  });
}

export async function pushRefreshToken(refreshToken: string, userId: string) {
  return await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      joyrUserId: userId,
    },
  });
}

/**
 * It deletes all refresh tokens associated with a user, then deletes the user
 * @param {string} userId - the id of the user to delete
 * @returns The deleted user
 */
export async function deleteUser(userId: string) {
  // delete refresh tokens associated with the account
  await prisma.refreshToken.deleteMany({
    where: {joyrUserId: userId},
  });
  // delete the account
  return await prisma.joyrUser.delete({
    where: {id: userId},
  });
}
