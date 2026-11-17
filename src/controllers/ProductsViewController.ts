import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

export default class ProductsViewController {

    constructor (private productService : ProductService){
        this.renderProductPage = this.renderProductPage.bind(this);
        this.renderProductsList = this.renderProductsList.bind(this);

    }
    renderProductsList(req: Request, res: Response) {
        res.render("products", {
            pageTitle: "Product list",
            description: "this is description",
            products: this.productService.findAll()
        })
    }

    renderProductPage(req: Request, res: Response) {
        const productId = +req.params.id;
        res.render("product", {
            product: this.productService.getProductByID(productId)
        })
    }
}