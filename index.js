const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bik86wn.mongodb.net/?retryWrites=true&w=majority`;


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
    // Send a ping to confirm a successful connection
    const usersCollections = client.db("bistro_boss").collection('users')
    const menuCollections = client.db("bistro_boss").collection('menu')
    const reviewCollections = client.db("bistro_boss").collection('reviews')
    const cartCollections = client.db("bistro_boss").collection('carts')

// user api
app.get('/users', async(req, res)=>{
  const result = await usersCollections.find().toArray()
  res.send(result)
})
app.post('/users', async(req, res)=>{
  const user = req.body;

  const query = {email:user.email}
  console.log(query)
  const existinguser = await usersCollections.findOne(query)
  if(existinguser){
    return res.send({'messege':"user exist"})
  }
  const result = await usersCollections.insertOne(user)
  res.send(result)

})













    app.get('/menu', async(req, res)=>{
      const cursor = await menuCollections.find().toArray()
      res.send(cursor)
    }) 
     app.get('/reviews', async(req, res)=>{
      const cursor = await reviewCollections.find().toArray()
      res.send(cursor)
    })


    app.get('/carts', async(req, res)=>{
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {email:email}
      const result = await cartCollections.find(query).toArray()
      res.send(result)
    })
    app.post('/carts', async(req, res)=>{
      const item = req.body;
      

      const result = await cartCollections.insertOne(item)
      res.send(result)
    })

    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await cartCollections.deleteOne(query)
      res.send(result)
    })


    app.patch('/users/admin/:id', async(req, res)=>{
      const id=req.params.id;
      const filter = {_id:new ObjectId(id)}


      const updateddoc = {
        $set:{
          role:'admin'
        }
      }
      const result = await usersCollections.updateOne(filter, updateddoc)
      res.send(result)
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // 4e
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
  res.send('server runnint')
})
app.listen(5000, ()=>{
  console.log('server running in 5000')
})