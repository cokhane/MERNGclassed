const { ApolloServer } = require('apollo-server');
// const gql = require('graphql-tag'); 
const mongoose = require('mongoose');

// const Post  = require('./models/Post')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js')

// exclamation is means required
// const typeDefs = gql`
//     type Post {
//         id: ID!
//         body: String!
//         createdAt: String!
//         username: String!
//     }
//     type Query {
//         getPosts:[Post]
//     }
// `;
// //each query, mutation or subscription has a resolver
// const resolvers = {
//     Query: {
//         async getPosts(){
//             try {
//                 const posts = await Post.find(); //fetch all
//                 return postsdsd;
//             } catch(err) {
//                 throw new Error(err);
//             }
//         }
//     }
// }

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true  })
    .then(() => {
        
        console.log('\n\nMongoDb Connected')
        return server.listen({ port: 5000})
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })