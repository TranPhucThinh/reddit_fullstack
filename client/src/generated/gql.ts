/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment fieldError on FieldError {\n  field\n  message\n}": types.FieldErrorFragmentDoc,
    "fragment mutationStatuses on UserMutationResponse {\n  code\n  success\n  message\n}": types.MutationStatusesFragmentDoc,
    "fragment userInfo on User {\n  id\n  username\n  email\n}": types.UserInfoFragmentDoc,
    "fragment userMutationResponse on UserMutationResponse {\n  ...mutationStatuses\n  user {\n    ...userInfo\n  }\n  errors {\n    ...fieldError\n  }\n}": types.UserMutationResponseFragmentDoc,
    "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    ...userMutationResponse\n  }\n}": types.LoginDocument,
    "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    ...userMutationResponse\n  }\n}": types.RegisterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment fieldError on FieldError {\n  field\n  message\n}"): (typeof documents)["fragment fieldError on FieldError {\n  field\n  message\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment mutationStatuses on UserMutationResponse {\n  code\n  success\n  message\n}"): (typeof documents)["fragment mutationStatuses on UserMutationResponse {\n  code\n  success\n  message\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userInfo on User {\n  id\n  username\n  email\n}"): (typeof documents)["fragment userInfo on User {\n  id\n  username\n  email\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userMutationResponse on UserMutationResponse {\n  ...mutationStatuses\n  user {\n    ...userInfo\n  }\n  errors {\n    ...fieldError\n  }\n}"): (typeof documents)["fragment userMutationResponse on UserMutationResponse {\n  ...mutationStatuses\n  user {\n    ...userInfo\n  }\n  errors {\n    ...fieldError\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    ...userMutationResponse\n  }\n}"): (typeof documents)["mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    ...userMutationResponse\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    ...userMutationResponse\n  }\n}"): (typeof documents)["mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    ...userMutationResponse\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;