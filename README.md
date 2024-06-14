<!-- 1 SERVER MODULE -->
// 1
// Importing modules: The code begins by importing necessary modules using the import statement. It imports authRoutes from the file auth.route.js, connectMongoDB from the file connectMongoDB.js, and cookieParser from the "cookie-parser" package.

// 2
// Configuring environment variables: The dotenv.config() function is called to load environment variables from a .env file. This allows the application to access configuration values such as database connection details or API keys.

// 3
// Creating an Express application: The app variable is assigned the result of calling the express() function. Express is a popular web application framework for Node.js that simplifies the process of building web servers.

// 4
// Setting the port: The PORT variable is assigned the value of the process.env.PORT environment variable, or 5000 if it is not defined. This allows the server to listen on a specific port specified by the environment or fallback to a default value.

// 5
// Middleware setup: Middleware functions are used to process incoming requests before they reach the route handlers. In this code, three middleware functions are set up using the app.use() method:

    // express.json(): This middleware parses incoming requests with JSON payloads and makes the data available on the req.body property.
    // express.urlencoded({extended: true}): This middleware parses incoming requests with URL-encoded payloads and makes the data available on the req.body property.
    // Cookie parsing: The cookieParser middleware is added using app.use() to parse cookies attached to incoming requests. It makes the parsed cookies available on the req.cookies property.

// 6
// Routing: The authRoutes are mounted on the /api/auth path using app.use(). This means that any requests starting with /api/auth will be handled by the routes defined in the authRoutes module.

// 7
// Starting the server: The app.listen() function is called to start the server and make it listen on the specified PORT. Once the server is running, a message is logged to the console indicating the port number. Additionally, the connectMongoDB() function is called, presumably to establish a connection to a MongoDB database.

// This code sets up an Express server, configures middleware, and defines routes for authentication. It also establishes a connection to a MongoDB database and starts the server to listen for incoming requests.

<!-- 2 AUTH.ROUTE MODULE -->
// 1
// Import Dependencies and Controllers:
    // express: A web application framework for Node.js, used to build web applications and APIs.
    // signup, login, logout, getMe: Functions imported from auth.controller.js, handling user signup, login, logout, and fetching the current user's information, respectively.
    // protectRoute: A middleware function imported from protect.middleware.js, used to protect routes that require authentication.

// 2
// Create Router:
    // express.Router(): Creates a new router object. A router object is a mini-application capable of performing middleware and routing functions. This is a part of Express's way to modularize routes.

// 3
// Define Routes:
    // router.get("/me", protectRoute, getMe): Defines a GET route for the path /me. It uses the protectRoute middleware to ensure the route is protected (accessible only by authenticated users) before calling the getMe controller function to return the current user's information.
    // router.post("/signup", signup): Defines a POST route for the path /signup. When this route is hit, the signup controller function is called to handle user registration.
    // router.post("/login", login): Similar to the signup route, this defines a POST route for /login, which calls the login controller function to authenticate a user.
    // router.post("/logout", logout): Defines a POST route for /logout, which calls the logout controller function to log a user out.

// 4
// Export Router:
    // export default router;: The router object, with all the defined routes, is exported. This allows it to be imported and used in other parts of the application, typically in the main server file where all routes are combined and the server is started.
    
// This structure allows for a clean and organized way to handle different authentication-related actions within the application.

<!-- 3 AUTH.CONTROLLER MODULE -->
// 1
// signup: This function handles the user signup process. It expects a request object (req) and a response object (res) as parameters. Inside the function, it performs the following steps:

    // Destructures the userName, fullName, email, and password properties from the request body.
    // Validates the email format using a regular expression. If the email format is invalid, it sends a response with a 400 status code and an error message.
    // Checks if the userName already exists in the database. If it does, it sends a response with a 400 status code and an error message.
    // Checks if the email already exists in the database. If it does, it sends a response with a 400 status code and an error message.
    // Checks if the password length is less than 6 characters. If it is, it sends a response with a 400 status code and an error message.
    // Hashes the password using the bcrypt library.
    // Creates a new User object with the provided user data.
    // Generates a token and sets it as a cookie in the response using the generateTokenAndSetCookie function from the generateToken.js module.
    // Saves the new user to the database.
    // Sends a response with a 201 status code and the user data (excluding the password) in the response body. If the user data is invalid, it sends a response with a 400 status code and an error message.

