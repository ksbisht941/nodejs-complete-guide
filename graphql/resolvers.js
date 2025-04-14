const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Product = require('../models/product');

module.exports = {
    // Query Resolvers
    login: async function({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }
        
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect.');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );
        return { token: token, userId: user._id.toString() };
    },

    products: async function(args, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        
        const products = await Product.find();
        return products.map(product => {
            return {
                ...product._doc,
                _id: product._id.toString(),
                price: parseFloat(product.price)
            };
        });
    },

    product: async function({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        const product = await Product.findById(id);
        if (!product) {
            const error = new Error('Product not found!');
            error.code = 404;
            throw error;
        }

        return {
            ...product._doc,
            _id: product._id.toString(),
            price: parseFloat(product.price)
        };
    },

    cart: async function(args, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        const user = await User.findById(req.userId);
        return {
            items: user.cart.items
        };
    },

    // Mutation Resolvers
    createUser: async function({ userInput }) {
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }

        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            password: hashedPw,
            cart: { items: [] }
        });

        const createdUser = await user.save();
        return {
            ...createdUser._doc,
            _id: createdUser._id.toString(),
            password: null // Don't return the password
        };
    },

    createProduct: async function({ productInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        const product = new Product({
            title: productInput.title,
            price: productInput.price,
            description: productInput.description,
            imageUrl: productInput.imageUrl,
            userId: req.userId
        });

        const createdProduct = await product.save();
        return {
            ...createdProduct._doc,
            _id: createdProduct._id.toString(),
            price: parseFloat(createdProduct.price)
        };
    },

    addToCart: async function({ productId }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        const user = await User.findById(req.userId);
        const product = await Product.findById(productId);
        
        if (!product) {
            const error = new Error('Product not found!');
            error.code = 404;
            throw error;
        }

        const cartProductIndex = user.cart.items.findIndex(cp => {
            return cp.productId.toString() === productId.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...user.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = user.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: productId,
                quantity: newQuantity
            });
        }

        user.cart.items = updatedCartItems;
        await user.save();

        return user.cart;
    },

    removeFromCart: async function({ productId }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        const user = await User.findById(req.userId);
        const updatedCartItems = user.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        user.cart.items = updatedCartItems;
        await user.save();

        return user.cart;
    }
};
