const jwt = require('jsonwebtoken')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "632e9116904cb9ff5cabfa891e670bc906c02af4b817a0097bdd3b5d10a13069cee9e0b8f94c024527d5f0fb0f3a9678b5a2c88af9fd45a184110c4059d62352";

function authenticateToken (req,res,next){
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({ error: true, message: "No token provided" });

    const secret = process.env.ACCESS_TOKEN_SECRET || "632e9116904cb9ff5cabfa891e670bc906c02af4b817a0097bdd3b5d10a13069cee9e0b8f94c024527d5f0fb0f3a9678b5a2c88af9fd45a184110c4059d62352";

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(401).json({ error: true, message: "Invalid or expired token" });
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
}