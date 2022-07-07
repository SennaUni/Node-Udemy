import CustomersRepository from '@modules/customers/typeorm/repository/CustomersRepository';
import { ProductRepository } from '@modules/product/typeorm/repository/ProductRepository';
import AppError from '@shared/errors/AppError';

import { getCustomRepository } from 'typeorm';

import Order from '../typeorm/entity/Order';
import { OrdersRepository } from '../typeorm/repository/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customerRespository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductRepository);

    const customerExists = await customerRespository.findById(customer_id);

    if (!customerExists)
      throw new AppError('Coult not find any customer with the given id', 400);

    const existsProducts = await productRepository.findAllByIds(products);

    if (!existsProducts.length)
      throw new AppError('Coult not find any products with the given ids', 400);

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Coult not find any products ${checkInexistentProducts[0].id}`,
        400,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity}
        is not available for ${quantityAvailable[0].id}`,
        400,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
