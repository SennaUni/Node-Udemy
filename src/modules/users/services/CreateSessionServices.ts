import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import authJWT from '@config/authJWT';

import User from '../typeorm/entity/User';
import UsersRepository from '../typeorm/repository/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect e-mail/password combination', 401);

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed)
      throw new AppError('Incorrect e-mail/password combination', 401);

    const token = sign({}, authJWT.secret, {
      subject: user.id,
      expiresIn: authJWT.expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionService;
