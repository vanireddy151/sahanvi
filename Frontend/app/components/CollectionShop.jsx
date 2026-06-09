"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { media } from "../data/media";
import { apiUrl } from "../lib/api";

const bodyColours = [
  ["Beige", "#f2f0d2"],
  ["Black", "#050505"],
  ["Blue", "#0808f7"],
  ["Brown", "#7b2f1d"],
  ["Burgundy", "#8d0025"],
  ["Cream", "#fffbd1"],
  ["Yellow", "#f4c400"],
  ["Green", "#18763d"],
  ["Purple", "#6d3a8f"],
  ["Pink", "#e89ab7"],
  ["Red", "#bc1f2d"],
  ["Grey", "#8d8d8d"],
  ["Off White", "#fff7e8"]
];

const filterDefinitions = [
  ["Material", "material"],
  ["Design", "design"],
  ["Border", "border"],
  ["Blouse", "blouse"],
  ["Zari Colour", "zariColour"],
  ["Weave", "weave"],
  ["Pallu Colour", "palluColour"]
];

const collectionChips = ["Wedding Ready", "Pure Silk", "Festive Drapes", "Zari Border", "Most Loved"];
const tabNames = ["Design", "Colour", "Occasion", "Material", "Weave"];

const productTemplates = [
  { code: "S763878", price: "₹21,020", colour: "Cream", design: "Buttas", occasion: "Wedding", material: "Pure Silk", weave: "Kanjeevaram", tags: ["Wedding Ready", "Pure Silk", "Most Loved"], image: media.bannerPerson },
  { code: "S842176", price: "₹18,950", colour: "Grey", design: "Zari Border", occasion: "Festive", material: "Soft Silk Tissue", weave: "Korvai", tags: ["Pure Silk", "Zari Border"], image: media.bannerPerson2 },
  { code: "S529410", price: "₹16,780", colour: "Pink", design: "Floral Printed", occasion: "Festive", material: "Tussar Silk", weave: "Handwoven", tags: ["Festive Drapes", "Most Loved"], image: media.bannerPerson },
  { code: "S684302", price: "₹14,520", colour: "Blue", design: "Embroidery", occasion: "Party", material: "Organza", weave: "Brocade", tags: ["Festive Drapes", "Zari Border"], image: media.bannerPerson2 },
  { code: "S743218", price: "₹23,400", colour: "Brown", design: "Checked", occasion: "Wedding", material: "Kora Silk", weave: "Ikat", tags: ["Wedding Ready", "Zari Border"], image: media.bannerPerson },
  { code: "S905117", price: "₹19,760", colour: "Black", design: "Tissue Brocade", occasion: "Reception", material: "Kanjeevaram Silk", weave: "Brocade", tags: ["Most Loved", "Pure Silk"], image: media.bannerPerson2 },
  { code: "S438920", price: "₹28,900", colour: "Burgundy", design: "Bandhini Print", occasion: "Wedding", material: "Pure Zari Kanjeevaram", weave: "Jamdani", tags: ["Wedding Ready", "Festive Drapes"], image: media.bannerPerson },
  { code: "S682410", price: "₹17,650", colour: "Green", design: "Kalamkari", occasion: "Daily Elegant", material: "Kota Organza", weave: "Handwoven", tags: ["Festive Drapes", "Most Loved"], image: media.bannerPerson2 }
];

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasSelectedValue(productValue, selectedValues) {
  const productValues = toList(productValue);
  return selectedValues.some((value) => productValues.includes(value));
}

