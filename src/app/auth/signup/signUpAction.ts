'use server';

import { addUser } from '@/util/dbUtil';



export async function signupAction(prevState: { message: string,
  success: boolean,}, formData: FormData) {
  const username = formData.get('username') as string;
  const passwordPlain = formData.get('password') as string;
  const phoneNumberStr = formData.get('phoneNumber') as string;

  if (!username || !passwordPlain || !phoneNumberStr) {
    return { success: false, message: 'All fields are required.' };
  }

  if (passwordPlain.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long.' };
  }

  const phoneNumber = parseInt(phoneNumberStr, 10);
  if (isNaN(phoneNumber)) {
    return { success: false, message: 'Phone number must be a valid number.' };
  }

  try {
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
