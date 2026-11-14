// Service => data storage & retrieval
import { Product } from "../interfaces/index.js";

type productBody = {
    title: string,
    price: number,
    description: string
}

export class ProductService {

    constructor(private products: Product[]) {
        this.products = products;
    }
    findAll(): Product[] {
        return this.products;
    }

    filterByQuery(filterQuery: string) {

        if (!filterQuery) return this.findAll();

        const propertiesToFilter = filterQuery.split(",");
        const filteredProducts = this.findAll().map(product => {
            const filteredProduct: Record<string, any> = {
                id: product.id
            }

            propertiesToFilter.forEach(property => {
                const key = property as keyof Product;
                if (product.hasOwnProperty(key)) {
                    filteredProduct[key] = product[key]
                }
            });
            return filteredProduct;
        });
        return filteredProducts;
    }

    getProductByID(productId: number) {
        return this.findAll().find(product => product.id === productId);
    }

    createProduct(productBody: productBody) {
        return this.findAll().push({ id: this.findAll().length + 1, ...productBody });
    }

    updateProductByIndex(index: number , productBody : productBody) {

        return  this.findAll()[index] = { ...this.findAll()[index], ...productBody };

    }

    deleteProduct(productId: number) {
        return this.findAll().filter(product => product.id !== productId);;
    }
};


