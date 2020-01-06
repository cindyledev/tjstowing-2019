const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Instafeed = require("instafeed.js");

const app = express();

const port = process.env.PORT || 8080;

// View engine setup
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: ""
  })
);
app.set("view engine", "handlebars");

// Static folder
app.use(express.static(path.join(__dirname, "/public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.multipart());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.render("main", { layout: false });
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.post("/send", (req, res) => {
  console.log(req.body);

  const output = `
    <p>You have a new quote request</p>
    <h4>Customer Details</h4>
    <ul>
      <li>Name: ${req.body.contactName}</li>
      <li>Email: ${req.body.contactEmail}</li>
      <li>Phone number: ${req.body.contactPhone}</li>
    </ul>
    <h4>Service(s) Needed</h4>
    <ul>
      <li>Urgency: ${req.body.urgency}</li>
      <li>Type of Service: ${req.body.typeOfService}</li>
    </ul>
    <h4>Vehicle Information</h4>
    <ul>
      <li>Vehicle Type: ${req.body.vehicleType}</li>
      <li>Wheel Type: ${req.body.wheelType}</li>
      <li>Year: ${req.body.vehicleYear}</li>
      <li>Make: ${req.body.vehicleMake}</li>
      <li>Model: ${req.body.vehicleModel}</li>
      <li>Location: ${req.body.vehicleLocation}</li>
      <li>Destination: ${req.body.vehicleDestination}</li>
    </ul>
    <p>Comments: ${req.body.comments}</p>
    <p>Sent customer copy: ${req.body.sendCopyToClient}</p>
  `;

  const oauth2Client = new google.auth.OAuth2(
    "923110423584-gtju3a9r4u5oo4eujbvq8je22kl51mgp.apps.googleusercontent.com", // ClientID
    "LMaLniYL76BZeiqRRaSvuF65", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token:
      "1//04pCkNRBR8HoQCgYIARAAGAQSNwF-L9IrRA1HS45q3HVLtUgbuNtELGFRQPQk22qW1oauSqWWZ2-kKbvR2e2ssiq-9sMDDUKkrTI"
  });

  const accessToken = oauth2Client.getAccessToken();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "cottontilt@gmail.com",
      clientId:
        "923110423584-gtju3a9r4u5oo4eujbvq8je22kl51mgp.apps.googleusercontent.com",
      clientSecret: "LMaLniYL76BZeiqRRaSvuF65",
      refreshToken:
        "1//04pCkNRBR8HoQCgYIARAAGAQSNwF-L9IrRA1HS45q3HVLtUgbuNtELGFRQPQk22qW1oauSqWWZ2-kKbvR2e2ssiq-9sMDDUKkrTI",
      accessToken:
        "ya29.Il-4B0S0Em7NQrqXyRWGAhiUeut-eMffgtledk1SdId4W_TH2PCPC7ghtMwP0iwjKBwgSjFpMonwhhO3D-w4ow3rAcOnnIIUmh2_7lJZEB1sB3cECQ4a1-MMG1r83tVlOQ",
      expires: 1484314697598
    }
  });

  /*
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: auth
  });
  */

  // send mail with defined transport object
  let mailOptions = {
    from: '"TJs Towing Quotes" <foo@example.com>', // sender address
    to: "le.cindy77@gmail.com", // list of receivers
    subject: "New Quote Request ✔", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  transporter.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    transporter.close();
  });
});

// Use the CDN or host the script yourself
// https://cdnjs.cloudflare.com/ajax/libs/instafeed.js/1.4.1/instafeed.min.js
// https://matthewelsom.com/assets/js/libs/instafeed.min.js

var userFeed = new Instafeed({
  get: "user",
  userId: "8987997106",
  clientId: "924f677fa3854436947ab4372ffa688d",
  accessToken: "8987997106.924f677.8555ecbd52584f41b9b22ec1a16dafb9",
  resolution: "standard_resolution",
  template:
    '<a href="{{link}}" target="_blank" id="{{id}}"><img src="{{image}}" /></a>',
  sortBy: "most-recent",
  limit: 4,
  links: false
});
userFeed.run();

app.listen(port, () => console.log("Server started..."));