export default function CollectionShop({ type }) {
  const [uploadedSarees, setUploadedSarees] = useState([]);
  const [colourSearch, setColourSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeChip, setActiveChip] = useState("");
  const [activeTab, setActiveTab] = useState("Design");
  const [activeTabOption, setActiveTabOption] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const savedSarees = JSON.parse(localStorage.getItem("sahanvi-admin-sarees") || "[]");
    setUploadedSarees(savedSarees);

    fetch(apiUrl("/api/sarees"))
      .then((response) => response.ok ? response.json() : [])
      .then((sarees) => {
        if (Array.isArray(sarees) && sarees.length) {
          setUploadedSarees(sarees);
        }
      })
      .catch(() => {});
  }, []);

  const stockProducts = useMemo(() => {
    return uploadedSarees
      .filter((saree) => type === "New Arrivals" ? saree.isNewArrival !== false : saree.type === type || saree.category === type)
      .filter((saree) => !["sold", "hidden"].includes(String(saree.availability || "available").toLowerCase()))
      .map((saree) => ({
        name: saree.name || `${type} Saree ${saree.code || ""}`.trim(),
        code: saree.code || "",
        price: saree.price ? `₹${Number(saree.price).toLocaleString("en-IN")}` : "₹0",
        image: saree.imageUrl || media.bannerPerson,
        colour: saree.colour || saree.bodyColour || "",
        design: toList(saree.design),
        occasion: saree.occasion || "",
        material: toList(saree.material),
        border: toList(saree.border),
        blouse: toList(saree.blouse),
        zariColour: toList(saree.zariColour),
        weave: toList(saree.weave),
        palluColour: toList(saree.palluColour),
        tags: saree.tags || []
      }));
  }, [type, uploadedSarees]);

  const products = useMemo(() => {
    if (stockProducts.length) return stockProducts;

    return productTemplates.map((product) => ({
      ...product,
      image: type === "Kalamkari"
        ? media.kalamkariSaree
        : type === "Paithani Yellow"
          ? media.paithaniYellowSaree
          : product.image,
      colour: type === "Paithani Yellow" ? "Yellow" : product.colour,
      name: `${type} Saree ${product.code}`
    }));
  }, [stockProducts, type]);

  const stockColourNames = useMemo(
    () => new Set(products.map((product) => product.colour).filter(Boolean)),
    [products]
  );

  const visibleColours = bodyColours.filter(([name]) =>
    stockColourNames.has(name) &&
    name.toLowerCase().includes(colourSearch.trim().toLowerCase())
  );

  const dynamicFilterGroups = useMemo(
    () => filterDefinitions
      .map(([group, field]) => {
        const options = [...new Set(products.flatMap((product) => toList(product[field])))];
        return { group, field, options };
      })
      .filter(({ options }) => options.length > 0),
    [products]
  );

  const tabOptions = useMemo(() => {
    const key = activeTab.toLowerCase();
    const values = products.flatMap((product) => toList(product[key]));
    return [...new Set(values)];
  }, [activeTab, products]);

  const filteredProducts = products
    .filter((product) => selectedColours.length === 0 || selectedColours.includes(product.colour))
    .filter((product) => Object.entries(selectedFilters).every(([field, values]) => {
      if (!values?.length) return true;
      return hasSelectedValue(product[field], values);
    }))
    .filter((product) => !activeChip || product.tags.includes(activeChip))
    .filter((product) => {
      if (!activeTabOption) return true;
      const key = activeTab.toLowerCase();
      return toList(product[key]).includes(activeTabOption);
    })
    .filter((product) => {
      const query = productSearch.trim().toLowerCase();
      if (!query) return true;

      return [product.name, product.code, product.price, product.colour, product.occasion, ...toList(product.design), ...toList(product.material), ...toList(product.weave), ...toList(product.border), ...toList(product.blouse), ...toList(product.zariColour), ...toList(product.palluColour), ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => {
      const first = Number(a.price.replace(/[^\d]/g, ""));
      const second = Number(b.price.replace(/[^\d]/g, ""));
      if (sortBy === "price-low") return first - second;
      if (sortBy === "price-high") return second - first;
      return 0;
    });

  const selectedFilterLabels = Object.entries(selectedFilters)
    .flatMap(([, values]) => values)
    .join(", ");

  function toggleColour(name) {
    setSelectedColours((current) =>
      current.includes(name) ? current.filter((colour) => colour !== name) : [...current, name]
    );
  }

  function toggleFilter(field, option) {
    setSelectedFilters((current) => {
      const selected = current[field] || [];
      const next = selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option];

      if (next.length === 0) {
        const { [field]: _removed, ...rest } = current;
        return rest;
      }

      return { ...current, [field]: next };
    });
  }

  function clearFilters() {
    setSelectedColours([]);
    setSelectedFilters({});
    setColourSearch("");
    setProductSearch("");
    setActiveChip("");
    setActiveTabOption("");
    setSortBy("newest");
  }

  function chooseTab(tab) {
    setActiveTab(tab);
    setActiveTabOption("");
  }

  return (
    <section className="collection-products" id="collection-products">
      <div className="collection-chip-row" aria-label="Collection highlights">
        {collectionChips.map((chip) => (
          <button
            className={`collection-chip ${activeChip === chip ? "active" : ""}`}
            type="button"
            key={chip}
            aria-pressed={activeChip === chip}
            onClick={() => setActiveChip(activeChip === chip ? "" : chip)}
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="collection-shop-layout">
        <aside className="collection-filters" aria-label={`${type} filters`}>
          <div className="filter-heading">
            <h2>Filters</h2>
            <button type="button" onClick={clearFilters}>Clear All</button>
          </div>
          <div className="filter-price">
            <input type="range" min="14860" max="43240" defaultValue="43240" aria-label="Price range" />
            <p>Price: ₹14,860 - ₹43,240</p>
          </div>

          <details className="filter-panel" open>
            <summary>Body Colour</summary>
            <label className="filter-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search Body Colour"
                value={colourSearch}
                onChange={(event) => setColourSearch(event.target.value)}
              />
            </label>
            <div className="colour-filter-grid">
              {visibleColours.map(([name, colour]) => (
                <label className="colour-option" key={name}>
                  <input
                    type="checkbox"
                    checked={selectedColours.includes(name)}
                    onChange={() => toggleColour(name)}
                  />
                  <span className="colour-swatch" style={{ "--swatch": colour }}></span>
                  <span>{name}</span>
                </label>
              ))}
            </div>
            {visibleColours.length === 0 ? <p className="filter-empty">No colour found.</p> : null}
          </details>

          {dynamicFilterGroups.map(({ group, field, options }) => (
            <details className="filter-panel filter-panel-compact" key={group}>
              <summary>{group}</summary>
              <div className="filter-option-list">
                {options.map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={(selectedFilters[field] || []).includes(option)}
                      onChange={() => toggleFilter(field, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </details>
          ))}
        </aside>

        <div className="collection-results">
          <div className="collection-toolbar">
            <div>
              <p>
                {filteredProducts.length} sarees found
                {selectedColours.length ? ` in ${selectedColours.join(", ")}` : ""}
                {selectedFilterLabels ? ` matching ${selectedFilterLabels}` : ""}
                {activeChip ? ` for ${activeChip}` : ""}
                {activeTabOption ? ` with ${activeTabOption}` : ""}
                {productSearch.trim() ? ` for "${productSearch.trim()}"` : ""}
              </p>
              <h2>{type} for every occasion</h2>
            </div>
            <div className="collection-toolbar-controls">
              <label className="collection-search">
                <span>Search sarees</span>
                <input
                  type="search"
                  placeholder="Search by name, code, colour"
                  value={productSearch}
                  onChange={(event) => setProductSearch(event.target.value)}
                />
              </label>
              <label>
                <span>Sort</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Loved</option>
                </select>
              </label>
            </div>
          </div>
          <div className="collection-tabs">
            {tabNames.map((tab) => (
              <button
                className={activeTab === tab ? "active" : ""}
                type="button"
                key={tab}
                aria-pressed={activeTab === tab}
                onClick={() => chooseTab(tab)}
              >
                By {tab}
              </button>
            ))}
          </div>
          <div className="collection-tab-option-row" aria-label={`${activeTab} options`}>
            {tabOptions.map((option) => (
              <button
                className={`collection-tab-option ${activeTabOption === option ? "active" : ""}`}
                type="button"
                key={option}
                aria-pressed={activeTabOption === option}
                onClick={() => setActiveTabOption(activeTabOption === option ? "" : option)}
              >
                {option}
              </button>
            ))}
          </div>
          {filteredProducts.length ? (
            <div className="product-grid collection-product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.code}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <h3>No sarees found</h3>
              <p>Try another search, choose a different colour, or clear the filters.</p>
              <button type="button" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
