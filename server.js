const express = require("express")
const app = express()
const cors = require("cors") // notes
// const MongoClient = requrie("mongodb").MongoClient if out how / why we need to use line 5
const {MongoClient, ObjectId} = require("mongodb")
require("dotenv").config()
const PORT = 8000

let db, //notes
    dbConnectionStr = process.env.DB_STRING,
    dbName = "sample_mflix",
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log("connected to database")
        db = client.db(dbName)
        collection = db.collection("movies")
    })

app.use(express.urlencoded({extended: true})) //double check how this done elsewhere
app.use(express.json())
app.use(cors())

app.get("/search", async (req,res) => { //make this request async
    try{
        let result = await collection.aggregate([
            {
                "$Search" : { //passing a seach
                    "autocomplete": { // the seach will be automplete seach
                        "query": `${request.query.query}`, // seach query
                        "path": "title", //within the oject check title
                        "fuzzy": { //allows you miss-spell word and still get suggest what your looking for
                            "maxEdits": 2, //how many spelling mistakes can be made
                            "prefixLength": 3 // how many characters before we start predicting 
                        }
                    }
                }
            }
        ]).toArray()
        res.send(result)
    }catch(err){
        res.status(500).send({message: err.message}) //compare this with json erros
    }
})

app.get("/get/:id", async (req,res) => {
    try {
        let result = await collection.findOne({ //compare with the others
            "_id" : ObjectId(req.params.id)
        })
        res.send(result) // no to array for this?
    }catch(err){
        res.status(500).send({message: err.message}) //compare this with json erros
    }
})

app.listen(PORT, () => {
    console.log("sever is running")
})