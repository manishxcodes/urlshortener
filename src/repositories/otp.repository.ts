import { otpsTable } from 'models/otp.model.js';
import { db } from '../db/index.js';
import { otpEntitySchema, type OtpEntityType, type OtpInsertType } from 'schema.js';
import { desc, eq } from 'drizzle-orm';

export class OtpRepository {
    async create (data: OtpInsertType): Promise<OtpEntityType> {
        const [row] = await db
            .insert(otpsTable)
            .values(data)
            .returning();

        if (!row) throw new Error("Failed to create OTP");

        return otpEntitySchema.parse({
            ...row,
            attempts: row.attempts ?? 0,
            createdAt: row.createdAt ?? new Date()
        })
    }

    async findLatestByEmail (email: string) {
        const [row] = await db  
            .select()
            .from(otpsTable)
            .where(
                eq(otpsTable.email, email)
            )
            .orderBy(
                desc(otpsTable.createdAt)
            )
        
        return row || null;
    }

    async markVerified (id: string) {
        await db.update(otpsTable)
            .set({ verifiedAt: new Date() })
            .where(
                eq(otpsTable.id, id)
            )
    }

    async incrementAttempts (id: string, attempts: number) {
        await db.update(otpsTable)
            .set({ attempts })
            .where(
                eq(otpsTable.id, id)
            )
    }
}