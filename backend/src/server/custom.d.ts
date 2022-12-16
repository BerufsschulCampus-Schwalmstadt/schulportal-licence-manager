import IdAndEmail from './tokens';

declare global {
  namespace Express {
    export interface Request {
      userIdAndEmail?: IdAndEmail;
    }
  }
}
