import { Application } from 'express'
import { verifyUser } from '../../utils/auth'

export default function (app: Application) {
    app.get('/', (_, res) => {
        res.send('Hello World!')
    })

    app.get('/api/verify-account/:token', async (req, res) => {
        const { token } = req.params
        const verified = await verifyUser(token)
        if (!verified.status) {
            res.status(404).json({
                message: 'Resource not found',
            })
        }

        res.json({
            message: 'Account verified successfully',
            status: true
        })

    })
}
