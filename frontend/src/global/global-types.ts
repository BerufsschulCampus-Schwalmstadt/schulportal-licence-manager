export type user = {
  id: string;
  email: string;
  accountType: 'BASIC' | 'ADMIN';
  smsAccountId: string | null;
};
