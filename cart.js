const express = require('express');
const cartItems = express.Router();
const pool = require('./connection'); //added to connect to database

//1. GET /cart-items. Response: a JSON array of all cart items at http://localhost:8888/cart-items
//   Response Code: 200 (OK)
// query for maxPrice, prefix, pageSize

cartItems.get("/", (request, response) => {
      const maxPrice = request.query.maxPrice;
      const prefix = request.query.prefix;
      const pageSize = request.query.pageSize;
      
      pool.query("SELECT * FROM shopping_cart;").then((results) => {
        response.json(results.rows);
   })    
      if(maxPrice){
      pool.query("SELECT * FROM shopping_cart WHERE price <= $1;", [maxPrice]).then((results) => {
        const filtered = results.rows;   
        response.status(200); 
        response.json(filtered);
       });
     }
     if(prefix){
        pool.query("SELECT * FROM shopping_cart WHERE product LIKE $1;", [prefix]).then((results) => {
            const filtered = results.rows; 
            response.status(200);
            response.json(filtered);
       });
     }
     if(pageSize){
        pool.query("SELECT * FROM shopping_cart LIMIT $1", [pageSize]).then( (results) => {
            const filtered = results.rows; 
            response.status(200);
            response.json(filtered);
        });
     }
  });

//2. GET /cart-items/:id from SQL database
//   Response Code: 200 (OK). IF item with that ID cannot be found, return a string
//   response “ID Not Found” with response code 404 (Not Found)
        //example on what to put in browser/POSTMAN http://localhost:8888/cart-items/2

  cartItems.get('/:id', (request, response)=> {
        const id = request.params.id;
        pool.query('SELECT * FROM shopping_cart WHERE id = $1', [id]).then((results) => {
        const items = results.rows;
        if(!items.length){
            response.status(404).json('ID Not Found');
        } else{
            response.json(items);
        }
     });
  });

//3. POST /cart-items Action: Add a cart item to the array 
//   Also generate a unique ID for that item.
//   Response Code: 201 (Created)
    //example on what to put in browser http://localhost:8888/cart-items

cartItems.post('/', (request, response) => {
    const newItem = request.body;
    pool.query('INSERT INTO shopping_cart (product, price, quantity) VALUES ($1, $2, $3);', [
        newItem.product,
        newItem.price,
        newItem.quantity
    ]).then( () => {
        response.status(201);
        response.json(newItem);
    })
});

// 4. PUT /cart-items/:id  Action: Update the cart item in the array that has the given id. 
//    Use the JSON body of the request as the new properties.
//      b. Response: the updated cart item object as JSON.
//      c. Response Code: 200 (OK).

        cartItems.put('/:id', (request, response) => {
            const cartUpdate = request.body;
            pool.query('UPDATE shopping_cart SET product = $1, price = $2, quantity = $3 WHERE id= $4;', [
                cartUpdate.product,
                cartUpdate.price,
                cartUpdate.quantity
            ]).then( () => {
                response.status(200);
                response.json(cartUpdate);
            })
        });

 //5. DELETE /cart-items/:id
 //    a. Action: Remove the item from the array that has the given ID.
 //    b. Response: Empty
 //    c. Response Code: 204 (No Content)

        cartItems.delete('/:id', (request,response) => {
            const id = request.params.id;
            pool.query("DELETE FROM shopping_cart WHERE id = $1", [id]).then( ()=> {
                response.status(204);
                response.json("Deleted")
            });
        });

//export module so we can use in other files
module.exports = cartItems;