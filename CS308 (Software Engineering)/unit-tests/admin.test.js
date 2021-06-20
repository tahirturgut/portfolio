const expect = require("chai").expect;
const mocha = require("mocha");
const axios = require("axios");

context('Login of Admin', () =>{
    describe('Login', () =>{

        it('should login', async () => {
            let info = {
                custMail: "ogrencialper@gmail.com",
                password: "Alper123&"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/login", info);
            expect(r.data.result).to.be.equals(1);
        });

        it('should not login because email or password is wrong', async () => {
            let info = {
                custMail: "mbilgehan@sabanciuniv.edu",
                password: "1test"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/login", info);
            expect(r.data.result).to.be.equals(0);
        });

        it('should not login because user is not an admin', async () => {
            let info = {
                custMail: "unittesttunit@unit.com",
                password: "testtestAb++"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/login", info);
            expect(r.data.result).to.be.equals(2);
        });

    });
});

context('Homepaga datas of Admin', () =>{
    describe('Getting homepage data', () =>{

        it('should get data', async () => {
            let info = {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0TmFtZSI6Ik0uIEJpbGdlaGFuIEVydGFuIiwiY3VzdElEIjoiNDAiLCJjdXN0TWFpbCI6Im1iaWxnZWhhbkBzYWJhbmNpdW5pdi5lZHUiLCJ1c2VyUm9sZSI6InNhbGVzTWFuYWdlciIsImlhdCI6MTYyMTkzMDk0OCwiZXhwIjoxNjIyMDE3MzQ4fQ.rRXCSUjb3Q8tsllDdHSL9Uccz-XoGRAITDGtP0McitY"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/get-data", info);
            expect(r.data.result).to.be.equals(1);
        }).timeout(10000)

        it('should not get because token is wrong', async () => {
            let info = {
                token: "123123"
            }
            let r =  await axios.post("https://gate.c2a.store/admin/get-data", info);
            expect(r.data.result).to.be.equals(-2);
        }).timeout(10000)

    });
});