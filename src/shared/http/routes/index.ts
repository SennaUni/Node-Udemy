import { Router } from 'express';

import productsRouter from '@modules/product/routes/products.routes';
import usersRouter from '@modules/users/routes/user.routes';
import sessionRouter from '@modules/users/routes/session.routes';
import passwordRouter from '@modules/users/routes/password.routes';
import profileRouter from '@modules/users/routes/profile.routes';
import customerRoutes from '@modules/customers/routes/customer.routes';
import ordersRouter from '@modules/orders/routes/orders.routes';

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/customers', customerRoutes);
routes.use('/orders', ordersRouter);

export default routes;
