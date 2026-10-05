CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

INSERT INTO users (name, email)
VALUES
    ('Reilly Parra', 'reillypebe010705@gmail.com'),
    ('Alejandro Barroso', 'alejandro@gmail.com');