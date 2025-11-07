import React, { useState } from "react";
import {
  TbMicroscope,
  TbAlertTriangle,
  TbCheck,
  TbLoader,
  TbRefresh,
} from "react-icons/tb";
import Container from "../components/layout/Container";
import FileInput from "../components/ui/FileInput";
import Button from "../components/ui/Button";
import { api } from "../utils/axiosInstances";

const PestDiagnosis = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileSelect = (base64, file) => {
    setImageBase64(base64);
    setError(null);
    setResult(null);
  };

  const handleIdentify = async () => {
    if (!imageBase64) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post("/pest/identify", {
        images: [imageBase64],
        top_n: 1, // Only get the most probable result
      });

      // Check if response is HTML (API error)
      if (
        typeof response.data === "string" &&
        response.data.includes("<!DOCTYPE")
      ) {
        setError(
          "Server configuration error: Please check API endpoint and key configuration."
        );
        console.error(
          "Received HTML instead of JSON:",
          response.data.substring(0, 200)
        );
        return;
      }

      if (response.data) {
        // Log the response structure for debugging
        console.log("API Response:", response.data);
        setResult(response.data);
      } else {
        setError("No results found. Please try with a different image.");
      }
    } catch (err) {
      console.error("Pest identification error:", err);

      // Check if error response is HTML
      if (
        err.response?.data &&
        typeof err.response.data === "string" &&
        err.response.data.includes("<!DOCTYPE")
      ) {
        setError(
          "API configuration error: The server returned an unexpected response. Please contact support."
        );
        return;
      }

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to identify pest. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageBase64(null);
    setError(null);
    setResult(null);
  };

  const renderResult = () => {
    if (!result) return null;

    // Handle the actual Kindwise API response structure
    const apiResult = result.result || result;

    // Get disease/pest suggestions - only show the most probable (first one)
    let suggestions = [];
    if (
      apiResult.disease?.suggestions &&
      Array.isArray(apiResult.disease.suggestions)
    ) {
      suggestions = [apiResult.disease.suggestions[0]]; // Only first (most probable)
    } else if (apiResult.suggestions && Array.isArray(apiResult.suggestions)) {
      suggestions = [apiResult.suggestions[0]];
    } else if (Array.isArray(apiResult)) {
      suggestions = [apiResult[0]];
    }

    // Get crop suggestions
    const cropSuggestions = apiResult.crop?.suggestions || [];
    const identifiedCrop =
      cropSuggestions.length > 0 ? cropSuggestions[0] : null;

    if (suggestions.length === 0 || !suggestions[0]) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 text-yellow-800">
            <TbAlertTriangle size={24} />
            <p className="font-semibold">No identification results found</p>
          </div>
          <p className="text-yellow-700 mt-2">
            We couldn't identify any disease or pest in the image. Please try
            with a clearer image.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Crop Identification */}
        {identifiedCrop && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100 mb-1">
                  Identified Crop
                </p>
                <h2 className="text-2xl font-bold capitalize">
                  {identifiedCrop.name}
                </h2>
                {identifiedCrop.scientific_name && (
                  <p className="text-green-100 italic mt-1">
                    {identifiedCrop.scientific_name}
                  </p>
                )}
              </div>
              {identifiedCrop.probability && (
                <div className="text-right">
                  <p className="text-sm text-green-100">Confidence</p>
                  <p className="text-3xl font-bold">
                    {(identifiedCrop.probability * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disease/Pest Results - Most Probable Only */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TbCheck className="text-green-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">
              Identified Disease/Pest
            </h2>
          </div>

          {suggestions.map((suggestion, index) => {
            const name = suggestion.name || "Unknown";
            const probability =
              suggestion.probability || suggestion.confidence || 0;
            const scientificName = suggestion.scientific_name || "";
            const entityId =
              suggestion.details?.entity_id || suggestion.id || "";
            const language = suggestion.details?.language || "";

            return (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-400 transition-all"
              >
                {/* Disease/Pest Header with Confidence */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {name}
                        </h3>
                        <div className="bg-green-500 text-white px-4 py-1 rounded-full text-lg font-bold">
                          {(probability * 100).toFixed(1)}%
                        </div>
                      </div>
                      {scientificName && scientificName !== name && (
                        <p className="text-sm text-gray-600 italic">
                          {scientificName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content - Display all available data from API response */}
                <div className="p-5 space-y-4">
                  {/* Scientific Name (if same as name) */}
                  {scientificName && scientificName === name && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Scientific Name
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        {scientificName}
                      </p>
                    </div>
                  )}

                  {/* Details Object - Display all fields from details */}
                  {suggestion.details &&
                    typeof suggestion.details === "object" && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Details
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          {Object.keys(suggestion.details).map((detailKey) => {
                            const detailValue = suggestion.details[detailKey];
                            if (
                              detailValue === null ||
                              detailValue === undefined ||
                              detailValue === ""
                            ) {
                              return null;
                            }

                            return (
                              <div key={detailKey}>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                  {detailKey.replace(/_/g, " ")}
                                </p>
                                {typeof detailValue === "object" &&
                                !Array.isArray(detailValue) ? (
                                  <pre className="text-xs text-gray-700 bg-white p-2 rounded overflow-auto border border-gray-200">
                                    {JSON.stringify(detailValue, null, 2)}
                                  </pre>
                                ) : Array.isArray(detailValue) ? (
                                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {detailValue.map((item, idx) => (
                                      <li key={idx}>{String(item)}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-700">
                                    {String(detailValue)}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Display any other fields from the API response (excluding already shown fields) */}
                  {Object.keys(suggestion).map((key) => {
                    // Skip fields we've already displayed
                    if (
                      [
                        "name",
                        "probability",
                        "confidence",
                        "scientific_name",
                        "details",
                      ].includes(key)
                    ) {
                      return null;
                    }

                    const value = suggestion[key];
                    if (value === null || value === undefined || value === "") {
                      return null;
                    }

                    return (
                      <div key={key}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        {typeof value === "object" && !Array.isArray(value) ? (
                          <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded overflow-auto">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : Array.isArray(value) ? (
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {value.map((item, idx) => (
                              <li key={idx}>{String(item)}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-700">
                            {String(value)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-white min-h-screen py-8 md:py-12">
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <TbMicroscope size={20} />
              <span>AI-Powered Pest & Disease Detection</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Pest & Disease Diagnosis
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload an image of your crop to identify diseases, pests, and get
              treatment recommendations using advanced AI technology.
            </p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - File Upload (Smaller) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Upload Image
                </h2>
                <FileInput
                  onFileSelect={handleFileSelect}
                  accept="image/*"
                  maxSize={10 * 1024 * 1024}
                  disabled={loading}
                />

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-4">
                  <Button
                    onClick={handleIdentify}
                    disabled={!imageBase64 || loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <TbLoader className="animate-spin" size={18} />
                        <span className="ml-2">Identifying...</span>
                      </>
                    ) : (
                      <>
                        <TbMicroscope size={18} />
                        <span className="ml-2">Identify</span>
                      </>
                    )}
                  </Button>
                  {imageBase64 && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      disabled={loading}
                      className="w-full"
                    >
                      <TbRefresh size={18} />
                      <span className="ml-2">Reset</span>
                    </Button>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <TbAlertTriangle size={18} />
                      <p className="font-semibold text-sm">Error</p>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Results (Larger) */}
            <div className="lg:col-span-2">
              {result ? (
                renderResult()
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center h-full">
                  <div className="flex flex-col items-center justify-center space-y-4 text-gray-400 h-full">
                    <TbMicroscope size={64} />
                    <p className="text-lg font-medium">No image uploaded yet</p>
                    <p className="text-sm">
                      Upload an image on the left to get started
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PestDiagnosis;
