const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: 4,
    content: "Prueba",
    important: true
  }
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

  app.get('/api/mongo', (request, response) => {
    
      const { MongoClient, ServerApiVersion } = require('mongodb');
      const uri = "mongodb+srv://emadb:<tesis2024>@cluster0.ylbc2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);

      response.json({ok:"Pinged your deployment. You successfully connected to MongoDB!"})
    })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)  
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  app.get('/api/mongo/:content', (request, response) => {
    const content = request.params.content
    const mongoose = require('mongoose')
    const url = "mongodb+srv://emadb:<tesis2024>@cluster0.ylbc2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    
    mongoose.set('strictQuery',false)
    
    mongoose.connect(url)
    
    const noteSchema = new mongoose.Schema({
      content: String,
      important: Boolean,
    })
    
    const Note = mongoose.model('Note', noteSchema)
    
    const note = new Note({
      content: content,
      important: true,
    })
    
    note.save().then(result => {
      console.log('note saved!')
      mongoose.connection.close()
    })

    response.send('<h1>Nota Creada correctamente!</h1>')

  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })