import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
    name: string,
    url: string,
    userId: string,
) {
    const result = await db.insert(feeds)
        .values({
            name,
            url,
            userId
        }).returning();
    //
    return firstOrUndefined(result);
};

export async function getFeeds() {
    const result = db.select().from(feeds);
    return result;
};

