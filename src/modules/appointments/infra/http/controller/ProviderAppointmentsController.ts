import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from "tsyringe";
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(req:Request, res:Response):Promise<Response> {
    const provider_id = req.user.id;

    const { day, month, year } = req.body




    const listProviderAppointments = container.resolve(ListProviderAppointmentsService);

    const appointments = await listProviderAppointments.execute({  day, month, year, provider_id });

    return res.json(appointments)
  }
}