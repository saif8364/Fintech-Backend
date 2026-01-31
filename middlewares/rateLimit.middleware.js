import { rateLimitMiddleware } from "../config/rateLimit.config.js";


const trasactionlimiter = rateLimitMiddleware(24 * 60 * 60 * 1000, 10); // 15 minutes, 100 requests
const changelimiter = rateLimitMiddleware(24 * 60 * 60 * 1000, 5); // 15 minutes, 100 requests


export { trasactionlimiter, changelimiter };