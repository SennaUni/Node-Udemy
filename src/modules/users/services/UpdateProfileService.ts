import AppError from '@shared/errors/AppError';

import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';

import User from '../typeorm/entity/User';
import UsersRepository from '../typeorm/repository/UsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found.', 400);

    const userUpdateEmail = await usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== user_id)
      throw new AppError('There is already one user with this e-mail.', 400);

    if (password && !old_password)
      throw new AppError('Old password is required.', 400);

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword)
        throw new AppError('Old password does not match.', 400);

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
