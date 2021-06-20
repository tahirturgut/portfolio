require("dotenv").config();

const express = require("express");
const app = express();
const expressCORS = require("cors");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const chalk = require("chalk");
const nodemailer = require("nodemailer");
const { createInvoice } = require("./src/createInvoice.js");
var fs = require('fs');

const mysql = require('mysql');

const {
    cursorTo
} = require("readline");
const {
    connect
} = require("http2");
const {
    resolve
} = require("path");
const {
    DH_NOT_SUITABLE_GENERATOR
} = require("constants");
const { Console } = require("console");

var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.mysql_user,
    password: process.env.mysql_pass,
    database: "mydb"
});

let transporter = nodemailer.createTransport({
    host: "smtp.eu.mailgun.org",
    port: 465,
    secure: true,
    auth: {
        user: process.env.mailgun_user,
        pass: process.env.mailgun_pass,
    },
});


connection.connect(err => {
    if (err) console.log(err);
    console.log(chalk.blue.bold("Remote MySQL connection established successfully!"));
});


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    console.log(chalk.bold.green(`[INCOMING] Request to ${req.path} from ${req.socket.remoteAddress}`))
    next();
});

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.use(expressCORS());

app.post('/user/register', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT custMail FROM customers WHERE custMail=?`;
    connection.query(ins, [post.custMail], (err, result) => {

        if (err) {
            console.log(err);
            response = {
                result: -1 // fail
            }
            res.json(response);
            return;
        }

        if (result.length == 0) {

            let salt = crypto.randomBytes(24).toString("base64");
            let hashed = crypto.createHash("sha256").update(post.password + salt).digest("hex");

            let ins = "INSERT INTO customers SET ? ";

            var values = {
                custName: post.custName,
                taxID: post.taxID,
                custMail: post.custMail,
                custAddress: post.custAddress,
                password: hashed,
                passwordSalt: salt,
                userRole: "user",
                isVerified: 0
            };

            connection.query(ins, values, (err, result) => {

                if (err) {
                    console.log(err);
                    response = {
                        result: -1
                    }
                    res.json(response);
                    return;
                }

                let verificationCode = crypto.randomBytes(16).toString("hex");
                let expiration = Date.now() + 86400 * 1000;


                if (!err) {
                    let ins = `SELECT * from customers WHERE custMail = ?`;
                    connection.query(ins,[post.custMail], (serr, sres) => {
                        if (sres.length != 0) {
                            let customerID = sres[0].custID;

                            var values = {
                                custID: customerID,
                                verifyCode: verificationCode,
                                expiration: expiration
                            };

                            let ins = `INSERT INTO acc_verification SET ?`;
                            connection.query(ins, values, (verr, vresult) => {

                                if (verr) {
                                    console.log(verr);
                                    response = {
                                        result: -1
                                    }
                                    res.json(response);
                                    return;
                                }

                                if (!verr) {
                                    let html;
                                    let base64mail = Buffer.from(post.custMail).toString('base64');

                                    html = fs.readFileSync('./src/verify.txt').toString("ascii").replace("{verificationCode}", verificationCode).replace("{customerMail}", base64mail);
                                    let info = transporter.sendMail({
                                        from: `noreply@c2a.store`,
                                        to: `${post.custMail}`,
                                        subject: "Verification Code C2A",
                                        text: `Text`,
                                        html,
                                    });

                                    response = {
                                        result: 1 // verification  and user inserted
                                    }

                                    res.json(response);
                                } else {
                                    response = {
                                        result: 2
                                    }
                                    res.json(response);
                                }

                            })
                        } else {
                            response = {
                                result: 3
                            }
                            res.json(response)
                        }
                    });
                } else {
                    respsone = {
                        result: 3 // not inserted
                    }
                    res.json(response)
                }

            })
        } else {
            response = {
                result: 4 // user already exists 
            }

            res.json(response)
        }
    })

});

app.post('/user/verification', (req, res, next) => {
    let post = req.body;
    let response;
    let ins = `SELECT * from customers WHERE custMail = ?`;

    connection.query(ins, [post.custMail], (serr, sres) => {
        if (serr) {
            console.log(serr);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }

        if (sres.length != 0) {
            let customerID = sres[0].custID;

            let ins = `SELECT * FROM acc_verification WHERE custID = ? AND verifyCode = ? AND expiration > ?`;
            connection.query(ins, [customerID, post.verificationCode, Date.now()], (verr, vres) => {
                if (verr) {
                    console.log(verr);
                    response = {
                        result: -1
                    }
                    res.json(response);
                    return;
                }

                if (!verr && vres.length != 0) {
                    let ins = `UPDATE customers SET isVerified = true WHERE custMail = ? AND custID = ?`;
                    connection.query(ins, [post.custMail, customerID], (vierr, vires) => {
                        if (vierr) {
                            console.log(vierr);
                            response = {
                                result: -1
                            }
                            res.json(response);
                            return;
                        }

                        if (!vierr) {
                            response = {
                                result: 5 // verification successfull!
                            }
                            res.json(response);

                        } else {
                            response = {
                                result: 6 // verification fail! 
                            }
                            res.json(response);
                        }

                    })
                } else {
                    response = {
                        result: 7 // verification fail! expired code or wrong code!
                    }
                    res.json(response);
                }

            })

        } else {
            response = {
                result: 8 // user not found! ?
            }

            res.json(response);
        }
    })


});

app.post('/user/auth', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM customers WHERE custMail = ?`;

    connection.query(ins, [post.custMail], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }

        if (!err && result.length != 0) {
            let hashedPass = crypto.createHash("sha256").update(post.password + result[0].passwordSalt).digest("hex");


            if (hashedPass === result[0].password) {
                let isVerified = result[0].isVerified;
                if (!isVerified) {
                    response = {
                        result: 2 // not verified!
                    }

                    res.json(response);
                    return;

                } else if (isVerified) {
                    let user = {
                        custName: result[0].custName,
                        custID: result[0].custID.toString(),
                        custMail: result[0].custMail,

                    }

                    let token = jwt.sign(user, process.env.SECRETKEY, {
                        expiresIn: "6d"
                    });
                    response = {
                        result: 1,
                        user: {
                            custName: result[0].custName,
                            custID: result[0].custID.toString()
                        },
                        token,
                    }
                    res.json(response);
                }

            } else {
                response = {
                    result: 0 // password or email wrong
                }
                res.json(response);
            }

        } else {
            response = {
                result: 0 // no email
            }
            res.json(response);
        }


    })
});

