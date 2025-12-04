import { db } from '../db/index.ts';
import { urlsTable } from 'models/url.model.ts';
import { eq, and } from 'drizzle-orm';
import type { CreateUrlBodyType } from 'schema.ts';
import { AppError } from 'utils/AppError.ts';

export class UrlRepository {
    async createUrl (data: CreateUrlBodyType) {
        if(!data.shortCode) throw new AppError("shortcode missing", 400);

        const [result] = await db
            .insert(urlsTable)
            .values(data)
            .returning({
                id: urlsTable.id,
                shortCode: urlsTable.shortCode,
                targetURL: urlsTable.targetURL
            });

        return result;
    }

    async getAllUrl (userId: string) {
        const data = await db
            .select()
            .from(urlsTable)
            .where(eq(urlsTable.id, userId));

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