import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5, //qntd de req
  duration: 1, //seg
});

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
):Promise<void> {
  try {
    await limiter.consume(req.ip);
    return next();
  } catch(err) {
    throw new AppError('Too many requests', 429)
  }
}
