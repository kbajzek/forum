module.exports = (req, res, next) => {
    if (req.get('X-XSRF-TOKEN') !== req.session.csrf) {
        return res.status(401).send({ errorType: 1, error: 'CSRF Token Not Matched!' })
    }

    next();
};