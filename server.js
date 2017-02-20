const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const app = express()

var db

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())

MongoClient.connect('mongodb://stella:kelapagading@ds153815.mlab.com:53815/starwars-quote', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', (req, res) => {
  // quotes is the db collection name , aka sql table
  db.collection('quotes').find().toArray(function (err, docs) {
    res.render('index.ejs', { quotes: docs })
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

app.put('/quotes', (req, res) => {
  db.collection('quotes')
    .findOneAndUpdate({ name: 'stella' }, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: { _id: -1 },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})


app.delete('/quotes', (req, res) => {
  // Handle delete event here
  db.collection('quotes').findOneAndDelete({ name: req.body.name },
    (err, result) => {
      if (err) return res.send(500, err)
      res.send('A darth vadar quote got deleted')
    })
})


