const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6IkJpbGdlaGFuIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJpYXQiOjE2MTkwNjQxNTgsImV4cCI6MTYxOTU4MjU1OH0.idf6bxBkSB7_0WqLR5Awch9PEh2Nd5FZGvTW48U5nPY";

context('User Profile Getting datas', () =>{

    describe('Get-address', () =>{
        
        it('should get address of user', async () => {
            let info = {token, custID:5};
            let r =  await axios.post("https://gate.c2a.store/user/get-address", info);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not find any address', async () => {
            let info = {token,custID:18}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-address", info);
            expect(r.data.result).to.be.equals(2);
        });
        it('should not proceed because the token is wrong or not exist', async () => {
            let info = {custID:18}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-address", info);
            expect(r.data.result).to.be.equals(-2);
        });
    });

    describe('Geting whole profile data', () =>{
        
        it('should get profile data', async () => {
            let info = {token, custID:5}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-profile", info);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not return data because user does not exist', async () => {
            let info = {token, custID:2}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-profile", info);
            expect(r.data.result).to.be.equals(2);
        });
        it('should not proceed because the token is wrong or not exist', async () => {
            let info = {token:"asdasd", custID:5}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-profile", info);
            expect(r.data.result).to.be.equals(-2);
        });

    });

    describe('Geting orders', () =>{
        
        it('should get orders data', async () => {
            let info = {token, custID:40}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-orders", info);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not return data because no orders exist for that user', async () => {
            let info = {token, custID:2}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-orders", info);
            expect(r.data.result).to.be.equals(2);
        });
        it('should not proceed because the token is wrong or not exist', async () => {
            let info = {token:"asdasd", custID:5}; 
            let r =  await axios.post("https://gate.c2a.store/user/get-orders", info);
            expect(r.data.result).to.be.equals(-2);
        });

    });

    
});

context('User profile changing datas', () => {

    describe('Changing passwords', () =>{
        
        it('should change password', async () => {
            let info = {token, custID:40, oldPassword: "123123Ab-+", newPassword: "123123Ab-+"};
            let r =  await axios.post("https://gate.c2a.store/user/change-password", info);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not change password since user not found', async () => {
            let info = {token, custID:2, oldPassword: "123123Ab-", newPassword: "123123Ab+"};
            let r =  await axios.post("https://gate.c2a.store/user/change-password", info);
            expect(r.data.result).to.be.equals(3);
        });
        it('should not change password since oldPassword is wrong', async () => {
            let info = {token, custID:40, oldPassword: "asd+", newPassword: "123123Ab-"};
            let r =  await axios.post("https://gate.c2a.store/user/change-password", info);
            expect(r.data.result).to.be.equals(2);
        });
        it('should not proceed because token is malformed or not exist', async () => {
            let info = {token:"asdasd", custID:2, oldPassword: "asd+", newPassword: "123123Ab-"};
            let r =  await axios.post("https://gate.c2a.store/user/change-password", info);
            expect(r.data.result).to.be.equals(-2);
        });
    });

    describe('Changing address', () =>{
        
        it('should change address', async () => {
            let info = {token, custID:40, custAddress:"testAddress"};
            let r =  await axios.post("https://gate.c2a.store/user/edit-address", info);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not proceed because token is malformed or not exist', async () => {
            let info = {token:"xxx", custID:40, custAddress:"testAddress"};
            let r =  await axios.post("https://gate.c2a.store/user/edit-address", info);
            expect(r.data.result).to.be.equals(-2);
        });
    });
    describe('Changing profile data', () =>{
        
        it('should change whole profile data', async () => {
            let info = {token, data:{custName: "test1", taxID:15, custAddress:"testAddress", custID: 40}};
            let r =  await axios.post("https://gate.c2a.store/user/update-profile", info);
            expect(r.data.result).to.be.equals(1);
        });
        it('should not proceed because token is malformed or not exist', async () => {
            let info = {token:"asdasd", custID:2, oldPassword: "asd+", newPassword: "123123Ab-"};
            let r =  await axios.post("https://gate.c2a.store/user/update-profile", info);
            expect(r.data.result).to.be.equals(-2);
        });
    });


});

