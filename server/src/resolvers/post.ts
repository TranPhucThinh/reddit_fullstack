import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { Post } from '../entities/Post'
import { checkAuth } from '../middleware/checkAuth'
import { CreatePostInput } from '../types/CreatePostInput'
import { PostMutationResponse } from '../types/PostMutationResponse'
import { UpdatePostInput } from '../types/UpdatePostInput'

@Resolver()
export class PostResolver {
  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async createPost(
    @Arg('createPostInput') createPostInput: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const { title, text } = createPostInput

      const newPost = Post.create({
        title,
        text,
      })

      await newPost.save()

      return {
        code: 200,
        success: true,
        message: 'Post created successfully',
        post: newPost,
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

  @Query((_return) => [Post], { nullable: true })
  async posts(): Promise<Post[] | null> {
    try {
      return await Post.find()
    } catch (error) {
      console.log('error', error)
      return null
    }
  }

  @Query((_return) => Post, { nullable: true })
  async post(@Arg('id', (_type) => ID) id: number): Promise<Post | undefined> {
    try {
      const post = await Post.findOne({ where: { id } })

      return post as any
    } catch (error) {
      console.log('error', error)
      return undefined
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async updatePost(
    @Arg('updatePostInput') updatePostInput: UpdatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const { id, title, text } = updatePostInput

      const existingPost = await Post.findOne({ where: { id } })
      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: 'Post not found',
        }
      }

      existingPost.title = title
      existingPost.text = text

      await existingPost.save()

      return {
        code: 200,
        success: true,
        message: 'Updated successfully',
        post: existingPost,
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

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg('id', (_type) => ID) id: number
  ): Promise<PostMutationResponse> {
    const existingPost = await Post.findOne({ where: { id } })
    if (!existingPost) {
      return {
        code: 400,
        success: false,
        message: 'Post not found',
      }
    }

    await Post.delete({ id })

    return {
      code: 200,
      success: true,
      message: 'Post deleted successfully',
    }
  }
}
