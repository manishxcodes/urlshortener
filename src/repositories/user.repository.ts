import { db } from '../db/index.ts';
import { usersTable } from 'models/user.model.ts';
import { eq } from 'drizzle-orm';
import type { SignupInputType } from 'schema.ts';

export class UserRepository {
    async findByEmail(email: string) {
        return await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
    }

    async findById(id: string) {
        return await db
            .select({
                firstname: usersTable.firstname,
                lastname: usersTable.lastname,
                email: usersTable.email
            })
            .from(usersTable)
            .where(eq(usersTable.id, id));
    }

    async createUser(data: SignupInputType) {
        const [user] = await db 
            .insert(usersTable)
            .values(data)
            .returning();
        
        return user;
    }
}