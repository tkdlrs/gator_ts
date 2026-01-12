import { getFeedByURL } from "src/lib/db/queries/feeds";
import {
    createFeedFollow,
    getFeedFollowsForUser,
} from "../lib/db/queries/feed-follows";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

//
export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed_url>`);
    }
    //
    const config = readConfig();
    const currentUserName = config.currentUserName;
    const user = await getUser(currentUserName);
    //
    if (!user) {
        throw new Error(`User ${currentUserName} not found`);
    }
    //
    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed not found: ${feedURL}`)
    }
    //
    const ffRow = await createFeedFollow(user.id, feed.id);
    //
    console.log(`Feed follow created:`);
    printFeedFollow(ffRow.userName, ffRow.feedName);
    //
    return;
}
//
export async function handlerListFeedFollows(_: string) {
    const config = readConfig();
    const currentUserName = config.currentUserName;
    const user = await getUser(currentUserName);
    //
    if (!user) {
        throw new Error(`User ${currentUserName} not found`);
    }
    //
    const feedFollow = await getFeedFollowsForUser(user.id);
    if (feedFollow.length === 0) {
        console.log(`No feed follow found for this user.`);
        return;
    }
    //
    console.log(`Feed follow for user %s:`, user.id);
    for (let ff of feedFollow) {
        console.log(`* %s`, ff.feedName);
    }
    //
    return;
}
//
export function printFeedFollow(userName: string, feedName: string) {
    console.log(`* User:       ${userName}`);
    console.log(`* Feed:       ${feedName}`);
}