app.post('/user/forgotPassword', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM customers WHERE custMail =?`;

    connection.query(ins, [post.custMail], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }

        if (!err && result.length != 0) {
            let verifycode = crypto.randomBytes(64).toString('hex');

            let passwordReset = {
                custID: result[0].custID,
                verifyCode: verifycode,
                expiration: Date.now() + 21600 * 1000,
                isUsed: false
            }

            let ins = `INSERT INTO password_resets SET ?`;

            connection.query(ins, passwordReset, (rerr, rresult) => {
                if (rerr) {
                    console.log(rerr);
                    response = {
                        result: -1
                    }
                    res.json(response);
                    return;

                }

                let html;
                let base64mail = Buffer.from(post.custMail).toString('base64');

                html = fs.readFileSync('./src/forgotpass.txt').toString("ascii").replace("{verifycode}", verifycode).replace("{customerMail}", base64mail);
                if (!rerr) {
                    let info = transporter.sendMail({
                        from: "noreply@c2a.store",
                        to: `${post.custMail}`,
                        subject: "Password Reset",
                        text: "",
                        html,
                    });
                    response = {
                        result: 1 // success
                    }
                    res.json(response);
                } else {
                    response = {
                        result: -1 // insert fail
                    }
                    res.json(response);

                }
            });

        } else {
            response = {
                result: 2 // no user foundd
            }
            res.json(response);
        }

    });

});

app.post('/user/forgotpass-verify', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM customers WHERE custMail = ?`;

    connection.query(ins, [post.custMail], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }
        if (result.length != 0) {
            let customerID = result[0].custID;

            let ins = `SELECT * FROM password_resets WHERE custID = ? AND verifyCode = ? AND isUsed = false AND expiration > ?`;

            connection.query(ins, [customerID, post.verifyCode, Date.now()], (verr, vres) => {
                if (verr) {
                    console.log(verr);
                    response = {
                        result: -1
                    }
                    res.json(response);
                    return;
                }

                if (!verr) {
                    response = {
                        result: 1 // password reset success
                    }
                    res.json(response);

                } else {
                    response = {
                        result: 3 // invalid code or expired code
                    }
                    res.json(response);
                }

            });
        } else {
            response = {
                result: 0 // mail not found
            }

            res.json(response);
        }

    });

});

