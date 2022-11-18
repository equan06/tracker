import express from "express";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
import { getActivities, getActivityById, createActivity, deleteActivityById, updateActivityById } from "./activities_api";
import { authUser } from "./auth";
import cors from "cors";

const port = 5000;
const CLIENT = "http://localhost:3000";

const app = express();
app.use(json());
app.use(
    urlencoded({
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
app.get("/activities", getActivities);
app.get("/activities/:id", getActivityById);
app.post("/activities", createActivity);
app.delete("/activities/:id", deleteActivityById);
app.put("/activities/:id", updateActivityById)


// Authentication API
app.post("/auth", authUser);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});