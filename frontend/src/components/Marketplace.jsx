import { useEffect, useState } from "react";
import { api } from "../api/client";
import StatsCards from "./StatsCards";
import PriceComparison from "./PriceComparison";
import ProductCard from "./ProductCard";

const CATEGORIES = [
  "All Crops",
  "Vegetables",
  "Fruits",
  "Grains",
  "Pulses"
];

const CROPS_PER_PAGE = 20;

export default function Marketplace({ onAddToCart, onToast }) {
  const [stats, setStats] = useState(null);
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Crops");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch marketplace statistics
  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  // Fetch crops whenever search or category changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const handle = setTimeout(() => {
      api
        .getCrops({ search, category })
        .then((data) => setCrops(data.crops))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(handle);
  }, [search, category]);

  // Add crop to cart
  const handleAddToCart = (crop) => {
    onAddToCart(crop);
    onToast(`Added ${crop.name} to cart`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(crops.length / CROPS_PER_PAGE);

  const startIndex = (currentPage - 1) * CROPS_PER_PAGE;

  const visibleCrops = crops.slice(
    startIndex,
    startIndex + CROPS_PER_PAGE
  );

  return (
    <>
      <StatsCards headline={stats?.headline} />

      <PriceComparison comparison={stats?.comparison} />

      {/* Search and Category Toolbar */}
      <div className="marketplace-toolbar">
        <span>🔍</span>

        <input
          className="search-input"
          placeholder="Search crops (e.g. Onion, Tomato, Potato, Basmati) or FPO location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${
              category === cat ? "active" : ""
            }`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="empty-state">
          Couldn't reach the backend: {error}
        </div>
      )}

      {/* Loading State */}
      {!error && loading && (
        <div className="loading-state">
          Loading crops…
        </div>
      )}

      {/* Empty State */}
      {!error && !loading && crops.length === 0 && (
        <div className="empty-state">
          No crops match your search. Try a different term or category.
        </div>
      )}

      {/* Product Grid + Pagination */}
      {!error && !loading && crops.length > 0 && (
        <>
          <div className="product-grid">
            {visibleCrops.map((crop) => (
              <ProductCard
                key={crop.id}
                crop={crop}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="pagination-button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}