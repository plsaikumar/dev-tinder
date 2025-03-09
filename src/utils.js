const adminAuth = (req, res, next) => {
  const token = "xyza";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Not Authenticated");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
