import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";
import { Feed } from "src/lib/db/schema";
import { parseDuration } from "src/lib/time";


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
    // iterate items in feed and print titles to console
    console.log(`Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`);
}
// 
function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
    );
}