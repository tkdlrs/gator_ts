import { readConfig, setUser } from '../config';
import { createUser, getUser, getUsers } from '../lib/db/queries/users';

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    //
    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`);
    }
    //
    setUser(existingUser.name);
    console.log(`User switched successfully!`);
    console.log(`User has been set to ${userName}.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    //
    const userName = args[0];
    const user = await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }
    //
    setUser(user.name);
    console.log('User created successfully!');
}

export async function handlerListUsers(_: string) {
    const users = await getUsers();
    if (users.length === 0) {
        throw new Error(`Application currently doesn't have any users`);
    }
    //
    const config = readConfig();
    const currentUser = config.currentUserName;
    //
    for (const user of users) {
        if (user.name === currentUser) {
            console.log(`* ${user.name} (current)`);
            continue;
        }
        console.log(`* ${user.name}`)
    }
}
