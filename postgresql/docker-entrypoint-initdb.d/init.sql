CREATE TABLE my_user (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    bcrypt_password TEXT NOT NULL
);
