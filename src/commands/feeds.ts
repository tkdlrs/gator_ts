import { readConfig } from "src/config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { feeds, users } from "src/lib/db/schema";


export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`)
    }
    //
    const name = args[0];
    const url = args[1];
    //
    const config = readConfig();
    const currentUserName = config.currentUserName;
    const databaseUser = await getUser(currentUserName);
    if (!databaseUser) {
        throw new Error(`User not found in database`);
    }
    //
    const feed = await createFeed(name, url, databaseUser.id);
    printFeed(feed, databaseUser);
    //
    return;
}

//
export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;
//
export function printFeed(feed: Feed, user: User) {
    console.log("user", user);
    console.log("feed", feed);
    return;
}