import AppError from '@shared/errors/AppError';

import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';

import Customer from '../typeorm/entity/Customer';
import CustomersRepository from '../typeorm/repository/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(id);

    if (!customer) throw new AppError('Customer not found.', 400);

    const customerUpdateEmail = await customerRepository.findByEmail(email);

    if (customerUpdateEmail && customerUpdateEmail.id !== id)
      throw new AppError(
        'There is already one customer with this e-mail.',
        400,
      );

    customer.name = name;
    customer.email = email;

    await customerRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
