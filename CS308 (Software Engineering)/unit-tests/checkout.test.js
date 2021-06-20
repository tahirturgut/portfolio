const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6InRlc3QxIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJpYXQiOjE2MTk2NDcwNTUsImV4cCI6MTYyMDE2NTQ1NX0.8YD1P2ANRg_X2V2qMnZs9BRAubgt0ae0HRga190mpy4";

context('Checkout system', () =>{
    describe('Checkout ', () =>{
        
        it('should process order', async () => {
            let info = {token, productIDs: "45;43;41", prodQuants: "1;1;2"};
            let r =  await axios.post("https://gate.c2a.store/cart/checkout", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(8000);
        it('should not process since token is invalid', async () => {
            let info = {token:"123asd", productIDs: "45;43;41", prodQuants: "1;1;2"};
            let r =  await axios.post("https://gate.c2a.store/cart/checkout", info);
            expect(r.data.result).to.be.equals(-2);
        });

    });

});