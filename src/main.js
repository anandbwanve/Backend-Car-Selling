import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";

const app = express();
app.use(cors()); // allowing everyone.

// required in post
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



async function addUserRecord(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let inputDoc = {
      username: req.query.username,
      password: req.query.password,
      email: req.query.email,
      mobile: req.query.mobile,
    };
    await messageColl.insertOne(inputDoc);

    await client.close();

    res.json({ opr: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function findAllUser(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let list = await messageColl.find().toArray();

    await client.close();
    res.json(list);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function enquiryshow(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("enquiry");

    let list = await messageColl.find().toArray();

    await client.close();
    res.json(list);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function addUserRecord1(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("enquiry");

    let inputDoc = {
      contact:req.query.contact,
      email: req.query.email,
      address: req.query.address,
    };
    await messageColl.insertOne(inputDoc);

    await client.close();

    res.json({ opr: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
// Login auth
async function loginByGet(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let query = { email: req.query.email, password: req.query.password };
    let userRef = await messageColl.findOne(query);

    await client.close();

    // Negative: UserRef CANBE NULL;
    if (!userRef) {
      let errorMessage = `Record Not Found or Authentication Failure: ${req.query.email}`;
      throw new Error(errorMessage);
    }

    // Postive Scenario
    res.json(userRef);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function deletEnquiry(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("enquiry");

    const email = req.params.email; // email is passed as a route parameter
    const result = await messageColl.deleteOne({ email: email });

    await client.close();

    if (result.deletedCount === 0) {
      throw new Error("Enquiry not found");
    }

    res.send("success");
  } catch (err) {
    res.status(500).send(err.message);
  }
}



async function loginByPost(req, res) {
  try {
    const uri = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(uri);

    const db = client.db("project");
    const messageColl = db.collection("user");

    let query = { email: req.body.email, password: req.body.password };
    let userRef = await messageColl.findOne(query);

    await client.close();

    // Negative: UserRef CANBE NULL;
    if (!userRef) {
      let errorMessage = `Record Not Found or Authentication Failure: ${req.body.email}`;
      throw new Error(errorMessage);
    }

    // Postive Scenario
    res.json(userRef);
  } catch (err) {
    res.status(500).send(err.message);
  }
}



// http://localhost:4000/addrecord
app.get("/adduser", addUserRecord);
app.get("/adduser1", addUserRecord1);
app.get("/find-all-user", findAllUser);
app.get("/login-by-get", loginByGet);
app.post("/login-by-post", loginByPost);
app.get("/enquiryshow", enquiryshow);
app.get("/deletEnquiry/:email", deletEnquiry);

// http://localhost:4000/
app.listen(4000);
