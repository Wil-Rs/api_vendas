import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  id: string;
  name: string;
  password: string;
  email: string;
  avatar: string;
}

class UpdateUserService {
  public async execute({ id, avatar, email, name, password }: IRequest) {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const emailExist = await usersRepository.findByEmail(email);
    if (emailExist || user.email != email) {
      return new AppError('There is already one user with this email');
    }

    user.avatar = avatar;
    user.email = email;
    user.name = name;
    user.password = password;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
