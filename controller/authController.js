const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const users = require('../model/userDatabase')
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;


    const user = users.find((u) => u.username === username);
    if (user) {
      return res.status(400).json({ message: "Invalid username" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, role };
    users.push(newUser);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (e) {
    console.log(e.message);
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid  password" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;

    res.json({ message: "Logged in successfully", token, refreshToken });
  } catch (e) {
    console.log(e.message);
  }
}
exports.token = (req, res) => {
  const { refreshToken } = req.body;
  const user = users.find((u) => u.refreshToken === refreshToken);
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.json({ message: "New access token generated", token });
}


exports.logout = (req, res) => {
  const { refreshToken } = req.body;
  const user = users.find((u) => u.refreshToken === refreshToken);
  if (!user) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }
  user.refreshToken = null;
  res.json({ message: "User logged out successfully" });
}




