import grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import { get } from "request-promise";
import {
  GetPostRequest,
  GetCommentsRequest,
  GetPostResponse,
  GetPostsResponse,
  GetCommentsResponse
} from "../../protos";

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

const server: grpc.Server = new grpc.Server();

server.addService(proto.Placeholder.service, {
  getPost: (
    call: grpc.ServerUnaryCall<GetPostRequest>,
    callback: grpc.sendUnaryData<GetPostResponse>,
  ) => {
    get(`https://jsonplaceholder.typicode.com/posts/${call.request.postID}`, {
      json: true,
    })
      .then(post => callback(null, { post }))
      .catch(err => callback(err, null));
  },
  getPosts: (
    _: void,
    callback: grpc.sendUnaryData<GetPostsResponse>,
  ) => {
    get("https://jsonplaceholder.typicode.com/posts", {
      json: true,
    })
      .then(posts => callback(null, { posts }))
      .catch(err => callback(err, null));
  },
  getComments: (
    call: grpc.ServerUnaryCall<GetCommentsRequest>,
    callback: grpc.sendUnaryData<GetCommentsResponse>,
  ) => {
    get(
      `https://jsonplaceholder.typicode.com/posts/${call.request.postID}/comments`, {
      json: true
    })
      .then(comments => callback(null, { comments }))
      .catch(err => callback(err, null));
  }
});

server.bind("127.0.0.1:3000", grpc.ServerCredentials.createInsecure());

server.start();
