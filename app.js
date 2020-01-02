const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

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

app.get("/location", (req, res) => {
  res.render("location");
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

  var auth = {
    type: "oauth2",
    user: "cottontilt@gmail.com",
    clientId:
      "923110423584-gtju3a9r4u5oo4eujbvq8je22kl51mgp.apps.googleusercontent.com",
    clientSecret: "LMaLniYL76BZeiqRRaSvuF65",
    refreshToken:
      "1//04PO1EoK-uU1kCgYIARAAGAQSNwF-L9IrkjawVn2uN1PrZPpqy14oXCtWdEb4q8tYSZrzww3BB1CyxTRUuE0YCmv2wkKrG02gVj8",
    accessToken:
      "syRPQfW2pzWoAk23oEWROcq3LNtbsruBNKTaB1HYrBjYE7gOJS5VkeDO8YO_C7CAdPrPf1g"
  };

  /*
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "cottontilt@gmail.com",
      pass: "vietnam8"
    }
  });
*/

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: auth,
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"TJs Towing Quotes" <foo@example.com>', // sender address
    to: "le.cindy77@gmail.com", // list of receivers
    subject: "New Quote Request ✔", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("main", {
      msg: "Your request as been sent! Please wait for a driver to contact you"
    });
  });
});

app.listen(port, () => console.log("Server started..."));
