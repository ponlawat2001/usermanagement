/** @format */

import DiscordOauth2 from 'discord-oauth2'

const oauth = new DiscordOauth2({
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
})

export class DiscordOAuthService {
  static async generateAuthUrl() {
    // Generate the authorization URL
    const authUrl = oauth.generateAuthUrl({
      scope: ['identify'],
      responseType: 'code',
    })

    return authUrl
  }

  static async getAccessToken(code: string) {
    // Exchange the authorization code for an access token
    try {
      const tokenResponse = await oauth.tokenRequest({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        code,
        scope: 'identify',
        grantType: 'authorization_code',
        redirectUri: process.env.DISCORD_REDIRECT_URI!,
      })
      return tokenResponse
    } catch (error) {
      console.error('Error exchanging Discord code for access token:', error)
      throw new Error('Failed to exchange Discord code for access token')
    }
  }

  static async getUserInfo(accessToken: string) {
    // Fetch user info using the access token
    try {
      const userInfo = await oauth.getUser(accessToken)
      return userInfo
    } catch (error) {
      console.error('Error fetching Discord user info:', error)
      throw new Error('Failed to fetch Discord user info')
    }
  }

  static async revokeToken(accessToken: string) {
    // Revoke the access token
    const credentials = Buffer.from(`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`).toString(
      'base64'
    )
    try {
      const newAccessToken = await oauth.revokeToken(accessToken, credentials)
      return newAccessToken
    } catch (error) {
      console.error('Error revoking Discord token:', error)
      throw new Error('Failed to revoke Discord token')
    }
  }
}
