const jwt = require('jsonwebtoken')

const adminmiddleware = (req, res, next) => {

    const authheader = req.headers.authorization
    const token = authheader.split(" ")[1]
    if (!token) {
        return res.send("Unauthorized user")
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.jwttoken
        )
        if (decoded.role !== "admin") {
            return res.send("Access denied. Admin only")
        }

        req.user = decoded // req.user=decoded  inplace of user use any word 

        next()

    } catch (error) {

        return res.send("Unauthorized user")
    }
}

module.exports = adminmiddleware
