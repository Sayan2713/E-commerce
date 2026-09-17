const { body, validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

const addressBodyRules = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Enter a valid full name'),
  body('phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit phone number'),
  body('line1').trim().isLength({ min: 3, max: 200 }).withMessage('Enter a valid address'),
  body('line2').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('landmark').optional({ checkFalsy: true }).trim().isLength({ max: 150 }),
  body('postOffice').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('city').trim().isLength({ min: 2, max: 100 }).withMessage('Enter a valid city'),
  body('state').trim().isLength({ min: 2, max: 100 }).withMessage('Enter a valid state'),
  body('pincode').trim().matches(/^\d{6}$/).withMessage('Enter a valid 6-digit PIN code'),
];

const orderItemsRules = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isMongoId().withMessage('Invalid product'),
  body('items.*.size').trim().notEmpty().withMessage('Size is required'),
  body('items.*.quantity').optional().isInt({ min: 1, max: 10 }).withMessage('Invalid quantity'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit phone number'),
  body('shippingAddress.pincode').trim().matches(/^\d{6}$/).withMessage('Enter a valid 6-digit PIN code'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('couponCode').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
];

module.exports = { handleValidation, addressBodyRules, orderItemsRules };
