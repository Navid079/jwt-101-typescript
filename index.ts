import * as crypto from "crypto";

class JWT {
  private getHeader(): string {
    return Buffer.from(JSON.stringify({ typ: "JWT", alg: "HS256" })).toString(
      "base64url"
    );
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

  sign(secret: string, payload: object): string {
    const message = this.getMessage(this.getHeader(), this.getPayload(payload));
    const signature = this.hs256(message, secret);

    return message + "." + signature;
  }

  verify(secret: string, token: string): object {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token: Token malformed");

    const [header, payload, signature] = parts;
    const message = header + "." + payload;

    const expectedSignature = this.hs256(message, secret);
    if (expectedSignature !== signature)
      throw new Error("Invalid token: Invalid signature");

    const data = this.decodePayload(payload);
    if (!data) throw new Error("Invalid token: Failed to decode payload");

    return data;
  }
}

function test() {
  const jwt = new JWT();
  const secret = "this is a secret string";

  const token = jwt.sign(secret, { userId: 2 });
  console.log(token);

  const payload = jwt.verify(secret, token);
  console.log(payload);
}

test()
