import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { ProductService } from "../services/ProductService.js";
import { generateFakeProducts } from "../utils/fakeData.js";

const productsRouter = Router();

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData);

const { getProducts, createProduct,getProductById,updateProductByIndex, deleteProduct } = new ProductController(productService);


productsRouter.route("/").get(getProducts).post(createProduct);

productsRouter.route("/:id").get(getProductById).patch(updateProductByIndex).delete(deleteProduct);


export default productsRouter;