app.post('/user/newPassword', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM customers WHERE custMail = ?`;
    connection.query(ins, [post.custMail], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1 // db fail try again. 
            }
            res.json(response);
            return;
        }
        if (result.length != 0) {
            let customerID = result[0].custID;

            let ins = `SELECT * FROM password_resets WHERE custID = ? AND verifyCode = ? AND isUsed = false AND expiration > ?`;

            connection.query(ins, [customerID, post.verifyCode, Date.now()], (verr, vres) => {
                if (verr) {
                    console.log(verr);
                    response = {
                        result: -1 // code is correct but db fail, try again. 
                    }
                    res.json(response);
                    return;
                }

                if (!verr && vres.length !=0) {

                    let ins = `UPDATE password_resets SET isUsed = true WHERE custID = ?`;

                    connection.query(ins, [customerID],(uerr, ures) => {
                        if (uerr) {
                            console.log(uerr);
                            response = {
                                result: -1
                            }
                            res.json(response);
                            return;
                        }


                        newPass = crypto.createHash("sha256").update(post.newPass + result[0].passwordSalt).digest("hex");

                        if (!uerr) {
                            let ins = `UPDATE customers SET password=? WHERE custID = ?`;

                            connection.query(ins, [newPass, customerID], (nerr, nres) => {

                                if (nerr) {
                                    console.log(nerr);

                                    response = {
                                        result: -1
                                    }
                                    res.json(response);
                                } else {
                                    response = {
                                        result: 1 // success
                                    }
                                    res.json(response);
                                }

                            })

                        } else {
                            response = {
                                result: -1 // code is correct but db fail, try again. 
                            }
                            res.json(response);
                            return;
                        }

                    });

                } else {
                    response = {
                        result: 2 // invalid code or expired code
                    }
                    res.json(response);
                }

            });
        } else {
            response = {
                result: 0 // mail not found
            }

            res.json(response);
        }

    });


});

app.post('/general/cart/add-product', (req, res, next) => {
    let post = req.body;
    let response;
    
    let productID = post.productID;
    let custID = post.custID;
    let token = post.token;

    if(token != null){
        var verify;
        try{
            verify = jwt.verify(token, process.env.SECRETKEY);
        }catch(err){
            response = {
                result:-2,  //token fail
                text : "token fail"
            }
            return;
        }
    }

    let cart_item = {
        custID: custID,
        productID: productID,
    }

    let ins = `SELECT * FROM products WHERE productID = ?`;
        connection.query(ins, [productID], (err, result) => {
            if (err) {
                console.log(err);
                response = {
                    result: -1,
                    text : "db error"
                }
                res.json(response);//db error
                return;
            }
            
            if(result.length != 0) {
                let ins = `SELECT productQuantity FROM products WHERE productID = ?`;
                connection.query(ins, [productID], async (err3, result3)  => {
                    if (err3) {
                        console.log(err3);
                        response = {
                            result: -1,
                            text : "db error"
                        }
                        res.json(response); 
                        return;
                        }
                    
                    if(result3[0].productQuantity==0){
                        response = {
                            result: 3,
                            text : "product out of stock"
                        }
                        res.json(response);
                        return
                    }

                    let ins = `INSERT INTO cart SET ?`;
                    connection.query(ins, cart_item, async (err1, result1)  => {
                        
                        if (err1) {
                            console.log(err1);
                            response = {
                                result: -1,
                                text : "db error"
                            }
                            res.json(response); 
                            return;
                        }
            
                        response = {
                               result: 1,
                               text : "successful insert"
                                   
                        }
                        res.json(response);
                        
                    });
            });
                
            }
            else {
                response = {
                    result: 2,
                    text : "product not found"
                }
                res.json(response);
            }
        });
});

app.post('/general/cart/remove-product', (req, res, next) => {
    let post = req.body;
    let response;
    
    let productID = post.productID;
    let custID = post.custID;
    let token = post.token;

    if(token != null){
        var verify;
        try{
            var verify = jwt.verify(token, process.env.SECRETKEY);
        }catch(err){
            response = {
                result:-2,
                text : "token fail"
            }
            return;
        }
    }

    let cart_item = {
        custID: custID,
        productID: productID,
    }

    let ins = `SELECT * FROM cart WHERE productID = ? AND custID = ?`;
    connection.query(ins, [post.productID, post.custID], (err, result) => {
    if (err) {
        console.log(err);
        response = {
            result: -1,
            text : "db error"
        }
        res.json(response);
        return;
    }
    if(result.length != 0) {
        let ins = `DELETE FROM cart WHERE productID = ? AND custID = ? LIMIT 1`;
        connection.query(ins, [post.productID, post.custID], (err1, result1)  => {                                            
            
            if (err1) {
                console.log(err1);
                response = {
                    result: -1,
                    text : "db error"
                }
                res.json(response);
                return;
            }
    
            response = {
                result: 1,
                text : "successful delete"
            }   
            res.json(response);
        });
        
    }
    else {
        response = {
            result: 2,
            text : "item not found in cart"
        }
        res.json(response);
    }
    });
});


app.post('/general/cart/get-cart', (req, res, next) => {
    let post = req.body;
    let response;

    let custID = post.custID;
    let token = post.token;
    if(token != null){ 
        try{
            var verify = jwt.verify(token, process.env.SECRETKEY);
        }catch(err){
             response = {
                result:-2,
                text : "token fail"
            }
            return;
        }
    }
    let ins = `SELECT products.*, COUNT(cart.productID) AS count FROM cart LEFT JOIN products ON cart.productID = products.productID WHERE cart.custID=? GROUP BY cart.custID,cart.productID`;
    connection.query(ins, [custID], (err, result)  => {
        if (err) {
            console.log(err);
            response = {
                result: -1//db error   
            }
            res.json(response);
            return;
        }
        response = {
            result: 1,
            data: result
        }
        res.json(response);
    });
});

app.post('/general/search', (req, res, next) => {
    let post = req.body;
    let response;

    toGet = (post.page - 1) * 18;

    let ins = `SELECT * FROM products WHERE productName LIKE CONCAT('%', ?, '%') OR productDescription LIKE CONCAT('%', ?, '%') LIMIT ?,18`;

    connection.query(ins, [post.term, post.term, toGet], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        } else if (result.length != 0) {

            count = result.length;

            response = {
                result: 1,
                returned: result,
                count
            }
            res.json(response);

        } else {
            response = {
                result: 2 // no item found
            }
            res.json(response);
        }
    })


});

app.post('/general/temp-search', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM products WHERE productName LIKE CONCAT('%', ?, '%') OR productDescription LIKE CONCAT('%', ?, '%') LIMIT 0,4`;

    connection.query(ins, [post.term, post.term], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        } else if (result.length != 0) {

            response = {
                result: 1,
                returned: result,

            }
            res.json(response);

        } else {
            response = {
                result: 2 // no item found
            }
            res.json(response);
        }
    })


});
app.post("/general/get-product-info", (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM products WHERE productID = ?`;

    connection.query(ins, [post.productID], (err, result) => {

        if (err) {
            console.log(err);
            response = {
                result: -1 // db fail
            }
            res.json(response);
            return;
        }

        if (result.length != 0) {
            returned = result[0];
            response = {
                result: 1,
                returned
            }
            res.json(response);

        } else {
            response = {
                result: 2 // no item found with that productID
            }
            res.json(response);
        }
    });
});

app.post("/general/get-reviews", (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM ratings WHERE productID = ? AND commentApproved = 1 LIMIT 0,10`;

    function doQuery(conn, sql, args) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, args, function (error, results, fields) {
                if (error) return reject(error)
                resolve({
                    results,
                    fields
                })
            })
        })
    }

    async function getUsers(result, connection) {

        for (let i = 0; i < result.length; i++) {
            result[i].custName = ""
            delete result[i].commentApproved;
            let ins = `SELECT custName FROM customers WHERE custID=?`;

            let queryOutput = await doQuery(connection, ins, [result[i].custID])
            result[i].custName = queryOutput.results[0].custName;
        }
        return result;
    }
    connection.query(ins, [post.productID], async (err, result) => {

        if (err) {
            console.log(err);
            response = {
                result: -1 // db fail
            }
            res.json(response);
            return;
        }

        if (result.length != 0) {

            getUsers(result, connection).then(function (resultValue) {
                returned = resultValue
                response = {
                    result: 1, // reviews found
                    returned
                };
                res.json(response);
            }).catch(console.error)


        } else {
            response = {
                result: 2 // no reviews found
            }
            res.json(response);
        }
    });

});

app.get("/home/getNavbar", (req,res,next) => {
    let response;
    let i;
    let ins = `SELECT name,sub_category,row_id FROM nav_bars`;
    connection.query(ins, (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1,
                text : "db error"
            }
            res.json(response);
            return;
        }
        else{

            if(result.length==0){
                response = {
                    result: -2,
                    text : "empty string"
                }
                res.json(response);
                return;
            }
            for(i=0;i<result.length;i++){
                if (result[i].sub_category)
                {
                    result[i].sub_category=result[i].sub_category.split(":");
                }
                else{
                    result[i].sub_category = [];
                }
                
            }

            console.log(result)
            response = {
                result: 1,
                text : "nav_bars returned",
                nav_bars: result
            }
            res.json(response);
            return; 
        }
    });
});

app.get('/home/get-newest-products', (req, res, next) => {
    let post = req.body;
    let response;

    let ins = `SELECT * FROM products ORDER BY productID DESC LIMIT 8`;
    connection.query(ins, (err, result)  => {
        if (err) {
            console.log(err);
            response = {
                result: -1//db error   
            }
            res.json(response);
            return;
        }
        response = {
            result: 1,
            data: result
        }
        res.json(response);
    });
});

