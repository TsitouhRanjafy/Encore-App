import { api } from "encore.dev/api";
import { randomBytes } from "node:crypto";

interface URL {
    id: string;
    url: string;
}

interface ShortenParams {
    url: string;
}


// Shorten a URL
// body exemple: { "url": "www;facebook.com" }
export const shorten = api(
    { method: "POST", path: "/url", expose: true },
    async ({ url }: ShortenParams): Promise<URL> => {
        const bytes = randomBytes(6)
        const id= bytes.toString("base64url");
        console.log(bytes);
        console.log(id);
        return { id,url }
    }
)