import { useEffect, useMemo, useState } from "react";
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
  const lower = name.toLowerCase();

  if (lower.includes("onion")) return "onion";
  if (lower.includes("tomato")) return "tomato";
  if (lower.includes("potato")) return "potato";
  if (lower.includes("rice")) return "rice";
  if (lower.includes("apple")) return "apple";
  if (lower.includes("toor dal")) return "toor dal";

  return name;
}

function getHindiCropName(name) {
  const simpleName = getSimpleCropName(name);
  return hindiCropNames[simpleName] || name;
}

function getShortLocation(location = "") {
  // Example: "Lasalgaon, Nashik, Maharashtra"
  return location.split(",")[1]?.trim() || location;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatDate(dateString) {
  if (!dateString) return "the latest available date";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCropDetails(crop) {
  return {
    name: crop.name,
    simpleName: getSimpleCropName(crop.name),
    hindiName: getHindiCropName(crop.name),
    location: crop.location,
    city: getShortLocation(crop.location),
    fpo: crop.fpo,
    available: crop.available,
    unit: crop.unit,
    mandiPrice: crop.mandiPricePerKg,
    kisanPrice: crop.kisanPricePerKg,
    farmerPrice: crop.farmerGetsPerKg,
    farmerUplift: crop.farmerUpliftPct,
    consumerSavings: crop.consumerSavingsPct,
    tags: crop.tags || [],
    harvested: crop.harvested,
  };
}

function createEnglishAdvisory(crop) {
  const d = getCropDetails(crop);

  return `
Welcome to KisanDirect.

Here is today's agricultural market update.

The update is for ${d.name}, available in ${d.location}.

The available quantity is ${formatNumber(d.available)} ${d.unit.toLowerCase()}.

The current mandi price is ${d.mandiPrice} rupees per kilogram.

The KisanDirect price is ${d.kisanPrice} rupees per kilogram.

Farmers receive approximately ${d.farmerPrice} rupees per kilogram.

This represents a farmer uplift of ${d.farmerUplift} percent.

Consumers can save approximately ${d.consumerSavings} percent through direct farm-to-market purchasing.

This produce is supplied by ${d.fpo}.

The available quality information includes ${d.tags.join(", ")}.

The produce was harvested on ${formatDate(d.harvested)}.

KisanDirect connects farmers and buyers directly for better market opportunities.

Thank you for using KisanDirect.
  `.replace(/\s+/g, " ").trim();
}

function createHindiAdvisory(crop) {
  const d = getCropDetails(crop);

  return `
नमस्कार! किसान डायरेक्ट में आपका स्वागत है।

यह आज का कृषि बाजार अपडेट है।

यह अपडेट ${d.city} में उपलब्ध ${d.hindiName} के लिए है।

इस उत्पाद की उपलब्ध मात्रा ${formatNumber(d.available)} ${d.unit === "Quintals" ? "क्विंटल" : d.unit} है।

मंडी कीमत ${d.mandiPrice} रुपये प्रति किलोग्राम है।

किसान डायरेक्ट की कीमत ${d.kisanPrice} रुपये प्रति किलोग्राम है।

किसानों को लगभग ${d.farmerPrice} रुपये प्रति किलोग्राम प्राप्त होते हैं।

इससे किसानों को लगभग ${d.farmerUplift} प्रतिशत का बेहतर मूल्य मिल रहा है।

उपभोक्ताओं को सीधे खरीदारी करने पर लगभग ${d.consumerSavings} प्रतिशत तक की बचत हो सकती है।

यह उत्पाद ${d.fpo} द्वारा उपलब्ध कराया गया है।

उत्पाद की गुणवत्ता संबंधी जानकारी: ${d.tags.join(", ")}।

इस उत्पाद की कटाई ${formatDate(d.harvested)} को की गई थी।

किसान डायरेक्ट किसानों और खरीदारों को सीधे जोड़कर बेहतर बाजार अवसर उपलब्ध कराता है।

किसान डायरेक्ट का उपयोग करने के लिए धन्यवाद।
  `.replace(/\s+/g, " ").trim();
}

export default function KisanVani({ onClose }) {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("");

  useEffect(() => {
    async function loadCrops() {
      try {
        setLoading(true);

        const response = await fetch("/api/crops");

        if (!response.ok) {
          throw new Error("Unable to load crop data");
        }

        const data = await response.json();

        // Supports either a direct array or { crops: [...] }
        const cropList = Array.isArray(data) ? data : data.crops || [];

        setCrops(cropList);
      } catch (err) {
        setError("Unable to load crop information. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadCrops();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const cropOptions = useMemo(() => {
    return [...new Set(crops.map((crop) => getSimpleCropName(crop.name)))];
  }, [crops]);

  const locationOptions = useMemo(() => {
    return [...new Set(crops.map((crop) => getShortLocation(crop.location)))];
  }, [crops]);

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

  function getSelectedCrop() {
    return filteredCrops[0];
  }

  function speakAdvisory(language) {
    const crop = getSelectedCrop();

    if (!crop) {
      setError("Please select a valid crop or location.");
      return;
    }

    if (!window.speechSynthesis) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const text =
      language === "hi"
        ? createHindiAdvisory(crop)
        : createEnglishAdvisory(crop);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
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

    utterance.onerror = () => {
      setSpeaking(false);
      setActiveLanguage("");
      setError("Unable to play the advisory. Please try again.");
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopAdvisory() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setActiveLanguage("");
  }

  function handleClose() {
    stopAdvisory();
    onClose?.();
  }

  return (
    <div className="kv-overlay" onClick={handleClose}>
      <div className="kv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="kv-header">
          <div className="kv-title">
            <span className="kv-mic">🎙️</span>
            <span>Kisan Vani – Multilingual AI Voice Copilot</span>
          </div>

          <button className="kv-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="kv-body">
          <div className={`kv-speaker ${speaking ? "is-speaking" : ""}`}>
            🔊
          </div>

          <h2>Today's Agricultural Market Update</h2>

          <p className="kv-subtitle">
            Hear detailed crop prices, availability, farmer benefits,
            and market information from KisanDirect.
          </p>

          {loading && <p className="kv-status">Loading crop information...</p>}

          {error && <p className="kv-error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="kv-input-grid">
                <div className="kv-field">
                  <label>Crop</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                  >
                    <option value="">All Crops</option>
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop.charAt(0).toUpperCase() + crop.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kv-field">
                  <label>Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    No matching crop found. Try another crop or location.
                  </div>
                )
              ) : (
                <div className="kv-hint">
                  Select a crop or location to hear its detailed update.
                </div>
              )}

              <div className="kv-actions">
                <button
                  className="kv-play-btn"
                  onClick={() => speakAdvisory("hi")}
                  disabled={filteredCrops.length === 0}
                >
                  🔊
                  <span>
                    {speaking && activeLanguage === "hi"
                      ? "Playing Hindi Advisory..."
                      : "Play Hindi Advisory"}
                  </span>
                  <small>हिंदी में आज का अपडेट सुनें</small>
                </button>

                <button
                  className="kv-play-btn kv-english-btn"
                  onClick={() => speakAdvisory("en")}
                  disabled={filteredCrops.length === 0}
                >
                  🔊
                  <span>
                    {speaking && activeLanguage === "en"
                      ? "Playing English Advisory..."
                      : "Play English Advisory"}
                  </span>
                  <small>Hear today's KisanDirect update</small>
                </button>
              </div>

              {speaking && (
                <button className="kv-stop-btn" onClick={stopAdvisory}>
                  ⏹ Stop Audio
                </button>
              )}
            </>
          )}

          <div className="kv-note">
            <strong>Accessibility for Smallholders:</strong> Kisan Vani
            uses the device's native Speech Synthesis engine to read
            agricultural market updates aloud.
          </div>
        </div>
      </div>
    </div>
  );
}