import { Context } from '../types/Context'
import { Resolver, Query, Ctx } from 'type-graphql'

@Resolver()
export class HelloResolver {
  @Query((_returns) => String)
  hello(@Ctx() { req }: Context) {
    console.log('check', req.session.userId)

    return 'hello world'
  }
}
