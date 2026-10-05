export interface Env {
  p6: D1Database;
}

async function queryDatabase(db: D1Database) {
  const { results } = await db
    .prepare("SELECT * FROM users")
    .all();

  return results;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const data = await queryDatabase(env.p6);

    return Response.json({
      message: "Hello World 3",
      dbData: data,
    });
  },
};