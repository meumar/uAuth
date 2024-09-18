import * as mongoose from 'mongoose';
import { mongodb_url } from './Utils/Config';

const connectDB = async () => {
  try {
    if (mongodb_url !== undefined) {
      const conn = await mongoose.connect(mongodb_url, {
        autoIndex: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

export default connectDB