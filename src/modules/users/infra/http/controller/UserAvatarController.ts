import { Request, Response } from 'express'
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
  public async update(req:Request, res:Response): Promise<Response>{
    const updateUserAvatar= container.resolve(UpdateUserAvatarService)

    const users = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    })

    return res.json(  classToClass(users) );


  }


}
