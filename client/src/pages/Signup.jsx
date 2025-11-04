// Signup.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Container from "../components/layout/Container";
import { TbUserSquareRounded } from "react-icons/tb";
import { api } from "../utils/axiosInstances";
import useLanguageStore from "../store/useLanguageStore";

// 1. Define the validation schema with Yup
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  cnfpass: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

function Signup() {
  // 2. Initialize useForm with the Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched", // Validate fields when the user clicks out of them
  });

  const navigate = useNavigate();
  const { t } = useLanguageStore();

  // 3. This function only runs on successful validation
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);

      //TODO toast
      navigate("/login");
    } catch (err) {
      //TODO toast
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
                {t("SignupPage.signup.title")}
              </h2>
              <p className="text-body text-gray-600">
                {t("SignupPage.signup.subtitle")}
              </p>
            </div>

            {/* 4. Use handleSubmit to wrap the submit function */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 5. Use the register function and connect errors */}
              <Input
                type="text"
                name="username"
                label={t("SignupPage.signup.form.full_name_label")}
                placeholder={t("SignupPage.signup.form.full_name_placeholder")}
                autoComplete="username"
                error={errors.username?.message}
                {...register("username")}
              />

              <Input
                type="email"
                name="email"
                label={t("SignupPage.signup.form.email_label")}
                placeholder={t("SignupPage.signup.form.email_placeholder")}
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                type="password"
                name="password"
                label={t("SignupPage.signup.form.password_label")}
                placeholder={t("SignupPage.signup.form.password_placeholder")}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                type="password"
                name="cnfpass"
                label={t("SignupPage.signup.form.confirm_password_label")}
                placeholder={t("SignupPage.signup.form.confirm_password_placeholder")}
                error={errors.cnfpass?.message}
                {...register("cnfpass")}
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-1"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  {t("SignupPage.signup.form.terms")} {" "}
                  <Link
                    to="/terms"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {t("SignupPage.signup.form.terms_link")}
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("SignupPage.signup.form.submitting") : t("SignupPage.signup.form.submit")}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {t("SignupPage.signup.footer.has_account")} {" "}
                <Link
                  to="/login"
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  {t("SignupPage.signup.footer.login_link")}
                </Link>
              </p>
            </div>

            {/* Social signup options remain the same */}
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Signup;
