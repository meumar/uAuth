import { Hono } from "hono";

const webhooks = new Hono();

webhooks.post("/users", async (c) => {
  console.log("TOKEN", c.req.header('verification_token'));
  const form = await c.req.json();
  console.log("form", form);
  return c.json({
    success: true,
    message: "Success"
  });
});

export default webhooks;
