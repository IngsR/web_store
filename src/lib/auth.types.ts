import type { JWTPayload } from 'jose';
import type { User } from './types';

export interface SessionPayload extends JWTPayload {
    user: User;
    expires: Date;
}
