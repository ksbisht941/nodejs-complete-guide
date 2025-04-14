require('dotenv').config();

// Core Node.js modules
const path = require('path');

// Third-party package imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

// Local imports
const errorController = require('./controllers/error');
const User = require('./models/user');

// Database configuration
const MONGODB_URI = 'mongodb://localhost:27017/shop';

// Express app initialization
const app = express();

// Session store configuration
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' // MongoDB collection for storing sessions
});

// CSRF protection middleware
const csrfProtection = csrf();

// File upload configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Store uploaded files in 'images' directory
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname); // Generate unique filenames
  }
});

// File type filter for uploads
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
  }
};

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Route imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Global middleware setup
// Add body-parser for JSON
app.use(bodyParser.json()); // Add this line for parsing JSON
app.use(bodyParser.urlencoded({ extended: false }));

// Handle file uploads
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Session configuration
app.use(
  session({
    secret: 'my secret', // Session signing key
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: store // Use MongoDB session store
  })
);

// Add auth middleware before GraphQL
app.use(auth);

// Add GraphQL endpoint BEFORE CSRF protection
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    }
  })
);

// CSRF protection after GraphQL
app.use(csrfProtection);
app.use(flash());

// Set local variables available in all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// User session handling middleware
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // Fetch user from database if session exists
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

// Regular routes
app.use('/admin', adminRoutes); // Admin routes under /admin
app.use(shopRoutes); // Shop routes at root level
app.use(authRoutes); // Authentication routes

// Error handling routes
app.get('/500', errorController.get500); // Server error page
app.use(errorController.get404); // 404 Not Found page

// Global error handling middleware
app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(result => {
      app.listen(3000);
      console.log('Server started on port 3000');
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = app; // Export for testing
