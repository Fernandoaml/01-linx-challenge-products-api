import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateProductCacheService from './CreateProductCacheService';

let fakeCacheProvider: FakeCacheProvider;
let createProductCache: CreateProductCacheService;

describe('CreateProductCache', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    createProductCache = new CreateProductCacheService(fakeCacheProvider);
  });
  it('Should be able to create a new product on a existing cache data from specific ip', async () => {
    const test = [
      {
        products: [{ id: '123', name: 'mesa1' }],
        fullDate: 1600571719756,
        ip: '192.168.0.249',
      },
      {
        products: [{ id: '124', name: 'mesa2' }],
        fullDate: 1600571712321,
        ip: '192.168.0.249',
      },
    ];
    await createProductCache.execute({
      products: [{ id: '123', name: 'mesa1' }],
      fullDate: 1600571719756,
      ip: '192.168.0.249',
      cacheData: test,
    });
    const productCache: any = await fakeCacheProvider.recover(
      `Products-List:192.168.0.249`,
    );
    expect(productCache[0]).toHaveProperty('ip');
    expect(productCache[0].ip).toBe('192.168.0.249');
  });
});
