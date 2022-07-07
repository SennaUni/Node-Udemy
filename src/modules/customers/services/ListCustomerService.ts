import { getCustomRepository } from 'typeorm';

import Customer from '../typeorm/entity/Customer';
import CustomersRepository from '../typeorm/repository/CustomersRepository';

class ListCustomerService {
  public async execute(): Promise<Customer[]> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customers = customerRepository.find();

    return customers;
  }
}

export default ListCustomerService;
