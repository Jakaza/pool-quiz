const express = require('express');
const router = express.Router();
const MultipleChoiceQuestion = require('../../models/multipleChoiceQuestion')
const TrueFalseQuestion = require('../../models/TrueFalseQuestion')


// https://opentdb.com/api.php?amount=10&category=23&difficulty=hard&type=multiple

router.get('/question', async (req, res )=>{
        // Build the query object based on query parameters
        const query = {};
        if (req.query.amount) query.amount = req.query.amount;
        // if (req.query.category) query.category = req.query.category;
        // if (req.query.difficulty) query.difficulty = req.query.difficulty;
        // if (req.query.type) query.type = req.query.type;

        const limitAmount = parseInt(req.query.amount, 10);
        const response = {
            status: true,
            url: 'http://localhost:3000/api/v1/question?',
            data : [
            ]
        }
        try{
            if(isDifficultyChecked(req)){
                if(req.query.type == "multiple"){
                    const data = await MultipleChoiceQuestion.find().limit(limitAmount)
                    response.data.push(data)
                }else{
                    const data = await TrueFalseQuestion.find().limit(limitAmount)
                    response.data.push(data)
                }
            }else{
                limitAmount = Math.floor(limitAmount/2)
                const data = await MultipleChoiceQuestion.find().limit(limitAmount)
                const data2 = await TrueFalseQuestion.find().limit(limitAmount)
                response.data.push(data)
                response.data.push(data2)
            }

            res.json(response)

        }catch(er){
            console.log(er);
        }
})

function isDifficultyChecked(req){
    return req.query.difficulty ? true : false
}


module.exports = router;
