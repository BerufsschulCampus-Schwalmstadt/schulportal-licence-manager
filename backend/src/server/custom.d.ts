import {joyrUser} from '@prisma/client';
import IdAndEmail from './routes/tokens';

declare global {
  namespace Express {
    export interface Request {
      userIdAndEmail?: IdAndEmail;
      accessToken?: string;
      user?: joyrUser;
    }
  }
}
