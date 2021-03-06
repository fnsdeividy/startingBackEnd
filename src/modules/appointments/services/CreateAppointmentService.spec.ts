import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCashProvider from '@shared/container/providers/CacheProvider/fakes/FakeCashProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCashProvider: FakeCashProvider;

describe('CreateAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCashProvider = new FakeCashProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCashProvider,
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 9, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 9, 10, 13),
      provider_id: '123',
      user_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 10, 12, 10);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123',
      user_id: '123123',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a paste date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 9, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 11),
        provider_id: '123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 9, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 10, 13),
        provider_id: '123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 9, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 9, 11, 7),
        provider_id: '123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
    
    await expect(
      createAppointment.execute({
        date: new Date(2021, 9, 11, 18),
        provider_id: '123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
