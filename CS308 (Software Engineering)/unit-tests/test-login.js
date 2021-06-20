const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Login & Register', () =>{
    describe('Register', () =>{
        
        it('should register a new user', async () => {
            let info = {
                custName: "UnitTest",
                taxID: 15,
                custMail: "unittest123@unit.com",
                custAddress: "Test Address",
                password: "testtestAb++"
            }; 
            let r =  await axios.post("https://gate.c2a.store/user/register", info);
            expect(r.data.result).to.be.equals(1);
        });

        it('should not register a user because e-mail already exist', async () => {
            let info = {
                custName: "UnitTest",
                taxID: 15,
                custMail: "unittestunit@unit.com",
                custAddress: "Test Address",
                password: "testtestAb++"
            }; 
            let r =  await axios.post("https://gate.c2a.store/user/register", info);
            expect(r.data.result).to.be.equals(4);
        });

        it('should verify the user with the correct verification code', async () => {
            let info = {
                custMail: "unittestunit@unit.com",
                verificationCode: "0cf607da6860726adf14fb5152b5d38f"
            }; 
            let r =  await axios.post("https://gate.c2a.store/user/verification", info);
            expect(r.data.result).to.be.equals(5);
        });

        it('should not verify because verification code is expired or wrong', async () => {
            let info = {
                custMail: "unittestunit@unit.com",
                verificationCode: "123123123"
            }; 
            let r =  await axios.post("https://gate.c2a.store/user/verification", info);
            expect(r.data.result).to.be.equals(7);
        });

        it('should not verify because user does not exist', async () => {
            let info = {
                custMail: "test@test.comsss",
                verificationCode: "123123123"
            }; 
            let r =  await axios.post("https://gate.c2a.store/user/verification", info);
            expect(r.data.result).to.be.equals(8);
        });
        
    });
    
    describe('Login', () =>{

        it('should login', async () => {
            let info = {
                custMail: "muratbilgehanertan@gmail.com",
                password: "123123Ab+"
            }
            let r =  await axios.post("https://gate.c2a.store/user/auth", info);
            expect(r.data.result).to.be.equals(1);
        });

        it('should not login because email or password is wrong', async () => {
            let info = {
                custMail: "mbilgehan@sabanciuniv.edu",
                password: "1test"
            }
            let r =  await axios.post("https://gate.c2a.store/user/auth", info);
            expect(r.data.result).to.be.equals(0);
        });

        it('should not login because user is not verified', async () => {
            let info = {
                custMail: "unittesttunit@unit.com",
                password: "testtestAb++"
            }
            let r =  await axios.post("https://gate.c2a.store/user/auth", info);
            expect(r.data.result).to.be.equals(2);
        });

    });

    describe('Forgot Password', () =>{
        it('should send forgot password e-mail', async () => {
            let info = {
                custMail: "muratbilgehanertan@gmail.com"
            }
            let r =  await axios.post("https://gate.c2a.store/user/forgotPassword", info);
            expect(r.data.result).to.be.equals(1);
        });

        it('should not send anything because user does not exist', async () => {
            let info = {
                custMail: "testdoesnotexist@test.com"
            }
            let r =  await axios.post("https://gate.c2a.store/user/forgotPassword", info);
            expect(r.data.result).to.be.equals(2);
        });
        
        it('should verify forgot password code', async () => {
            let info = {
                custMail: "muratbilgehanertan@gmail.com",
                verifyCode: "69d8233c5d1b81ed24ef7d4c945c3e131c176081f90672606f305de1c898145a79512335530c3a28f34991496fbfba66e8869f18aa3eeb89f83062126751fc10"
            }
            let r =  await axios.post("https://gate.c2a.store/user/forgotpass-verify", info);
            expect(r.data.result).to.be.equals(1);
        });


    });
});