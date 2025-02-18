import { api, APIError } from "encore.dev/api";
import { randomBytes } from "node:crypto";
import { SQLDatabase } from "encore.dev/storage/sqldb";

import { ShortenParams, URL } from "./model/type";
import { url } from "node:inspector";

// 'url' database is used to store the URLs that are being shortened.
const db = new SQLDatabase('url', { migrations: "./migrations" } );

// Shorten a URL
// body exemple: { "url": "www;facebook.com" }
export const shorten = api(
    { method: "POST", path: "/url", expose: true },
    async ({ url }: ShortenParams): Promise<URL> => {
        const bytes = randomBytes(6)
        const id= bytes.toString("base64url");
        await db.exec`
            INSERT INTO url (id, original_url)
            VALUES (
                ${id},
                ${url}
            )
        `
        return { id,url }
    }
)

// Get an url by id
export const get = api(
    { expose: true, auth: false, method: 'GET', path:"/url/:id" },
    async ({id}: {id: string}): Promise<URL> => {
        const row = await db.queryRow`
            SELECT original_url FROM url WHERE id=${id}
        `
        if (!row) throw APIError.notFound("url not fund");
        return { id,url:row.original_url };
    }
)
