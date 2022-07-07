import AppError from '@shared/errors/AppError';

import { getCustomRepository } from 'typeorm';

import Customer from '../typeorm/entity/Customer';
import CustomersRepository from '../typeorm/repository/CustomersRepository';

interface IRequest {
  id: string;
}

class ShowCustomerService {
  public async execute({ id }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(id);

    if (!customer) throw new AppError('Customer not found.', 400);

    return customer;
  }
}

export default ShowCustomerService;
