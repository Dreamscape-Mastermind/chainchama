// types/index.ts

export interface User {
  id: string;
  name: string;
  email?: string | null;
  password?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
  sessions: Session[];
  isVerified?: string | null;
}

export interface Account {
  id: string;
  userId: string;
  type?: string | null;
  provider: string;
  providerAccountId: string;
  token_type?: string | null;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  scope?: string | null;
  id_token?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Session {
  id: string;
  userId?: string | null;
  sessionToken: string;
  accessToken?: string | null;
  expires: Date;
  user?: User | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationRequest {
  id: string;
  identifier: string;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}
