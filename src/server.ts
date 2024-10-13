import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";

import justifyRoute from "./routes/justifyRoute";

void (async () => {
  console.log("Starting server");

  dotenv.config();

  const app = new Koa();
  const router = new Router();

  // Middleware to parse JSON and text/plain
  app.use(
    bodyParser({
      enableTypes: ["json", "text"],
      extendTypes: {
        text: ["text/plain"],
      },
    })
  );

  // Routes
  router.use("/api", justifyRoute.routes(), justifyRoute.allowedMethods());

  app.use(router.routes()).use(router.allowedMethods());

  // Error Handling Middleware
  app.on("error", (err, ctx) => {
    console.error("Server error", err, ctx);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
