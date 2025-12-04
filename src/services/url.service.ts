import { UrlRepository } from "repositories/url.repository";
import type { CreateUrlBodyType } from "schema";
import { nanoid } from "nanoid";
import { AppError } from "utils/AppError";

export class UrlService {
    private repository = new UrlRepository();

    async createUrl (data: CreateUrlBodyType) {
        const shortCode = nanoid(8);

        const newShortUrl = await this.repository.createUrl({
            shortCode,
            targetURL: data.targetURL,
            userId: data.userId
        })
        if(!newShortUrl) throw new AppError("Couldn't generate url", 500);

        return newShortUrl;
    }

    async getAllUrl (userId: string) {
        return this.repository.getAllUrl(userId);
    }

    async deleteUrl (shortCode: string, userId: string) {
        const deleted =  this.repository.deleteUrl(shortCode, userId);

        if (!deleted) throw new AppError("URL not found or not owned by user", 404);
        return deleted;
    }
}