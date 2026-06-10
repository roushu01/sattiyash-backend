const router = require('./src/routes/userauthroute.js');
const cartRouter = require('./src/routes/cartauthroutes.js');
const productRouter = require('./src/routes/productauthroutes.js');
const orderRouter = require('./src/routes/orderauthroutes.js');
const contactRouter = require('./src/routes/contactauthroutes.js');
const whislistRouter = require('./src/routes/wishlistauthroutes.js');
const connectDB = require('./src/controllers/dbconfig.js');

const express = require('express');
const dns = require("dns");
const cookieParser = require("cookie-parser");
const cors = require("cors");   // <-- add this

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

connectDB();

app.use(cookieParser());


app.use(
  cors({
    origin: [
      "https://sattiyash-frontend-git-main-roushu01s-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(router);
app.use(orderRouter);
app.use(cartRouter);
app.use(whislistRouter);
app.use(productRouter);
app.use(contactRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
