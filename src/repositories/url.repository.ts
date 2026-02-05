import { db } from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { eq, and } from 'drizzle-orm';
import type { CreateUrlBodyType } from '../schema.js';
import { AppError } from '../utils/AppError.js';

export class UrlRepository {
    async createUrl (data: CreateUrlBodyType) {
        if(!data.shortCode) throw new AppError("shortcode missing", 400);

        const [result] = await db
            .insert(urlsTable)
            .values(data)
            .returning({
                id: urlsTable.id,
                shortCode: urlsTable.shortCode,
                targetURL: urlsTable.targetURL,
                title: urlsTable.title
            });

        return result;
    }

    async getAllUrl (userId: string) {
        const data = await db
            .select()
            .from(urlsTable)
            .where(eq(urlsTable.userId, userId));

        return data;
    }

    async findByShortCode(shortCode: string) {
        const [url] = await db
            .select()
            .from(urlsTable)
            .where(eq(urlsTable.shortCode, shortCode))
        
        return url;
    }

    async deleteUrl(shortCode: string, userId: string) {
        const [deleted] = await db
            .delete(urlsTable)
            .where(
                and(
                    eq(urlsTable.userId, userId),
                    eq(urlsTable.shortCode, shortCode)
                )
            )
            .returning();

        return deleted;
    }
}