# JWT 101: Custom TypeScript Implementation

This repository contains a simple, from-scratch implementation of JSON Web Tokens (JWTs) in TypeScript. It is built using only Node.js's native `crypto` module.

This code was created as part of the article: [JWT 101: What It Is, How It Works, and How to Build Your Own](https://medium.com/@navid.naseri.079/jwt-101-what-it-is-how-it-works-and-how-to-build-your-own-ed189c936e0e).

## Features
- **`JWT.sign(secret: string, payload: object, algorithm: "rs256" | "hs256" = "hs256"): string`**  
    Creates a signed JWT using either HMAC-SHA256 (`hs256`) or RSA-SHA256 (`rs256`) algorithms.
    
- **`JWT.verify(secret: string, token: string): object`**  
    Verifies the JWT signature and returns the decoded payload.

---

✅ No external libraries  
✅ Only Node.js built-in modules  
✅ Educational and easy to follow  

---

## How to Generate RSA Keys

To use the `rs256` algorithm, you need a private key and a public key. Here's how you can generate them:

### On Linux
1. Open a terminal.
2. Run the following commands:
     ```bash
     openssl genrsa -out private.key 2048
     openssl rsa -in private.key -pubout -out public.key
     ```
3. The `private.key` and `public.key` files will be created in the current directory.

### On Windows
1. Install OpenSSL if not already installed. You can download it from [OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html).
2. Open a Command Prompt or PowerShell.
3. Run the same commands as in the Linux section using OpenSSL. The steps and commands are identical.

---

## Usage

### 1. Clone the Repository
```bash
git clone https://github.com/Navid079/jwt-101-typescript.git
cd jwt-101-typescript
```

### 2. Install Dependencies
This project uses only Node.js built-in modules, so no additional dependencies are required.

### 3. Run the Code
To test the implementation:
```bash
npx ts-node index.ts
```

### 4. Example Output
- **HS256 Example**:
    ```
    --- HS256
    <Generated Token>
    { userId: 2 }
    ```
- **RS256 Example**:
    ```
    --- RS256
    <Generated Token>
    { userId: 2 }
    ```

---

For more details, check out the article: [JWT 101: What It Is, How It Works, and How to Build Your Own](https://medium.com/@navid.naseri.079/jwt-101-what-it-is-how-it-works-and-how-to-build-your-own-ed189c936e0e).
