//server code
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Połączono z bazą danych"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());

// app.get("/test", async (req: Request, res: Response) => {
//   //when our express server gets a request to /test, it'll return "Hi!"
//   res.json({ message: "Hi!" });
// });

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json()); //automatically convert the body of any request we make to our API server to json format

app.get("/health", async (req: Request, res: Response) => {
  //used in docker and kubernetes too
  res.send({ messsage: "health OK!" });
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("Serwer działa na localhost:7000");
});
