# Koa Login Practice
A toy project to practice implementing login session for koa server.

**Technology Stack** : Koa.js, Typescript, PostgreSQL, Redis

## Demo

You can see the published version of this project here:

<https://koa-login-session-practice.herokuapp.com/>

## How to Run
There is a `docker-compose.yml` file in `.devcontainer` directory to ease the setup process.
```bash
cd .devcontainer
docker-compose up
```

Otherwise, you can setup PostgreSQL and Redis servers manually.

Then, start the koa server.
```bash
npm ci
npm run build
npm start
```

## What I Leared
### About Sessions
**Session** is a technique to persist login state for web applications.
**JWT** is often mentioned as an alternative to sessions, but I am convinced
that session is better approach for persisting login state. Read more about
the comparison here: [Stop Using JWT for Sessions](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/).

Session IDs are often stored in cookies, and there are a few options for cookies 
to make the system more secure.

- **HttpOnly Attribute** : Prevents browser scripts from accessing session ID.
- **Secure Attribute** : Only allows session over HTTPS. 
- **Signed Cookies** : Makes it harder to guess session ID.

### About Koa.js
This is my first project using Koa and there were a few techniques
that were non-trivial.

Like Express, Koa's middlewares often extend the request handlers'
parameters. Especially, `koa-session` injects `ctx.session` object.
When using `typescript`, handlers cannot know whether the `session` object
is injected or not, because they assume `ctx` to be `DefaultContext` type
by default. So we have to use type parameters to explicitly set the type
of `ctx`.
```typescript
const router: Router<any, {
    session: {
        userId?: number
    } | null
}> = new Router();
```
In this example, I also defined the shape of `session` object. Handlers
can determine whether a session is logged in or not, by checking
`userId === undefined`.

## What's Next?
I have struggled to implement login & session systems in the past, and
always resorted to 3rd party authentication solutions (i.e. Google Signin).
The purpose of this toy project was to make something I can use in my future projects
when I need the user login feature.

I think this repo is minimal enough, so I can quickly setup a new project
based on this repo, just by skimming through `docker-compose.yml` and
`app.ts`.
