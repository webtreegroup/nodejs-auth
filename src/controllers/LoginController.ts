import { Request, Response } from 'express'
import { ERROR_MESSAGES, SECRET_KEY } from '../consts'
import * as jwt from 'jsonwebtoken'
import { UserService } from '../services/UserService'
import { getPasswordHash, verifyPassword } from '../utils'

export class LoginController {
    static async signIn(req: Request, res: Response) {
        const user = await UserService.getByLogin(req.body.login)

        const isPasswordValid = await verifyPassword(
            req.body.password,
            user.password,
        )

        if (!isPasswordValid) {
            return res.status(403).json({ message: ERROR_MESSAGES[403] })
        }

        const token = jwt.sign(
            {
                id: user._id,
                position: user.position,
            },
            SECRET_KEY,
        )

        res.cookie('access_token', token, {
            httpOnly: true,
        })
            .status(200)
            .json({ message: 'Sign in successfully!' })
    }

    static async signUp(req: Request, res: Response) {
        const user = await UserService.getByLogin(req.body.login)

        if (user) {
            return res
                .status(400)
                .json({ error: 'The same user exists already!' })
        }

        const password = await getPasswordHash(req.body.password)

        const result = await UserService.create({
            login: req.body.login,
            password,
        })

        if (!result) {
            res.status(500).json({ message: ERROR_MESSAGES[500] })
        } else {
            res.status(200).json({
                message: 'Sign up successfully!',
                result,
            })
        }
    }

    static logout(_: Request, res: Response) {
        return res
            .clearCookie('access_token')
            .status(200)
            .json({ message: 'Logged out successfully!' })
    }
}
