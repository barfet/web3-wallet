import zxcvbn from 'zxcvbn';
import validator from 'validator';

export function validatePassword(password: string): boolean {
  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Use validator.js to check for at least one uppercase, one lowercase, one number, and one special character
  if (!validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    return false;
  }

  // Use zxcvbn to check password strength
  const result = zxcvbn(password);
  // Require a minimum score of 3 out of 4
  return result.score >= 3;
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password) return 'weak';
  
  const result = zxcvbn(password);
  
  if (result.score <= 2) return 'weak';
  if (result.score === 3) return 'medium';
  return 'strong';
}