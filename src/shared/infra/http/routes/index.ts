import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import productsRouter from '@modules/products/infra/http/routes/products.routes';
import rateLimiter from '@modules/products/infra/http/middlewares/rateLimiter';
import * as swagerDocument from '@shared/infra/services/swagger.json';

const routes = Router();

routes.use('/products', rateLimiter, productsRouter);
routes.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagerDocument));

export default routes;
