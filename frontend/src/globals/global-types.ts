export type size = 'sm' | 'md' | 'lg';

export type status = 'idle' | 'active';

export type UserInfo = {
  infoAcquired?: boolean;
  authenticated?: boolean;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  accessToken?: string;
}; // + refresh token in cookies

export type UserInfoEditor = (
  propertyToSet: keyof UserInfo,
  propertyValue: string | boolean
) => void;

export type UserInfoGetter = () => Promise<void>;

export type GetAndSetUserInfo = {
  currentUserInfo: UserInfo;
  editUserInfo: UserInfoEditor;
  getUserInfo: UserInfoGetter;
};

export type licenceData = {
  heading?: string[];
  body?: string[][];
  bodyLen?: number;
};
