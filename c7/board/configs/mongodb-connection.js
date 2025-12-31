const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://mymongo:asd1234@cluster0.puvsrsz.mongodb.net/board?appName=Cluster0&retryWrites=true&w=majority";

module.exports = function (callback){
    return MongoClient.connect(uri, callback);
};
