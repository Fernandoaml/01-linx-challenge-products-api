import { injectable, inject, container } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';

import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import ISearchedData from '@modules/products/dtos/ISearchedData';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import CreateProductService from '@modules/products/services/CreateProductService';

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
    const createProductService = container.resolve(CreateProductService);
    const verifyData: ISearchedData[] = [];
    const cacheData = await this.cacheProvider.recover<ICreateProductsDTO[]>(
      `Products-List:${ip}`,
    );

    if (!cacheData) {
      console.log('Os Dados do produto foram salvos no Redis.');
      const newProduct = { products, fullDate, ip };
      createProductService.execute(newProduct);
    }

    if (cacheData) {
      cacheData.map((data, index) => {
        const isSameData =
          JSON.stringify(products) === JSON.stringify(data.products);
        const momentHour = Date.now();
        const minutes = differenceInMinutes(momentHour, data.fullDate);

        if (isSameData) {
          if (minutes < 10) {
            return verifyData.push({
              hasValue: true,
              index,
              isNew: false,
              values: data,
            });
          }
          // cacheData.splice(index);
          return verifyData.push({
            hasValue: false,
            index,
            isNew: false,
            values: data,
          });
        }
        return verifyData.push({
          hasValue: false,
          index,
          isNew: true,
          values: data,
        });
      });
    }

    // console.log(verifyData);
    // const createProductReturn = createProductService.execute(verifyData);

    // if (verifyData[0] === false) {
    //   cacheData.push({ products, fullDate, ip });
    //   await this.cacheProvider.save(`Products-List:${ip}`, cacheData);
    // }
    // console.log(cacheData);
  }
}

export default VerifyProductsService;