app.get('/home/get-popular-product',  (req, res, next) => {
    let post = req.body;
    let response;

    if(post.count==null || post.count=='') post.count=8;
    
    let ins = `SELECT products.*, COUNT(ratings.productID) AS count FROM ratings LEFT JOIN products ON ratings.productID =
    products.productID GROUP BY ratings.productID ORDER BY COUNT(ratings.productID) DESC LIMIT ?`; 

        connection.query(ins, [parseInt(post.count,10)],  (err, result)  => {
        if (err) {
            console.log(err);
            response = {
                result: -1//db error   
            }
            res.json(response);
            return;
        }
        response = {
            result: 1,
            data: result
        }
        res.json(response);
    });


});

app.post("/user/change-password", (req,res,next) => {
    let post = req.body;
    let response;

    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    
    let saltPass = crypto.randomBytes(24).toString("base64");
    let hashedPass = crypto.createHash("sha256").update(post.newPassword + saltPass).digest("hex");

    let ins = 'SELECT * FROM customers WHERE custID = ?';
    connection.query(ins, [post.custID], (err, res1) =>{
        if(err){
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }
        if(res1.length != 0 ){

            let hashed = crypto.createHash("sha256").update(post.oldPassword+res1[0].passwordSalt).digest("hex");

            if(res1[0].password === hashed){
                ins = 'UPDATE customers SET password = ?, passwordSalt = ? WHERE custID = ? ';
                connection.query(ins, [hashedPass, saltPass, post.custID], (err2, res2) =>{
                    if(err2){
                        console.log(err2);
                        response = {
                            result: -1 // db fail
                        }
                        res.json(response);
                        return;
                    }
                    else{
                        response = {
                            result: 1 // success
                        }
                        res.json(response);
                    }

                });
            }
            else{
                response = {
                    result: 2 // old password is wrong
                }
                res.json(response);
            }
        }
        else{
            response = {
                result: 3 // user not found
            }
            res.json(response);
        }

    })


});

app.post("/user/get-address",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT custAddress FROM customers WHERE custID = ?';
    connection.query(ins, [post.custID], (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result : -1
            }
            res.json(response);
            return;
        }
        if(res1.length != 0 && res1[0].custAddress != "" && res1[0].custAddress!= null){
            response = {
                result: 1,
                returned: res1[0]
            }
            res.json(response);

        }
        else{
            response = {
                result: 2 // no address found
            }
            res.json(response);
            return;
        }
    })
});

app.post("/user/get-profile",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT * FROM customers WHERE custID = ?';
    connection.query(ins, [post.custID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }

        if(res1.length !=0){
            returned = res1[0];
            delete returned.custID;
            delete returned.password;
            delete returned.passwordSalt;
            delete returned.userRole;
            delete returned.isVerified;
            response = {
                result: 1,
                returned
            }
            res.json(response);


        }
        else{
            response = {
                result : 2 // no user found
            }
            res.json(response);
        }
    });

});

app.post("/user/update-profile",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    let ins = 'UPDATE customers SET custName = ?, taxID=?, custAddress=? WHERE custID = ?';

    connection.query(ins, [post.data.custName,post.data.taxID, post.data.custAddress, parseInt(post.data.custID,10)], (err1, res1) =>{
        if(err1){
            console.log(err1);
            response={
                result: -1
            }
            res.json(response);
            return;
        }
        response = {
            result: 1
        }
        res.json(response);
    })

});

app.post("/user/edit-address",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'UPDATE customers SET custAddress = ? WHERE custID = ?'
    connection.query(ins, [post.custAddress, post.custID], (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result : -1
            }
            res.json(response);
            return;
        }
        
        response = {
            result: 1 // address updated
        }
        res.json(response);
    })

});

app.post("/user/get-orders",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    function doQuery(conn, sql, args) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, args, function (error, results, fields) {
                if (error) return reject(error)
                resolve({
                    results,
                    fields
                })
            })
        })
    }

    async function getProductDetail(products, connection){
        var result=[];
        for(let i=0; i< products.length;i++){
            let ins = 'SELECT * FROM products WHERE productID = ?';
            let queryOutput = await doQuery(connection, ins, products[i]);
            result[i] = queryOutput.results[0];
            delete result[i].productDescription
        }
        return result;

    }
    async function getProductArray(connection,res1){
        var returned=[];
        for(let i=0;i<res1.length;i++){
            let products = res1[i].productIDs.split(";");
            
            await getProductDetail(products, connection).then(function (returnValue) {
            
                res1[i].products = returnValue;
                returned[i] = res1[i];
            

            }).catch(console.error)

        }
        return returned;
    }
    let ins = 'SELECT * FROM delivery WHERE custID = ?';
    connection.query(ins, [post.custID], async (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result : -1
            }
            res.json(response);
            return;
        }
        if(res1.length != 0){
            await getProductArray(connection,res1).then(function(returned){
                response = {
                    result: 1,
                    returned
                }
                res.json(response);
            })
      
        }
        else{
            response = {
                result: 2 // no order found for that user
            }
            res.json(response);
        }

    });

});


app.post("/general/write-review",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    post.comment.replace("<","&lt;");
    post.comment.replace(">","&gt;");
    let review = {
        "ratingComment" : post.comment,
        "custID" : verify.custID,
        "productID" : post.productID,
        "ratingValue" : parseFloat(post.ratingValue),
        "commentApproved" : false
    }
    let ins = 'INSERT INTO ratings SET ?';

    connection.query(ins, review, (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1
            }
            res.json(response);
            return;
        }

        response = {
            result : 1
        }
        res.json(response);

    })

});

app.post("/general/delete-own-review",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;

    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'DELETE FROM ratings WHERE custID = ? AND ratingID = ?';
    connection.query(ins, [verify.custID, post.ratingID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1
            }
            res.json(response);
            return;
        }
    
        if(res1.affectedRows == 1){
            response = {
                result: 1
            }
            res.json(response);
        }
        else{
            response = {
                result : 2
            }
            res.json(response);
        }
    });

});

