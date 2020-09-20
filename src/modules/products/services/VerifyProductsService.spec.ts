import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppErrors';
import VerifyProductsService from './VerifyProductsService';

let fakeCacheProvider: FakeCacheProvider;
let verifyProducts: VerifyProductsService;

describe('CreateProductCache', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    verifyProducts = new VerifyProductsService(fakeCacheProvider);
  });
  it('Should be able to create a new product to a new IP Client. If cache data is false', async () => {
    await verifyProducts.execute({
      products: [{ id: '123', name: 'mesa1' }],
      fullDate: 1600571719756,
      ip: '192.168.0.51',
    });
    const productCache: any = await fakeCacheProvider.recover(
      `Products-List:192.168.0.51`,
    );
    expect(productCache[0]).toHaveProperty('ip');
    expect(productCache[0].ip).toBe('192.168.0.51');
  });
  it('Should be able to create a same product to a with existent IP Client. But after passed the wait period time.', async () => {
    await verifyProducts.execute({
      products: [{ id: '123', name: 'mesa1' }],
      fullDate: 1600571719756,
      ip: '192.168.0.200',
      cacheData: test,
    });
    await verifyProducts.execute({
      products: [{ id: '123', name: 'mesa1' }],
      fullDate: Date.now(),
      ip: '192.168.0.200',
      cacheData: test,
    });

    const productCache: any = await fakeCacheProvider.recover(
      `Products-List:192.168.0.200`,
    );
    expect(productCache[0]).toHaveProperty('ip');
    expect(productCache[0].ip).toBe('192.168.0.200');
  });
  it('Should be able to create a new product to a with existent IP Client.', async () => {
    await verifyProducts.execute({
      products: [{ id: '123', name: 'mesa1' }],
      fullDate: 1600571719756,
      ip: '192.168.0.200',
      cacheData: test,
    });
    const timeNow = Date.now();
    await verifyProducts.execute({
      products: [{ id: '123', name: 'mesa2' }],
      fullDate: timeNow,
      ip: '192.168.0.200',
      cacheData: test,
    });

    const productCache: any = await fakeCacheProvider.recover(
      `Products-List:192.168.0.200`,
    );
    expect(productCache[1]).toHaveProperty('ip');
    expect(productCache[1].ip).toBe('192.168.0.200');
    expect(productCache[1]).toHaveProperty('products');
    expect(productCache[1].fullDate).toBe(timeNow);
  });

  it('Should not be able to create a same product on a flood communication', async () => {
    const timeNow = Date.now();

    await verifyProducts.execute({
      products: [{ id: '123', name: 'mesa2' }],
      fullDate: timeNow,
      ip: '192.168.0.200',
      cacheData: test,
    });

    await expect(
      verifyProducts.execute({
        products: [{ id: '123', name: 'mesa2' }],
        fullDate: timeNow,
        ip: '192.168.0.200',
        cacheData: test,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
