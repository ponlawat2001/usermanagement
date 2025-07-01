/** @format */

import { Elysia } from 'elysia'
import { UserController } from '../controllers/user/user.controller'
import { AuthController } from '../controllers/auth/auth.controller'
import { ThirdpartyController } from '@/controllers/thirdparty/thridpary.controller'

export const apiRoutes = new Elysia({
  prefix: '/api/v1',
})
.group('/auth', (app) => app.use(AuthController))
.group('/users', (app) => app.use(UserController))
.group('/thirdparty', (app) => app.use(ThirdpartyController))
