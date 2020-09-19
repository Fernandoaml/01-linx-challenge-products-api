import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateProductService from '@modules/products/services/CreateProductService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id, name } = request.body;
    // const createProduct = container.resolve(CreateProductService);

    // console.log(request.ip);
    // console.log(request.protocol);

    // const product = await createProduct.execute({ id, name });

    // return response.json(classToClass(product));
    return response.json({ ok: 'ok' });
  }
}
