//server code
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Połączono z bazą danych"));

const app = express();

app.use(express.json()); //automatically convert the body of any request we make to our API server to json format
app.use(cors());

// app.get("/test", async (req: Request, res: Response) => {
//   //when our express server gets a request to /test, it'll return "Hi!"
//   res.json({ message: "Hi!" });
// });

app.get("/health", async (req: Request, res: Response) => {
  //used in docker and kubernetes too
  res.send({ messsage: "health OK!" });
});

app.use("/api/my/user", myUserRoute);

app.listen(7000, () => {
  console.log("Serwer działa na localhost:7000");
});