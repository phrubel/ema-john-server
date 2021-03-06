const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser=require('body-parser')
const cors=require('cors')
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nijm6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json())
app.use(cors())

const port = 5000

app.get('/',(req,res) =>{
    res.send("welcome to Mongodb Database!! Now you Can use this Data...")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
    app.post('/addProducts',(req,res) =>{
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result =>{
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
    })

    app.get('/products',(req,res) =>{
        const search=req.query.search;
        productsCollection.find({name:{$regex: search}})
        .toArray((err,documents) =>{
            res.send(documents)
        })
    })

    app.get('/product/:key',(req,res) =>{
        productsCollection.find({key:req.params.key})
        .toArray((err,documents) =>{
            res.send(documents[0])
        })
    })

    // many keys post
    app.post('/productsByKeys',(req,res) =>{
        const productKeys=req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err,documents) =>{
            res.send(documents);
        })
    })

    app.post('/addOrder',(req,res) =>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })

});


app.listen(process.env.PORT || port)