const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6IlRhaGlyIFR1cmd1dCIsImN1c3RJRCI6IjQzIiwiY3VzdE1haWwiOiJ0YWhpcnR1cmd1dHRAb3V0bG9vay5jb20iLCJpYXQiOjE2MjAxNjE2NDIsImV4cCI6MTYyMDY4MDA0Mn0.g0ygP3o006Kdpq6dTyH_ITrM4X4xZGwytmIJOEumcyQ";

context('Approving comment system', () =>{
    describe('Approve comment ', () =>{
        
        it('should approve comment', async () => {
            let info = {token, ratingID: 62};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/manage-comment", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(8000);
        it('should not approve comment since token is invalid', async () => {
            let info = {token:"123asd", ratingID: 60};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/manage-comment", info);
            expect(r.data.result).to.be.equals(-2);
        });
        it('should not approve comment since ratingID is not found', async () => {
            let info = {token, ratingID: 54};
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/manage-comment", info);
            expect(r.data.result).to.be.equals(2);
        });

    });

});