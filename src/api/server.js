const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const activities = require("./activities_api");
const auth = require("./auth");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (request, response) => {
    response.json({info: "Node, Express, Postgres API"})
});


// Activities API
app.get("/activities", activities.getActivities);
app.get("/activities/:id", activities.getActivityById);
app.post("/activities", activities.createActivity);
app.delete("/activities/:id", activities.deleteActivityById);
app.put("/activities/:id", activities.updateActivityById)


// Authentication API

app.post("/auth", auth.authUserEmail);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});