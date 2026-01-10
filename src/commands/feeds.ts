import { readConfig } from "src/config";
import { createFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";


export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`)
    }
    //
    const config = readConfig();
    const currentUserName = config.currentUserName;
    const user = await getUser(currentUserName);
    if (!user) {
        throw new Error(`User not found in database`);
    }
    //
    const name = args[0];
    const url = args[1];
    //
    const feed = await createFeed(name, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }
    //
    console.log("Feed created successfully:")
    printFeed(feed, user);
    return;
}

// This is a helper function. It does not need to be exported.
function printFeed(feed: Feed, user: User) {
    console.log(`* ID:          ${feed.id}`);
    console.log(`* Created:     ${feed.createdAt}`);
    console.log(`* Updated:     ${feed.updatedAt}`);
    console.log(`* Name:        ${feed.name}`);
    console.log(`* URL:         ${feed.url}`);
    console.log(`* User:        ${user.name}`);
    //
    return;
}