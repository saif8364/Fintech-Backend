import { rateLimitMiddleware } from "../config/rateLimit.config.js";


const trasactionlimiter = rateLimitMiddleware(24 * 60 * 60 * 1000, 10); // 15 minutes, 100 requests
const changepin_limiter = rateLimitMiddleware(24 * 60 * 60 * 1000, 5); // 15 minutes, 100 requests
const changeusername_limiter = rateLimitMiddleware(24 * 60 * 60 * 1000, 5); // 15 minutes, 100 requests


export { trasactionlimiter, changepin_limiter,changeusername_limiter };