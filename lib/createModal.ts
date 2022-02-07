import { IHttp, IModify, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';

import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitBlockIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { IUIKitModalViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';

export interface IModalContext extends Partial<IUIKitBlockIncomingInteraction> {
    threadId?: string;
}
export function uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export async function createModal({ persistence, data, modify, http, channels }: {
   
    persistence: IPersistence,
    data: IModalContext,
    modify: IModify,
    http: IHttp,
    channels: string
}): Promise<IUIKitModalViewParam> {
    
    const viewId = uuid();
    const block = modify.getCreator().getBlockBuilder();
    
    block.addInputBlock({
        blockId: 'broadcast_channels',
        element: block.newPlainTextInputElement({ initialValue: channels, actionId: 'channels' }),
        label: block.newPlainTextObject('Broadcast Channels'),
    });
    block.addInputBlock({
        blockId: 'broadcast_headline',
        element: block.newPlainTextInputElement({ initialValue: "", actionId: 'headline' }),
        label: block.newPlainTextObject('Broadcast Headline'),
    });
    block.addInputBlock({
        blockId: 'broadcast_message',
        element: block.newPlainTextInputElement({ initialValue: "", multiline: true, actionId: 'message' }),
        label: block.newPlainTextObject('Broadcast Message'),
    });
   

  return {
    id: viewId,
    title: block.newPlainTextObject('Create a broadcast'),
    submit: block.newButtonElement({
        text: block.newPlainTextObject('Create'),
    }),
    close: block.newButtonElement({
        text: block.newPlainTextObject('Dismiss'),
    }),
    blocks: block.getBlocks()
  }
}

