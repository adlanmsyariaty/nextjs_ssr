if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Controller = require("./controllers/controller");
const errorHandlers = require("./middlewares/errorHandlers");
const authentication = require("./middlewares/authentication");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", Controller.register);
app.post("/login", Controller.login);

app.post("/otp/send", Controller.sendOtp);
app.post("/otp/verify", Controller.verifyOtp);

app.get("/posts", Controller.getAllPost);
app.use(authentication);
app.post("/posts", Controller.createPost);
app.delete("/posts/:id", Controller.deletePost);
app.put("/posts/:id", Controller.updatePost);
app.post("/posts/presigned-url", Controller.createUploadPresignedUrl);

app.use(errorHandlers);

app.listen(port, () => {
  console.log(`This app listening on port ${port}`);
});
