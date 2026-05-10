const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/email")
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Failed to connect"))

// Replace your schema and model with this (adds timestamps)
const EmailSchema = new mongoose.Schema({
  email: String,
}, { timestamps: true })

const Email = mongoose.model("mngEmails", EmailSchema)

Email.find().then((data) => {
  console.log(data[0])
}).catch((err) => {
  console.log(err)
})

// DELETE single record
app.delete("/history/:id", async (req, res) => {
  try {
    await Email.findByIdAndDelete(req.params.id)
    res.send(true)
  } catch (err) {
    console.log(err)
    res.send(false)
  }
})

// DELETE all records
app.delete("/history", async (req, res) => {
  try {
    await Email.deleteMany({})
    res.send(true)
  } catch (err) {
    console.log(err)
    res.send(false)
  }
})

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})


app.post("/sending", async (req, res) => {

  try {

    const { email, text, subject } = req.body

    // save emails in db
    const newMail = new EmailModel({
      email: email.join(", ")
    })

    await newMail.save()

    // send mails
    const sendPromises = email.map((mail) => {
      return transpoter.sendMail({
        from: "sanjayraj23560@gmail.com",
        to: mail,
        subject,
        text,
      })
    })

    await Promise.all(sendPromises)

    res.send(true)

  } catch (err) {

    console.log(err)

    res.send(false)
  }
})

app.get("/history", (req, res) => {
  Email.find().then((data) => {
    res.send(data)
  }).catch((err) => {
    res.send(err)
  })
})



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})