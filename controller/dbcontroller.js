let mongo = require ('mongodb');
let{MongoClient} = require('mongodb');
// let mongourl = "mongodb://127.0.0.1:27017";
let mongourl ="mongodb+srv://rohitdeveloper:IlCpS76zgiO9IFgB@cluster0.ivcxuxo.mongodb.net/?retryWrites=true&w=majority";

let client = new MongoClient(mongourl);

async function dbConnect(){
   await client.connect()
}

let db = client.db('messho');

async function getData(colName,query){
    let output = [];
    try{
        const cursor = db.collection(colName).find(query);
        for  await  (const data of  cursor){
            output.push(data)
        }
        cursor.closed
    }
    catch(err){
        output.push({"Error" : "Error in get data"})
    }
    return output
}

async function postData(colName,data){
    let output ;
    try{
        output = await db.collection(colName).insertOne(data)
    }
    catch(err){
        output={"response":"Error in post data"}
    }
    return output
}

async function updateOrder(colName,condition,data){
    let output ;
    try{
        output = db.collection(colName).updateOne(condition,data)
    }
    catch(err){
        output={"response":"error in update order"}
    }
    return output
}
 

async function deleteOrder(colName,condition){
    let output;
    try{
        output= await db.collection(colName).deleteOne(condition)
    }
    catch(err){
        output= {"response":"Error in delete data"}
    }
    return output
}

module.exports = {
    dbConnect,
    getData,
    postData,
    updateOrder,
    deleteOrder
}