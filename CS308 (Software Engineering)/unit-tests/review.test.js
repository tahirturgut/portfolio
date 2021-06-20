const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6IkJpbGdlaGFuIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJpYXQiOjE2MTkwNjQxNTgsImV4cCI6MTYxOTU4MjU1OH0.idf6bxBkSB7_0WqLR5Awch9PEh2Nd5FZGvTW48U5nPY";

context('Review system', () =>{
    describe('Adding review', () =>{
        
        it('should add review', async () => {
            let review = {token, comment:"test", productID: 36, ratingValue: 10}; 
            let r =  await axios.post("https://gate.c2a.store/general/write-review", review);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not add since token is invalid', async () => {
            let review = {token:"asdasd", comment:"test", productID: 36, ratingValue: 10}; 
            let r =  await axios.post("https://gate.c2a.store/general/write-review", review);
            expect(r.data.result).to.be.equals(-2);
        });

    });

    describe('Deleting own reviews', () =>{
        it('should delete own review ', async () => {
            let review = {token, ratingID: 74}; 
            let r =  await axios.post("https://gate.c2a.store/general/delete-own-review", review);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not delete own review since no rating found', async () => {
            let review = {token, ratingID: 3}; 
            let r =  await axios.post("https://gate.c2a.store/general/delete-own-review", review);
            expect(r.data.result).to.be.equals(2);
        });
        it('should not proceed since token is invalid ', async () => {
            let review = {token: "asd", ratingID: 63}; 
            let r =  await axios.post("https://gate.c2a.store/general/delete-own-review", review);
            expect(r.data.result).to.be.equals(-2);
        });

    });
});