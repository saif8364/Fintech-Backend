import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
let sql=null
try {
     sql = await postgres(connectionString)
     console.log('DataBase Connected');
     
} catch (error) {
    console.error('Failed to connect to the database:', error)
}

export default sql