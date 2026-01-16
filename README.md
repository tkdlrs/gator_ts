# Build a Blog Aggregator in TypeScript

A guided project from [Boot.dev](https://www.boot.dev/).

## Learned section

This guided project is called 'gator,' and it taught me the following:

- How to use TypeScript to write a CLI tool
  - I learned a lot about 'Type Safety' and ensuring that data from unknown sources is properly checked to ensure it is what it says it is.
- How to connect to a Postgres database using Drizzle ORM
- How to write and manage database migrations using Drizzle ORM
- Gave me practice writing middleware to abstract various features in a way that makes a codebase easier to maintain.
  - For example, checking to see if a user is authenticated
- Loads of practice writing database queries
- Provided me with several opportunities to use psql and the command line to interact with a Postgres database
- Also got to work on writing and setting up a 'joining' table to handle many-to-many relationships
- Using the Fetch API to GET RSS feed data
- Strategies for parsing XML data (from RSS feeds)
- Storing data from various Fetch requests in various database tables as appropriate
- A lot of CRUD functionality

## The project

If you want to use it, you'll need to set up a config file at the root of your machine.
This file is where you'll keep your database connection string and how the project checks/verifies who is 'authenticated'.

### WTC does it even do?

It's a blog aggregator, so it stores lists of URLs from various blog feeds in a database based on a specified user.

### Supported commands

- "login": sets the current user,
- "register": signs up a new user,
- "reset": deletes the database,
- "users": lists the user,
- "agg": Goes and collects articles from feeds,
- "feeds": Lists all the feeds,
- "addfeed": Adds a feed,
- "follow": Allows a user to follow a feed,
- "following": Lists the feeds that the current user is following,
- "unfollow": Allows a user to stop following a feed,
- "browse": Lets you view the information of the posts in a feed that you are following,

---

I highly recommend going to Boot.dev and doing the course yourself.
I got a lot out of it and had fun learning.

Enough fun, I was even willing to write documentation (lookie mum! I'm becoming a real dev).

Project made with minimum clanker input/influence.

Less of a 'vibes' approach to software development ~which is why it actually works.
