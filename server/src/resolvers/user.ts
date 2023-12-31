import argon2 from 'argon2'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'

import { COOKIE_NAME } from '../constants'
import { User } from '../entities/User'
import { Context } from '../types/Context'
import { LoginInput } from '../types/LoginInput'
import { RegisterInput } from '../types/RegisterInput'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { validateRegisterInput } from './../utils/validateRegisterInput'

@Resolver()
export class UserResolver {
  @Query((_returns) => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined | null> {
    if (!req.session.userId) return null

    const user = await User.findOne({ where: { id: req.session.userId } })

    return user
  }

  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg('registerInput') registerInput: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput)

    if (validateRegisterInputErrors !== null) {
      return {
        code: 400,
        success: false,
        ...validateRegisterInputErrors,
      }
    }

    try {
      const { username, email, password } = registerInput

      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      })

      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: 'Duplicate user name or email',
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: `${
                existingUser.username === username ? 'Username' : 'Email'
              } already taken`,
            },
          ],
        }
      }

      const hashedPassword = await argon2.hash(password)

      const newUser = User.create({
        username,
        password: hashedPassword,
        email,
      })

      await User.save(newUser)

      req.session.userId = newUser.id

      return {
        code: 200,
        success: true,
        message: 'User registration successful',
        user: newUser,
      }
    } catch (error) {
      console.log('error', error)
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg('loginInput') loginInput: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const { usernameOrEmail, password } = loginInput

      const existingUser = await User.findOne({
        where: usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      })

      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: 'User not found',
          errors: [
            {
              field: 'usernameOrEmail',
              message: 'Username or email incorrect',
            },
          ],
        }
      }

      const passwordValid = await argon2.verify(existingUser.password, password)

      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: 'Incorrect password',
          errors: [{ field: 'password', message: 'Incorrect password' }],
        }
      }

      // create session and return cookie
      req.session.userId = existingUser.id

      return {
        code: 200,
        success: true,
        message: 'Logged in successful',
        user: existingUser,
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      }
    }
  }

  @Mutation((_returns) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME)
      req.session.destroy((error) => {
        if (error) {
          console.log('DESTROYING SESSION ERROR')
          resolve(false)
        }

        resolve(true)
      })
    })
  }
}
