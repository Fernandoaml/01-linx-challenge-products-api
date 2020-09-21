interface IListProductsDTO {
  id: string;
  name: string;
}

export default interface ICreateProductsDTO {
  products: IListProductsDTO[];
  ip: string;
  fullDate: number;
  cacheData?: any;
}
