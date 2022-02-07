import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    broadcastChannels = 'broadcastChannels'
}



export const settings: Array<ISetting> = [
    {
        id: AppSetting.broadcastChannels,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'broadcastListOfChannel',
        i18nDescription: 'broadcastListOfChannelDescription',
        i18nPlaceholder: 'general',
        required: true
    },
];
