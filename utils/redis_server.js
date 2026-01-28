import { Redis } from '@upstash/redis'

let redis;
export const getRedis = async () => {   

try {
  redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})
console.log('Redis Connected Successfully');

} catch (error) {
    console.log('Error while connecting to Redis',error);
    
}
return redis;
}

