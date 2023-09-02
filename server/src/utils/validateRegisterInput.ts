import { RegisterInput } from '../types/RegisterInput'

export const validateRegisterInput = (registerInput: RegisterInput) => {
  if (!registerInput.email.includes('@')) {
    return {
      message: 'Invalid email',
      errors: [{ field: 'email', message: 'Email must include @ symbol' }],
    }
  }

  if (registerInput.username.length <= 2) {
    return {
      message: 'Invalid username',
      errors: [
        {
          field: 'username',
          message: 'Length username must be greater than 2 characters',
        },
      ],
    }
  }

  if (registerInput.username.includes('@')) {
    return {
      message: 'Invalid username',
      errors: [
        {
          field: 'username',
          message: 'Username username cannot include @ symbol',
        },
      ],
    }
  }

  if (registerInput.password.length <= 5) {
    return {
      message: 'Invalid password',
      errors: [
        {
          field: 'password',
          message: 'Length password must be greater than 6 characters',
        },
      ],
    }
  }

  return null
}
