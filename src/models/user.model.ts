import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),


    firstname: varchar('first_name', {length: 55}).notNull(),
    lastname: varchar('last_name', {length: 55}),

    email: varchar("email", { length: 255 }).notNull(),
    password: text().notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').$onUpdate(() => new Date())
});