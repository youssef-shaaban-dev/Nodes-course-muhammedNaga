import express from "express";
import { generateFakeProducts } from "./utils/fakeData.js";
import { ProductService } from "./services/ProductService.js";
import path from "node:path";
import productsRouter from "./routes/products.js";
import ProductsViewController from "./controllers/ProductsViewController.js";
import ErrorMiddleware from "./middlewares/Error.js";

const app = express();

app.use(express.json());
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


// Apis

app.use("/api/products", productsRouter)

app.get("/", (req, res) => {
    res.render("index");
})

// handle 404 page ui
app.use((req, res) => {
    res.render("notFound");
})


app.use(ErrorMiddleware.handle);

const PORT: number = 5000;
app.listen(PORT, () => {
    console.log(`server run on port localhost:${PORT}`);
});