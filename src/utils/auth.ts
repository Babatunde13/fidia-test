import { Request, Response } from 'express'
import { AuthenticationError } from 'apollo-server-express'
import { MiddlewareFn } from 'type-graphql'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import envs from '../config/envs'
import userModel from '../models/user.model'

export interface MyContext {
    req: Request
    res: Response
    payload?: {
      user_id: object | string
    }
  }

export const generateToken = (payload: any, expiresIn?: string | number) => {
    return jwt.sign(payload, envs.JWT_SECRET_KEY, { expiresIn: expiresIn || '1d' })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, envs.JWT_SECRET_KEY)
}

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}

export const authChecker: MiddlewareFn<MyContext> = ({ context }, next) => {
    const authorization = context.req.headers['authorization']
  
    if (!authorization) {
      throw new AuthenticationError('Unauthorized access')
    }
  
    try {
      const token = authorization.split(' ')[1]
      const payload: any = verifyToken(token)
  
      context.payload = payload
    } catch (error) {
      throw new AuthenticationError('Please login again')
    }
  
    return next()
}

export const verifyUser = async (token: string) => {
    try {
        const payload = verifyToken(token)
        const user = await userModel.findOne({ _id: (payload as any)._id })

        if (!user) {
            return {
                message: 'Invalid Token',
                status: false
            }
        }

        user.isVerified = true

        await user.save()

        return {
            message: 'Account Verified',
            status: true
        }
    } catch (error) {
        return {
            message: 'Invalid Token',
            status: false
        }
    }
}