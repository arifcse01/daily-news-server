const express = require('express')
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3080;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wapuj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connection Successfully")
client.connect(err => {
  const newsCollection = client.db(process.env.DB_NAME).collection("all-news");
  const adminCollection = client.db(process.env.DB_NAME).collection("admin");
  
  app.post('/addNews', (req, res) =>{
    const addNews = req.body;
    newsCollection.insertOne(addNews)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount)
    })
  })

  app.get('/allNews', (req, res) =>{
    newsCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  app.get('/newsInfo/:id', (req, res) =>{
    const id = req.params.id;
    newsCollection.find({_id: ObjectId(id)})
    .toArray((err, documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/addAdmin', (req, res) =>{
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
    .then(result => {
      res.send(result)
    })
  })
  

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);