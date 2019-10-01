// TODO: Investigate generating static types from protos with:
//    https://github.com/agreatfool/grpc_tools_node_protoc_ts
// Official GRPC support for Typescript seems sparse.

export interface Post {
  id: string;
  title: string;
  body: string;
};

export interface Comment {
  id: string;
  name: string;
  email: string;
  body: string;
}

export interface GetPostRequest {
  postID: string;
}

export interface GetCommentsRequest {
  postID: string;
}

export interface GetPostResponse {
  post: Post;
}

export interface GetPostsResponse {
  posts: [Post];
}

export interface GetCommentsResponse {
  comments: [Comment];
}
