import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class CreateProductService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    products,
    fullDate,
    ip,
  }: ICreateProductsDTO): Promise<void> {
    await this.cacheProvider.save(`Products-List:${ip}`, [
      {
        products,
        fullDate,
        ip,
      },
    ]);
  }
}

export default CreateProductService;
