import * as Koa from "koa";
import * as serve from "koa-static";
import * as Router from "@koa/router";
import * as bodyParser from "koa-bodyparser";
import { resolve } from "path";

const app = new Koa();
const router = new Router();

// Handle login.
router.post("/login", (ctx, next) => {
    console.table(ctx.request.body);
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(resolve("static")));
app.use(serve(resolve("dist")));

app.listen(process.env.PORT);
