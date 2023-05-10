//Imported Data
const State = require('../model/States');
const statesData = require('../model/statesData.json');

//GET Request Functions 
const getAllStates = async (req, res) => {
    const { contig } = req.query;
    let statesList = statesData;

    if (contig === 'false') {
        statesList = statesData.filter(st => st.code === 'AK' || st.code === 'HI');
        return res.json(statesList);
    }
    if (contig === 'true') {
        statesList = statesData.filter(st => st.admission_number < 49);
        return res.json(statesList);
    }
    
    const mongoStates = await State.find();
    statesList.forEach(state => {
        const stateExists = mongoStates.find(st => st.stateCode === state.code);
        if(stateExists) {
            let funfactArray = stateExists.funfacts;
            if (funfactArray.length !== 0) {
                state.funfacts = [...funfactArray]; 
            }
        }
    });
    res.json(statesList);
}

const getState = async (req, res) => {    
    const stateReq = req.params.state;
    const stateData = statesData.find(state => state.code === stateReq);
    const mongoStates = await State.find();   
    const stateExists = mongoStates.find(st => st.stateCode === stateData.code);
    
    if(stateExists) {
        let funfactArray = stateExists.funfacts;
        if (funfactArray.length !== 0) {
            stateData.funfacts = [...funfactArray]; 
        }
    }
    res.json(stateData);
}

const getFunFact = async (req, res) => {
    const stateReq = req.params.state;
    const stateData = statesData.find(state => state.code === stateReq);   
    const mongoStates = await State.find();
    const stateExists = mongoStates.find(st => st.stateCode === stateData.code);
    
    if (!stateExists || !stateExists.funfacts) {
        return res.json({ "message": `No Fun Facts found for ${stateData.state}` });
    }

    const funfactArray = stateExists.funfacts;
    
    let randomNum = Math.floor(Math.random()*funfactArray.length);
    let funfact = funfactArray[randomNum];

    res.json({ funfact });
}

const getCapital = (req, res) => {
    const stateReq = req.params.state;
    const stateData = statesData.find(state => state.code === stateReq);
    const state = stateData.state;
    const capital = stateData.capital_city;

    res.json({ state, capital });
}

const getNickname = (req, res) => {
    const stateReq = req.params.state;
    const stateData = statesData.find(state => state.code === stateReq);
    const state = stateData.state;
    const nickname = stateData.nickname;

    res.json({ state, nickname });
}

const getPopulation = (req, res) => {
    const stateReq = req.params.state;
    const stateData = statesData.find(state => state.code === stateReq);
    const state = stateData.state;
    const popInt = stateData.population;
    const population = popInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    res.json({ state, population });
}

const getAdmission = (req, res) => {
    const stateReq = req.params.state;
    const stateData = statesData.find(state => state.code === stateReq);
    const state = stateData.state;
    const admitted = stateData.admission_date;

    res.json({ state, admitted });
}


//POST Request Functions 
const postFunFact = async (req, res) => {
    if(!req.body.funfacts) {
        return res.status(400).json({"message": "State fun facts value required"});
    }
 
    const stateCode = req.params.state;
    const funfacts = req.body.funfacts;

    if (!(funfacts instanceof Array) || funfacts instanceof String) {  
        return res.status(400).json({"message": "State fun facts value must be an array"});
    }

    const foundState = await State.findOne({stateCode: stateCode});

    if (!foundState) {
        try {
            const result = await State.create({
                stateCode: stateCode,
                funfacts: funfacts
            });
            console.log(typeof result);
            res.status(201).json(result);
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        let funfactArray = foundState.funfacts;
        funfactArray = funfactArray.push(...funfacts);
        const result = await foundState.save();
        res.status(201).json(result);
    }
}


//PATCH Request Functions 
const patchFunFact = async (req, res) => {
    if (!req.body.index) {
      return res.status(400).json({ "message": "State fun fact index value required" });
    }
    if (!req.body.funfact || req.body.funfact instanceof Array) {
      return res.status(400).json({ "message": "State fun fact value required" });
    }
  
    const index = parseInt(req.body.index) - 1;
    const stateCode = req.params.state;
    const stateData = statesData.find(state => state.code === stateCode);
    const stateName = stateData.state;
    const funfact = req.body.funfact;
    const foundState = await State.findOne({ stateCode: stateCode });
  
    if (!foundState) {
      return res.status(400).json({ "message": `No State found with code ${stateCode}` });
    }

    if (funfactArray === null) {
        return res.status(400).json({ "message": `No Fun Facts found for ${stateName}` });
      }
  
    let funfactArray = foundState.funfacts;
  
    if (!funfactArray || !funfactArray.length) {
      return res.status(400).json({ "message": `No Fun Facts found for ${stateName}` });
    }
  
    if (!funfactArray[index]) {
      return res.status(400).json({ "message": `No Fun Fact found at that index for ${stateName}` });
    }
    
    funfactArray[index] = funfact;
    const result = await foundState.save();
    res.status(201).json(result);
  }
  



//DELETE Request Functions 
const deleteFunFact = async (req, res) => {
    if(!req.body.index) {
        return res.status(400).json({"message": "State fun fact index value required"});
    }
    
    const index = parseInt(req.body.index) - 1;
    const stateCode = req.params.state;
    const stateData = statesData.find(state => state.code === stateCode);
    const stateName = stateData.state;
    const foundState = await State.findOne({stateCode: stateCode});
    let funfactArray = foundState.funfacts;

    if(!funfactArray || !funfactArray.length) {
        return res.status(400).json({"message": `No Fun Facts found for ${stateName}`});
    }
    if(!funfactArray[index]) {
        return res.status(400).json({"message": `No Fun Fact found at that index for ${stateName}`});
    }

    funfactArray.splice(index, 1);
    const result = await foundState.save();
    res.status(201).json(result); 
}



module.exports = {
    getAllStates, 
    getState, 
    getFunFact,
    getCapital,
    getNickname, 
    getPopulation,
    getAdmission,
    postFunFact,
    patchFunFact,
    deleteFunFact
};
