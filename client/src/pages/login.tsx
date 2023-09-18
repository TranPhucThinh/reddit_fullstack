import InputField from '@/components/InputField'
import Wrapper from '@/components/Wrapper'
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from '@/generated/graphql'
import { mapFieldErrors } from '@/helpers/mapFieldErrors'
import { useCheckAuth } from '@/utils/useCheckAuth'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'

const Login = () => {
  const router = useRouter()

  const { data: authData, loading: authLoading } = useCheckAuth()

  const initialValues: LoginInput = { usernameOrEmail: '', password: '' }

  const [loginUser, { data, loading: _loginUserLoading, error }] =
    useLoginMutation()

  const toast = useToast()

  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: { loginInput: values },
      update(cache, { data }) {
        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          })
        }
      },
    })

    if (response.data?.login.errors) {
      setErrors(mapFieldErrors(response.data.login.errors))
    } else if (response.data?.login.user) {
      toast({
        title: 'Welcome!',
        description: `${response.data.login.user.username}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/')
    }
  }

  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper>
          {error && <p>Failed to login.</p>}

          <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
            {({ isSubmitting }) => {
              return (
                <Form>
                  <FormControl>
                    <InputField
                      name="usernameOrEmail"
                      placeholder="Username or Email"
                      label="Username or Email"
                      type="text"
                    />
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
                    Login
                  </Button>
                </Form>
              )
            }}
          </Formik>
        </Wrapper>
      )}
    </>
  )
}

export default Login
