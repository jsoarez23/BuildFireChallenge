const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const fs = require("fs");

const LOGIN_COLLECTION = "LOGIN";
const SCHEMA_NAME = "users";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Connect To mongo
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) return console.log(err);
        var db = client.db(SCHEMA_NAME);
        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Post new users
router.post('/user/create', (req, res) => {
    
    var user = req.body;
    user.createDate = new Date();
    user.password = req.body.password;
    user.email = req.body.email;
    
    if (!req.body) {
        sendError(400, "Invalid input, no data provided");
    }
    connection((db) => {
        db.collection(LOGIN_COLLECTION)
        .insertOne(user)
        .then(result => {
            response.data = 'User Saved';
            res.json(response.data);
        })
        .catch((err) => {
            sendError(err, res);
        });
    });
});

// Get users
router.get('/users/get', (req, res) => {
    
    connection((db) => {
        db.collection(LOGIN_COLLECTION)
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });

});
module.exports = router;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);

