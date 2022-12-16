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
 * It deletes a user from the database
 * @param {string} userEmail - The email of the user to delete.
 * @returns The deleted user
 */
export async function deleteUser(userId: string) {
  return await prisma.joyrUser.delete({
    where: {id: userId},
  });
}
