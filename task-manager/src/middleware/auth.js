const
    jwt = require('jsonwebtoken'),
    User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const
            token = req.header('Authorization').replace('Bearer ', ''),
            decoded = jwt.decode(token, process.env.JWT_SECRET),
            user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

            if (!user) throw new Error();

            req.token = token;
            req.user = user;
            
            next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;