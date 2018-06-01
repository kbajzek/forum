const models  = require('../models');

module.exports = (req, res, next) => {
    return models.Rating.findOne({where: {userId: req.session.passport.user, postId: req.body.postId}}) //Check if the post is already rated by rater
        .then(function (rating) {
            if(!rating){
                return res.status(401).send({ errorType: 5, error: 'User has not yet rated the post!' })
            }else{
                return next();
            } 
        });
};