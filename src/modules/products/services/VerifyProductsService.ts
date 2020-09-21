import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
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
  }: ICreateProductsDTO): Promise<ICreateProductsDTO> {
    const createProductCacheService = new CreateProductCacheService(
      this.cacheProvider,
    );
    const createProductService = new CreateProductService(this.cacheProvider);

    const compareInternalData: any[] = [];
    const internalDataIndex: any[] = [];
    const compareNewData: any[] = [];

    const cacheData = await this.cacheProvider.recover<ICreateProductsDTO[]>(
      `Products-List:${ip}`,
    );

    if (!cacheData) {
      const newProduct = { products, fullDate, ip };
      await createProductService.execute(newProduct);
      return newProduct;
    }
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
    if (compareInternalData.indexOf(true) !== -1) {
      const list: any = [];
      internalDataIndex.forEach(index => {
        list.push(
          JSON.stringify(products) ===
            JSON.stringify(cacheData[index].products),
        );
      });
      if (list.indexOf(true) !== -1) {
        if (
          differenceInMinutes(
            fullDate,
            cacheData[list.indexOf(true)].fullDate,
          ) < 10
        ) {
          throw new AppError('Too many requests with the same data.', 429);
        } else if (
          differenceInMinutes(
            fullDate,
            cacheData[list.indexOf(true)].fullDate,
          ) >= 10
        ) {
          cacheData.splice(list.indexOf(true), 1);
          cacheData.push({
            products,
            fullDate,
            ip,
          });
          createProductCacheService.execute({
            products,
            fullDate,
            ip,
            cacheData,
          });
          return { products, fullDate, ip };
        }
      }
    }
    cacheData.push({ products, fullDate, ip });
    createProductCacheService.execute({
      products,
      fullDate,
      ip,
      cacheData,
    });
    return { products, fullDate, ip };
  }
}

export default VerifyProductsService;
