import { getCustomRepository } from 'typeorm';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import UsersRepository from '../typeorm/repository/UsersRepository';
import UserTokensRepository from '../typeorm/repository/UserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userTokenExists = await userTokensRepository.findByToken(token);

    if (!userTokenExists)
      throw new AppError('User Token does not exists!', 400);

    const user = await usersRepository.findById(userTokenExists.user_id);

    if (!user) throw new AppError('User Token does not exists!', 400);

    const tokenCreatedAt = userTokenExists.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate))
      throw new AppError('Token expired.', 400);

    user.password = await hash(password, 8);

    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
