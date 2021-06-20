const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Cart Functionality', () =>{
    describe('Adding product to cart', () =>{
        
        it('should add product to cart', async () => {
            let product = {productID:36,custID:7}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/add-product", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not add product to cart becouse of not found', async () => {
            let product = {productID:1,custID:7}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/add-product", product);
            expect(r.data.result).to.be.equals(2);
        });
        it('should not add due to stock', async () => {
            let product = {productID:43,custID:7}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/add-product", product);
            expect(r.data.result).to.be.equals(3);
        });
    });

    describe('Deleting product from cart', () =>{
        
        it('should delete product from cart', async () => {
            let product = {productID:36,custID:7}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/remove-product", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find product in cart', async () => {
            let product = {productID:-1,custID:7}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/remove-product", product);
            expect(r.data.result).to.be.equals(2);
        });
    });

    describe('Geting cart concent', () =>{
        
        it('should return customers cart', async () => {
            let product = {custID:7}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/get-cart", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should return empty cart', async () => {
            let product = {custID:123}; 
            let r =  await axios.post("https://gate.c2a.store/general/cart/get-cart", product);
            expect(r.data.data.length).to.be.equals(0);
        });

    });
    
});