app.post("/cart/checkout",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    function doQuery(conn, sql, args) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, args, function (error, results, fields) {
                if (error) return reject(error)
                resolve({
                    results,
                    fields
                })
            })
        })
    }
    async function checkQuantities(products, quantities, connection) {
        for (let i = 0; i < products.length; i++) {
            let ins = 'SELECT productQuantity FROM products WHERE productID = ?'
            connection.query(ins, [products[i]], (err, result) => {
                if (err) {
                    console.log(err);
                    response = {
                        result: -1,
                        text : "db error"
                    }
                    res.json(response);
                    return;
                }
                else
                {
                    if (result[0].productQuantity < quantities[i]){
                        products.splice(i, 1);
                        quantities.splice(i, 1);
                    }
                }
            });
        }
        return;
    }

    async function changeQuantities(products, quantities, connection) {

        for (let i = 0; i < products.length; i++) {
    
            let ins = 'UPDATE products SET productQuantity = productQuantity - ? WHERE productID = ?'

            let queryOutput = await doQuery(connection, ins, [quantities[i], products[i]]);
        }
        return;
    }
    async function getProductDetail(products, connection){
        var result=[];
        for(let i=0; i< products.length;i++){
            let ins = 'SELECT * FROM products WHERE productID = ?';
            let queryOutput = await doQuery(connection, ins, products[i]);
            result[i] = queryOutput.results[0];
            delete result[i].productDescription
        }
        return result;

    }

    let ins = `SELECT productID, COUNT(*) as count FROM cart WHERE custID = ? GROUP BY productID`;
    connection.query(ins, [verify.custID], (err, result) => {
        if (err) {
            console.log(err);
            response = {
                result: -1,
                text : "db error"
            }
            res.json(response);
            return;
        }
        else
        {

            let products = post.productIDs.split(";");
            let quantities = post.prodQuants.split(";");
            checkQuantities(products, quantities, connection);

            let ins = `DELETE FROM cart WHERE custID = ?`;
            connection.query(ins, [verify.custID], (err, result) => {
                if (err) {
                    console.log(err);
                    response = {
                        result: -1,
                        text : "db error"
                    }
                    res.json(response);
                    return;
                }
                else
                {
                
                    getProductDetail(products, connection).then(function (productDetails) {
                        let i;
                        let items=[];
                        var productDetails = productDetails
                        changeQuantities(products, quantities, connection);
                        for(i=0;i<products.length;i++){
                            items[i] = {
                                item: productDetails[i].productName,
                                quantity: quantities[i],
                                amount: productDetails[i].productPrice*quantities[i]
                            }

                        }
                        var totalPr=0;
                        let j;
                        for(j=0;j<items.length;j++){
                            totalPr+= items[j].amount;
                        }
                        let today = new Date().toISOString().slice(0,19).replace('T',' ')

                        let strProducts = "";
                        let strQuantities = "";
                        for (k = 0; k < products.length-1; k++){
                            strProducts += products[k].toString() + ";";
                            strQuantities += quantities[k].toString() + ";";
                        }
                        strProducts += products[k].toString();
                        strQuantities += quantities[k].toString();

                        let setProd = {
                            custID: parseInt(verify.custID,10),
                            productIDs: strProducts,
                            quants: strQuantities,
                            totalPrice: totalPr,
                            deliveryStatus: "Processing",
                            purchaseDate: today
                        };
                        let ins = 'INSERT INTO delivery SET ?';
                        connection.query(ins, setProd, (err2, res2) =>{
                            if (err2) {
                                console.log(err2);
                                response = {
                                    result: -1,
                                    text : "db error"
                                }
                                res.json(response);
                                return;
                            }
                        const invoice = {
                            shipping: {
                                name: "",
                                address: "Online Delivery",
                                city: "",
                                state: "",
                                country: "",
                                postal_code: 0
        
                            },
                            items,
                            subtotal: totalPr,
                            paid: totalPr,
                            invoice_nr: res2.insertId
        
                        };
                        
                        var pdfStream = createInvoice(invoice, `./src/invoices/${res2.insertId}.pdf`);
                        pdfStream.addListener('finish', function() {
                        html = fs.readFileSync('./src/ordercomplete.txt').toString("ascii").replace("{totalPrice}", totalPr).replace("{today}", today);
                        let info = transporter.sendMail({
                            from: `noreply@c2a.store`,
                            to: `${verify.custMail}`,
                            subject: "Purchase Completed -- C2A",
                            text: `Text`,
                            html,
                            attachments: [
                                {
                                    filename: `${res2.insertId}.pdf`,
                                    path: `./src/invoices/${res2.insertId}.pdf`
                                }
                            ]
                        });

                        response = {
                            result: 1, // checkout done
                            orderID: res2.insertId
                        }
                        res.json(response);

                });
                    })
                    
                }).catch(console.error)
            }
        });
         
        }
    });     
});

app.post("/user/invoice-download",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let invoiceID = post.orderID;

    res.download(`./src/invoices/${invoiceID}.pdf`);     
});

app.post("/admin/login",(req,res,next) => {
    let post = req.body;
    let response;

    let ins = ` SELECT * FROM customers WHERE custMail = ?`;

    connection.query(ins, [post.custMail], (err, result) =>{
        if(err){
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }

        if(result.length != 0 ){
            let hashedPass = crypto.createHash("sha256").update(post.password + result[0].passwordSalt).digest("hex");

            if(hashedPass === result[0].password){
                if(result[0].userRole === 'prodManager' || result[0].userRole === 'salesManager'){
                    let user = {
                        custName: result[0].custName,
                        custID: result[0].custID.toString(),
                        custMail: result[0].custMail,
                        userRole: result[0].userRole
                    };
                    let token = jwt.sign(user, process.env.SECRETKEY, {
                        expiresIn: "1d"
                    });
                    
                    response = {
                        result: 1,
                        user: {
                            custName: result[0].custName,
                            custID: result[0].custID.toString(),
                            userRole: result[0].userRole
                        },
                        token,
                    };
                    res.json(response);
                }
                else{
                    response = {
                        result : 2 // this user is not an admin
                    }
                    res.json(response);
                }
            }
            else{
                response = {
                    result : 0 // password or emailwrong
                }
                res.json(response);
            }
        }
        else{
            response = {
                result : 0 // Password or e-mail is wrong
            }
            res.json(response);
        }

    });
});
app.get("/home/get-categories", (req, res, next) => {
    let response;

    let ins = 'SELECT DISTINCT productDistributor FROM products';
    connection.query(ins, (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response)
        }
        if(res1.length !=0){
            var categories = [];
            let i;
            for(i=0;i<res1.length;i++){
                categories[i] = res1[i].productDistributor;
            }
            response ={
                result: 1,
                returned: categories
            }
            res.json(response)
        }
        else{
            response = {
                result: 3 // no product found
            }
            res.json(response);
        }

    });
});
app.post("/home/get-category-detail", (req,res,next) => {
    let post = req.body;
    let response;

    let ins = 'SELECT * FROM products WHERE productDistributor = ?';
    connection.query(ins, [post.categoryName], (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response)
        }
        if(res1.length !=0){
   
            response ={
                result: 1,
                returned: res1
            }
            res.json(response)
        }
        else{
            response = {
                result: 3 // no product found
            }
            res.json(response);
        }
    })
});

