const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

require('dotenv').config()
// const corsConfig = {
//     origin: '',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }

// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzflvsa.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// // Add the Content Security Policy (CSP) middleware
// app.use((req, res, next) => {
//     res.setHeader(
//         'Content-Security-Policy',
//         "default-src 'none'; font-src 'self' data:; style-src 'self' 'unsafe-inline';"
//     );
//     next();
// });

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const toyServiceCollection = client.db('toyCar').collection('services');

        // 20 Toys routes
        app.get('/allToys20', async (req, res) => {
            const limit = parseInt(req.query.limit) || 20;
            const cursor = await toyServiceCollection.find().limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        })
        // 8 Toys routes
        app.get('/allToys8', async (req, res) => {
            const limit = parseInt(req.query.limit) || 8;
            const cursor = await toyServiceCollection.find().limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        })
        // all Toys routes
        app.get('/allToys', async (req, res) => {
            const cursor = await toyServiceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // Retrieve data by email address
        app.get('/myToys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { SellerEmail: req.query.email }
            }
            const result = await toyServiceCollection.find(query).toArray();
            res.send(result);
        })
        //load  a toy
        app.get('/SingleToyDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyServiceCollection.findOne(query);
            // const result =  cursor.toArray();
            res.send(result);
        })
        //add a toy
        app.post('/addToy', async (req, res) => {
            const addToy = req.body;
            const result = await toyServiceCollection.insertOne(addToy);
            res.send(result);
        });
        //update my toy
        app.patch('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateToy = req.body;
            const updateDoc = {
                $set: {
                    Price: updateToy.Price,
                    AvailableQuantity: updateToy.AvailableQuantity,
                    Description: updateToy.Description
                },
            };
            const result = await toyServiceCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        //delete a toy
        app.delete('/deleteToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyServiceCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        ////////////////
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Toy car server is running')
})

app.listen(port, () => {
    console.log(`Toy car server is running on port ${port}`);
})