// Login.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../utils/axiosInstances";
import * as Yup from "yup";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Container from "../components/layout/Container";
import { TbUserSquareRounded } from "react-icons/tb";
import useAuthStore from "../store/useAuthStore";
import useLanguageStore from "../store/useLanguageStore";

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
  const login = useAuthStore((state) => state.login);
  const { t } = useLanguageStore();

  // 3. This function only runs on successful validation
  const onSubmit = async (data) => {
    // Simulate API call
    try {
      const res = await api.post("/auth/login", data);
      const token = res.data.accessToken;

      //TODO Toast
      login(token);
      navigate("/features");
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
                {t("LoginPage.login.title")}
              </h2>
              <p className="text-body text-gray-600">
                {t("LoginPage.login.subtitle")}
              </p>
            </div>

            {/* 4. Use handleSubmit to wrap the submit function */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 5. Use the register function and connect errors */}
              <Input
                type="email"
                name="email"
                label={t("LoginPage.login.form.email_label")}
                placeholder={t("LoginPage.login.form.email_placeholder")}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                type="password"
                name="password"
                label={t("LoginPage.login.form.password_label")}
                placeholder={t("LoginPage.login.form.password_placeholder")}
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
                    {t("LoginPage.login.form.remember_me")}
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {t("LoginPage.login.form.forgot_password")}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("LoginPage.login.form.submitting") : t("LoginPage.login.form.submit")}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {t("LoginPage.login.footer.no_account")} {" "}
                <Link
                  to="/signup"
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  {t("LoginPage.login.footer.signup_link")}
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
