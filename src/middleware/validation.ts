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

export const validateMyRestaurantRequest = [
  body("restaurantName")
    .notEmpty()
    .withMessage("Nazwa restauracji jest wymagana"),
  body("city").notEmpty().withMessage("Nazwa miasta jest wymagana"),
  body("country").notEmpty().withMessage("Kraj jest wymagany"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Cena za dowóz jest wymagana"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Czas oczekiwania musi być wartością dodatnią"),
  body("cuisines")
    .isArray()
    .withMessage("Dania muszą być tablicą")
    .not()
    .isEmpty()
    .withMessage("Tabliuca dań nie może być pusta"),
  body("menuItems").isArray().withMessage("Menu musi być tablicą"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("Nazwa pozycji w menu jest wymagana"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage(
      "Cena pozycji w menu jest wymagana i musi być wartością dodatnią"
    ),
  handleValidationErrors,
];
