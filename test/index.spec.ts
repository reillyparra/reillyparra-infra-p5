import { env, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Hello World worker", () => {
  it("responds with Hello World! (unit style)", async () => {
    const request = new Request("https://example.com");
    const response = await worker.fetch(request, env, {} as ExecutionContext);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      message: "Hello World 3",
      dbData: [
        {
          id: 1,
          name: "Reilly Parra",
          email: "reillypebe010705@gmail.com",
        },
        {
          id: 2,
          name: "Alejandro Barroso",
          email: "alejandro@gmail.com",
        },
      ],
    });
  });

  it("responds with Hello World! (integration style)", async () => {
    const response = await SELF.fetch("https://example.com");

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      message: "Hello World 3",
      dbData: [
        {
          id: 1,
          name: "Reilly Parra",
          email: "reillypebe010705@gmail.com",
        },
        {
          id: 2,
          name: "Alejandro Barroso",
          email: "alejandro@gmail.com",
        },
      ],
    });
  });
});