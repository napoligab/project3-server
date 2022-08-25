const {expressjwt: jwt} = require ('express-jwt');

function getTokenFromHeaders(req) {

    //authorization: "Bearer tfgbhjknlmçdljagvfwacemdaw"
   // to get the first part of the string above we can use .startsWith() or .split(' '), make it an array and get the [0] and then [1].
    if(req.headers.authorization && req.headers.authorization.split(' ')[0]) { // req.headers.authorization.startsWith('Bearer')) 

        const token = req.headers.authorization.split(' ')[1]
        return token;
    }

    return null;
}

const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET, 
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders,
})

module.exports = {
    isAuthenticated,
  };