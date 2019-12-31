const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Static folder
app.use(express.static(path.join(__dirname, "/public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact", { layout: false });
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
    <p>Sent customer copy: ${req.body.sendCopyToClient}></p>
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
  let info = transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "le.cindy77@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  res.render("contact", {
    msg: "Your quote as been requested! Please wait for a driver to contact you"
  });
});

app.listen(3000, () => console.log("Server started..."));
