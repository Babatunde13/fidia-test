import { Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import {
    CreateUserArgs,
    LoginUserArgs,
    UserResponse,
    UsersResponse,
    UserVerificationArgs,
    ResStatus
} from '../schema/user.schema'
import userModel from '../../models/user.model'
import {
    authChecker,
    comparePassword,
    generateToken,
    hashPassword,
    MyContext,
    verifyUser
} from '../../utils/auth'
import { sendEmail } from '../../utils/sendMail'

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async signUp(
        @Args({ validate: true }) args: CreateUserArgs,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        args.email = args.email.toLowerCase().trim()
        args.password = await hashPassword(args.password)
        if (args.mobile_number.startsWith('0') && args.mobile_number.length === 11) {
            args.mobile_number = '234' + args.mobile_number.substring(1)
        } else if (args.mobile_number.startsWith('234') && args.mobile_number.length === 13) {
            // do nothing
        } else {
            return {
                message: 'Invalid phone number',
                status: false
            }
        }

        try {
            const userExists = await userModel.findOne({ email: args.email })
            if (userExists) {
                return {
                    message: 'User already exists',
                    status: false
                }
            }
            const user = await userModel.create(args)
            // send verification email
            await sendEmail(
                [user.email],
                'welcome-mail',
                'Welcome to Fidia',
                {
                    token: generateToken({ _id: user._id }, '30m'),
                    name: user.name,
                    host: req.protocol + '://' + req.hostname + ':' + req.socket.localPort
                }
            )

            const authToken = generateToken({ user_id: user._id})
            return {
                message: 'User created successfully',
                status: true,
                token: authToken,
                user
            }
        } catch (error) {
            return {
                message: error.message,
                status: false
            }
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Args({ validate: true }) args: LoginUserArgs
    ): Promise<UserResponse> {
        args.email = args.email.toLowerCase().trim()
        try {
            const user = await userModel.findOne({ email: args.email })
            if (!user) {
                return {
                    message: 'Invalid email or password',
                    status: false
                }
            }

            const isPasswordValid = await comparePassword(args.password, user.password)
            if (!isPasswordValid) {
                return {
                    message: 'Invalid email or password',
                    status: false
                }
            }
            const token = generateToken({ user_id: user._id})
            return {
                message: 'User logged in successfully',
                status: true,
                token,
                user
            }
        } catch (error) {
            return {
                message: error.message,
                status: false
            }
        }
    }

    @Mutation(() => ResStatus)
    async verifyAccount(
        @Args({ validate: true }) args: UserVerificationArgs
    ): Promise<ResStatus> {
        return verifyUser(args.token)
    }

    @Mutation(() => ResStatus)
    @UseMiddleware(authChecker)
    async resendVerificationMail(
        @Ctx() { payload, req }: MyContext
    ): Promise<ResStatus> {
        try {
            const user = await userModel.findOne({ _id: payload?.user_id })

        if (!user) {
            return {
                message: 'Invalid Token',
                status: false
            }
        }

        await sendEmail(
            [user.email],
            'verify-account',
            'Verify Your Creator Profile',
            {
                token: generateToken({ _id: user._id }, '30m'),
                name: user.name,
                host: req.protocol + '://' + req.hostname + ':' + req.socket.localPort
            }
        )

        return {
            message: 'Mail sent successfully',
            status: true
        }

        } catch (error) {
            return {
                message: error.message,
                status: false
            }
        }
    }

    @Query(() => UserResponse)
    @UseMiddleware(authChecker)
    async profile(
        @Ctx() { payload }: MyContext
    ): Promise<UserResponse> {
        try {
            const user = await userModel.findOne({ _id: payload?.user_id })

            if (!user) {
                return {
                    message: 'Invalid Token',
                    status: false
                }
            }
            return {
                message: 'User fetched successfully',
                status: true,
                user
            }
        } catch (error) {
            return {
                message: error.message,
                status: false
            }
        }
    }

    @Query(() => UsersResponse)
    async users(): Promise<UsersResponse> {
        try {
            const users = await userModel.find()
            return {
                message: 'Users fetched successfully',
                status: true,
                users
            }
        } catch (error) {
            return {
                message: error.message,
                status: false
            }
        }
    }
}
