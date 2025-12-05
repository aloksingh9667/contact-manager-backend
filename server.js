const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(cors());

// ----------------------
// 🔗 MONGO CONNECTION
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ----------------------
// 📌 Mongoose Schema + Model
// ----------------------
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    work: String,
    nick: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

// ----------------------
// 📌 ROUTES
// ----------------------

// GET all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST create new contact
app.post("/contacts", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// DELETE a contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ error: "Contact Not Found" });
  }
});

// ----------------------
// 🚀 START SERVER
// ----------------------

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
