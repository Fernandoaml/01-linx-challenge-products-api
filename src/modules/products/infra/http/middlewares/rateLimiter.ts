import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { format } from 'date-fns';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';
import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import VerifyProductsService from '@modules/products/services/VerifyProductsService';

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  enable_offline_queue: false,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'RateLimiterMiddleware',
  points: 10,
  duration: 600,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { ip } = request;
    const data = {
      products: request.body,
      ip,
      fullDate: Date.now(),
    } as ICreateProductsDTO;

    const verifyTheRequestService = container.resolve(VerifyProductsService);
    await verifyTheRequestService.execute(data);
    // console.log(`Verificação de Existencia: ${exists}`);
    await limiter.consume(ip);
    return next();
  } catch {
    throw new AppError(
      'You has creating too many requests with the same data.',
      429,
    );
  }
}
