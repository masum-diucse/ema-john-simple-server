const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser=require('body-parser');
const cors=require('cors');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdxcg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

app.use(bodyParser.json());
app.use(cors());

client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTIONS}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER_COLLECTIONS}`);

  //--post one product
  app.post('/addProduct',(req,res)=>{
      const product=req.body;
      productsCollection.insertOne(product)
      .then(result=>{
          res.send(product.length===result.insertedCount)
      })
  })

  //--post one order
  app.post('/addOrder',(req,res)=>{
    const order=req.body;
    ordersCollection.insertOne(order)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
})

  //-get all products
  app.get('/getAllProducts',(req,res)=>{
      productsCollection.find({}).limit(30)
      .toArray((err,documents)=>{
          res.status(200).send(documents);
      })
  })

  //--get single product
  app.get('/getProduct/:key',(req,res)=>{
      productsCollection.find({key:req.params.key})
      .toArray((err,document)=>{
          res.send(document[0])
      })
  })

  //--get multiple product
  app.post('/productByKeys',(req,res)=>{
      const productKeys=req.body;
      productsCollection.find({key:{$in:productKeys}})
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })
 console.log("Db connected successfully")
});


app.listen(5000);