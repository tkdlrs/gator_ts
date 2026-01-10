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

export async function getFeedsWithUser() {
    return db.select().from(feeds).fullJoin(users, eq(users.id, feeds.userId));
};

