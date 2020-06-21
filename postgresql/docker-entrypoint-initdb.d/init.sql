CREATE TABLE my_user (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    bcrypt_password TEXT NOT NULL
);
