import { XMLParser } from "fast-xml-parser";


export async function handlerAgg(cmdName: string, ...args: string[]) {
    let feedURL = args[0];
    if (args.length !== 1 || typeof feedURL === undefined) {
        // throw new Error(`usage: ${cmdName}, <url_string>`);
        feedURL = 'https://www.wagslane.dev/index.xml'
    }
    //
    const feedData = await fetchFeed(feedURL);
    if (!feedData) {
        throw new Error(`Issue fetching feed.`);
    }
    //
    // console.log(feed);
    const parser = new XMLParser();
    const rawJavaScriptObject = parser.parse(feedData);
    //
    const channel = rawJavaScriptObject.rss.channel;
    // console.log("raw channel", channel)
    const javaScriptObject: RSSFeed = {
        channel: {
            title: "",
            link: "",
            description: "",
            item: []
        }
    };
    // Confirm that channel exists
    if (!channel) {
        throw new Error(`feed is missing channel.`);
    }
    // Confirm metadata on channel
    if (!channel.title ||
        !channel.link ||
        !channel.description
    ) {
        throw new Error(`channel is missing either a title, link, or description`);
    }
    javaScriptObject.channel.title = channel.title;
    javaScriptObject.channel.link = channel.link;
    javaScriptObject.channel.description = channel.description;
    //
    const itemsArray = channel.item;
    // console.log("channel: ", typeof itemsArray, itemsArray.length)
    // if (Array.isArray(itemsArray)) {
    //     throw new Error(`channel items is not an array`);
    // }
    itemsArray.forEach(feedItem => javaScriptObject.channel.item.push({
        title: feedItem.title,
        link: feedItem.link,
        description: feedItem.description,
        pubDate: feedItem.pubDate
    }));
    //
    return console.log(JSON.stringify(javaScriptObject, null, 2));
}

//
export async function fetchFeed(url: string) {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "gator"
            }
        });
        if (!response.ok) {
            throw new Error(`error Fetching Feed. Response status: ${response.status}`)
        }
        //
        return response.text();
        //
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error: ${err}`);
        } else {
            throw new Error(`Error: ${err}`);
        }
    }
}

// Types
export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
}
