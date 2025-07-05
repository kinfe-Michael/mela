'use server';

import { addUser } from '@/util/dbUtil'; // Adjust path as needed for your addUser function
import { v4 as uuidv4 } from 'uuid'; // For generating a temporary phone number if needed for testing

// Define the initial state for the form, useful for useActionState
const initialState = {
  message: '',
  success: false,
};

// Server Action to handle form submission
export async function signupAction(prevState: typeof initialState, formData: FormData) {
  const username = formData.get('username') as string;
  const passwordPlain = formData.get('password') as string;
  const phoneNumberStr = formData.get('phoneNumber') as string; // Get phone number as string

  // Basic server-side validation
  if (!username || !passwordPlain || !phoneNumberStr) {
    return { success: false, message: 'All fields are required.' };
  }

  // Validate password length
  if (passwordPlain.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long.' };
  }

  // Convert phoneNumber to integer
  const phoneNumber = parseInt(phoneNumberStr, 10);
  if (isNaN(phoneNumber)) {
    return { success: false, message: 'Phone number must be a valid number.' };
  }

  try {
    // Call the addUser function. It expects 'passwordPlain' and handles hashing internally.
    const newUser = await addUser({
      userName: username,
      phoneNumber: phoneNumber,
      passwordPlain: passwordPlain,
    });

    if (newUser) {
      return { success: true, message: `Account created successfully for ${newUser.userName}!` };
    } else {
      return { success: false, message: 'Failed to create account.' };
    }
  } catch (error: any) {
    console.error('Error during signup:', error);
    // Handle specific database errors (e.g., unique constraint violation for username/phone number)
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      if (error.message.includes('users_user_name_unique')) {
        return { success: false, message: 'Username already exists. Please choose a different one.' };
      }
      if (error.message.includes('users_phone_number_unique')) {
        return { success: false, message: 'Phone number already registered. Please use a different one.' };
      }
    }
    return { success: false, message: error.message || 'An unexpected error occurred during signup.' };
  }
}
