import { Filter } from 'bad-words'

const filter = new Filter()


filter.removeWords('butt')

const containsProfanity = (text: string) => {
  const profaneWords = filter.list
  const lowerText = text.toLowerCase()

  for (const word of profaneWords) {
    if (lowerText.includes(word)) {
      return true
    }
  }
  return false
}

export const validateInputFields = (
  firstName: string,
  lastName: string,
  username: string,
) => {
  const usernameRegex = /^[A-Za-z0-9_-]{2,}$/
  const nameRegex = /^[A-Za-z0-9 _-]{2,}$/
  let error = ''

  if (!nameRegex.test(firstName)) {
    error = 'First name must be at least 2 characters long.'
  } else if (firstName.length > 22) {
    error = 'First name cannot exceed 22 characters.'
  } else if (containsProfanity(firstName)) {
    error = 'First name contains inappropriate language.'
  } else if (!nameRegex.test(lastName)) {
    error = 'Last name must be at least 2 characters long.'
  } else if (lastName.length > 22) {
    error = 'Last name cannot exceed 22 characters.'
  } else if (containsProfanity(lastName)) {
    error = 'Last name contains inappropriate language.'
  } else if (!usernameRegex.test(username)) {
    error = 'Username must be at least 2 characters long.'
  } else if (username.length > 22) {
    error = 'Username cannot exceed 22 characters.'
  } else if (containsProfanity(username)) {
    error = 'Username contains inappropriate language.'
  }

  return error
}
