// node src/app.js
// nodemon src/app.js
// nodemon src/app.js -e js,hbs
const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Dat Nguyen"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Dat Nguyen"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Dat Nguyen",
    helpText: "This is the help page"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "please type an address"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData, extraData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          extraData,
          location: location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Dat Nguyen",
    errorMessage: "Help article not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Dat Nguyen",
    errorMessage: "Page not found"
  });
});

app.listen(port, () => {
  console.log("server is up on port 3000");
});
