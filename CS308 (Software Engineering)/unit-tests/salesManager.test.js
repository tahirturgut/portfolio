const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

let wrong_token = "zzeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6InRlc3QxIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJpYXQiOjE2MTk2NDcwNTUsImV4cCI6MTYyMDE2NTQ1NX0.8YD1P2ANRg_X2V2qMnZs9BRAubgt0ae0HRga190mpy4";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6Ik0uIEJpbGdlaGFuIEVydGFuIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJ1c2VyUm9sZSI6InNhbGVzTWFuYWdlciIsImlhdCI6MTYyMTM1NTc5MSwiZXhwIjoxNjIxNDQyMTkxfQ.AIy4m_Wpp_y-QWP1G-NzNJpdjijl4N8nYOiVP6dEASc"
context('Sales Manager', () =>{
    describe('Setting a discount', () =>{
        
        it('should fail to set discount due to invalid token', async () => {
            let product = {wrong_token,productID:51,discount_rate:0.3}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-discount", product);
            expect(r.data.result).to.be.equals(-4);
        });
        it('should fail to set discount due to invalid discount', async () => {
            let product = {token,productID:51,discount_rate:2}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-discount", product);
            expect(r.data.result).to.be.equals(-2);
        });
        it('should fail to set discount due to invalid productID', async () => {
            let product = {token,productID:-1,discount_rate:0.4}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-discount", product);
            expect(r.data.result).to.be.equals(-3);
        });
        it('should set discount succesfuly', async () => {
            let product = {token,productID:51,discount_rate:0.3}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-discount", product);
            expect(r.data.result).to.be.equals(1);
        });
    });

    describe('Setting a price', () =>{      
        it('should fail to set price due to invalid token', async () => {
            let product = {wrong_token,productID:51,price:150}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-price", product);
            expect(r.data.result).to.be.equals(-4);
        });
        it('should fail to set price due to invalid price', async () => {
            let product = {token,productID:51,price:-2}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-price", product);
            expect(r.data.result).to.be.equals(-2);
        });
        it('should fail to set price due to invalid productID', async () => {
            let product = {token,productID:-1,price:50}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-price", product);
            expect(r.data.result).to.be.equals(-3);
        });
        it('should set discount succesfuly', async () => {
            let product = {token,productID:51,price:150}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/set-price", product);
            expect(r.data.result).to.be.equals(1);
        });
    });

    describe('Geting deliveris in range of dates', () =>{
        
        it('should fail to get deliveries due to invalid token', async () => {
            let product = {wrong_token,start_date:new Date(2019,04,30).toISOString(),end_date:new Date(2021,04,30).toISOString()}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/get-delivery-with-date-range", product);
            expect(r.data.result).to.be.equals(-4);
        });
        it('should fail to get deliveries due to invalid dates', async () => {
            let product = {token,start_date:"2015-04-30",end_date:"2014-04-30"}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/get-delivery-with-date-range", product);
            expect(r.data.result).to.be.equals(-2);
        });
        it('should fail to get deliveries due to no delivery in this date range', async () => {
            let product = {token,start_date:"2016-04-30",end_date:"2017-04-30"}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/get-delivery-with-date-range", product);
            expect(r.data.result).to.be.equals(-3);
        });
        it('should get deliveries in range', async () => {
            let product = {token,start_date:new Date(2019,04,30).toISOString(),end_date:new Date(2021,04,30).toISOString()}; 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/get-delivery-with-date-range", product);
            expect(r.data.result).to.be.equals(1);
        });
    });
    describe('Geting products to be refunded', () =>{
        
        it('should fail to get deliveries due to invalid token', async () => {
            let product = {wrong_token} 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/get-refunds", product);
            expect(r.data.result).to.be.equals(-4);
        });
        it('should get the products', async () => {
            let product = {token} 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/get-refunds", product);
            expect(r.data.result).to.be.equals(1);
        });

    });
    describe('Geting products to be refunded', () =>{
        
        it('should fail to process deliveries due to invalid token', async () => {
            let product = {wrong_token} 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/refund-product", product);
            expect(r.data.result).to.be.equals(-4);
        });
        it('should refund the products', async () => {
            let product = {token, deliveryID: 188 } 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/refund-product", product);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not refund it because delivery not exist', async () => {
            let product = {token, deliveryID: 1 } 
            let r =  await axios.post("https://gate.c2a.store/admin/salesManager/refund-product", product);
            expect(r.data.result).to.be.equals(3);
        });

    });
});