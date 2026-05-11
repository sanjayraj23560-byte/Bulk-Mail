const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION FIX
========================= */

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected 🚀");

    // START SERVER ONLY AFTER DB CONNECTS
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

const Email = mongoose.model("mngEmails", EmailSchema);

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
   ROUTES
========================= */

app.post("/sending", async (req, res) => {

  try {

    const { email, text, subject } = req.body;

    const newMail = new Email({
      email: email.join(", ")
    });

    await newMail.save();

    const sendPromises = email.map((mail) => {

      return transpoter.sendMail({
        from: process.env.EMAIL_USER,
        to: mail,
        subject,
        text,
      });
    });

    // send response immediately
    res.send(true);

    // continue sending in background
    Promise.all(sendPromises)

      .then(() => {
        console.log("All mails sent");
      })

      .catch((err) => {
        console.log(err);
      });

  } catch (err) {

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
  } catch (err) {
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
  } catch (err) {
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
  } catch (err) {
    console.log(err);
    res.send(false);
  }
});