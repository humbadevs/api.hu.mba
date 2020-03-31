const validator = require('../helpers/validate');

const mailCheck = (req, res, next) => {
    const validateMail = {
        "email": "required|email",
    }
    validator(req.body, validateMail, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Please enter a valid E-Mail',
                    data: err
                });
        } else {
            next();
        }
    });
}

module.exports = { 
    mailCheck
}