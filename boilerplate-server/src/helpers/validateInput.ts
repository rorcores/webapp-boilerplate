const Filter = require("bad-words");
const filter = new Filter();

// Remove 'butt' from the filter's list of profane words
filter.removeWords("butt");

// Function to detect profanity, excluding the word 'butt'
const containsProfanity = (text: string) => {
  const profaneWords = filter.list as string[]; // Get the list of profane words
  const lowercasedText = text.toLowerCase(); // Convert input text to lowercase for case-insensitive comparison

  for (const word of profaneWords) {
    if (word === "butt") continue; 
    if (lowercasedText.includes(word)) {
      return true;
    }
  }
  return false;
};

export const validateInputFields = (
  firstName: string,
  lastName: string,
  username: string,
) => {
  const usernameRegex = /^[A-Za-z0-9_-]{2,}$/;  // Allows letters, numbers, underscores, and dashes
  const nameRegex = /^[A-Za-z0-9 _-]{2,}$/;    // Allows letters, numbers, spaces, underscores, and dashes

  let error = "";

  // First Name Validation
  if (!nameRegex.test(firstName)) {
    error =
      "First name can only contain letters, numbers, spaces, underscores, and dashes, and must be at least 2 characters long.";
  } else if (firstName.length > 22) {
    error = "First name cannot exceed 22 characters.";
  } else if (containsProfanity(firstName)) {
    error = "First name contains inappropriate language.";
  }

  // Last Name Validation
  else if (!nameRegex.test(lastName)) {
    error =
      "Last name can only contain letters, numbers, spaces, underscores, and dashes, and must be at least 2 characters long.";
  } else if (lastName.length > 22) {
    error = "Last name cannot exceed 22 characters.";
  } else if (containsProfanity(lastName)) {
    error = "Last name contains inappropriate language.";
  }

  // Username Validation
  else if (!usernameRegex.test(username)) {
    error =
      "Username can only contain letters, numbers, underscores, or dashes, and must be at least 2 characters long.";
  } else if (username.length > 22) {
    error = "Username cannot exceed 22 characters.";
  } else if (containsProfanity(username)) {
    error = "Username contains inappropriate language.";
  }

  return error;
};
