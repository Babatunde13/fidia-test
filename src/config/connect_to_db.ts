import mongoose from 'mongoose'
import envs from './envs'

export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(envs.MONGO_DB_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`)
    } catch (error) {
        console.error(error)
    }
}
