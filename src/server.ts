import express from "express";
import { generateFakeProducts } from "./utils/fakeData.js";
import { ProductController } from "./controllers/ProductController.js";
import { ProductService } from "./services/ProductService.js";
import path from "node:path";

const app = express();

app.use(express.json());
// set Views director
app.set("view engine", "pug");
app.set("views", path.join(import.meta.dirname, "views"));

// static files
app.use(express.static(path.join(import.meta.dirname, "public")))

// Products Routes
app.get("/products", (req, res) => productController.renderProductsList(req, res));



app.get("/api", (req, res) => {
    res.send("<h1>hello from express</h1>")
});

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData)

const productController = new ProductController(productService);

// Apis
app.get("/api/products", (req, res) => productController.getProducts(req, res));

app.get("/api/products/:id", (req, res) => productController.getProductById(req, res));

// Create A New Product
app.post("/api/products", (req, res) => productController.createProduct(req, res));

// Update

app.patch("/api/products/:id", (req, res) => productController.updateProductByIndex(req, res));

// Delete

app.delete("/api/products/:id", (req, res) => productController.deleteProduct(req, res));


app.get("/", (req, res) => {
    res.render("index");
})

// handle 404 page ui
app.use((req, res) => {
    res.render("notFound");
})

const PORT: number = 5000;
app.listen(PORT, () => {
    console.log(`server run on port localhost:${PORT}`);
});