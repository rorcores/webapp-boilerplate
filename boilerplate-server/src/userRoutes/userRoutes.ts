import dotenv from "dotenv";
dotenv.config();

import { Request, Response, Router } from "express";
import { createClient } from "@supabase/supabase-js";
import {
  authenticate,
  AuthenticatedRequest,
} from "../authMiddleware/authMiddleware";
import {
  otpRateLimiter,
  userCreateRateLimiter,
  signOutRateLimiter,
  checkIfUsernameExistsRateLimiter,
  checkIfUserExistsRateLimiter,
  getUserDataRateLimiter,
  updateUserRateLimiter,
} from "../rateLimiterMiddleware/rateLimiterMiddleware";
import { verify } from "jsonwebtoken";
import { validateInputFields } from "../helpers/validateInput";
import { trackUmamiEvent } from "../analytics/trackUmamiEvents";

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

router.post(
  "/v1/log-user-in-via-otp-link",
  otpRateLimiter,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      console.log("Email not provided in request.");
      return res.status(400).json({ error: "Email is required" });
    }

    if (email.length > 60) {
      console.log("Email exceeds the allowed length of 60 characters.");
      return res
        .status(400)
        .json({ error: "Email cannot exceed 60 characters" });
    }

    try {
      // Call Supabase to send the OTP email
      // console.log(`Sending OTP to email: ${email}`);
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        console.error("Error sending OTP via Supabase:", error);
        return res.status(500).json({ error: "Error sending OTP" });
      }

      await trackUmamiEvent("OTP Login", { email });

      // console.log(`OTP sent successfully to ${email}`);
      return res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("Unexpected error occurred while sending OTP:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  },
);

router.post(
  "/v1/log-sign-out-event",
  signOutRateLimiter,
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const { accessToken } = req.body;
    const email = req.email; // Extract email from the authenticated request

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email not found in the request" });
    }

    try {
      // Log the sign-out event
      await trackUmamiEvent("User Sign-Out", { email });

      // Acknowledge the request
      return res.status(200).json({ message: "Sign-out logged successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  },
);

router.post(
  "/v1/create-new-user",
  userCreateRateLimiter,
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const { firstName, lastName, username } = req.body;
    const userId = req.userId; // Use the user's UUID from the JWT
    const email = req.email; // Get email from authenticated user

    if (!userId || !email) {
      return res.status(400).json({ error: "User ID or email is missing" });
    }

    // Use the imported validation logic
    const validationError = validateInputFields(firstName, lastName, username);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const { error } = await supabase.from("users").insert({
        supabase_user_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        username,
      });

      if (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Error adding user" });
      }

      await trackUmamiEvent("New User Created", {
        email,
        username,
        firstName,
        lastName,
      });

      res.json({ message: "User added successfully" });
    } catch (err) {
      console.error("Unexpected error occurred:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  },
);

router.post(
  "/v1/update-users-profile-information",
  updateUserRateLimiter,
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const { email, firstName, lastName, username } = req.body;
    const email_from_req = req.email;

    if (email !== email_from_req) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this user" });
    }

    // Use the imported validation logic
    const validationError = validateInputFields(firstName, lastName, username);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      return res
        .status(500)
        .json({ message: "Server configuration error: missing JWT secret" });
    }

    try {
      const decoded: any = verify(token, jwtSecret);
      const supabase_user_id = decoded.sub;

      if (supabase_user_id !== req.userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this user" });
      }

      const { error } = await supabase.from("users").upsert(
        {
          supabase_user_id: supabase_user_id,
          first_name: firstName,
          last_name: lastName,
          username,
        },
        {
          onConflict: "supabase_user_id",
        },
      );

      if (error) {
        console.error("Error updating user information:", error);
        return res
          .status(500)
          .json({ error: "Error updating user information" });
      }

      await trackUmamiEvent("User Profile Updated", {
        email,
        username,
        firstName,
        lastName,
      });

      res.json({ message: "User information updated successfully" });
    } catch (err) {
      console.error("Unexpected error occurred:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  },
);

// Fetch user data (Authenticated)
router.get(
  "/v1/get-users-profile-information",
  getUserDataRateLimiter,
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      return res
        .status(500)
        .json({ message: "Server configuration error: missing JWT secret" });
    }

    try {
      // Decode the token to get the Supabase UID (supabase_user_id)
      const decoded: any = verify(token, jwtSecret);
      const supabase_user_id = decoded.sub; // Extracting the user ID from the token

      const userId = req.userId;

      // Ensure the user is fetching their own data by comparing the token UID with the request body UID
      if (supabase_user_id !== userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to access this user data" });
      }

      // console.log("Fetching user data from Supabase...");
      // console.log("Querying with supabase_user_id:", userId);

      const { data: user, error } = await supabase
        .from("users")
        .select("first_name, last_name, username, credits")
        .eq("supabase_user_id", userId)
        .maybeSingle();

      if (error) {
        // console.error("Error fetching user data from Supabase:", error);
        return res.status(500).json({ error: "Error fetching user data" });
      }

      if (!user) {
        console.error("No user found with the provided UUID");
        return res.status(404).json({ error: "User not found" });
      }

      // console.log("User data fetched successfully:", user);

      res.json(user);
    } catch (err) {
      console.error("Unexpected error occurred:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  },
);

router.get(
  "/v1/check-if-user-exists",
  checkIfUserExistsRateLimiter,
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    // Extract the email of the authenticated user from the request
    const email = req.email; // Using req.email, set by authenticate middleware

    if (!email) {
      console.error("No authenticated email found in the request");
      return res.status(400).json({ error: "Authenticated email is required" });
    }

    // console.log('Authenticated email, proceeding with database check...');

    try {
      // Query the database to see if a user exists with the given email
      const { data: user, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .maybeSingle(); // maybeSingle() returns null if no record is found

      if (error) {
        console.error("Error occurred while checking user in database:", error);
        return res.status(500).json({ error: "Error checking user" });
      }

      // Return a boolean indicating if the user exists
      res.json({ exists: !!user });
    } catch (err) {
      console.error("Unexpected error occurred:", err);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  },
);

// Check if username exists (Authenticated)
router.post(
  "/v1/check-if-username-exists",
  checkIfUsernameExistsRateLimiter,
  authenticate,
  async (req: Request, res: Response) => {
    const { username, email } = req.body;

    try {
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("username, email")
        .eq("username", username)
        .single();

      // Handle database errors (but not a "no row" error)
      if (error && error.code !== "PGRST116") {
        console.error("Error checking username in database:", error);
        return res.status(500).json({ error: "Error checking username" });
      }

      // Check if the username already exists and if it belongs to the current user
      if (existingUser) {
        if (existingUser.email === email) {
          // Allow if the username belongs to the user making the request
          return res.json({
            message: "Username is yours, proceed with update",
          });
        } else {
          return res.json({ error: "Username taken" });
        }
      } else {
        return res.json({ message: "Username available" });
      }
    } catch (err) {
      // Catch any unexpected errors and log them
      console.error("Unexpected error in check-if-username-exists:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
