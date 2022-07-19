import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repository/ProductRepository';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);

    const redisCache = new RedisCache();

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found', 400);
    }

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
