import { Collection, Db, MongoClient } from 'mongodb'
import { UserModel } from './models/UserModel'

export interface DataBaseCollection<T> {
    key: string
    collection: Collection<T>
}

export class DataBase {
    private static _url = 'mongodb://root:example@localhost:27017'
    private static _dbName = 'nodejsauth'
    private static _dbClient: MongoClient
    private static _db: Db

    static init() {
        DataBase._dbClient = new MongoClient(DataBase._url)
        DataBase._db = DataBase._dbClient.db(DataBase._dbName)
    }

    static addCollection<T>(key: string) {
        return {
            key,
            collection: DataBase._db.collection<T>(key),
        }
    }

    static async connect() {
        await DataBase._dbClient.connect()
    }
}

DataBase.init()

export const users = DataBase.addCollection<UserModel>('users')
