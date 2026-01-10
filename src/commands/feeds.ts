import { readConfig } from "src/config";
import { createFeed, getFeedsWithUser } from "src/lib/db/queries/feeds";
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



export async function handlerListFeeds(_: string) {
    const feedsAndUsers = await getFeedsWithUser();
    //
    for (const item of feedsAndUsers) {
        const feed = item.feeds;
        const user = item.users;
        //
        if (!feed || !user) {
            continue;
            // throw new Error('No feed or user provided')
        }
        //
        console.log(` * Feed Name:           ${feed.name}`);
        console.log(` * Feed URL:            ${feed.url}`);
        console.log(` * Created By:          ${user.name}`);
        console.log(`--------------------------------------------------`);
    };
};
