const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Product {
        _id: ID!
        title: String!
        price: Float!
        description: String!
        imageUrl: String!
        userId: ID!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        cart: Cart
    }

    type Cart {
        items: [CartItem!]
    }

    type CartItem {
        productId: ID!
        quantity: Int!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input ProductInput {
        title: String!
        price: Float!
        description: String!
        imageUrl: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        products: [Product!]!
        product(id: ID!): Product!
        cart: Cart!
    }

    type RootMutation {
        createUser(userInput: UserInput): User!
        createProduct(productInput: ProductInput): Product!
        addToCart(productId: ID!): Cart!
        removeFromCart(productId: ID!): Cart!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
