const express = require("express");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

// Create a simple test server to debug the validation
const app = express();

app.use(cors());
app.use(express.json());

// Copy the exact validation rules from your middleware
const validateRegister = [
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

app.post("/test-validation", validateRegister, (req, res) => {
  const errors = validationResult(req);

  console.log("Received data:", req.body);
  console.log("Validation errors:", errors.array());

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        value: error.value,
        message: error.msg,
      })),
    });
  }

  res.json({
    success: true,
    message: "Validation passed!",
    data: req.body,
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
  console.log(
    'Test with: curl -X POST http://localhost:5001/test-validation -H "Content-Type: application/json" -d \'{"firstName":"bolro","lastName":"bolro","email":"bolro@bolro.com","password":"Test123","confirmPassword":"Test123"}\''
  );
});