app.post("/general/cancel-order",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;

    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    function doQuery(conn, sql, args) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, args, function (error, results, fields) {
                if (error) return reject(error)
                resolve({
                    results,
                    fields
                })
            })
        })
    }

    async function changeQuantities(products, quantities, connection) {

        for (let i = 0; i < products.length; i++) {
    
            let ins = 'UPDATE products SET productQuantity = productQuantity + ? WHERE productID = ?'

            let queryOutput = await doQuery(connection, ins, [quantities[i], products[i]]);
        }
        return;
    }

    let ins = 'SELECT * FROM delivery WHERE deliveryID = ?';
    connection.query(ins, [post.deliveryID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }

        if (res1.length == 0) {
            response = {
                result : -5     //deliveryID not found
            }
            res.json(response);
            return;
        }

        if (res1[0].deliveryStatus == "Shipped") {
            response = {
                result : -3         //order is already shipped
            }
            res.json(response);
            return;
        }

        else if (res1[0].deliveryStatus == "Completed") {
            response = {
                result : -4         //order is already completed
            }
            res.json(response);
            return;
        }
        else {

            let products = res1[0].productIDs.split(";");
            let quantities = res1[0].quants.split(";");
            console.log(products);
            console.log(quantities);

            let ins = 'DELETE FROM delivery WHERE deliveryID = ?';
            connection.query(ins, [post.deliveryID], (err2, res2) => {
                if(err2){
                    console.log(err2);
                    response = {
                        result : -1     //db error
                    }
                    res.json(response);
                    return;
                }

                changeQuantities(products, quantities, connection);

                response = {
                    result : 1       //order succesfully deleted
                }
                res.json(response);
                return;
            });
        }
    });

});

app.post("/general/refund-product",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;

    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT * FROM delivery WHERE deliveryID = ?';
    connection.query(ins, [post.deliveryID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }

        console.log(res1)

        if (res1.length == 0) {
            response = {
                result : -5     //deliveryID not found
            }
            res.json(response);
            return;
        }

        if (res1[0].deliveryStatus == "Shipped") {
            response = {
                result : -3         //order is not yet shipped
            }
            res.json(response);
            return;
        }

        else if (res1[0].deliveryStatus == "Processing") {
            response = {
                result : -4         //order is not yet completed
            }
            res.json(response);
            return;
        }

        else {

            let ins = 'UPDATE delivery SET deliveryStatus = "Refunding" WHERE deliveryID = ?';
            connection.query(ins, [post.deliveryID], (err2, res2) => {
                if(err2){
                    console.log(err2);
                    response = {
                        result : -1     //db error
                    }
                    res.json(response);
                    return;
                }

                response = {
                    result : 1       //order refunding
                }
                res.json(response);
                return;
            });
        }
    });

});


app.post("/admin/salesManager/set-discount",(req,res,next) => {
    let post = req.body;
    let response;
    let productID = post.productID;
    let discount_rate = post.discount_rate;

    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,
                text : "token fail"
            }
            res.json(response);
        return;   
    }

    if(discount_rate<0 || discount_rate>1){
        response = {
            result: -2//discount_rate shold be between 0-1
        }
        res.json(response);
        return;
    }
    let ins = `UPDATE products SET productPrice = productPrice*? WHERE productID = ?`;
    connection.query(ins, [discount_rate,  productID], (err, res1) => {
        if(res1.affectedRows==0){
            console.log(err);
            response = {
                result: -3//there is no product with this id
            }
            res.json(response);
            return;
        }
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }
        else{
            html = fs.readFileSync('./src/discount.html').toString("ascii").replace("{discount_rate}", post.discount_rate*100).replace("{productID}", post.productID);
            let info = transporter.sendMail({
                from: `noreply@c2a.store`,
                to: `mbilgehan@sabanciuniv.edu`,
                subject: "DISCOUNT -- C2A",
                text: `Text`,
                html
            });

            response = {
                result: 1 //discount succesfuly set
            }
            res.json(response);
        }
             
    })
});

app.post("/admin/salesManager/set-price",(req,res,next) => {
    let post = req.body;
    let response;
    let productID = post.productID;
    let price = post.price;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,
                text : "token fail"
            }
            res.json(response);
        return;   
    }

    if(price<0){
        response = {
            result: -2//price cannot be negative number
        }
        res.json(response);
        return;
    }
    let ins = `UPDATE products SET productPrice = ?, originalPrice=? WHERE productID = ?`;
    connection.query(ins, [price,price,productID], (err, res1) => {
        if(res1.affectedRows==0){
            console.log(err);
            response = {
                result: -3//there is no product with this id
            }
            res.json(response);
            return;
        }
        if (err) {
            console.log(err);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }
        else{
            response = {
                result: 1 //price succesfuly set
            }
            res.json(response);
        }           
    })
});

app.post("/admin/salesManager/get-delivery-with-date-range",(req,res,next) => {
    let post = req.body;
    let response;
    let start_date = post.start_date;
    let end_date = post.end_date;
    if(start_date >= end_date){
        response = {
            result: -2//start date cannot be after end date           
        }
        res.json(response);
        return;
    }
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,
                text : "token fail"
           }
            res.json(response);
        return;   
    }    
    let ins = `SELECT * FROM delivery WHERE purchaseDate > ? AND purchaseDate < ? AND custID <> -1`;
    connection.query(ins, [start_date, end_date], (err, res1) => {
        if(res1.length==0){
            response = {
                result: -3//there is no deliveries in this date range
                
            }
            res.json(response);
            return;
        }
        if (err) {
            console.log(err);
            response = {
                result: -1
                
            }
            res.json(response);
            return;
        }
        else{
            response = {
                result: 1, //deliveries in range returned
                deliveries:res1
            }
            res.json(response);
        }           
    })
});

