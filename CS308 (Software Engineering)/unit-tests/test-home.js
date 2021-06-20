const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Home Functionality', () =>{
    describe('Geting nav bar', () =>{
        
        it('should get nav bar', async () => {
            let r =  await axios.get("https://gate.c2a.store/home/getNavbar");
            expect(r.data.result).to.be.equals(1);
        });
        // it('should not get navbar', async () => {
        //     let r =  await axios.post("https://gate.c2a.store/home/getNavbar");
        //     expect(r.status).to.be.equal(404);
        // });

    });

    describe('Geting newest products', () =>{
        
        it('should return newest products', async () => {
            let r =  await axios.get("https://gate.c2a.store/home/get-newest-products");
            expect(r.data.result).to.be.equals(1);
        });

    });

    describe('Geting popular products', () =>{
        
        it('sshould return popular products', async () => {
            let r =  await axios.get("https://gate.c2a.store/home/get-popular-product");
            expect(r.data.result).to.be.equals(1);
        });
    });
});

