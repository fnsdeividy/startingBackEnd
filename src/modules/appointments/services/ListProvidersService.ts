import { inject, injectable } from 'tsyringe';

import ICashProvider from '@shared/container/providers/CacheProvider/models/ICashProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICashProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list: ${user_id}`,
    );

    if (!users) {

      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,

      });

      console.log('A query no banco foi feita!')

      await this.cacheProvider.save(`providers-list: ${user_id}`, users);


    }

    return users;

  }
}

export default ListProvidersService;