app.post("/admin/salesManager/invoice-download",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,
                text : "token fail"
            }
            res.json(response);
        return;   
    }
    let invoiceID = post.orderID;
    res.download(`./src/invoices/${invoiceID}.pdf`);     
});

app.post("/admin/salesManager/get-profit-chart",(req,res,next) => {
    let post = req.body;
    let response;
    let start_date = new Date(post.start_date);
    let end_date = new Date(post.end_date);
    if(start_date >= end_date){
        response = {
            result: -2//start date cannot be after end date           
        }
        res.json(response);
        return;
    }
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,//token fail
                text : "token fail"
        }
            res.json(response);
        return;   
    }    
    let ins = `SELECT totalPrice,purchaseDate FROM delivery ORDER BY purchaseDate`;
    connection.query(ins, [start_date, end_date], (err, res1) => {
        if (err) {
            console.log(err);
            response = {
                result: -1                
            }
            res.json(response);
            return;
        }
        let i;
        let starting_value=0;
        results=[];

        for(i=0;i<res1.length;i++)
        {
            if(res1[i].purchaseDate < start_date){
                starting_value+=res1[i].totalPrice;
            }
            else if(res1[i].purchaseDate >= start_date && res1[i].purchaseDate <= end_date){
                results.push([res1[i].purchaseDate,res1[i].totalPrice]);
            }
            else{
                break;
            }
        }
        if(results.length==0){
            response = {
                result: -3//there is no deliveries in this date range               
            }
            res.json(response);
            return;
        }       
        else{
            response = {
                result: 1, //deliveries in range returned
                starting_value:starting_value,
                nodes:results               
            }
            res.json(response);
        }           
    })
});


app.post("/admin/salesManager/get-refunds",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,
                text : "token fail"
            }
            res.json(response);
        return;   
    }

    let ins = 'SELECT * FROM delivery WHERE deliveryStatus = "Refunding" OR deliveryStatus = "Refunded"';
    connection.query(ins, (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }
        if(res1.length != 0 ){
            response = {
                result : 1,
                returned: res1
            }
            res.json(response);
        }
        else{
            response = {
                result: 2
            }
            res.json(response)
        }
    });


});
app.post("/admin/salesManager/refund-product",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;

    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "salesManager") throw err;
    }catch(err){
            response = {
                result: -4,
                text : "token fail"
            }
            res.json(response);
        return;   
    }
    function doQuery(conn, sql, args) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, args, function (error, results, fields) {
                if (error) return reject(error)
                resolve({
                    results,
                    fields
                })
            })
        })
        }
    
    async function changeQuantities(products, quantities, connection) {
    
        for (let i = 0; i < products.length; i++) {
    
            let ins = 'UPDATE products SET productQuantity = productQuantity + ? WHERE productID = ?'
    
            let queryOutput = await doQuery(connection, ins, [quantities[i], products[i]]);
        }
        return;
        }

    let ins = 'SELECT * FROM delivery WHERE deliveryID = ?';
    connection.query(ins, [post.deliveryID], async (err1,res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response);
        }
        if(res1.length !=0){
            let products = res1[0].productIDs.split(";");
            let quantities = res1[0].quants.split(";");

            await changeQuantities(products,quantities,connection);

            let ins = 'UPDATE delivery SET deliveryStatus="Refunded" WHERE deliveryID = ?';
            connection.query(ins, [post.deliveryID], (err2, res2) =>{
                if(err2){
                    console.log(err2)
                    response = {
                        result: -1
                    }
                    res.json(response);
                }
                response = {
                    result: 1
                }
                res.json(response)
                return;
            })
        }
        else{
            response = {
                result: 3
            }
            res.json(response)
        }
    
    });

});

app.post("/admin/product-manager/set-stock",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    if (post.quantity < 0){
        response = {
            result : -3     //quantity cannot be lower than 0
        }
        res.json(response);
        return;
    }

    let ins = 'UPDATE products SET productQuantity = ? WHERE productID = ?';
    connection.query(ins, [post.quantity, post.productID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }

        console.log(res1.affectedRows)
        if (res1.affectedRows == 0){
            response = {
                result : 2     //productID does not exist
            }
            res.json(response);
            return;
        }

        response = {
            result : 1        //successfully updated
        }
        res.json(response);
        return;
    });

});

app.post("/admin/product-manager/manage-comment",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'UPDATE ratings SET commentApproved = 1 WHERE ratingID = ?';
    connection.query(ins, [post.ratingID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }

        console.log(res1.affectedRows)
        if (res1.affectedRows == 0){
            response = {
                result : 2     //ratingID does not exist
            }
            res.json(response);
            return;
        }

        response = {
            result : 1        //successfully approved
        }
        res.json(response);
        return;
    });

});

app.post("/admin/product-manager/all-delivery-list",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT * FROM `delivery` where custID != -1 ORDER BY `purchaseDate` DESC';
    connection.query(ins, (err, result)  => {
        if (err) {
            console.log(err);
            response = {
                result: -1//db error   
            }
            res.json(response);
            return;
        }
        response = {
            result: 1,
            data: result
        }
        res.json(response);
    });
});

app.post("/admin/product-manager/all-ratings",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT * FROM `ratings`';
    connection.query(ins, (err, result)  => {
        if (err) {
            console.log(err);
            response = {
                result: -1//db error   
            }
            res.json(response);
            return;
        }
        response = {
            result: 1,
            data: result
        }
        res.json(response);
    });
});

app.post("/admin/product-manager/get-product",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT * FROM `products` WHERE productID = ?';
    connection.query(ins, [post.productID], (err1, result) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }

        console.log(result.length)
        if (result.length == 0){
            response = {
                result : 2     //productID does not exist
            }
            res.json(response);
            return;
        }

        response = {
            result: 1,
            data: result
        }
        res.json(response);
        return;
    });
});

app.post("/admin/product-manager/products-to-deliver",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'SELECT * FROM `delivery` WHERE deliveryStatus = "Processing" OR deliveryStatus = "Shipped" AND custID <> -1 ORDER BY `purchaseDate` DESC';
    connection.query(ins, (err, result)  => {
        if (err) {
            console.log(err);
            response = {
                result: -1//db error   
            }
            res.json(response);
            return;
        }
        response = {
            result: 1, //succesfull return of products being delivered
            data: result
        }
        res.json(response);
    });
});

