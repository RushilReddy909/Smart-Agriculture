// Login.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../utils/api";
import * as Yup from "yup";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Container from "../components/layout/Container";
import { TbUserSquareRounded } from "react-icons/tb";

// 1. Define the validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  // 2. Initialize useForm with the Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  // 3. This function only runs on successful validation
  const onSubmit = async (data) => {
    // Simulate API call
    try {
      const res = await api.post("/auth/login", data);
      
      const token = res.data.accessToken;
      localStorage.setItem("token", token);

      //TODO Toast
      navigate("/");
    } catch (err) {
      //TODO Toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12">
      <Container size="sm">
        <div className="animate-fade-in">
          <Card className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <TbUserSquareRounded className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="heading-secondary text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-body text-gray-600">
                Sign in to your Smart Agriculture account
              </p>
            </div>

            {/* 4. Use handleSubmit to wrap the submit function */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 5. Use the register function and connect errors */}
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Social login options remain the same */}
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Login;
