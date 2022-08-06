const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const db = require('./queries');
const cors = require('cors');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get('/', (request, response) => {
    response.json({info: 'Node, Express, Postgres API'})
});

app.get('/activities', db.getActivities);
app.get('/activities/:id', db.getActivityById);
app.post('/activities', db.createActivity);
app.delete('/activities/:id', db.deleteActivityById);
app.put('/activities/:id', db.updateActivityById)

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});