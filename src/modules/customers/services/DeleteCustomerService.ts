import AppError from '@shared/errors/AppError';

import { getCustomRepository } from 'typeorm';

import CustomersRepository from '../typeorm/repository/CustomersRepository';

interface IRequest {
  id: string;
}

class DeleteCustomerService {
  public async execute({ id }: IRequest): Promise<void> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(id);

    if (!customer) throw new AppError('Customer not found.', 400);

    await customerRepository.remove(customer);
  }
}

export default DeleteCustomerService;
