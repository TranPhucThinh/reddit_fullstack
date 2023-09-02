import argon2 from 'argon2'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { LoginInput } from '../types/LoginInput'
import { RegisterInput } from '../types/RegisterInput'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { validateRegisterInput } from './../utils/validateRegisterInput'

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg('registerInput') registerInput: RegisterInput
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

      return {
        code: 200,
        success: true,
        message: 'User registration successful',
        user: await User.save(newUser),
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
    @Arg('loginInput') loginInput: LoginInput
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

      // temporary
      return {
        code: 200,
        success: true,
        message: 'Login successful',
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
}
