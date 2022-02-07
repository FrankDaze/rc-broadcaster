import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ISetting } from '@rocket.chat/apps-engine/definition/settings';
import { UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { BroadcastCommand } from './commands/Broadcast';
import { AppSetting, settings } from './config/Settings';
import { sendMessage } from './lib/sendMessage';

export class BroadcastApp extends App  {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public static BroadCastChannels;
    public bc;

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));
        this.bc = new BroadcastCommand(this);
        await configuration.slashCommands.provideSlashCommand(this.bc);

    }
    public async onSettingUpdated(setting: ISetting, configurationModify: IConfigurationModify, read: IRead, http: IHttp): Promise<void> 
    {
        
        // -------------------------------------
        // Value mapping
        // -------------------------------------
        if(setting.id == AppSetting.broadcastChannels)
        {
            BroadcastApp.BroadCastChannels = setting.value;
            this.bc.modalChannels = setting.value;
        }
       
        return super.onSettingUpdated(setting, configurationModify, read, http);
    }

    public async executeViewClosedHandler()
    {
         return;
    }

    // ---------------------------------------------
    // Click on create button in modal
    // ---------------------------------------------
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
        const data = context.getInteractionData();
      
        const { state } = data.view as any;
        
        const sender = data.user; // the user calling the slashcommand

        if(!state)
        {
            return;
        }
        const channelsArray = state.broadcast_channels.channels.split(",");

        const headline = state.broadcast_headline.headline;
        const text = state.broadcast_message.message;

        const message = `### ${headline}\n<br> ${text}`;
    
        channelsArray.map(async (roomName) => {

            if(roomName!= "")
            {
                const room = await read.getRoomReader().getByName(roomName.trim()) ; 
                if(!room)
                {
                    return;
                }
                
                
                return await sendMessage(sender, room, read, modify, message);
                
            }
        });
        if(this.bc.useRoom)
        {
           return await this.sendNotifyMessage(sender,this.bc.useRoom,read,`You send a broadcast message to this channels: ${state.broadcast_channels.channels}`);
        }
    
    }

    private async sendNotifyMessage(sender: IUser,room: IRoom, read: IRead, text: string): Promise<void> {
        const msg = read.getNotifier().getMessageBuilder().setText(text)
            .setUsernameAlias("Broadcaster").setEmojiAvatar(':loud_sound:')
            .setRoom(room)
            .setSender(sender).getMessage();

        return await read.getNotifier().notifyUser(sender, msg);
    }
}


