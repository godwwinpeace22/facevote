import { UserSession, AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data', 'email'])
export const userSession = new UserSession({ appConfig })


