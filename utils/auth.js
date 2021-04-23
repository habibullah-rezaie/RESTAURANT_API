const jwt = require("jsonwebtoken");
const { throwError } = require("./error");

exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throwError("Athentication required.", 401);
  }

  const accessToken = authHeader.split(" ")[1];

  if (!accessToken) throwError("No access token provided", 401);

  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.error(err);
        throwError("Somthing went wrong when decoding token.", 401);
      }
      if (!decoded) {
        throwError("Invalid token.", 401);
      }

      req.admin = decoded.admin.email;
      next();
    }
  );
};
