const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6Ik0uIEJpbGdlaGFuIEVydGFuIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJ1c2VyUm9sZSI6InByb2RNYW5hZ2VyIiwiaWF0IjoxNjIxOTMxMjM0LCJleHAiOjE2MjIwMTc2MzR9.8l7rrJj7vBU84rHgrqLXVJwKNbcjaZCbgpTD6TbmlTI";

context('Product Manager', () =>{
    describe('Getting all products', () =>{

        it('should get all products', async () => {
            let info = {
               token
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/get-all-products", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(10000)

        it('should not get because token is wrong', async () => {
            let info = {
                token: "123123"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/get-all-products", info);
            expect(r.data.result).to.be.equals(-2);
        }).timeout(10000)

    });

    describe('Getting single product', () =>{

        it('should get products', async () => {
            let info = {
               token,
               productID: 36
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/get-product", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(10000)

        it('should not get because token is wrong', async () => {
            let info = {
                token: "123123",
                productID: 36
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/get-product", info);
            expect(r.data.result).to.be.equals(-2);
        }).timeout(10000)
        it('should not get anything because productID is not exist', async () =>{
            let info = {
                token,
                productID: 1
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/get-product", info);
            expect(r.data.result).to.be.equals(2);

        })

    });

    describe('Getting products to be delivered', () =>{

        it('should get products', async () => {
            let info = {
               token
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/products-to-deliver", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(10000)

        it('should not get because token is wrong', async () => {
            let info = {
                token: "123123"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/products-to-deliver", info);
            expect(r.data.result).to.be.equals(-2);
        }).timeout(10000)

    });

    describe('Cancelling order', () =>{

        it('should cancel order', async () => {
            let info = {
               token,
               deliveryID:149
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/cancel-order", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(10000)

        it('should not get because token is wrong', async () => {
            let info = {
                token: "123123",
                deliveryID: 150
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/cancel-order", info);
            expect(r.data.result).to.be.equals(-2);
        }).timeout(10000)

        it('should not cancel order because order is already shipped', async () => {
            let info = {
               token,
               deliveryID:150
            
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/cancel-order", info);
            expect(r.data.result).to.be.equals(-3);
        }).timeout(10000)

        it('should not cancel order because order is already completed', async () => {
            let info = {
               token,
               deliveryID: 186
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/cancel-order", info);
            expect(r.data.result).to.be.equals(-4);
        }).timeout(10000)

        it('should not cancel order because order not exist', async () => {
            let info = {
               token,
               deliveryID: 1
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/cancel-order", info);
            expect(r.data.result).to.be.equals(-5);
        }).timeout(10000)

    });
    
    describe('Getting all ratings', () =>{

        it('should get ratings', async () => {
            let info = {
               token
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/all-ratings", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(10000)

        it('should not get because token is wrong', async () => {
            let info = {
                token: "123123"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/product-manager/all-ratings", info);
            expect(r.data.result).to.be.equals(-2);
        }).timeout(10000)

    });

});