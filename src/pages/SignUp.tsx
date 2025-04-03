import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { validatePassword, validateEmail } from '../utils/validation';

export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError.message;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError.message;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (error) throw error;
      
      navigate('/signin', {
        state: {
          message: 'Please check your email to confirm your account',
        },
      });
    } catch (err: any) {
      setErrors({
        form: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account? Sign in instead"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{errors.form}</p>
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </div>

        <div className="text-sm text-gray-600">
          <p>Password must:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Be at least 6 characters long</li>
            <li>Contain at least one uppercase letter</li>
            <li>Contain at least one lowercase letter</li>
            <li>Contain at least one number</li>
          </ul>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}