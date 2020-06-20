import * as Koa from "koa";
import * as serve from "koa-static";
import * as Router from "@koa/router";
import * as bodyParser from "koa-bodyparser";
import * as bcrypt from "bcrypt";
import { resolve } from "path";
import { UserAdapter } from "./user_adapter";

const app = new Koa();
const router = new Router();
const userAdapter = new UserAdapter();

// Login.
router.post("/login", async (ctx, next) => {
    try {
        if (typeof ctx.request.body.email !== "string") {
            throw new Error("Malformed Request");
        }
        if (typeof ctx.request.body.password !== "string") {
            throw new Error("Malformed Request");
        }
        const user = await userAdapter.getUserByEmail(ctx.request.body.email).catch(() => null);
        if (user === null || !(await bcrypt.compare(ctx.request.body.password, user.bcryptPassword))) {
            // Password mismatch.
            throw new Error("Failed to login.");
        }
        ctx.body = {
            message: "OK"
        };
    } catch (e) {
        ctx.status = 400; // Bad request
        ctx.body = {
            error: e.message
        };
    }
});

// Create user.
router.post("/user", async (ctx, next) => {
    console.table(ctx.request.body);
    if (typeof ctx.request.body.email !== "string") {
        return;
    }
    if (typeof ctx.request.body.password !== "string") {
        return;
    }
    try {
        const user = await userAdapter.createUser(ctx.request.body.email, ctx.request.body.password);
        ctx.body = {
            message: "OK"
        };
    } catch (e) {
        ctx.status = 500 // Internal error.
        ctx.body = {
            error: "Failed to create user."
        };
    }
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(resolve("static")));
app.use(serve(resolve("dist")));

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
});
