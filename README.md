# End to End Typed API Experiment

An experimental set of applications to create an end to end typed API.

The [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) was used in place of a database for simplicity.  

## Run Locally

### Start the GRPC Server

```
npm install
npm start
```

This will launch the server at `localhost:3000`

#### Directly Access the GRPC Server

[grpcc](https://github.com/njpatel/grpcc) provides an easy to use CLI for interacting the the server.

```
#Connect Command
grpcc -a localhost:3000 -p ./placeholder.proto -i

#Example Interaction
client.getPost({postID: "1"}, printReply)
```

### Start the GraphQL Server

```
npm install
npm start
```

This will launch the server at `localhost:4000`.  Visit [http://localhost:4000/graphql](http://localhost:4000/graphql) for the GraphiQL interface.