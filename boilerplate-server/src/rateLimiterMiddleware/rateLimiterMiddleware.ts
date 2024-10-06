import rateLimit from "express-rate-limit";

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});

export const signOutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});

export const userCreateRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});

export const updateUserRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});

export const getUserDataRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});

export const checkIfUserExistsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});

export const checkIfUsernameExistsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: JSON.stringify({ error: "Too many requests. Try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(
      `Rate limit exceeded for IP: ${req.ip} on endpoint: ${req.originalUrl}`,
    );
    res.status(429).json({ error: "Too many requests. Try again later." });
  },
});
