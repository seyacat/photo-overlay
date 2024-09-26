//express server
import express from "express";

const app = express();
console.log(__dirname);

app.use("/public", express.static(__dirname + "/"));
app.get("/", (req: any, res: any) => {
  res.sendFile(__dirname + "/index.html");
});
app.listen(3000, () => {
  console.log("listening on *:3000");
});
