import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Podaj imię"),
  body("addressLine1").isString().notEmpty().withMessage("Podaj adres"),
  body("city").isString().notEmpty().withMessage("Podaj miasto"),
  body("country").isString().notEmpty().withMessage("Podaj kraj"),
  handleValidationErrors,
];
