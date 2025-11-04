import React, { useMemo, useState, useRef } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import useLanguageStore from "../store/useLanguageStore";
import { api } from "../utils/axiosInstances";
import { TbMicroscope, TbPhoto, TbX } from "react-icons/tb";

const DIAGNOSIS_ENDPOINT = "/pest/identify";

// 1. New helper function to convert File object to Base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract only the Base64 data part (after the comma)
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

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
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValue("cropImage", file, { shouldValidate: true });

    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setPreviewURL(null);
    }
  };

  const onSubmit = async (data) => {
    setDiagnosisResult(null);
    setApiError("");

    try {
      // 2. Convert the file object to a Base64 string
      const base64Image = await fileToBase64(data.cropImage);

      // 3. Prepare the JSON payload as required by the backend API: {"images": ["base64_string"]}
      const payload = {
        images: [base64Image],
      };

      // 4. Send the JSON payload
      const response = await api.post(DIAGNOSIS_ENDPOINT, payload);

      // 5. Handle the structured API response
      if (response.data && response.data.disease) {
        setDiagnosisResult({
          disease: response.data.disease,
          confidence: response.data.confidence,
          treatment: response.data.treatment,
        });
      } else {
        setApiError(
          response.data?.message ||
            "The diagnosis API returned an unexpected or empty response. Check API logs."
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      // Display the specific error message from the backend if available
      setApiError(
        err.response?.data?.message ||
          "Failed to get a diagnosis. Please check the API is running and try again."
      );
    }
  };

  const formatConfidence = (score) => {
    if (typeof score !== "number" || isNaN(score)) return "N/A";
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-white">
      <Container>
        <div className="py-8 md:py-12 space-y-10">
          <header className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <TbMicroscope /> <span>{t("pest.badge")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {t("pest.title")}
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto md:mx-0">
              {t("pest.subtitle")}
            </p>
          </header>

          <Card className="p-6">
            <form
              className="grid gap-4 md:grid-cols-3 items-end"
              onSubmit={handleSubmit}
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("pest.form.image")}
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium text-sm whitespace-nowrap"
                    >
                      <TbPhoto className="w-5 h-5" />
                      {imageFile ? t("pest.form.change_file") : t("pest.form.choose_file")}
                    </label>
                    {imageFile ? (
                      <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                        <span className="truncate flex-1">{imageFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImageFile(null);
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
                        {t("pest.form.no_file_selected")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-1 flex gap-3">
                <Button type="submit" disabled={loading} variant="primary" size="md">
                  {loading ? t("pest.form.submitting") : t("pest.form.submit")}
                </Button>
                {apiKeyMissing && (
                  <span className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 self-center">
                    {t("pest.form.api_warning")}
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

          {results.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r, idx) => (
                <Card key={idx} className="p-5 card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {r.common_name || r.name || t("pest.cards.unknown")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {r.scientific_name || r.cause || ""}
                      </div>
                    </div>
                    <h2 className="heading-secondary text-red-600 capitalize">
                      {diagnosisResult.disease || "Unknown Disease"}
                    </h2>
                  </div>

                  <div className="text-body-large text-gray-800">
                    <span className="font-semibold">Confidence:</span>{" "}
                    {formatConfidence(diagnosisResult.confidence)}
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-800 mb-1">
                      {t("pest.cards.treatment")}
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
                      {t("pest.cards.learn_more")}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}

          {results.length === 0 && rawResponse && (
            <Card className="p-5">
              <div className="text-sm text-gray-700">
                {t("pest.cards.no_description")}
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
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PestDiagnosis;
