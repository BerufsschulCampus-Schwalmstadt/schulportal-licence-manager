export type UserInfo = {
  authenticated: boolean;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type UserInfoEditor = (
  propertyToSet: keyof UserInfo,
  propertyValue: string | boolean
) => void;

export type GetAndSetUserInfo = {
  currentUserInfo: UserInfo;
  editUserInfo: UserInfoEditor;
};