// 2
// login: This function handles the user login process. It expects a request object (req) and a response object (res) as parameters. Inside the function, it performs the following steps:
    // Destructures the userName and password properties from the request body.
    // Finds a user in the database with the provided userName.
    // Compares the provided password with the hashed password stored in the user object using the bcrypt.compare function.
    // If the user is not found or the password is incorrect, it sends a response with a 400 status code and an error message.
    // Generates a token and sets it as a cookie in the response using the generateTokenAndSetCookie function.
    // Sends a response with a 200 status code and the user data (excluding the password) in the response body.

// 3
// logout: This function handles the user logout process. It expects a request object (req) and a response object (res) as parameters. Inside the function, it performs the following steps:
    // Clears the JWT (JSON Web Token) cookie by setting its value to an empty string and setting the maxAge to 0, effectively expiring the cookie.
    // Sends a response with a 200 status code and a success message.

// 4
// getMe: This function retrieves the currently authenticated user's data. It expects a request object (req) and a response object (res) as parameters. Inside the function, it performs the following steps:
    // Uses the req.user._id property to find the user in the database.
    // Excludes the password field from the retrieved user data.
    // Sends a response with a 200 status code and the user data in the response body.

// In case any error occurs during the execution of these functions, a catch block logs the error message and sends a response with a 500 status code and an error message indicating an internal server error.

<!-- 4 PROTECT.MIDDLEWARE MODULE -->
// The protectRoute middleware function is responsible for protecting routes by verifying the user's authentication token. Here's how it works:
    // The function takes three parameters: req (request), res (response), and next (a function to pass control to the next middleware or route handler).
    // Inside the function, it first checks if the authentication token exists in the request cookies. If it doesn't exist, it returns a 401 (Unauthorized) response with an error message indicating that no token was provided.
    // If the token exists, it uses the jwt.verify method to decode and verify the token using the process.env.JWT_SECRET as the secret key.
    // If the token is invalid or cannot be decoded, it returns a 401 (Unauthorized) response with an error message indicating that the token is invalid.
    // If the token is valid, it retrieves the user's information from the database using the decoded user ID. It excludes the password field for security reasons.
    // If the user is not found in the database, it returns a 404 (Not Found) response with an error message indicating that the user was not found.
    // If the user is found, it attaches the user object to the req object and calls the next function to pass control to the next middleware or route handler.

<!-- 5 JENERATE.TOKEN MODULE -->
This function takes two parameters: userId and res.

Inside the function, it generates a JSON Web Token (JWT) using the jwt.sign method from the jsonwebtoken library. The JWT is created by signing a payload object containing the userId with a secret key (process.env.JWT_SECRET). The third argument to jwt.sign specifies additional options for the token, including the expiration time of 15 days (expiresIn: "15d").

After generating the token, the function uses the res.cookie method to set a cookie named "jwt" with the generated token as its value. The res.cookie method is typically used in server-side JavaScript frameworks like Express.js to set cookies in the HTTP response. The res parameter represents the response object.

The res.cookie method is called with an object that specifies various options for the cookie. In this case, the maxAge option is set to 15 days in milliseconds, which determines how long the cookie will be valid. The httpOnly option is set to true, which ensures that the cookie is only accessible through HTTP requests and cannot be accessed by client-side JavaScript, preventing cross-site scripting (XSS) attacks. The sameSite option is set to "strict", which helps prevent cross-site request forgery (CSRF) attacks. Finally, the secure option is set based on the NODE_ENV environment variable, ensuring that the cookie is only sent over secure HTTPS connections in production environments.