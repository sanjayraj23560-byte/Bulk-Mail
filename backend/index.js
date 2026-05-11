const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Resend } = require('resend');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   RESEND CONFIG
========================= */

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URL)

  .then(() => {

    console.log("MongoDB Connected 🚀");

    app.listen(port, () => {

      console.log(`Server running on port ${port}`);

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
   SEND MAIL
========================= */

app.post("/sending", async (req, res) => {

  try {

    const { email, text, subject } = req.body;

    /* VALIDATION */

    if (!Array.isArray(email) || email.length === 0) {

      return res.send(false);

    }

    /* SAVE EMAILS TO DATABASE */

    const newMail = new Email({

      email: email.join(", ")

    });

    await newMail.save();

    /* FAST RESPONSE */

    res.send(true);

    /* SEND MAILS IN BACKGROUND */

    for (const mail of email) {

      try {

        const data = await resend.emails.send({

          from: "onboarding@resend.dev",

          to: mail,

          subject: subject,

          text: text

        });

        console.log(`Mail Sent ✅ ${mail}`);

        console.log(data);

      }

      catch (err) {

        console.log(`Mail Failed ❌ ${mail}`);

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