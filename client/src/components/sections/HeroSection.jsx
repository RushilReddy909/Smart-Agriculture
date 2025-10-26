import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../layout/Container";
import PlatformStats from "../ui/PlatformStats";
import useLanguageStore from "../../store/useLanguageStore";

const HeroSection = () => {
  const { t } = useLanguageStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="heading-primary text-gray-900 mb-6">
            {t("hero.heading.p1")}{" "}
            <span className="text-gradient">{t("hero.heading.p2")}</span>
            <span className="text-4xl ml-2">🌾</span>
          </h1>

          {/* Subtitle */}
          <p className="text-body-large max-w-3xl mx-auto mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              t("hero.feature.management"),
              t("hero.feature.weather"),
              t("hero.feature.pest"),
              t("hero.feature.analytics"),
            ].map((feature, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200"
              >
                {feature}
              </div>
            ))}
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="min-w-[200px] shadow-lg hover:shadow-xl"
              >
                {t("hero.buttons.start")}
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                {t("hero.buttons.login")}
              </Button>
            </Link>
          </div>

          {/* Platform Capabilities */}
          <PlatformStats />
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
