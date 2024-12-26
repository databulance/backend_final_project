const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Configure session
app.use("/customer",session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Use the same secret key as in `auth_users.js`
    req.session.user = decoded; // Store user info in session
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
