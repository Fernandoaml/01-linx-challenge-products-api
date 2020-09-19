import { injectable, inject, container } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ISearchedData from '../dtos/ISearchedData';

@injectable()
class CreateProductCacheService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    hasValue,
    index,
    isNew,
    values,
  }: ISearchedData): Promise<void> {}
}

export default CreateProductCacheService;
