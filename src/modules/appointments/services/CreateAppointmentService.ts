import { startOfHour } from "date-fns";
import Appointment from "../infra/typeorm/entities/Appointments";
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from "../infra/typeorm/repositories/AppointmentRepository";
import AppError from '@shared/errors/AppError'

interface Request {
  provider_id:string;
  date: Date;
}

class CreateAppointmentService {

  public async execute({ provider_id, date }: Request): Promise<Appointment> {

    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date)


  const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate)

  if(findAppointmentInSameDate ) {
    throw new AppError('This appointment is already booked')
  }


  const appointment = appointmentsRepository.create({
    provider_id,
    date:appointmentDate

  })
  await appointmentsRepository.save(appointment)

  return appointment;
  }

}

export default CreateAppointmentService;