import React, { useState, useRef } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import useLanguageStore from "../store/useLanguageStore";
import { api } from "../utils/axiosInstances";
import { TbMicroscope, TbPhoto, TbX } from "react-icons/tb";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const DIAGNOSIS_ENDPOINT = "/pest/identify";

// Helper function: convert file → Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Validation
const validationSchema = Yup.object().shape({
  cropImage: Yup.mixed()
    .required("A crop image is required for diagnosis.")
    .test(
      "fileSize",
      "File size is too large (max 5MB)",
      (value) => value && value.size <= 5242880
    )
    .test(
      "fileType",
      "Unsupported File Format (.jpg or .png only)",
      (value) => value && ["image/jpeg", "image/png"].includes(value.type)
    ),
});

const PestDiagnosis = () => {
  const { t } = useLanguageStore();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [rawResponse, setRawResponse] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const fileInputRef = useRef(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setDiagnosisResult(null);
    setApiError("");
    setLoading(true);

    try {
      const base64Image = await fileToBase64(data.cropImage);
      const payload = { images: [base64Image] };

      const response = await api.post(DIAGNOSIS_ENDPOINT, payload);
      setRawResponse(response.data);

      if (response.data && response.data.disease) {
        setDiagnosisResult({
          disease: response.data.disease,
          confidence: response.data.confidence,
          treatment: response.data.treatment,
        });
        setResults(response.data.results || []);
      } else {
        setApiError(
          response.data?.message ||
            "The diagnosis API returned an unexpected response."
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      setApiError(
        err.response?.data?.message ||
          "Failed to get a diagnosis. Please check if the API is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-white">
      <Container>
        <div className="py-8 md:py-12 space-y-10">
          <header className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <TbMicroscope /> <span>{t("PestDiagnosisPage.pest.badge")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {t("PestDiagnosisPage.pest.title")}
            </h1>
            <p className="text-gray-600 max-w-3xl">
              {t("PestDiagnosisPage.pest.subtitle")}
            </p>
          </header>

          {/* Upload Form */}
          <Card className="p-6">
            <form
              className="grid gap-4 md:grid-cols-3 items-end"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("PestDiagnosisPage.pest.form.image")}
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImageFile(file || null);
                      setValue("cropImage", file, { shouldValidate: true });
                      setPreviewURL(file ? URL.createObjectURL(file) : null);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium text-sm whitespace-nowrap"
                    >
                      <TbPhoto className="w-5 h-5" />
                      {imageFile
                        ? t("PestDiagnosisPage.pest.form.change_file")
                        : t("PestDiagnosisPage.pest.form.choose_file")}
                    </label>
                    {imageFile ? (
                      <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                        <span className="truncate flex-1">{imageFile.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setPreviewURL(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove file"
                        >
                          <TbX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                        {t("PestDiagnosisPage.pest.form.no_file_selected")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 flex gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {loading
                    ? t("PestDiagnosisPage.pest.form.submitting")
                    : t("PestDiagnosisPage.pest.form.submit")}
                </button>
                {apiKeyMissing && (
                  <span className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 self-center">
                    {t("PestDiagnosisPage.pest.form.api_warning")}
                  </span>
                )}
              </div>
            </form>

            {error && (
              <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r, idx) => (
                <Card key={idx} className="p-5 card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {r.common_name ||
                          r.name ||
                          t("PestDiagnosisPage.pest.cards.unknown")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {r.scientific_name || r.cause || ""}
                      </div>
                    </div>
                    <h2 className="heading-secondary text-red-600 capitalize">
                      {diagnosisResult?.disease || "Unknown Disease"}
                    </h2>
                  </div>

                  {r.image && (
                    <img
                      src={r.image}
                      alt={r.common_name || r.name}
                      className="w-full h-40 object-cover rounded-lg mt-3"
                    />
                  )}

                  <div className="mt-3 text-sm text-gray-700 leading-6">
                    {r.details?.description ||
                      r.description ||
                      t("PestDiagnosisPage.pest.cards.no_description")}
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-800 mb-1">
                      {t("PestDiagnosisPage.pest.cards.treatment")}
                    </div>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      {(r.details?.treatment || r.treatment || [])
                        .slice(0, 3)
                        .map((step, i) => (
                          <li key={i}>
                            {typeof step === "string" ? step : step?.text}
                          </li>
                        ))}
                    </ul>
                  </div>

                  {r.details?.url && (
                    <Button
                      as="a"
                      href={r.details.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="ghost"
                      size="sm"
                      className="mt-3 px-0"
                    >
                      {t("PestDiagnosisPage.pest.cards.learn_more")}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Raw Response Display */}
          {results.length === 0 && rawResponse && (
            <Card className="p-5">
              <div className="text-sm text-gray-700">
                {t("PestDiagnosisPage.pest.cards.no_description")}
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-gray-800 font-medium hover:text-green-700 transition-colors">
                  Raw response
                </summary>
                <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-80">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </details>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PestDiagnosis;
