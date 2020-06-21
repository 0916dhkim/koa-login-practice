import * as pgp from "pg-promise";
import * as bcrypt from "bcrypt";

const db = pgp()({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT === undefined ? undefined : parseInt(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

interface User {
    id: number;
    email: string;
    bcryptPassword: string;
}

/**
 * Adapter class to manage users.
 */
export class UserAdapter {
    /**
     * Find one user that has the matching email.
     * @param email email to match.
     */
    async getUserByEmail(email: string): Promise<User> {
        const user = await db.one("SELECT id, email, bcrypt_password FROM my_user WHERE email = $1", [email])
        return {
            id: user.id,
            email: user.email,
            bcryptPassword: user.bcrypt_password
        };
    }

    /**
     * Insert a new user into database.
     * @param email new user's email
     * @param password new user's password
     * @returns created user info
     */
    async createUser(email: string, password: string): Promise<User> {
        const bcryptPassword = await bcrypt.hash(password, 10);
        const user = await db.one("INSERT INTO my_user (email, bcrypt_password) VALUES ($1, $2) RETURNING id, email, bcrypt_password", [email, bcryptPassword]);
        return {
            id: user.id,
            email: user.email,
            bcryptPassword: user.bcrypt_password
        };
    }
}
