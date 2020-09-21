import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateProductService from './CreateProductService';

let fakeCacheProvider: FakeCacheProvider;
let createProduct: CreateProductService;

describe('CreateProductCache', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    createProduct = new CreateProductService(fakeCacheProvider);
  });
  it('Should be able to create a new product to a new IP Client.', async () => {
    await createProduct.execute({
      products: [{ id: '123', name: 'mesa1' }],
      fullDate: 1600571719756,
      ip: '192.168.0.50',
    });
    const productCache: any = await fakeCacheProvider.recover(
      `Products-List:192.168.0.50`,
    );
    expect(productCache[0]).toHaveProperty('ip');
    expect(productCache[0].ip).toBe('192.168.0.50');
  });
});
