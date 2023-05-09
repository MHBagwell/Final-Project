const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyStates = require('../../middleware/verifyStates');

//set all routes
router.route('/')
    .get(verifyStates,statesController.getAllStates);

    router.route('/:state')
        .get(verifyStates, statesController.getState);

    router.route('/:state/funfact')
        .get(verifyStates, statesController.getFunFact)
        .post(verifyStates, statesController.postFunFact)
        .patch(verifyStates, statesController.patchFunFact)
        .delete(verifyStates, statesController.deleteFunFact);

    router.route('/:state/capital')
        .get(verifyStates,statesController.getCapital);

    router.route('/:state/nickname')
        .get(verifyStates, statesController.getNickname);

    router.route('/:state/population')
        .get(verifyStates, statesController.getPopulation);
        
    router.route('/:state/admission')
        .get(verifyStates,statesController.getAdmission);


module.exports = router;