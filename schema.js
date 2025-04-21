const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    url: Joi.string().allow("", null),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),
  }).required(),
});

module.exports.reviewsSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});


