import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import AppError from '@shared/errors/AppErrors';

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  enable_offline_queue: false,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'RateLimiterMiddleware',
  points: 10,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { ip } = request;
    await limiter.consume(ip);
    return next();
  } catch {
    throw new AppError('You has creating too many requests.', 429);
  }
}
