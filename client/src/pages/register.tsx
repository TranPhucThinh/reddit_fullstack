import InputField from '@/components/InputField'
import Wrapper from '@/components/Wrapper'
import { RegisterInput, useRegisterMutation } from '@/generated/graphql'
import { mapFieldErrors } from '@/helpers/mapFieldErrors'
import { Box, Button, FormControl } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'

const Register = () => {
  const router = useRouter()
  const initialValues: RegisterInput = { username: '', email: '', password: '' }

  const [registerUser, { data, loading: _registerUserLoading, error }] =
    useRegisterMutation()

  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const response = await registerUser({
      variables: { registerInput: values },
    })

    if (response.data?.register.errors) {
      setErrors(mapFieldErrors(response.data.register.errors))
    } else if (response.data?.register.user) {
      router.push('/')
    }
  }

  return (
    <Wrapper>
      {error && <p>Failed to register</p>}
      {data && data.register.success && (
        <p>Registered successfully {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormControl>
                <InputField
                  name="username"
                  placeholder="Username"
                  label="Username"
                  type="text"
                />
                <Box mt={4}>
                  <InputField
                    name="email"
                    placeholder="Email"
                    label="Email"
                    type="text"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Form>
          )
        }}
      </Formik>
    </Wrapper>
  )
}

export default Register
