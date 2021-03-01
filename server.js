const express = require("express"); // require the Express module
const app = express(); // creates an instance of an Express server


const cartItems = require('./cart'); //importing and using the cart route in app


//allows us to use query strings params,
//path params, and body, all in the req object
app.use(express.json());


// define the port where the app will run
const port = 8888;

app.use("/cart-items/", cartItems); //endpoint


// run the server. hooks all the functionality together
app.listen(port, () => console.log(`Listening on port: ${port}.`));

//just for ease of use no functionality
console.log("http://localhost:"+ port + "/cart-items")