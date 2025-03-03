
const { MongoClient } = require('mongodb');

// Connection URL
const URL = "mongodb+srv://plsaikumar72:ISvtbf60LZPJxLPb@learnnode.g97id.mongodb.net/"
const client = new MongoClient(URL);

// Database Name
const dbName = 'HelloWorld';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('Users');
   
    const insertResult = await collection.insertOne({ name: "saketh", age:23 });
    console.log('Inserted documents =>', insertResult);
     const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult); 
  
    // the following code examples can be pasted here...
  
    return 'done.';
  }
  
  main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());