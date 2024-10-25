const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mrd4l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const craftsCollection = client.db("craftDB").collection("crafts");
    const categoriesCollection = client.db("craftDB").collection("categories");
    const usersCollection = client.db("craftDB").collection("users");

    app.get('/crafts', async(req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftsCollection.findOne(query)
      res.send(result);
    })

    app.post('/craft', async(req, res) => {
      const newCraft = req.body;
      console.log(newCraft)
      const result = await craftsCollection.insertOne(newCraft);
      res.send(result);
    })

    app.post('/categories', async(req, res) => {
      const newCategory = req.body;
      console.log(newCategory)
      const result = await categoriesCollection.insertOne(newCategory);
      res.send(result);
    })

    app.get('/categories', async(req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/categories/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await categoriesCollection.findOne(query)
      res.send(result);
    })

    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedCraft = req.body;
      const craft = {
        $set: {
          craftIamge: updatedCraft.craftIamge,
          craftName: updatedCraft.craftName,
          category: updatedCraft.category,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processingTime: updatedCraft.processingTime,
          stockStatus: updatedCraft.stockStatus,
          processingTime: updatedCraft.processingTime,
          email: updatedCraft.email,
          userName: updatedCraft.userName,
          shortDescription: updatedCraft.shortDescription
        }
      }
      const result = await craftsCollection.updateOne(filter, craft, options);
      res.send(result);
    })

    app.delete('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftsCollection.deleteOne(query)
      res.send(result);
    })

    // user related apis
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user)
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Artify server is running.')
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})