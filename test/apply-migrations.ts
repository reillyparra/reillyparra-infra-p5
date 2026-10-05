import { env } from "cloudflare:workers";

await env.p6
  .prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `)
  .run();

await env.p6
  .prepare(`
    INSERT INTO users (name, email)
    VALUES (?, ?)
  `)
  .bind("Reilly Parra", "reillypebe010705@gmail.com")
  .run();

await env.p6
  .prepare(`
    INSERT INTO users (name, email)
    VALUES (?, ?)
  `)
  .bind("Alejandro Barroso", "alejandro@gmail.com")
  .run();