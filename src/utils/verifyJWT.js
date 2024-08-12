require('dotenv').config();
const jwt = require('jsonwebtoken');


const verifyJwt = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;

     '[Bearer] [eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJmaXJzdE5hbWUiOiJMZWlhIiwibGFzdE5hbWUiOiJPcmdhbmEiLCJlbWFpbCI6ImxlaWFAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkaDlnUTFGV0k4MjE3SFM3ZlB5RmFDT1p2U1hVQjVoNld1VVQxRDA2Vk45ZzFTMktIVzg4dUsiLCJjcmVhdGVkQXQiOiIyMDI0LTA4LTA4VDIzOjAxOjQxLjM2MFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTA4LTA4VDIzOjAxOjQxLjM2MFoifSwiaWF0IjoxNzIzMjQyOTczLCJleHAiOjE3MjMzMjkzNzN9.nAKNxCJIya21Chi-jnb9N82RqBGX0Qhs5Epv9kAe7Co]'

    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = decoded.user;
            next();
        }
    )
}

module.exports = {verifyJwt};