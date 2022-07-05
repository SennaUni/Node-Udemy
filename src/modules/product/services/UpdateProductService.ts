import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entity/Product';
import { ProductRepository } from '../typeorm/repository/ProductRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found', 400);
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError('There is already one product with this name', 400);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
