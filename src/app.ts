import * as Koa from "koa";
import * as serve from "koa-static";
import * as Router from "@koa/router";
import * as bodyParser from "koa-bodyparser";
import * as session from "koa-session";
import * as redisStore from "koa-redis";
import * as bcrypt from "bcrypt";
import { resolve } from "path";
import { UserAdapter } from "./user_adapter";

const app = new Koa();
const router: Router<any, {
    session: {
        userId?: number
    } | null
}> = new Router();
const userAdapter = new UserAdapter();

// Session.
app.keys = [
    process.env.COOKIE_SECRET || "secret"
];
app.use(session({
    store: redisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT === undefined ? undefined : parseInt(process.env.REDIS_PORT)
    }),
    secure: false
}, app))

router.get("/", (ctx, next) => {
    if (ctx.session === null || ctx.session.userId === undefined) {
        // Not logged in.
        ctx.redirect("/login.html");
        return;
    }
    ctx.redirect("/index.html");
});

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
        if (ctx.session === null) {
            throw new Error("Failed to set session.");
        }
        ctx.session.userId = user.id;
        ctx.redirect("/");
    } catch (e) {
        ctx.status = 400; // Bad request
        ctx.body = {
            error: e.message
        };
    }
});

// Logout.
router.get("/logout", (ctx, next) => {
    ctx.session = null;
    ctx.redirect("/login.html");
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
