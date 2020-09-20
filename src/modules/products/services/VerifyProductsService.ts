import { injectable, inject, container } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';

import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import CreateProductService from '@modules/products/services/CreateProductService';
import CreateProductCacheService from '@modules/products/services/CreateProductCacheService';
import AppError from '@shared/errors/AppErrors';

@injectable()
class VerifyProductsService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    fullDate,
    ip,
    products,
  }: ICreateProductsDTO): Promise<void> {
    const compareInternalData: any[] = [];
    const internalDataIndex: any[] = [];
    const compareNewData: any[] = [];
    const createProductService = container.resolve(CreateProductService);
    const createProductCacheService = container.resolve(
      CreateProductCacheService,
    );

    const cacheData = await this.cacheProvider.recover<ICreateProductsDTO[]>(
      `Products-List:${ip}`,
    );

    if (!cacheData) {
      const newProduct = { products, fullDate, ip };
      createProductService.execute(newProduct);
    }

    if (cacheData) {
      cacheData.forEach((data, index) => {
        internalDataIndex.push(index);
        cacheData.forEach(compare => {
          compareInternalData.push(
            JSON.stringify(data.products) === JSON.stringify(compare.products),
          );
        });
        compareNewData.push(
          JSON.stringify(products) === JSON.stringify(data.products),
        );
      });
      cacheData.forEach(
        async (data, position): Promise<void> => {
          const momentHour = Date.now();
          const minutes = differenceInMinutes(momentHour, data.fullDate);
          if (compareInternalData.indexOf(true) !== -1) {
            if (minutes < 1) {
              return;
            }
            cacheData.splice(internalDataIndex[position], 1);
            cacheData.push({
              products: data.products,
              fullDate: momentHour,
              ip: data.ip,
            });
            createProductCacheService.execute({
              products: data.products,
              fullDate: momentHour,
              ip: data.ip,
              cacheData,
            });
          }
        },
      );
      if (compareNewData.indexOf(true) === -1) {
        cacheData.push({ products, fullDate, ip });
        createProductCacheService.execute({
          products,
          fullDate,
          ip,
          cacheData,
        });
        return;
      }
      throw new AppError(
        'You has creating too many requests with the same data.',
        429,
      );
    }
  }
}

export default VerifyProductsService;
