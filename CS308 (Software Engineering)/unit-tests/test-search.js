const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Search Functionality', () =>{
    describe('Temp search function', () =>{
        it('should search product with name', async () => {
            let product = {term:"CS:GO"}; 
            let r =  await axios.post("https://gate.c2a.store/general/temp-search", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should search product with description', async () => {
            let product = {term:"Riot"}; 
            let r =  await axios.post("https://gate.c2a.store/general/temp-search", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find anything', async () => {
            let product = {term:"TestFind"}; 
            let r =  await axios.post("https://gate.c2a.store/general/temp-search", product);
            expect(r.data.result).to.be.equals(2);
        });

    });
    
    describe('Advanced search function', () =>{
        it('should search product with name and page ', async () => {
            let product = {term:"CS:GO", page: 1}; 
            let r =  await axios.post("https://gate.c2a.store/general/search", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should search product with description and page ', async () => {
            let product = {term:"E-pin", page: 1}; 
            let r =  await axios.post("https://gate.c2a.store/general/search", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find anything ', async () => {
            let product = {term:"TestFind", page: 1}; 
            let r =  await axios.post("https://gate.c2a.store/general/search", product);
            expect(r.data.result).to.be.equals(2);
        });

    });
});