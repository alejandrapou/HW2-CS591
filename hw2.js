const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/CS591')
const db = mongoose.connection
db.once('open', function () {
    console.log('Connection successful.')
})

const Schema = mongoose.Schema
const stringSchema = new Schema({
    string: String,
    length: Number

})
const input_string = mongoose.model('input_string', stringSchema)


//GET all strings currently in the database
router.get('/', function (req, res, next) {
    input_string.find({}, function (err, results) {
        res.json(results);
    })

})

//GET method: first look in the database to see if string is present,
//if string is not found then store in database and return to client
router.get('/:name', function (req, res, next) {
    findByName(req.params.name)
        .then(function (status) {
            res.json(status)
        })
        .catch(function (status) {
            let str = req.params.name;
            let str_len = str.length;
            let aString= new input_string({string: str, length:str_len})
            aString.save()
            res.json(status)

        })
})

let findByName = function (checkName) {
    return new Promise(function (resolve, reject) {
        input_string.find({string: checkName}, function (err, results) {
            if (results.length > 0) {
                resolve({found: results})
            }
            else {
                reject({found: false})
            }
        })
    })
}


// POST Create a new user
router.post('/', function(req, res, next) {
    findByName(req.body.string)
        .then(function (status) {
                res.json(status)
        })
        .catch(function (status) {
            let str = req.body.string;
            let str_length = str.length;
            let aString = new input_string({string: str, length: str_length})
            aString.save()
            res.json(status)
        })
})


//DELETE Delete the specified user
router.delete('/:name', function (req, res, next) {
    console.log(req.params.name)
    findByName(req.params.name)
        .then(function (status) {
            input_string.findOneAndRemove({string: req.params.name}, function (err, result) {
                if (err){
                    res.json({message: 'String does not exist'});
                }
                else{
                    res.json({message: 'Success'});
                }
            })
        })
        .catch(function (status) {
            res.json("String does not exist")
        })
});

module.exports = router;