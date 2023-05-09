const stateData = require('../model/statesData.json');

const verifyStates = (req, res, next) => {

    const stateAb = req.params.state.toUpperCase();
    const stateCodes = stateData.map(st => st.code);
    const State = stateCodes.find(code => code === stateAb);

    if (!State) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }
    req.params.state = stateAb;
    next();
}

module.exports = verifyStates;
