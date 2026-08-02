import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/Models/User.js';
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URL || 'mongodb+srv://arpit7s:arpit123@cluster1.qnlldm4.mongodb.net/users?appName=Cluster1'
app.use(cors({
  origin: '*',
})); 
app.use(express.json());
mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/', (req, res) => {    
  res.send('Hello, World!');
});

app.post("/user", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }   
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);   
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});