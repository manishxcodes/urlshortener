import type { Request, Response, NextFunction } from "express";
import { UrlRepository } from "../repositories/url.repository.js";
import { UrlService } from "../services/url.service.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const urlService = new UrlService();
const urlRepo = new UrlRepository();

export const createUrl = asyncHandler(
    async function (req: Request, res:Response, next: NextFunction) {
        const userId = req.userId;
        const targetURL = req.body.targetURL;
        const title = req.body.title;
        const shortCode = "";

        if(!userId) return next(new AppError("Unauthorized", 401));

        const data = await urlService.createUrl({
            title,
            userId,
            targetURL,
            shortCode
        })

        if(!data) return next(new AppError("Couldn't generate shortUrl"));

        return AppResponse.created(res, "Short url generated.", data);
    }
)

export const getAllUrl = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId;
        if(!userId) return next(new AppError("Unauthorized", 401));

        const urls = await urlService.getAllUrl(userId);
         if(!urls) return next(new AppError("Couldn't get all shortUrl"));

        return AppResponse.success(res, "FetchedUrl", urls);
    }
)

export const deleteUrl = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { shortCode } = req.body;
    
    if(!userId) return next(new AppError("Unauthorized", 401));
    if(!shortCode) return next(new AppError("Shortcode required", 400));

    const deletedUrl = await urlService.deleteUrl(shortCode, userId);
    if(!deletedUrl) return next(new AppError("Couldn't delete shortUrl"));

    return AppResponse.success(res, "URL deleted", deletedUrl)
});

export const redirect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const shortCode = req.params.shortCode;
    if(!shortCode) return next(new AppError("Shortcode is required", 401));

    const data = await urlRepo.findByShortCode(shortCode);
    if(!data) return next(new AppError("Invalid url", 404));

    return res.redirect(data.targetURL);
});