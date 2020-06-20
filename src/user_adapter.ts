import * as pgp from "pg-promise";
import * as bcrypt from "bcrypt";

const db = pgp()({
    host: "db",
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

interface User {
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
        const user = await db.one("SELECT email, bcrypt_password FROM my_user WHERE email = $1", [email])
        return {
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
        await db.none("INSERT INTO my_user (email, bcrypt_password) VALUES ($1, $2)", [email, bcryptPassword]);
        return { email, bcryptPassword };
    }
}
