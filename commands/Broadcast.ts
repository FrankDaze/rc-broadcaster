import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { AppSetting } from "../config/Settings";

import { createModal } from "../lib/createModal";

export class BroadcastCommand implements ISlashCommand {
  
    public command = 'broadcast';
    public i18nParamsExample = 'broadcastParamExample';
    public i18nDescription = 'broadcastDescription';
    public providesPreview = false;
    public static fromRoom;
    public useRoom;
    public modalChannels;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<any> {
    
        const triggerId = context.getTriggerId();
       
        if(!this.modalChannels)
        {
            this.modalChannels = await read.getEnvironmentReader().getSettings().getValueById(AppSetting.broadcastChannels);
        }

        this.useRoom = context.getRoom();
        const data = {
            room: (context.getRoom() as any).value,
            threadId: context.getThreadId(),
        };
        const channels = this.modalChannels;
        
        if (channels && triggerId) {
            const modal = await createModal({ persistence: persis, modify, data, http,  channels});

            await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
        }
        
    }

    
}
