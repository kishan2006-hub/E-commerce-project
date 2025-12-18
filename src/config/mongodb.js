import { MongoClient } from "mongodb";

const url = process.env.DB_URL

let client;
export const connectToServer = async ()=>{
    await MongoClient.connect(url)
      .then(clientInstance=>{
        client = clientInstance
        console.log("Connected to Mongodb Server.")
        createCounter(client.db())
        createIndexes(client.db())
      })
      .catch(err=>{
        console.log(err)
      })
}

export function getDB(){
    return client.db()
} 

export function getClient(){
  return client
}

const createCounter = async(db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }
}

const createIndexes = async(db)=>{
   try{
     db.collection("products").createIndex({price:1})
     db.collection("products").createIndex({desc:"text"})
     db.collection("products").createIndex({ name: 1},{ unique: true })
   }catch(err){
     console.log(err.message)
   }
}