app.post("/admin/product-manager/cancel-order",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    function doQuery(conn, sql, args) {
        return new Promise(function (resolve, reject) {
            conn.query(sql, args, function (error, results, fields) {
                if (error) return reject(error)
                resolve({
                    results,
                    fields
                })
            })
        })
    }

    async function changeQuantities(products, quantities, connection) {

        for (let i = 0; i < products.length; i++) {
    
            let ins = 'UPDATE products SET productQuantity = productQuantity + ? WHERE productID = ?'

            let queryOutput = await doQuery(connection, ins, [quantities[i], products[i]]);
        }
        return;
    }

    let ins = 'SELECT * FROM delivery WHERE deliveryID = ?';
    connection.query(ins, [post.deliveryID], (err1, res1) => {
        if(err1){
            console.log(err1);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }

        if (res1.length == 0) {
            response = {
                result : -5     //deliveryID not found
            }
            res.json(response);
            return;
        }

        if (res1[0].deliveryStatus == "Shipped") {
            response = {
                result : -3         //order is already shipped
            }
            res.json(response);
            return;
        }

        else if (res1[0].deliveryStatus == "Completed") {
            response = {
                result : -4         //order is already completed
            }
            res.json(response);
            return;
        }
        else {

            let products = res1[0].productIDs.split(";");
            let quantities = res1[0].quants.split(";");
            console.log(products);
            console.log(quantities);

            let ins = 'DELETE FROM delivery WHERE deliveryID = ?';
            connection.query(ins, [post.deliveryID], (err2, res2) => {
                if(err2){
                    console.log(err2);
                    response = {
                        result : -1     //db error
                    }
                    res.json(response);
                    return;
                }

                changeQuantities(products, quantities, connection);

                response = {
                    result : 1       //order succesfully deleted
                }
                res.json(response);
                return;
            });
        }
    });
});

app.post("/admin/product-manager/add-product",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'INSERT INTO `products` ( `productName`, `productModel`, `productNumber`, `productDescription`, `productQuantity`, `purchasedPrice`, `originalPrice`, `productPrice`, `productWarrantyStatus`, `productDistributor`, `productThumb`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    connection.query(ins, [ post.productName, post.productModel, post.productNumber, post.productDescription, post.productQuantity, post.purchasedPrice, post.originalPrice, post.productPrice, post.productWarrantyStatus, post.productDistributor, post.productThumb], (err2, res1) => {

        if(err2){
            console.log(err2);
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }
        x=-1*post.productQuantity*post.purchasedPrice;
        let info = {
            "custID": -1,
            "totalPrice":x,
            "purchaseDate":new Date().toISOString().slice(0,19).replace('T',' ')
        }
        let ins2 = 'INSERT INTO delivery SET ?';
        connection.query(ins2, info, (err4, res4) => { 
            if(err4){
                response = {
                    result : -1     //db error
                }
                res.json(response);
                return;
            } 
            response = {
                result : 1 //not-existing item is created
            }
            res.json(response);
            return;;                             
        }) 
    });
});

app.post("/admin/product-manager/delete-product",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    let ins = 'SELECT productQuantity,purchasedPrice FROM products WHERE productID=?';
    connection.query(ins, [post.productID], (err2, res2) => {
        var x=res2[0].productQuantity*res2[0].purchasedPrice
        if(err2){
            response = {
                result : -1     //db error
            }
            res.json(response);
            return;
        }
        if(res2.length==0){
            response = {
                result : 2 // id does not exists
            }
            res.json(response);
            return
        }
        if(res2.length == 1){
            let ins = 'DELETE FROM products WHERE productID = ?';
            connection.query(ins, [post.productID], (err3, res3) => {
                if(err3){
                    response = {
                        result : -1     //db error
                    }
                    res.json(response);
                    return;
                }
                let info = {
                    "custID": -1,
                    "totalPrice":x,
                    "purchaseDate":new Date().toISOString().slice(0,19).replace('T',' ')
                }
                let ins2 = 'INSERT INTO delivery SET ?';
                connection.query(ins2, info, (err4, res4) => { 
                    if(err4){
                        response = {
                            result : -1     //db error
                        }
                        res.json(response);
                        return;
                    } 
                    response = {
                        result: 1 // succesfull deletion
                    }
                    res.json(response);                             
                }) 
            })                   
        }
    });
});
app.post("/admin/product-manager/get-all-products",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager" && verify.userRole != "salesManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }
    let ins = 'SELECT * FROM products';
    connection.query(ins, (err1,res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response);
            return;
        }
        if(res1.length !== 0){
            response = {
                result: 1,
                returned : res1
            }
            res.json(response);
        }
        else{
            response = {
                result: -2
            }
            res.json(response);
        }
    })

});

app.post("/admin/product-manager/edit-product",(req,res,next) => {
    let post = req.body;
    let response;
    let token = post.token;
    var verify;
    try{
        verify = jwt.verify(token, process.env.SECRETKEY);
        if(verify.userRole != "prodManager") throw err; // change this userRole as salesManager or prodManager depending on the feature
    }catch(err){
            response = {
                result: -2,
                text : "token fail"
            }
            res.json(response);
        return;
    }

    let ins = 'UPDATE products SET productName = ?, productDescription = ?, productQuantity=?, purchasedPrice=?, originalPrice=?, productPrice=?, productDistributor=?, productThumb=? WHERE productID = ?';
    connection.query(ins, [post.productName, post.productDescription, parseInt(post.productQuantity,10), parseInt(post.purchasedPrice,10), parseInt(post.originalPrice,10), 
        parseInt(post.productPrice,10), post.productDistributor, post.productThumb, parseInt(post.productID,10)], (err1, res1) =>{
        if(err1){
            console.log(err1);
            response = {
                result: -1
            }
            res.json(response);
        }
        if(res1.affectedRows === 1){
            response = {
                result: 1
            }
            res.json(response);
        }
        else{
            response = {
                result: 0
            }
            res.json(response);
        }

    });

});
app.listen(8086, () => console.log(chalk.bold.blue("HTTP serving on 8086.")));