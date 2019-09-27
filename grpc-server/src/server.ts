import grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import { get } from "request-promise";

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
    call: grpc.ServerUnaryCall<any>,
    callback: (err: string, resp: object) => void
  ) => {
    get(`https://jsonplaceholder.typicode.com/posts/${call.request.postID}`)
      .then(body => {
        try {
          let post = JSON.parse(body);
          callback(null, {
            post
          });
        } catch (e) {
          throw e;
        }
      })
      .catch(err => {
        callback(err, null);
      });
  },
  getPosts: (_: void, callback: (err: string, resp: object) => void) => {
    get("https://jsonplaceholder.typicode.com/posts")
      .then(body => {
        try {
          let posts = JSON.parse(body);
          callback(null, {
            posts
          });
        } catch (e) {
          throw e;
        }
      })
      .catch(err => {
        callback(err, null);
      });
  },
  getComments: (
    call: grpc.ServerUnaryCall<any>,
    callback: (err: string, resp: object) => void
  ) => {
    get(
      `https://jsonplaceholder.typicode.com/posts/${call.request.postID}/comments`
    )
      .then(body => {
        try {
          let comments = JSON.parse(body);
          callback(null, {
            comments
          });
        } catch (e) {
          throw e;
        }
      })
      .catch(err => {
        callback(err, null);
      });
  }
});

server.bind("127.0.0.1:3000", grpc.ServerCredentials.createInsecure());

server.start();
