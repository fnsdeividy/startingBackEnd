
import User from '@modules/users/infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe'

import ICashProvider from '@shared/container/providers/CacheProvider/models/ICashProvider';

import AppError from '@shared/errors/AppError'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest {
  name: string,
  email: string,
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository:IUsersRepository,

    @inject('HashProvider')
    private hashProvider:IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICashProvider,
    ) {}

  public async execute({ name, email, password }: IRequest ): Promise<User> {


    const checkUserExist = await this.usersRepository.findByEmail(email)

    if(checkUserExist) {
      throw new AppError('Email addres already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

   const user = await this.usersRepository.create({
     name,
     email,
     password: hashedPassword
   });

   await this.cacheProvider.invalidatePrefix('provider-list')


   return user;
  }

}

export default CreateUserService


