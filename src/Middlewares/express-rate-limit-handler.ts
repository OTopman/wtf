import expressRateLimit from 'express-rate-limit';

export default expressRateLimit({
  max: 100,
  windowMs: 2 * 60 * 1000,
  handler: function (req, res) {
    res.status(429).json({
      status: 'failed',
      message: 'Too many requests= require(this IP, please try again in two minutes!',
    });
  },
});
