import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { IResolvers } from "graphql-tools";
import grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import { DocumentNode } from "graphql";

const PROTO_PATH: string = __dirname + "../../../protos/placeholder.proto";

const packageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const proto: any = grpc.loadPackageDefinition(packageDefinition).placeholder;

const client = new proto.Placeholder(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

const typeDefs: DocumentNode = gql`
  type Comment {
    id: String
    name: String
    email: String
    body: String
  }

  type Post {
    id: String
    title: String
    body: String
    comments: [Comment]
  }

  type Query {
    Post(postID: String!): Post
    Posts: [Post]
    Comments(postID: String!): [Comment]
  }
`;

const resolvers: IResolvers = {
  Query: {
    Post: (_: void, args: any) => {
      return new Promise((resolve, reject) => {
        client.getPost({ postID: args.postID }, (err: string, resp: any) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(resp.post);
        });
      });
    },
    Posts: () => {
      return new Promise((resolve, reject) => {
        client.getPosts({}, (err: string, resp: any) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(resp.posts);
        });
      });
    }
  },
  Post: {
    comments: (parent: any) => {
      return new Promise((resolve, reject) => {
        client.getComments({ postID: parent.id }, (err: string, resp: any) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(resp.comments);
        });
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 });
