const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the header
//   console.log(req.headers);
  const token = req.headers.authorization.split(" ")[1];

  // Check if the token is provided
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "No token provided, authorization denied.",
      });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "harshp4114");
    // console.log("decoded",decoded);
    // Attach user info to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({success: false, message: "Token is not valid." });
  }
};

module.exports = authMiddleware;
