# JWT 101: Custom TypeScript Implementation

This repository contains a simple, from-scratch implementation of JSON Web Tokens (JWTs) in TypeScript.

It is built using only Node.js's native `crypto` module.

This code was created as part of the article: JWT 101: What It Is, How It Works, and How to Build Your Own.

## What’s inside
- `JWT.sign(secret: string, payload: object): string` — Creates a signed JWT.
- `JWT.verify(secret: string, token: string): object` — Verifies the JWT and returns the decoded payload.

---

✅ No external libraries  
✅ Only Node.js built-in modules  
✅ Educational and easy to follow
