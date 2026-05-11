const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URL)

  .then(() => {

    console.log("MongoDB Connected 🚀");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  })

  .catch((err) => {
    console.log("MongoDB connection error ❌", err);
  });

/* =========================
   SCHEMA
========================= */

const EmailSchema = new mongoose.Schema({

  email: String,

}, { timestamps: true });

const Email = mongoose.model(
  "mngEmails",
  EmailSchema
);

/* =========================
   NODEMAILER
========================= */

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS

  }

});

/* =========================
   SEND MAIL
========================= */

app.post("/sending", async (req, res) => {

  try {

    const { email, text, subject } = req.body;

    // validation
    if (!Array.isArray(email) || email.length === 0) {

      return res.send(false);

    }

    // save emails to database
    const newMail = new Email({

      email: email.join(", ")

    });

    await newMail.save();

    // send response immediately
    res.send(true);

    // send mails in background
    const sendPromises = email.map((mail) => {

      return transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: mail,

        subject,

        text,

      });

    });

    Promise.all(sendPromises)

      .then(() => {

        console.log("All mails sent ✅");

      })

      .catch((err) => {

        console.log("Mail sending error ❌", err);

      });

  }

  catch (err) {

    console.log(err);

    res.send(false);

  }

});

/* =========================
   HISTORY
========================= */

app.get("/history", async (req, res) => {

  try {

    const data = await Email.find();

    res.send(data);

  }

  catch (err) {

    console.log(err);

    res.send(err);

  }

});

/* =========================
   DELETE ONE
========================= */

app.delete("/history/:id", async (req, res) => {

  try {

    await Email.findByIdAndDelete(req.params.id);

    res.send(true);

  }

  catch (err) {

    console.log(err);

    res.send(false);

  }

});

/* =========================
   DELETE ALL
========================= */

app.delete("/history", async (req, res) => {

  try {

    await Email.deleteMany({});

    res.send(true);

  }

  catch (err) {

    console.log(err);

    res.send(false);

  }

});