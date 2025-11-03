import React, { useMemo, useState } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import useLanguageStore from "../store/useLanguageStore";
import { api } from "../utils/axiosInstances";

const readableConfidence = (c) => `${Math.round((c || 0) * 100)}%`;

const resizeAndCompressToBase64 = (
  file,
  maxW = 1024,
  maxH = 1024,
  quality = 0.7
) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        const targetW = Math.round(width * ratio);
        const targetH = Math.round(height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PestDiagnosis = () => {
  const { t } = useLanguageStore();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [rawResponse, setRawResponse] = useState(null);

  const normalizePredictions = (data) => {
    if (!data) return [];
    const candidates = [
      data.result?.diseases,
      data.result?.predictions,
      data.result?.suggestions,
      data.predictions,
      data.diseases,
      data.suggestions,
    ].filter(Array.isArray);
    const arr = candidates[0] || [];
    return arr.map((item) => ({
      common_name: item.common_name || item.name || item.label || item.title,
      scientific_name:
        item.scientific_name || item.cause || item.taxonomy?.scientific_name,
      probability: item.probability ?? item.confidence ?? item.score,
      image: item.image || item.images?.[0]?.url,
      details: item.details || {
        description: item.description,
        url: item.url,
        treatment: item.treatment,
      },
      treatment: item.treatment,
      description: item.description,
      url: item.url,
    }));
  };

  const apiKeyMissing = useMemo(
    () => !import.meta.env.VITE_KINDWISE_API_KEY,
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);

    if (!imageFile) {
      setError(t("pest.form.errors.image"));
      return;
    }
    try {
      setLoading(true);
      const imageBase64 = await resizeAndCompressToBase64(
        imageFile,
        1280,
        1280,
        0.7
      );

      // NOTE: Endpoint and payload format should follow crop.health docs.
      // Replace the URL/body if your account requires a different version/path.
      const { data } = await api.post("/pest/identify", {
        images: [imageBase64],
        details: ["url", "treatment", "description", "symptoms", "severity"],
        top_n: 3,
      });
      setRawResponse(data);
      const suggestions = normalizePredictions(data);
      setResults((suggestions || []).slice(0, 3));
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          t("pest.form.errors.generic")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <Container>
        <div className="py-8 md:py-12 space-y-8">
          <header className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {t("pest.title")}
            </h1>
            <p className="text-gray-600 max-w-3xl">{t("pest.subtitle")}</p>
          </header>

          <Card className="p-6">
            <form
              className="grid gap-4 md:grid-cols-3 items-end"
              onSubmit={handleSubmit}
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("pest.form.image")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                />
              </div>
              <div className="md:col-span-1 flex gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {loading ? t("pest.form.submitting") : t("pest.form.submit")}
                </button>
                {apiKeyMissing && (
                  <span className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 self-center">
                    {t("pest.form.api_warning")}
                  </span>
                )}
              </div>
            </form>
            {error && (
              <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}
          </Card>

          {results.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r, idx) => (
                <Card key={idx} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {r.common_name || r.name || t("pest.cards.unknown")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {r.scientific_name || r.cause || ""}
                      </div>
                    </div>
                    <div className="text-sm px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100">
                      {readableConfidence(r.probability || r.confidence)}
                    </div>
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
                      t("pest.cards.no_description")}
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
                    <a
                      href={r.details.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-green-700 hover:text-green-800 text-sm"
                    >
                      {t("pest.cards.learn_more")}
                    </a>
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
                <summary className="cursor-pointer text-sm text-gray-800 font-medium">
                  Raw response
                </summary>
                <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-auto max-h-80">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </details>
            </Card>
          )}

          <p className="text-xs text-gray-500">
            {t("pest.disclaimer")} (
            <a
              className="underline"
              href="https://www.kindwise.com/crop-health"
              target="_blank"
              rel="noopener noreferrer"
            >
              crop.health
            </a>
            )
          </p>
        </div>
      </Container>
    </div>
  );
};

export default PestDiagnosis;
