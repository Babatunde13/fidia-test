import { ObjectType, Field, ArgsType } from 'type-graphql'
import { Length, IsEmail, IsPhoneNumber } from 'class-validator'

@ObjectType()
class UserSchema {
    @Field()
    id?: string

    @Field()
    name: string

    @Field()
    email: string

    @Field()
    mobile_number: string

    @Field()
    country: string

    @Field()
    isVerified: boolean
}

@ObjectType({ description: 'User response' })
export class UserResponse {
    @Field()
    message: string

    @Field()
    status: boolean

    @Field(() => UserSchema, { nullable: true })
    user?: UserSchema

    @Field({ nullable: true })
    token?: string
}

@ArgsType()
export class CreateUserArgs {
    @Field()
    @Length(1, 255)
    name: string

    @Field()
    @IsEmail()
    email: string

    @Field({ description: 'Phone number example format. ====>> "2348023456789".' })
    @Length(11, 13)
    @IsPhoneNumber('NG', { message: 'Invalid phone number' })
    mobile_number: string

    @Field()
    password: string

    @Field()
    country: string
}

@ArgsType()
export class LoginUserArgs {
    @Field()
    @IsEmail()
    email: string

    @Field()
    password: string
}

@ObjectType({ description: 'All users' })
export class UsersResponse {
    @Field()
    message: string

    @Field()
    status: boolean

    @Field(() => [UserSchema], { nullable: true })
    users?: UserSchema[]
}

@ArgsType()
export class UserVerificationArgs {
    @Field()
    token: string
}

@ObjectType({ description: 'General response' })
export class ResStatus {
    @Field()
    message: string

    @Field()
    status: boolean
}
