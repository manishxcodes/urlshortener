import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AppError } from 'utils/AppError';

const connectionUrl = process.env.DATABASE_URL;
if(!connectionUrl) {
    throw new AppError("connectionUrl is missing");
}
export const db = drizzle(connectionUrl);

export default db;