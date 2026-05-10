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
  service: "gmail",
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

    // save to DB
    const newMail = new Email({
      email: email.join(", ")
    });

    await newMail.save();

    // send emails
    const sendPromises = email.map((mail) => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: mail,
        subject,
        text,
      });
    });

    await Promise.all(sendPromises);

    res.send(true);

  } catch (err) {
    console.log("Send error:", err);
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