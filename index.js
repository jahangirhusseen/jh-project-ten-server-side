require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_URI}:${process.env.SECRET_KEY}@simplecluster.o6nxivi.mongodb.net/?appName=SimpleCluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send(`<h2 style="text-align:center;">Welcome to Our PawMart</h2>`);
});

async function run() {
  try {
    // await client.connect();
    const petDB = client.db("petServices");
    const petServicesCollection = petDB.collection("pServices");
    // Get all Services
    app.get("/services", async (req, res) => {
      const { category } = req.query;
      const query = {};
      if (category) {
        query.category = category;
      }

      const cursor = petServicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get single services data

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Single User data:", id);
      const query = { _id: new ObjectId(id) };
      const result = await petServicesCollection.findOne(query);
      res.send(result);
      // const result = await userCollection.
    });

    // Create A new Service
    app.post("/services", async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;
      const result = await petServicesCollection.insertOne(data);
      res.send(result);
    });

    // Delate a Services Data
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petServicesCollection.deleteOne(query);
      res.send(result);
    });

    // get my services
    app.get("/my-services", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await petServicesCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });

    // my services Update
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: data,
      };
      const options = {};
      const result = await petServicesCollection.updateOne(
        query,
        update,
        options
      );
      res.send(result);

      console.log("update data user id:", id);
    });

    // Delete a services data
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petServicesCollection.deleteOne(query);
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is Running ${port}`);
});
