import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile_number: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

UserSchema.set('toJSON', {
    transform: function (_, user: IUser) {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile_number: user.mobile_number,
            country: user.country,
            isVerified: user.isVerified
        }
    }
})

export interface IUser {
    _id: string | object
    name: string
    email: string
    password: string
    mobile_number: string
    country: string
    isVerified: boolean
}


const userModel =  model('User', UserSchema)

export default userModel
