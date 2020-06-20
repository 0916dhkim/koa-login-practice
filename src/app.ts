import * as Koa from "koa";
import * as serve from "koa-static";
import { resolve } from "path";
const app = new Koa();

app.use(serve(resolve("static")));
app.use(serve(resolve("dist")));

app.listen(process.env.PORT);
