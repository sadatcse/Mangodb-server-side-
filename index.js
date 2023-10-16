//Header area
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express =require('express');
const cors = require('cors');
const app= express();
const port =process.env.PORT ||5000;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.M_U}:${process.env.SECRET_KEY}@cluster0.kxbs450.mongodb.net/?retryWrites=true&w=majority`;


// middleware 
app.use(cors());
app.use(express.json());


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  if (client && client.topology && client.topology.s.state === 2) {
    console.log("Already connected to MongoDB!");
  } else {
    // Connect the client to the server if not already connected
    await client.connect();
    console.log("Connected to MongoDB!");
  }

  const userCollection = client.db('Sweeding').collection('user');

  app.get('/user', async (req, res) => {
    const cursor = userCollection.find();
    const users = await cursor.toArray();
    res.send(users);
  });

  app.post('/user', async (req, res) => {
    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);
  });

  app.patch('/user', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = {
      $set: {
        lastLoggedAt: user.lastLoggedAt,
      },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

  app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
  });

  app.get('/', (req, res) => {
    res.send('Blank Page');
  });
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on Port:${port}`);
});


