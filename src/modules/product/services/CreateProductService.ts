import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import RedisCache from '@shared/cache/RedisCache';
import Product from '../typeorm/entity/Product';
import { ProductRepository } from '../typeorm/repository/ProductRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const productExists = await productsRepository.findByName(name);

    const redisCache = new RedisCache();

    if (productExists) {
      throw new AppError('There is already one product with this name', 400);
    }

    const product = productsRepository.create({
      name: name,
      price: price,
      quantity: quantity,
    });

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
