const express = require("express");
const bodyParser = require("body-parser");
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
