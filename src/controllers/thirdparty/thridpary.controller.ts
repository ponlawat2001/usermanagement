/** @format */

import { UserService } from '@/services/user/user.service'
import Elysia, { t } from 'elysia'
import { DiscordOAuthService } from '../../api/discord'
// import { GoogleOAuthService } from '../../api/google'
import { ResponseHandler } from '@/utils/response.utils'
import { discordOAuthSchemaDocs } from '@/docs/auth.docs'
import { JwtUtils } from '@/utils/jwt.utils'

const userService = new UserService()

export const ThirdpartyController = new Elysia()

  // discord Sign in
  .post(
    '/discord-sign-in',
    async ({ set }) => {
      try {
        // Exchange authorization code for access token
        const tokenResponse = await DiscordOAuthService.generateAuthUrl()
        if (!tokenResponse) {
          set.status = 400
          return ResponseHandler.validationError('Invalid Discord authorization code')
        }
        console.log('Discord Token Response:', tokenResponse)
        return ResponseHandler.success(tokenResponse, 'Discord sign-in URL generated successfully')
      } catch (error: any) {
        set.status = 500
        return ResponseHandler.serverError(error.message || 'Discord sign-in failed')
      }
    },
    {
      detail: discordOAuthSchemaDocs,
    }
  )

  // discord callback
  .get(
    '/discord-callback',
    async ({ query, set }) => {
      try {
        const { code } = query
        if (!code) {
          set.status = 400 // Bad Request
          return ResponseHandler.validationError('Authorization code is required')
        }
        // Exchange authorization code for access token and user info
        const discordToken = await DiscordOAuthService.getAccessToken(code)
        if (!discordToken) {
          set.status = 400 // Bad Request
          return ResponseHandler.validationError('Invalid Discord authorization code')
        }

        const discordUser = await DiscordOAuthService.getUserInfo(discordToken.access_token)
        if (!discordUser) {
          set.status = 400 // Bad Request
          return ResponseHandler.validationError('Failed to fetch Discord user info')
        }

        let payload = {
          id: '',
          username: '',
          email: '', // Discord may not provide email
        }
        // Check if user already exists in the database
        const user = await userService.findByDiscordId(discordUser.id)
        if (!user) {
          const formattedUser = {
            discordId: discordUser.id,
            fullname: discordUser.username, // Assuming fullname is same as username
          }
          const newUser = await userService.createUserByDiscordId(formattedUser)
          await userService.updateLastLogin(newUser.id)

          payload = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email || '', // Discord may not provide email
          }
        } else {
          // If user exists, update their last login time
          await userService.updateLastLogin(user.id)

          // Generate JWT token and refresh token for the user
          payload = {
            id: user.id,
            username: user.username,
            email: user.email,
          }

          const { accessToken, refreshToken } = await JwtUtils.generateTokens(payload)
          return ResponseHandler.success(
            {
              accessToken,
              refreshToken,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user',
              },
            },
            'Login successful'
          )
        }
      } catch (error: any) {
        set.status = 500 // Internal Server Error
        return ResponseHandler.serverError(error.message || 'Discord callback failed')
      }
    },
    {
      query: t.Object({
        code: t.String({
          description: 'Discord authorization code',
        }),
      }),
      detail: {
        hide: true,
      },
    }
  )

// // Google Sign in
// .post(
//   '/google-sign-in',
//   async ({ set }) => {
//     try {
//       const authUrl = await GoogleOAuthService.generateAuthUrl()
//       if (!authUrl) {
//         set.status = 400
//         return ResponseHandler.validationError('Failed to generate Google authorization URL')
//       }
//       return ResponseHandler.success(authUrl, 'Google sign-in URL generated successfully')
//     } catch (error: any) {
//       set.status = 500
//       return ResponseHandler.serverError(error.message || 'Google sign-in failed')
//     }
//   },
//   {
//     detail: {
//       tags: ['Third Party Auth'],
//       summary: 'Generate Google OAuth sign-in URL',
//       description: 'Returns Google OAuth authorization URL for user authentication',
//     },
//   }
// )

// // Google callback
// .get(
//   '/google-callback',
//   async ({ query, set }) => {
//     try {
//       const { code } = query
//       if (!code) {
//         set.status = 400
//         return ResponseHandler.validationError('Authorization code is required')
//       }

//       // Exchange authorization code for access token
//       const googleToken = await GoogleOAuthService.getAccessToken(code)
//       if (!googleToken) {
//         set.status = 400
//         return ResponseHandler.validationError('Invalid Google authorization code')
//       }

//       // Get user info from Google
//       const googleUser = await GoogleOAuthService.getUserInfo(googleToken.access_token)
//       if (!googleUser) {
//         set.status = 400
//         return ResponseHandler.validationError('Failed to fetch Google user info')
//       }

//       let payload = {
//         id: '',
//         username: '',
//         email: '',
//       }

//       // Check if user already exists in the database
//       const user = await userService.findByGoogleId(googleUser.id)
//       if (!user) {
//         // Create new user
//         const formattedUser = {
//           googleId: googleUser.id,
//           fullname: googleUser.name,
//           email: googleUser.email,
//         }
//         const newUser = await userService.createUserByGoogleId(formattedUser)
//         await userService.updateLastLogin(newUser.id)

//         payload = {
//           id: newUser.id,
//           username: newUser.username,
//           email: newUser.email,
//         }
//       } else {
//         // User exists, update last login
//         await userService.updateLastLogin(user.id)

//         payload = {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//         }
//       }

//       // Generate JWT tokens
//       const { accessToken, refreshToken } = await JwtUtils.generateTokens(payload)
//       return ResponseHandler.success(
//         {
//           accessToken,
//           refreshToken,
//           user: {
//             id: payload.id,
//             username: payload.username,
//             email: payload.email,
//             role: user?.role || 'user',
//           },
//         },
//         'Google login successful'
//       )
//     } catch (error: any) {
//       set.status = 500
//       return ResponseHandler.serverError(error.message || 'Google callback failed')
//     }
//   },
//   {
//     query: t.Object({
//       code: t.String({
//         description: 'Google authorization code',
//       }),
//     }),
//     detail: {
//       hide: true,
//     },
//   }
// )
