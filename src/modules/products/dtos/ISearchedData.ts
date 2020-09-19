import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';

export default interface ISearchedData {
  index: number;
  hasValue: boolean;
  isNew: boolean;
  values: ICreateProductsDTO;
}
