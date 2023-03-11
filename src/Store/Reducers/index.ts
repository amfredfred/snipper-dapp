export const AccountReducer = (state: any, action: any) => ({ ...state, [action['type']]: action['payload'] })

export const BotConfigReducer = (state: any, action: any) => ({ ...state, [action['type']]: action['payload'] })
