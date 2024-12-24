const User = require('../models/User');
const verifyGoogleToken = require('../utils/googleAuth');
const generateToken = require('../utils/jwt');

// Register or login user using Google ID token
exports.googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the Google ID token
    const payload = await verifyGoogleToken(token);

    // Check if the user exists in the database
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
      await user.save();
    }

    // Generate a JWT token
    const jwtToken = generateToken(user);

    // Send user data and JWT token as response
    res.status(200).json({
      message: 'User authenticated successfully',
      token: jwtToken,
      userId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid Google Token' });
  }
};

