declare module "discord.js" {
    interface Client {
        login(token: string | undefined);
        on(arg0: string, arg1: (string: any) => void);
        commands: Collection<unknown, any>
    }
}