let express = require('express');
let api = express();
let port = process.env.PORT || 9737;
const bodyparser = require('body-parser');
const cors = require('cors');
let {dbConnect , getData, postData, updateOrder, deleteOrder} = require('./controller/dbcontroller');


api.use(bodyparser.json());
api.use(bodyparser.urlencoded({extended:true}))
api.use(cors())

api.get('/',(req,res) => {

    res.send("hi today i m using express")
})


api.get('/category', async (req,res) => {
    let query = {};
    let collection = "category"
    let output = await getData(collection,query)
    res.send(output);
})
/*api.get('/quick',async(req,res)=>{
    let query = {}
    if(req.query.quickid){
        query = {quick_id:Number(req.query.quickid)}
    }else{
        query={}
    }
    let collection = "quick"
    let output = await getData(collection,query)
    res.send(output)
})*/

//product selscted
api.get('/products',async(req,res)=>{
    let query = {}
    if(req.query.productid){
        query = {product_id:Number(req.query.productid)}
    }else if(req.query.categoryid){
        query = {category_id:Number(req.query.categoryid)}
    }
    else{
        query={}
    }
    let collection = "products"
    let output = await getData(collection,query)
    res.send(output)
})

api.get('/filter/:id',async(req,res)=>{
    let id =  req.params.id;
    let query = {size:id}
    let collection = "products"
    let output = await getData(collection,query)
    res.send(output)
})

//price of product(filter)
api.get('/price',async(req,res)=>{
    let lcost = Number(req.query.lcost);
    let hcost =Number(req.query.hcost); 
    let query = {}
    if (lcost && hcost){
        query = {
            $and:[{price:{$gt:lcost, $lt:hcost}}]
        }
    }
    else{
        query = {}
    }
    let collection = "products"
    let output = await getData(collection,query)
    res.send(output)
})

//details of products
api.get('/details/:id',async(req,res)=>{
    let id = Number(req.params.id)
    let query = {product_id : id}
    let collection = "products"
    let output = await getData(collection,query)
    res.send(output) 
})

//oders
api.get('/orders',async(req,res)=>{
    let query = {};
    let collection = "orders"
    let output = await getData(collection,query)
    res.send(output)
})


//placeorder
api.post('/placeorder',async(req,res)=>{
    let data = req.body;
    let collection = "orders"
    let output = await postData(collection,data)
    res.send(output)
})

api.post('/orderdetails',async (req,res)=>{
    if(Array.isArray(req.body.id)){
        let query = {product_id:{$in:req.body.id}}
        let collection = "products"
        let output = await getData(collection,query)
        res.send(output)
    } 
    else{
        res.send('please pass the data in form of array')
    }
})

api.put('/updateOrder', async (req,res)=>{
    let collection = "orders"
    let condition = {product_id:req.body.product_id}
    let data = {
        $set :{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})


api.put('/deleteOrder',async(req,res)=>{
    let collection = "orders"
    let condition = {product_id:req.body.product_id}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})


api.listen(port,(err)=>{
    dbConnect()
    if (err) throw err
    console.log(`server is running on port ${port}`)
})
