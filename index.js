import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 7000;

app.use(cors());
//middleware while using post
app.use(express.json());
//mongodb connection
const MONGO_URL = process.env.mongo_url;

async function createConnnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}
const client = await createConnnection();

app.get("/", (req, res) => {
  res.send("hello world");
});
//endpoint to get all books
app.get("/books", async (req, res) => {
  const books = await client
    .db("demoproject-bookapp")
    .collection("books")
    .find()
    .toArray(); //db name from atlas
    res.send(books);
});

//delete
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  const book = await client
    .db("b47-book-app")
    .collection("books")
    .deleteOne({ id: id });
  res.send(book);
});

//delete using object id
// app.delete("/books/:id", async (req, res) => {
//   const _id = Number(req.params);
//   const book = await client
//     .db("b47-book-app")
//     .collection("books")
//     .deleteOne({ _id }, (err, result) => {
//       if (err) throw err;
//       res.send("Deleted Successfully");
//     });
//   res.send(book);
// });

//add book
app.post("/books", async (req, res) => {
  const newBooks = req.body;
  const output = await client
    .db("demoproject-bookapp")
    .collection("books")
    .insertMany(newBooks);
  res.send(output);
});

//edit books
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const updatedBooks = req.body;
  const output = await client
    .db("b47-book-app")
    .collection("books")
    .updateOne({ id: id }, { $set: updatedBooks });
  res.send(output);
});

//need to use body-parser so this is not working
//app.use(bodyParser.urlencoded({ extended: true })
//app.use(bodyParser.json())

// //update post and get books by id edit
// app.put("/books/:id", async (req, res) => {
//     const oid = req.params
//       const updatedBooks = req.body
//       const output= await client
//         .db("demoproject-bookapp")
//         .collection("books")
//         .deleteOne({id:oid},{$set:updatedBooks})//first one is from db second is from params
//       res.send(output);
//     });

app.listen(PORT, () => console.log("Server started at port", PORT));
