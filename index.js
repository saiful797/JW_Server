require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

// Mongodb setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3qxp45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const stockCollection = client.db('janata-wifi-db').collection('stock-market-data');

    //Stock market data related api
    app.get('/stock-market-data', async ( req, res) => {
        const result = await stockCollection.find().toArray();
        res.send(result);
    })

    app.delete('/specific-stock-delete/:id', async( req, res ) => {
        const query = {_id: new ObjectId(req.params.id)}
        const result = await stockCollection.deleteOne(query);
        res.send( result );
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


// Server ON and Running Port message
app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});