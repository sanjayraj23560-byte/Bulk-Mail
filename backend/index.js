const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();

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

    console.log("MongoDB Connection Error ❌");

    console.log(err);

  });

/* =========================
   SCHEMA
========================= */

const EmailSchema = new mongoose.Schema({

  email: String

}, { timestamps: true });

const Email = mongoose.model(
  "mngEmails",
  EmailSchema
);

/* =========================
   NODEMAILER
========================= */

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS

  },

  tls: {
    rejectUnauthorized: false
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000

});

/* =========================
   VERIFY SMTP
========================= */

transporter.verify(function (error, success) {

  if (error) {

    console.log("SMTP Error ❌");

    console.log(error);

  }

  else {

    console.log("SMTP Server Ready ✅");

  }

});

/* =========================
   SEND MAIL
========================= */

app.post("/sending", async (req, res) => {

  try {

    const { email, text, subject } = req.body;

    /* VALIDATION */

    if (!Array.isArray(email) || email.length === 0) {

      return res.send(false);

    }

    /* SAVE TO DATABASE */

    const newMail = new Email({

      email: email.join(", ")

    });

    await newMail.save();

    /* SEND RESPONSE FAST */

    res.send(true);

    /* SEND EMAILS IN BACKGROUND */

    for (const mail of email) {

      try {

        const info = await transporter.sendMail({

          from: process.env.EMAIL_USER,

          to: mail,

          subject,

          text

        });

        console.log(`Mail Sent To ✅ ${mail}`);

        console.log(info.response);

      }

      catch (err) {

        console.log(`Failed Sending ❌ ${mail}`);

        console.log(err);

      }

    }

  }

  catch (err) {

    console.log("Route Error ❌");

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