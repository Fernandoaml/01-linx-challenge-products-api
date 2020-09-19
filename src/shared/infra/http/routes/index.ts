import { Router } from 'express';

import productsRouter from '@modules/products/infra/http/routes/products.routes';
import rateLimiter from '@modules/products/infra/http/middlewares/rateLimiter';

const routes = Router();

routes.use('/products', rateLimiter, productsRouter);

export default routes;
