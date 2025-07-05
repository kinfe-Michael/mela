"use client";
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { AiOutlineGoogle, AiOutlineLock, AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePhone } from 'react-icons/ai'; // Removed AiOutlineMail

import { signupAction } from './signUpAction'; // Import the server action

const initialState = {
  message: '',
  success: false,
};

interface SignupFormInputs extends FieldValues {
  username: string;
  phoneNumber: string;
  password: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="w-full bg-[#FF3B30] hover:bg-[#ff3a30d8] text-white font-semibold py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing Up...' : 'Sign Up'}
    </Button>
  );
}

export default function App() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
    defaultValues: {
      username: '',
      phoneNumber: '',
      password: '',
    },
  });

  const handleGoogleSignup = () => {
    console.log('Signing up with Google...');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <div className="min-h-screen mt-16 bg- flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-sm bg-gray-100 rounded-xl shadow-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold ">Create an Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join us today! Enter your details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-600">Username</Label>
              <div className="relative">
                <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <Controller<SignupFormInputs>
                  name="username"
                  control={control}
                  rules={{ required: 'Username is required' }}
                  render={({ field }) => (
                    <Input
                      id="username"
                      placeholder="Abebe"
                      type="text"
                      className="pl-10 bg-gray-100 border-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-600">Phone Number</Label>
              <div className="relative">
                <AiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <Controller<SignupFormInputs>
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\d+$/, 
                      message: 'Phone number must contain only digits'
                    },
                    minLength: { value: 10, message: 'Phone number must be at least 10 digits' } // Example min length
                  }}
                  render={({ field }) => (
                    <Input
                      id="phoneNumber"
                      placeholder="e.g., 251912345678"
                      type="tel"
                      className="pl-10 bg-gray-100 border-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-600">Password</Label>
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <Controller<SignupFormInputs>
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }}
                  render={({ field }) => (
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10 bg-gray-100 border-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-lg" />
                  ) : (
                    <AiOutlineEye className="text-lg" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <SubmitButton />
          </form>

          {state.message && (
            <p
              className={`text-center text-sm mt-4 p-2 rounded-md ${
                state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {state.message}
            </p>
          )}

          <div className="relative flex items-center justify-center my-6">
            <div className="relative z-10 px-4 text-gray-800 text-sm">
              OR
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 border-gray-300 hover:bg-gray-700 font-bold py-2 rounded-md transition-colors duration-200"
            onClick={handleGoogleSignup}
          >
            <AiOutlineGoogle className="text-lg" />
            Sign Up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-400">
          Already have an account? <a href="#" className="ml-1 text-blue-500 hover:underline">Log In</a>
        </CardFooter>
      </Card>
    </div>
  );
}
