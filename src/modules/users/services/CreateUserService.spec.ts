import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()


    const createUser = new CreateUserService(fakeUsersRepository,fakeHashProvider);

    const user = await createUser.execute({
      name: 'John Snow',
      email: 'johnsnow@got.com',
      password: 'tantofaz',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider()


    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Snow',
      email: 'johnsnow@got.com',
      password: 'tantofaz',
    });

    expect(
      createUser.execute({
        name: 'John Snow',
        email: 'johnsnow@got.com',
        password: 'tantofaz',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
