const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6IlRhaGlyIFR1cmd1dCIsImN1c3RJRCI6IjQzIiwiY3VzdE1haWwiOiJ0YWhpcnR1cmd1dHRAb3V0bG9vay5jb20iLCJpYXQiOjE2MjAxNjE2NDIsImV4cCI6MTYyMDY4MDA0Mn0.g0ygP3o006Kdpq6dTyH_ITrM4X4xZGwytmIJOEumcyQ";

context('Managing stock system', () =>{
    describe('Update stock ', () =>{
        
        it('should update stock', async () => {
            let info = {token, quantity: 55, productID: 54};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/set-stock", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(8000);
        it('should not update stock since token is invalid', async () => {
            let info = {token:"123asd", productIDs: "45;43;41", prodQuants: "1;1;2"};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/set-stock", info);
            expect(r.data.result).to.be.equals(-2);
        });
        it('should not update stock since quantity is negative', async () => {
            let info = {token, quantity: -3, productID: 52};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/set-stock", info);
            expect(r.data.result).to.be.equals(-3);
        });
        it('should not update stock since productID is not found', async () => {
            let info = {token, quantity: 40, productID: 1};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/set-stock", info);
            expect(r.data.result).to.be.equals(2);
        });

    });

});