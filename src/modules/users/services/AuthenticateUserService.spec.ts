import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);

    const user = await createUser.execute({
      name: 'John Snow',
      email: 'johnsnow@got.com',
      password: 'tantofaz'
    });

    const response = await authenticateUser.execute({
      email: 'johnsnow@got.com',
      password: 'tantofaz'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);


    expect(authenticateUser.execute({
      email: 'joaosnow@got.com',
      password: 'tantofaz'
    })).rejects.toBeInstanceOf(AppError)
  });
  it('should not be able to authenticate with invalid password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);

    await createUser.execute({
      name: 'John Snow',
      email: 'johnsnow@got.com',
      password: 'tantofaz'
    });



    expect(authenticateUser.execute({
      email: 'johnsnow@got.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError)


  });

});