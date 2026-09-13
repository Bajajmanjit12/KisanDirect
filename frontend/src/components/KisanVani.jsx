
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import "./KisanVani.css";

const hindiCropNames = {
  onion: "प्याज़",
  tomato: "टमाटर",
  potato: "आलू",
  rice: "चावल",
  apple: "सेब",
  "toor dal": "तूर दाल",
};

function getSimpleCropName(name = "") {
  const lower = String(name).toLowerCase();

  if (lower.includes("onion")) return "onion";
  if (lower.includes("tomato")) return "tomato";
  if (lower.includes("potato")) return "potato";
  if (lower.includes("rice")) return "rice";
  if (lower.includes("apple")) return "apple";
  if (lower.includes("toor dal")) return "toor dal";

  return lower;
}

function getHindiCropName(name = "") {
  const simpleName = getSimpleCropName(name);
  return hindiCropNames[simpleName] || name;
}

function getShortLocation(location = "") {
  const parts = String(location).split(",");

  // Example:
  // "Lasalgaon, Nashik, Maharashtra"
  // returns "Nashik"
  return parts[1]?.trim() || parts[0]?.trim() || location;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(dateString) {
  if (!dateString) return "the latest available date";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "the latest available date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCropDetails(crop) {
  return {
    name: crop.name || "this crop",
    simpleName: getSimpleCropName(crop.name),
    hindiName: getHindiCropName(crop.name),
    location: crop.location || "the local market",
    city: getShortLocation(crop.location),
    fpo: crop.fpo || "the listed farmer organization",
    available: crop.available ?? 0,
    unit: crop.unit || "units",
    mandiPrice: crop.mandiPricePerKg ?? 0,
    kisanPrice: crop.kisanPricePerKg ?? 0,
    farmerPrice: crop.farmerGetsPerKg ?? 0,
    farmerUplift: crop.farmerUpliftPct ?? 0,
    consumerSavings: crop.consumerSavingsPct ?? 0,
    tags: Array.isArray(crop.tags) ? crop.tags : [],
    harvested: crop.harvested,
  };
}

function createEnglishAdvisory(crop) {
  const d = getCropDetails(crop);

  return `
Welcome to KisanDirect.

Here is today's agricultural market update.

The update is for ${d.name}, available in ${d.location}.

The available quantity is ${formatNumber(d.available)} ${String(
    d.unit
  ).toLowerCase()}.

The current mandi price is ${d.mandiPrice} rupees per kilogram.

The KisanDirect price is ${d.kisanPrice} rupees per kilogram.

Farmers receive approximately ${d.farmerPrice} rupees per kilogram.

This represents a farmer uplift of ${d.farmerUplift} percent.

Consumers can save approximately ${d.consumerSavings} percent through direct farm-to-market purchasing.

This produce is supplied by ${d.fpo}.

The available quality information includes ${
    d.tags.length > 0 ? d.tags.join(", ") : "standard quality information"
  }.

The produce was harvested on ${formatDate(d.harvested)}.

KisanDirect connects farmers and buyers directly for better market opportunities.

Thank you for using KisanDirect.
  `
    .replace(/\s+/g, " ")
    .trim();
}

function createHindiAdvisory(crop) {
  const d = getCropDetails(crop);

  const quantityUnit =
    d.unit === "Quintals" || d.unit === "quintal"
      ? "क्विंटल"
      : d.unit;

  return `
नमस्कार! किसान डायरेक्ट में आपका स्वागत है।

यह आज का कृषि बाजार अपडेट है।

यह अपडेट ${d.city} में उपलब्ध ${d.hindiName} के लिए है।

इस उत्पाद की उपलब्ध मात्रा ${formatNumber(
    d.available
  )} ${quantityUnit} है।

मंडी कीमत ${d.mandiPrice} रुपये प्रति किलोग्राम है।

किसान डायरेक्ट की कीमत ${d.kisanPrice} रुपये प्रति किलोग्राम है।

किसानों को लगभग ${d.farmerPrice} रुपये प्रति किलोग्राम प्राप्त होते हैं।

इससे किसानों को लगभग ${d.farmerUplift} प्रतिशत का बेहतर मूल्य मिल रहा है।

उपभोक्ताओं को सीधे खरीदारी करने पर लगभग ${d.consumerSavings} प्रतिशत तक की बचत हो सकती है।

यह उत्पाद ${d.fpo} द्वारा उपलब्ध कराया गया है।

उत्पाद की गुणवत्ता संबंधी जानकारी: ${
    d.tags.length > 0 ? d.tags.join(", ") : "मानक गुणवत्ता"
  }।

इस उत्पाद की कटाई ${formatDate(d.harvested)} को की गई थी।

किसान डायरेक्ट किसानों और खरीदारों को सीधे जोड़कर बेहतर बाजार अवसर उपलब्ध कराता है।

किसान डायरेक्ट का उपयोग करने के लिए धन्यवाद।
  `
    .replace(/\s+/g, " ")
    .trim();
}

export default function KisanVani({ onClose }) {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [speaking, setSpeaking] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("");

  /*
   * Load crop data using the SAME API client used
   * by the rest of the application.
   *
   * This means:
   *
   * VITE_API_URL
   *       ↓
   * https://kisandirect-backend.onrender.com/api
   *       ↓
   * api.getCrops()
   *       ↓
   * /crops
   */
  useEffect(() => {
    async function loadCrops() {
      try {
        setLoading(true);
        setError("");

        const data = await api.getCrops();

        // Supports:
        // 1. Direct array: [...]
        // 2. Object: { crops: [...] }
        const cropList = Array.isArray(data)
          ? data
          : Array.isArray(data?.crops)
          ? data.crops
          : [];

        setCrops(cropList);

        if (cropList.length === 0) {
          setError("No crop information is currently available.");
        }
      } catch (err) {
        console.error("Kisan Vani API error:", err);

        setError(
          "Unable to load crop information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCrops();

    // Stop speech when the component is closed/unmounted.
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /*
   * Get unique crop names.
   */
  const cropOptions = useMemo(() => {
    return [
      ...new Set(
        crops
          .map((crop) => getSimpleCropName(crop.name))
          .filter(Boolean)
      ),
    ];
  }, [crops]);

  /*
   * Get unique locations.
   */
  const locationOptions = useMemo(() => {
    return [
      ...new Set(
        crops
          .map((crop) => getShortLocation(crop.location))
          .filter(Boolean)
      ),
    ];
  }, [crops]);

  /*
   * Filter crops according to selected crop/location.
   */
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const cropMatches =
        !selectedCrop ||
        getSimpleCropName(crop.name) === selectedCrop;

      const locationMatches =
        !selectedLocation ||
        getShortLocation(crop.location).toLowerCase() ===
          selectedLocation.toLowerCase();

      return cropMatches && locationMatches;
    });
  }, [crops, selectedCrop, selectedLocation]);

  /*
   * Get the crop that should be used for the voice advisory.
   *
   * If the user selected a crop/location, the first matching
   * crop is used.
   *
   * If nothing is selected, the first available crop is used.
   */
  function getSelectedCrop() {
    return filteredCrops[0] || null;
  }

  /*
   * Speak Hindi or English advisory.
   */
  function speakAdvisory(language) {
    const crop = getSelectedCrop();

    if (!crop) {
      setError("Please select a valid crop or location.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      setError(
        "Speech synthesis is not supported in this browser."
      );
      return;
    }

    // Stop any previous speech.
    window.speechSynthesis.cancel();

    const text =
      language === "hi"
        ? createHindiAdvisory(crop)
        : createEnglishAdvisory(crop);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang =
      language === "hi" ? "hi-IN" : "en-IN";

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setActiveLanguage(language);
      setError("");
    };

    utterance.onend = () => {
      setSpeaking(false);
      setActiveLanguage("");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);

      setSpeaking(false);
      setActiveLanguage("");

      setError(
        "Unable to play the advisory. Please try again."
      );
    };

    window.speechSynthesis.speak(utterance);
  }

  /*
   * Stop current speech.
   */
  function stopAdvisory() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
    setActiveLanguage("");
  }

  /*
   * Close modal and stop audio.
   */
  function handleClose() {
    stopAdvisory();
    onClose?.();
  }

  return (
    <div className="kv-overlay" onClick={handleClose}>
      <div
        className="kv-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="kv-header">
          <div className="kv-title">
            <span className="kv-mic">🎙️</span>

            <span>
              Kisan Vani – Multilingual AI Voice Copilot
            </span>
          </div>

          <button
            className="kv-close"
            onClick={handleClose}
            aria-label="Close Kisan Vani"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="kv-body">
          <div
            className={`kv-speaker ${
              speaking ? "is-speaking" : ""
            }`}
          >
            🔊
          </div>

          <h2>Today's Agricultural Market Update</h2>

          <p className="kv-subtitle">
            Hear detailed crop prices, availability, farmer
            benefits, and market information from KisanDirect.
          </p>

          {/* LOADING */}
          {loading && (
            <p className="kv-status">
              Loading crop information...
            </p>
          )}

          {/* ERROR */}
          {error && (
            <p className="kv-error">
              {error}
            </p>
          )}

          {/* MAIN CONTENT */}
          {!loading && !error && (
            <>
              {/* FILTERS */}
              <div className="kv-input-grid">
                <div className="kv-field">
                  <label htmlFor="kv-crop">
                    Crop
                  </label>

                  <select
                    id="kv-crop"
                    value={selectedCrop}
                    onChange={(e) =>
                      setSelectedCrop(e.target.value)
                    }
                  >
                    <option value="">
                      All Crops
                    </option>

                    {cropOptions.map((crop) => (
                      <option
                        key={crop}
                        value={crop}
                      >
                        {crop.charAt(0).toUpperCase() +
                          crop.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kv-field">
                  <label htmlFor="kv-location">
                    Location
                  </label>

                  <select
                    id="kv-location"
                    value={selectedLocation}
                    onChange={(e) =>
                      setSelectedLocation(e.target.value)
                    }
                  >
                    <option value="">
                      All Locations
                    </option>

                    {locationOptions.map(
                      (location) => (
                        <option
                          key={location}
                          value={location}
                        >
                          {location}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* PREVIEW / HINT */}
              {selectedCrop || selectedLocation ? (
                filteredCrops.length > 0 ? (
                  <div className="kv-preview">
                    <strong>
                      {filteredCrops.length === 1
                        ? filteredCrops[0].name
                        : `${filteredCrops.length} matching crops`}
                    </strong>

                    <span>
                      {filteredCrops.length === 1
                        ? `${filteredCrops[0].location} • ₹${filteredCrops[0].kisanPricePerKg}/kg`
                        : "The first matching crop will be used for the advisory."}
                    </span>
                  </div>
                ) : (
                  <div className="kv-no-match">
                    No matching crop found. Try another
                    crop or location.
                  </div>
                )
              ) : (
                <div className="kv-hint">
                  Select a crop or location to hear its
                  detailed update.
                </div>
              )}

              {/* AUDIO BUTTONS */}
              <div className="kv-actions">
                <button
                  className="kv-play-btn"
                  onClick={() =>
                    speakAdvisory("hi")
                  }
                  disabled={
                    filteredCrops.length === 0 ||
                    speaking
                  }
                >
                  🔊

                  <span>
                    {speaking &&
                    activeLanguage === "hi"
                      ? "Playing Hindi Advisory..."
                      : "Play Hindi Advisory"}
                  </span>

                  <small>
                    हिंदी में आज का अपडेट सुनें
                  </small>
                </button>

                <button
                  className="kv-play-btn kv-english-btn"
                  onClick={() =>
                    speakAdvisory("en")
                  }
                  disabled={
                    filteredCrops.length === 0 ||
                    speaking
                  }
                >
                  🔊

                  <span>
                    {speaking &&
                    activeLanguage === "en"
                      ? "Playing English Advisory..."
                      : "Play English Advisory"}
                  </span>

                  <small>
                    Hear today's KisanDirect update
                  </small>
                </button>
              </div>

              {/* STOP BUTTON */}
              {speaking && (
                <button
                  className="kv-stop-btn"
                  onClick={stopAdvisory}
                >
                  ⏹ Stop Audio
                </button>
              )}
            </>
          )}

          {/* ACCESSIBILITY NOTE */}
          <div className="kv-note">
            <strong>
              Accessibility for Smallholders:
            </strong>{" "}
            Kisan Vani uses the device's native Speech
            Synthesis engine to read agricultural market
            updates aloud.
          </div>
        </div>
      </div>
    </div>
  );
}
