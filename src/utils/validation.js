const validator = require("validator");

const validateSignUpAPI = (req) => {
  const { firstName, lastName, password, emailId } = req;

  if (!firstName) {
    throw new Error("First Name is Required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid user Email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

module.exports = {
  validateSignUpAPI: validateSignUpAPI,
};
