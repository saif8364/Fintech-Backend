import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/errorResponse.js';

export function rateLimitMiddleware(time, maxRequests) {
const limiter = rateLimit({
	windowMs: time, // 15 minutes
	limit: maxRequests, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.   
	
	handler: (req, res, next, options) =>
		 errorResponse(res, `You have exceeded the ${options.windowMs / 60 / 60 / 1000}-hour  requests limit`, 429)
});

return limiter;

}
