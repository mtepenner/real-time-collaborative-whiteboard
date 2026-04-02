import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    
    // In a real app, generate a JWT here
    res.status(201).json({ 
      user: { id: user._id, name: user.name, email: user.email },
      token: "mock_token_for_now" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ 
      user: { id: user._id, name: user.name, email: user.email },
      token: "mock_token_for_now" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
