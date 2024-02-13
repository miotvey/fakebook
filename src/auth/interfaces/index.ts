// import { CurrencyEntity } from '../../users/entities/currency.entity';
// import { LanguagesEntity } from '../../users/entities/languages.entity';

import { UserDocument } from '../../user/interfaces/document.model';

export interface RegisterUserBody {
  login: string;
  password: string;
}

export interface LoginUserBody {
  login: string;
  password: string;
}

export interface AuthResp {
  id: number;
  authToken: string;
}

export interface User {
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  login: string;
  password: string;
}

export interface Language {
  id: string;
  isoCode: string;
  name: string;
}

export interface GenerateToken {
  user: UserDocument;
  password: string;
}

export interface SendPasswordResetEmailBody {
  email: string;
  resetPasswordUrl: string;
}

export interface ResetPasswordUserBody {
  login: string;
  password: string;
}

export interface AuthResponse {
  uuid: string;
  authToken: string;
}

export interface SendPasswordResetEmailResponse {
  statusCode: number;
}
