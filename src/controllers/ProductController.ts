import { Request, Response } from "express";
import { Product } from "../interfaces/index.js";
import { ProductService } from "../services/ProductService.js";

export class ProductController {

    constructor(private productService: ProductService) {
        this.getProducts = this.getProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProductByIndex = this.updateProductByIndex.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }


    getProducts(req: Request, res: Response) {
        throw new Error("Something went wrong");
        const filterQuery = req.query.filter as string;

        if (filterQuery) {
            return res.send(this.productService.filterByQuery(filterQuery) as Product[]);
        }

        return res.send(this.productService.findAll());
    }

    getProductById(req: Request, res: Response) {
        const productId = +req.params.id;

        if (isNaN(productId)) {
            res.status(400).send({ message: "Invalid Product ID" })
        }

        const product: Product | undefined = this.productService.getProductByID(productId);

        if (product) {
            return res.send({ id: productId, title: product.title, price: product.price });
        }
        else {
            return res.status(404).send({ message: "Product Not Found" })
        }
    }

    createProduct(req: Request, res: Response) {
        const productBody = req.body;

        this.productService.createProduct(productBody);

        res.status(201).send({
            id: this.productService.findAll().length + 1,
            title: productBody.title,
            price: productBody.price,
            description: productBody.description,
        })
    }

    updateProductByIndex(req: Request, res: Response) {
        const productId = +req.params.id;

        if (isNaN(productId)) {
            return res.status(404).send({ message: "Invalid Product ID" });
        }

        const index = this.productService.findAll().findIndex(product => product.id === productId);

        if (index !== -1) {
            const productBody = req.body; // { title : "" }

            this.productService.updateProductByIndex(index, productBody)

            return res.status(200).send({ message: "Product has been updated" });
        }

        return res.status(404).send({ message: "Product Not Found!" });
    }

    deleteProduct(req: Request, res: Response) {
        const productId = +req.params.id;

        if (isNaN(productId)) {
            return res.status(404).send({ message: "Invalid Product ID" });
        };

        const productIndex: number | undefined = this.productService.findAll().findIndex(product => product.id === productId);

        if (productIndex !== -1) {

            const filteredProducts = this.productService.deleteProduct(productId);

            return res.status(200).send(filteredProducts);
        }

        return res.status(404).send({ message: "product not found!" });
    }

    
};