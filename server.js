const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
var session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var passport = require("passport");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/ieat");

// Express Session
app.use(
  session({
    secret: "secret",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: true,
    resave: true
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

const apiRoutes = require("./routes/apiRoutes");
app.use(apiRoutes);

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/ieat");

// app.get("*", (request, response) => {
//   response.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/public/index.html"), function (
    err
  ) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, function () {
  console.log("App is listening on port http://localhost:" + PORT);
});
