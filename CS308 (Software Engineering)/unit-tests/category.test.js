const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Getting categories', () =>{
    describe('Getting detailed product info', () =>{
        
        it('should get category info', async () => {
            let r =  await axios.get("https://gate.c2a.store/home/get-categories");
            expect(r.data.result).to.be.equals(1);
        });
    });

    describe('Getting detailed products', () =>{
        it('should find details', async () => {
            let product = {categoryName: "Steam"}; 
            let r =  await axios.post("https://gate.c2a.store/home/get-category-detail", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should find details', async () => {
            let product = {categoryName: "Riot Games"}; 
            let r =  await axios.post("https://gate.c2a.store/home/get-category-detail", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find any details', async () => {
            let product = {categoryName: "TEST"}; 
            let r =  await axios.post("https://gate.c2a.store/home/get-category-detail", product);
            expect(r.data.result).to.be.equals(3);
        });

    });
});
