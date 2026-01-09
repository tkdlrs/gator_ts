import { fetchFeed } from "src/lib/rss";


export async function handlerAgg(_: string) {
    const feedURL = 'https://www.wagslane.dev/index.xml';
    // let feedURL = args[0];
    // if (args.length !== 1 || typeof feedURL === undefined) {
    //     // throw new Error(`usage: ${cmdName}, <url_string>`);
    //     feedURL = 'https://www.wagslane.dev/index.xml'
    // }
    //
    const feedData = await fetchFeed(feedURL);
    const feedDataStr = JSON.stringify(feedData, null, 2);
    console.log(feedDataStr);
    return;
}

