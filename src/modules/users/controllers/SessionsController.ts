import { Request, Response } from 'express';
import { instanceToInstance } from 'class-transformer';

import CreateSessionService from '../services/CreateSessionServices';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = new CreateSessionService();

    const user = await createSession.execute({
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}
