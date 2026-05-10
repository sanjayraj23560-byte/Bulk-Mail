const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const EmailSchema = new mongoose.Schema({
  email: String,
}, { timestamps: true });

const Email = mongoose.model(
  "mngEmails",
  EmailSchema
);

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

    await Promise.all(sendPromises);

    res.send(true);

  } catch (err) {

    console.log(err);

    res.send(false);
  }
});

app.get("/history", async (req, res) => {

  try {

    const data = await Email.find();

    res.send(data);

  } catch (err) {

    res.send(err);
  }
});

app.delete("/history/:id", async (req, res) => {

  try {

    await Email.findByIdAndDelete(req.params.id);

    res.send(true);

  } catch (err) {

    console.log(err);

    res.send(false);
  }
});

app.delete("/history", async (req, res) => {

  try {

    await Email.deleteMany({});

    res.send(true);

  } catch (err) {

    console.log(err);

    res.send(false);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});