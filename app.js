require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = 3000;

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qj0tyeo.mongodb.net/assignmentdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const tickerSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Ticker = mongoose.model('Ticker', tickerSchema);

app.use(express.static('public'));

app.get('/fetch-data', (req, res) => {
  axios.get('https://api.wazirx.com/api/v2/tickers')
    .then(response => {
      const tickers = response.data;

      const tickerDocuments = Object.keys(tickers).map(key => ({
        name: tickers[key].name,
        last: tickers[key].last,
        buy: tickers[key].buy,
        sell: tickers[key].sell,
        volume: tickers[key].volume,
        base_unit: tickers[key].base_unit,
      })).slice(0, 10);

      Ticker.insertMany(tickerDocuments)
        .then(() => {
          console.log('Data stored in the database');
          res.send('Data stored in the database');
        })
        .catch(error => {
          console.error('Error storing data in the database:', error);
          res.status(500).send('Error storing data in the database');
        });
    })
    .catch(error => {
      console.error('Error fetching data from the API:', error);
      res.status(500).send('Error fetching data from the API');
    });
});

app.get('/ticker-data', (req, res) => {
  Ticker.find().limit(10)
    .then(tickers => {
      res.json(tickers);
    })
    .catch(error => {
      console.error('Error retrieving data from the database:', error);
      res.status(500).send('Error retrieving data from the database');
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
