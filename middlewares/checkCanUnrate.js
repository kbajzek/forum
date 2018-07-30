const models  = require('../models');

module.exports = (req, res, next) => {
    return models.Rating.findOne({where: {id: req.body.ratingId}}) //Check if the rating exists
        .then(function (rating) {
            if(!rating){
                return res.status(401).send({ errorType: 5, error: 'Rating does not exist!' })
            }else{
                return next();
            } 
        });
};