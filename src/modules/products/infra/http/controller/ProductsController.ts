import { Request, Response } from 'express';
import 'express-async-errors';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import VerifyProductsService from '@modules/products/services/VerifyProductsService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { ip } = request;
    const data = {
      products: request.body,
      ip,
      fullDate: Date.now(),
    } as ICreateProductsDTO;

    const verifyTheRequestService = container.resolve(VerifyProductsService);
    await verifyTheRequestService.execute(data);
    return response.json(classToClass(request.body));
  }
}
