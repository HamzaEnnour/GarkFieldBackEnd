const router = require('express-promise-router')();

const passport = require('passport');
const passportConfig = require('../config/passport');
const financialController = require('../controller/financial.controller');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const finController = require('../controller/financial.controller');


router.route('/')
    .get(passportJwt, financialController.getAll)
    .post(passportJwt, financialController.createIncome)

router.route('/:_id')
    .delete(passportJwt, financialController.delete)
    .put(passportJwt, financialController.updateIncome)

router.route('/spents/:_id')
    .put(passportJwt, financialController.updateSpent)   

router.route('/spents')
    .post(passportJwt , financialController.createSpent)
   
router.get('/stats',passportJwt, financialController.getStats);




module.exports = router