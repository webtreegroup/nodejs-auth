import { Express } from 'express'
import { UserController } from '../controllers/UserController'
import { users } from '../db'
import { auth } from '../middlewares/auth'

export class UserRouter {
    private _route = users.key
    private _server: Express

    constructor(server: Express) {
        this._server = server

        this.init()
    }

    private init() {
        this._server.get(
            `/${this._route}/:login`,
            auth,
            UserController.getByLogin,
        )

        this._server.get(`/${this._route}/:id`, auth, UserController.getById)

        this._server.delete(
            `/${this._route}/:id`,
            auth,
            UserController.deleteById,
        )

        this._server.put(`/${this._route}/:id`, auth, UserController.updateById)

        this._server.get(`/${this._route}`, auth, UserController.getAll)

        this._server.post(`/${this._route}`, auth, UserController.create)
    }
}
