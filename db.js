import postgres from 'postgres'
import { configDotenv } from 'dotenv';
configDotenv();

const connectionString = process.env.DATABASE_URL
let sql;
try {
     sql = await postgres(connectionString)
     console.log('DataBase Connected',sql);
} catch (error) {
    console.log('Error while connecting to database',error);
    
}
   


export {sql}