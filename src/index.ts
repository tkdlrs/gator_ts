import { setUser } from "./config.js";
import { readConfig } from "./config.js";

function main() {
    // Set current user and update config file on disk.
    setUser("Levi");
    // Read config again, parse it into object and print to terminal
    const cfg = readConfig();
    console.log(cfg);

};

main();

