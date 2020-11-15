import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./router/index.router.ts";
import { APP_HOST, APP_PORT } from "./config.ts";
import errorMiddleware from "./middlewares/error.ts";

const app = new Application();

app.use(errorMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on port ${APP_PORT}`);
await app.listen(`${APP_HOST}:${APP_PORT}`);
