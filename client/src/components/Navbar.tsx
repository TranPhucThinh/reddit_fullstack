import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from '@/generated/graphql'
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

const Navbar = () => {
  const { data, loading } = useMeQuery()
  const [logout, _] = useLogoutMutation()

  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null },
          })
        }
      },
    })
  }

  let body

  if (loading) {
    body = null
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = <Button onClick={logoutUser}>Logout</Button>
  }

  return (
    <Box bg="tan" p={4}>
      <Flex maxW={800} justifyContent="space-between" align="center" m="auto">
        <NextLink href="/">
          <Heading>Reddit</Heading>
        </NextLink>
        <Box>{body}</Box>
      </Flex>
    </Box>
  )
}

export default Navbar
