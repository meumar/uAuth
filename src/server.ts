import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import routes from "./Routes";
import { prettyJSON } from "hono/pretty-json";
import connectDB from "./db";
import { contextStorage } from "hono/context-storage";
//#2dd4bf
connectDB();

const app = new Hono();

app.use(logger(), prettyJSON(), contextStorage());


app.get("/", (c) => {
  return c.text("uAuth 1.0.1");
});

app.route("/api", routes);



app.onError((err: any, c) => {
  if (err.logError) {
    console.log("LOG");
  }
  return c.json(
    {
      success: false,
      message: err.message,
      data: err.data,
    },
    err.status
  );
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
