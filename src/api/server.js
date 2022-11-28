import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import * as activities from "./activities_api.js";
import * as auth from "./auth.js";
import cors from "cors";
import bodyParser from "body-parser";

const port = 5000;
const CLIENT = "http://localhost:3000";

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors({
    origin: CLIENT,
    credentials: true // necessary for specifying credentials: 'include' for setting cookies
}));

app.use(cookieParser());

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
app.post("/auth", auth.authUser);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});