import { XMLParser } from "fast-xml-parser";
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
//
export async function fetchFeed(feedURL: string) {
    const res = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        }
    });
    if (!res.ok) {
        throw new Error(`failed to fetch feed: ${res.status}: ${res.statusText}`)
    }
    //
    const xml = await res.text();
    const parser = new XMLParser();
    let result = parser.parse(xml);
    // Confirm that channel exists
    const channel = result.rss?.channel;
    if (!channel) {
        throw new Error(`feed is missing channel.`);
    }
    // Confirm metadata on channel
    if (!channel.title ||
        !channel.link ||
        !channel.description ||
        !channel.item
    ) {
        throw new Error(`failed to parse channel. Channel is missing either a title, link, description, or item`);
    }
    const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];
    //
    const rssItems: RSSItem[] = [];
    //
    for (const feedItem of items) {
        // Guard clause to remove items with incomplete data.
        if (!feedItem.title || !feedItem.link || !feedItem.description || !feedItem.pubDate) {
            continue;
        }
        //
        rssItems.push({
            title: feedItem.title,
            link: feedItem.link,
            description: feedItem.description,
            pubDate: feedItem.pubDate
        });
    };
    //
    const rss: RSSFeed = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems
        },
    };
    //
    return rss;
}

