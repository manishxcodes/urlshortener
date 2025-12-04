import { db } from '../db/index.ts';
import { usersTable } from 'models/user.model.ts';
import { eq } from 'drizzle-orm';
import type { SignupInputType } from 'schema.ts';

export class UserRepository {
    async findByEmail(email: string) {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
        
        return user || null
    }

    async findById(id: string) {
        const [user] = await db
            .select({
                id: usersTable.id,
                firstname: usersTable.firstname,
                lastname: usersTable.lastname,
                email: usersTable.email
            })
            .from(usersTable)
            .where(eq(usersTable.id, id));
        
        return user || null;
    }

    async createUser(data: SignupInputType) {
        const [user] = await db 
            .insert(usersTable)
            .values(data)
            .returning();
        
        return user;
    }
}