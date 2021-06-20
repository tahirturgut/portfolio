const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Getting product page info', () =>{
    describe('Getting detailed product info', () =>{
        
        it('should get product info', async () => {
            let product = {productID:36}; 
            let r =  await axios.post("https://gate.c2a.store/general/get-product-info", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find anything', async () => {
            let product = {productID:1}; 
            let r =  await axios.post("https://gate.c2a.store/general/get-product-info", product);
            expect(r.data.result).to.be.equals(2);
        });

    });

    describe('Getting reviews', () =>{
        it('getting reviews for a specific product ', async () => {
            let product = {productID:36}; 
            let r =  await axios.post("https://gate.c2a.store/general/get-reviews", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find any reviews', async () => {
            let product = {productID:1}; 
            let r =  await axios.post("https://gate.c2a.store/general/get-reviews", product);
            expect(r.data.result).to.be.equals(2);
        });

    });
});
