const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

const { ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

//connect to mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@trendallteam1.xgqruui.mongodb.net/?retryWrites=true&w=majority&appName=TrendallTeam1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const artefactCollection = client.db('Trendall-AllArtefactData').collection("Artefacts");



    //counting how many artefact are there for pagination 
    app.get('/artefacts-element-count', async (req, res) => {
      try {
          const result = await artefactCollection.find().toArray();
          let totalCount = 0;
  
          // Iterate through each document in the collection
          result.forEach(item => {
              // Assuming each item is an object with an array field
              Object.keys(item).forEach(key => {
                  const value = item[key];
                  if (Array.isArray(value)) {
                      // Increment the totalCount by the length of the array
                      totalCount += value.length;
                  }
              });
          });
  
          res.send({ totalCount });
      } catch (err) {
          console.error("Error:", err);
          res.status(500).send("Internal Server Error");
      }
  });
  
  
  



  //load full book without merging
    app.get('/artefacts', async (req, res) => {
        const result = await artefactCollection.find().toArray();
        res.send(result);
    });


    //merging all chapter in an array 
    app.get('/artefacts-all', async (req, res) => {
      try {
          const result = await artefactCollection.find().toArray();
          let mergedArray = [];
          result.forEach(item => {
              // Assuming each item is an object with index keys like 0, 1, 2...
              Object.keys(item).forEach(index => {
                  if (Array.isArray(item[index])) {
                      mergedArray = mergedArray.concat(item[index]);
                  }
              });
          });
          res.send(mergedArray);
      } catch (err) {
          console.error("Error:", err);
          res.status(500).send("Internal Server Error");
      }
  });
  
  // http://localhost:5000/artefacts-all
    
  




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req, res) =>{
    res.send('Trendall Research Center Running')
})
app.listen(port,()=>{
    console.log(`Trendall Research Center Running on ${port}`);
});
