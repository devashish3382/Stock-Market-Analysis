const express = require('express');
const app = express();
const router = require('./routers/StockRouter');
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(router);

//creating server on specified port
app.listen(port,()=>{
console.error("server is up on port "+port);
})