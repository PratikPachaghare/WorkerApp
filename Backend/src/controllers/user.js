// userController
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      location
    });
    await newUser.save();

    res.status(201).json({
        newUser,
        message: 'User registered successfully' 
    });
  } catch (err) {
    res.status(500).json({ message:"error in registerUser : ",err});
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials, Password not match' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
export const getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
export const getUserById = async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await User.findById({userId}).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


