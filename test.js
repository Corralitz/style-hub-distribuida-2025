// mongodb+srv://widerman:widerman123@sept-22-2025.dpc8pmr.mongodb.net/?retryWrites=true&w=majority&appName=sept-22-2025/ecommerce
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://widerman:widerman123@sept-22-2025.dpc8pmr.mongodb.net/?retryWrites=true&w=majority&appName=sept-22-2025/ecommerce";
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    const db = client.db("ecommerce");
    await db.collection("comments").insertOne({ test: true });
    console.log("✅ Test document inserted!");
  } finally {
    await client.close();
  }
}

test();
