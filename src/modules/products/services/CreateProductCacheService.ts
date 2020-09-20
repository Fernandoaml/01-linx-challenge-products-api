import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ICreateProductsDTO from '../dtos/ICreateProductsDTO';

@injectable()
class CreateProductCacheService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(data: ICreateProductsDTO): Promise<void> {
    await this.cacheProvider.save(`Products-List:${data.ip}`, data.cacheData);
  }
}

export default CreateProductCacheService;
