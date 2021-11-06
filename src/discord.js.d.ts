declare module "discord.js" {
    interface Client {
        commands: Collection<unknown, any>
    }
}