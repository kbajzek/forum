module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send({ errorType: 1, error: 'Not Logged In!' })
    }

    next();
    return null;
};