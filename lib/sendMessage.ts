import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';

export const  sendMessage = async (sender: IUser, room: IRoom, read: IRead, modify: IModify, message: string): Promise<any> =>
{
     if (!message) {
         return;
     }
 
     const msg = modify.getCreator().startMessage()
     .setRoom(room)
     .setSender(sender)
     .setText(message);
     
     return new Promise(async (resolve) => {
         modify.getCreator().finish(msg).then((result) => resolve(result)).catch((error) => console.error("message"+ error));
     });
}

