import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";
import { Feed, NewPost } from "src/lib/db/schema";
import { parseDuration } from "src/lib/time";
import { createPost } from "src/lib/db/queries/posts";


export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName}, <time_between_reqs>`);
    }
    //
    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(
            `invalid duration: ${timeArg} - use format 1h 30m 15s or 3500ms`,
        );
    }
    //
    console.log(`Collecting feeds every ${timeArg}...`);
    // Start the first scrape right away
    scrapeFeeds().catch(handleError);
    //
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError)
    }, timeBetweenRequests);
    //
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}
//
async function scrapeFeeds() {
    // get the next feed to fetch
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log(`No feeds to fetch.`)
        return;
    }
    console.log(`Found a feed to fetch!`);
    scrapeFeed(feed);
}
//
async function scrapeFeed(feed: Feed) {
    // mark fetched
    await markFeedFetched(feed.id);
    // fetch feed using URL
    const feedData = await fetchFeed(feed.url);
    // iterate items in feed and save them to the database
    const feedItems = feedData.channel.item;
    for (let item of feedItems) {
        console.log(`Found post: %s`, item.title);
        //
        const now = new Date();
        //
        const post = ({
            url: item.link,
            feedId: feed.id,
            title: item.title,
            createdAt: now,
            updatedAt: now,
            description: item.description,
            publishedAt: new Date(item.pubDate),
        } satisfies NewPost);
        //
        await createPost(post)
    };
    //
    console.log(`Feed ${feed.name} collected, ${feedItems.length} posts found`);
}
// 
function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
    );
}