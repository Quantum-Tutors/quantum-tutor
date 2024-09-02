import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
// const dbUserName = process.env.DB_USER_NAME
// const dbPassword = process.env.DB_PASSWORD
// const dbHostName = process.env.DB_HOST_NAME
// const dbName = process.env.DB_NAME

const cache: {
  connection?: typeof mongoose;
} = {};

async function connectDB() {
  const databaseUrl = `mongodb://localhost:27017`; // process.env.DB_URL
  // const databaseUrl = `mongodb+srv://${dbUserName}:${dbPassword}@${dbHostName}/${dbName}`;
  if (!databaseUrl) {
    throw new Error('No databaseURL');
  }
  if (cache.connection) {
    return cache.connection;
  }
  try {
    cache.connection = await mongoose.connect(databaseUrl);
  } catch (e) {
    cache.connection = undefined;
    throw e;
  }
  return cache.connection;
}

export default connectDB;