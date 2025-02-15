const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors())
console.log(process.env.DB_PASS);

// coffee-master
// xlz7NuvO4LbPPv7L


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpmcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
   
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection('coffee');
    await client.connect();
    // for users
    const userCollection = client.db("coffeeDB").collection('users')
    app.get("/coffee", async(req, res) =>{
        await client.connect();
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get("/coffee/:id", async(req, res) =>{
        await client.connect();
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result =await coffeeCollection.findOne(query);
        res.send(result)
    })
    app.post("/coffee", async(req,res)=>{
        await client.connect();
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result) 
    })
    app.put("/coffee/:id", async(req,res) =>{
      await client.connect();
      const id =req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name, 
          chef: updatedCoffee.chef,
          taste:  updatedCoffee.taste,
          supplier: updatedCoffee.supplier,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options)
      res.send(result)
    })
    app.delete("/coffee/:id", async(req,res)=>{
          await client.connect();
        const id = req.params.id;
        console.log(id);
        
        const query = {_id: new ObjectId(id)}
        const result =await coffeeCollection.deleteOne(query);
        res.send(result)
    })
    // post user data
    app.post("/users", async(req, res)=>{
       await client.connect();
      const users = req.body
      const result = await userCollection.insertOne(users)
      res.send(result)
    })
    // get post in backend
    app.get("/users", async(req, res) =>{
       await client.connect();
      const cursor = userCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // delete user
    app.delete('/users/:id', async(req, res)=>{
      await client.connect();
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res) =>{
    res.send("coffe store")
})

app.listen(port , () =>{
    console.log(`Example app listening on port ${port}`)
})