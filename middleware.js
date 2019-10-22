    let jwt = require('jsonwebtoken');
    let config = require('./index.js');

    let checkToken = (req, res, next) => {
    //let token = req.headers['x-access-token'] || req.headers['authorization']; 
    let token =req.headers.authorization.split(" ")[1];
 

    if (token) {
        
        jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({
            success: false,
            message: 'Token is not valid'
            });
        } else {
            req.decoded = decoded;
            next();
        }
        });
    } else {
        return res.json({
        success: false,
        message: 'Auth token is not supplied'
        });
    }
    };

module.exports =  checkToken
