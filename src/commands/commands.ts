export type CommandHandler = (
    cmdName: string,
    ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

// Registers a new handler function for a command name
export function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler
): void {
    registry[cmdName] = handler;
}

// Executes a provide command with a given state (assuming the command exists)
export async function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }
    //
    await handler(cmdName, ...args);
}