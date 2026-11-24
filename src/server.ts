import express from "express";
import { generateFakeProducts } from "./utils/fakeData.js";
import { ProductService } from "./services/ProductService.js";
import path from "node:path";
import productsRouter from "./routes/products.js";
import ProductsViewController from "./controllers/ProductsViewController.js";
import ErrorMiddleware from "./middlewares/Error.js";
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import NotFoundMiddleware from "./middlewares/notFound.js";
import pool from "./models/db.js";
import dotenv from "dotenv"
dotenv.config();

const app = express();


const rateLimiterOptions = {
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 100,
    message: "Too many requests from this Ip , please try again later. "
};

app.use(express.json());

app.use(helmet({
    contentSecurityPolicy: false,
    xFrameOptions: {
        action: "deny"
    }
}));

app.use(morgan("dev"));

app.use(rateLimit(rateLimiterOptions))

// set Views director
app.set("view engine", "pug");
app.set("views", path.join(import.meta.dirname, "views"));

// static files
app.use(express.static(path.join(import.meta.dirname, "public")));

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData);

// Products Routes
const productsViewController = new ProductsViewController(productService)

app.get("/products", productsViewController.renderProductsList);
app.get("/products/:id", productsViewController.renderProductPage);


app.get("/api", (req, res) => {
    res.send("<h1>hello from express</h1>")
});



app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/db/products", async (req, res) => {
    try {
        const products = await pool.query("SELECT * FROM products;");
        res.json({
            products: products.rows,
            length: products.rowCount
        })
    } catch (error) {
        console.error(error);
    }
});


// Middlewares
app.use(NotFoundMiddleware.handle);
app.use(ErrorMiddleware.handle);

const PORT: number = 5000;
app.listen(PORT, () => {
    console.log(`server run on port localhost:${PORT}`);
});