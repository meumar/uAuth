import { Hono } from "hono";

//routes
import users from "./users";
import clients from "./clients";
import collections from "./collections";
import webhooks from "./webhook";

const routes = new Hono();

routes.route("/users", users);
routes.route("/clients", clients);
routes.route("/collections",collections);
routes.route("/webhook", webhooks);


routes.get("/", (c) => {
  return c.text("API 1.0.1");
});

export default routes;
