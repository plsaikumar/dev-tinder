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
const validateEditProfile = (req) => {
  const allowedKeys = ["lastName", "age", "about", "skills"];

  const isAllowed = Object.keys(req).every((k) => allowedKeys.includes(k));

  return isAllowed;
};

const validateResetPassword = (req) => {
  const allowedInputs = ["newPassword", "confirmPassword"];

  const isPasswordEditable = Object.keys(req).every((k) =>
    allowedInputs.includes(k)
  );


  if (
    !isPasswordEditable ||
    Object.keys(req).length <= 0 ||
    Object.keys(req).length > 2
  ) {
    throw new Error("Something went wrong!");
  }

  const newPassWord = req.newPassword;
  const confirmPassWord = req.confirmPassword;
  if (newPassWord === confirmPassWord) {
    return newPassWord;
  } else {
    throw new Error("Invalid Passowrd!");
  }
};

module.exports = {
  validateSignUpAPI: validateSignUpAPI,
  validateEditProfile,
  validateResetPassword,
};
