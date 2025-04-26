import * as crypto from "crypto";
import fs from "fs";

class JWT {
  private getHeader(algorithm: "rs256" | "hs256"): string {
    return Buffer.from(
      JSON.stringify({ typ: "JWT", alg: algorithm.toUpperCase() })
    ).toString("base64url");
  }

  private getPayload(payload: object): string {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
  }

  private getMessage(header: string, payload: string): string {
    return header + "." + payload;
  }

  private decodePayload(payload: string): object | null {
    try {
      return JSON.parse(Buffer.from(payload, "base64url").toString());
    } catch {
      return null;
    }
  }

  private hs256(message: string, secret: string): string {
    return crypto
      .createHmac("sha256", secret)
      .update(message)
      .digest("base64url");
  }

  private sha256(message: string): Buffer {
    return crypto.createHash("sha256").update(message).digest();
  }

  private getDigestInfo(message: string): Buffer {
    const sha256Hash = this.sha256(message);
    const digestInfoPrefix = Buffer.from(
      "3031300d060960864801650304020105000420",
      "hex"
    );
    return Buffer.concat([digestInfoPrefix, sha256Hash]);
  }

  private rs256Encrypt(message: string, privateKey: string): string {
    const digestInfo = this.getDigestInfo(message);
    const signature = crypto.privateEncrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      digestInfo
    );
    return signature.toString("base64url");
  }

  private rs256Decrypt(signature: string, publicKey: string): Buffer {
    const buffer = Buffer.from(signature, "base64url");
    const decrypted = crypto.publicDecrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    return decrypted;
  }

  sign(
    secret: string,
    payload: object,
    algorithm: "rs256" | "hs256" = "hs256"
  ): string {
    const message = this.getMessage(
      this.getHeader(algorithm),
      this.getPayload(payload)
    );
    const signature =
      algorithm === "hs256"
        ? this.hs256(message, secret)
        : this.rs256Encrypt(message, secret);

    return message + "." + signature;
  }

  verify(secret: string, token: string): object {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token: Token malformed");

    const [header, payload, signature] = parts;
    const decodedHeader = this.decodePayload(header) as { alg?: string };
    if (!decodedHeader) throw new Error("Invalid token: Token malformed");
    const algorithm = decodedHeader.alg?.toLowerCase();

    if (!algorithm || !["rs256", "hs256"].includes(algorithm))
      throw new Error("Invalid token: Unknown algorithm");

    const message = header + "." + payload;

    if (algorithm === "hs256") {
      const expectedSignature = this.hs256(message, secret);

      if (expectedSignature !== signature)
        throw new Error("Invalid token: Invalid signature");
    } else {
      const expectedDigestInfo = this.getDigestInfo(message).toString("hex");
      const decryptedDigestInfo = this.rs256Decrypt(signature, secret).toString(
        "hex"
      );

      if (expectedDigestInfo !== decryptedDigestInfo)
        throw new Error("Invalid token: Invalid signature");
    }

    const data = this.decodePayload(payload);
    if (!data) throw new Error("Invalid token: Failed to decode payload");

    return data;
  }
}

function testRS256() {
  const jwt = new JWT();

  const privateKey = fs.readFileSync("private.key", "utf8");
  const publicKey = fs.readFileSync("public.key", "utf8");

  const token = jwt.sign(privateKey, { userId: 2 }, "rs256");
  console.log(token);

  const payload = jwt.verify(publicKey, token);
  console.log(payload);
}

function testHS256() {
  const jwt = new JWT();
  const secret = "this is a secret string";

  const token = jwt.sign(secret, { userId: 2 }, "hs256");
  console.log(token);

  const payload = jwt.verify(secret, token);
  console.log(payload);
}

function test() {
  console.log("--- HS256");
  testHS256();
  console.log("--- RS256");
  testRS256();
}

test();
