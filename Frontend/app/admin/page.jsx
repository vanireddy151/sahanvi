"use client";

import Header from "../components/Header";
import { apiUrl } from "../lib/api";
import { menus } from "../data/navigation";
import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  category: "Heritage Sarees",
  type: menus["Heritage Sarees"][0],
  name: "",
  code: "",
  price: "",
  stock: "1",
  imageUrl: "",
  palluImageUrl: "",
  borderImageUrl: "",
  bodyImageUrl: "",
  description: "",
  fabric: "",
  style: "",
  zariType: "",
  occasion: "",
  length: "6.3 meters with blouse",
  blouseStatus: "Unstitched",
  vendorId: "",
  vendorName: "",
  fallPico: false,
  customBlouseStitching: false,
  material: [],
  design: [],
  border: [],
  blouse: [],
  zariColour: [],
  weave: [],
  palluColour: [],
  availability: "available"
};

const stockDetailFields = [
  ["material", "Material", ["Kanjeevaram Silk", "Pure Zari Kanjeevaram", "2 Gram Kanjeevaram", "Kanjeevaram Linen", "Kanjeevaram Organza", "Tussar Silk", "Kora Silk", "Kota Organza", "Soft Silk Tissue"]],
  ["design", "Design", ["Checked", "Floral Printed", "Buttas", "Embroidery", "Tissue Brocade", "Bandhini Print", "Shibori", "Kalamkari", "Ajrakh", "Printed Kanjeevaram"]],
  ["border", "Border", ["Borderless", "Self Border", "Contrast Border", "Korvai Border", "Rettapet Border", "Paithani Border", "Striped Border", "Gold & Silver Zari Border"]],
  ["blouse", "Blouse", ["With Blouse 0.80 Mtrs", "Running Blouse", "Contrast Blouse", "Kalamkari Blouse", "Ikat Blouse", "Blouse Stitching", "Blouse Detachment"]],
  ["zariColour", "Zari Colour", ["Pure Gold Zari", "Gold Zari", "Silver Zari", "Gold & Silver Zari", "Antique Zari", "No Zari"]],
  ["weave", "Weave", ["Handwoven", "Kanjeevaram", "Korvai", "Ikat", "Jamdani", "Brocade", "Tissue", "Crushed"]],
  ["palluColour", "Pallu Colour", ["Self Pallu", "Contrast Pallu", "Gold Pallu", "Printed Pallu", "Paithani Pallu", "Zari Woven Pallu"]]
];

function priceNumber(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSaree(saree) {
  return {
    ...saree,
    id: saree.id || saree._id || `SR-${saree.code || Date.now()}`,
    stock: saree.stock ?? 1,
    palluImageUrl: saree.palluImageUrl || "",
    borderImageUrl: saree.borderImageUrl || "",
    bodyImageUrl: saree.bodyImageUrl || "",
    fabric: saree.fabric || "",
    style: saree.style || "",
    zariType: saree.zariType || "",
    occasion: saree.occasion || "",
    length: saree.length || "6.3 meters with blouse",
    blouseStatus: saree.blouseStatus || "Unstitched",
    vendorId: saree.vendorId || "",
    vendorName: saree.vendorName || "",
    fallPico: Boolean(saree.fallPico),
    customBlouseStitching: Boolean(saree.customBlouseStitching),
    material: toArray(saree.material),
    design: toArray(saree.design),
    border: toArray(saree.border),
    blouse: toArray(saree.blouse),
    zariColour: toArray(saree.zariColour),
    weave: toArray(saree.weave),
    palluColour: toArray(saree.palluColour),
    availability: saree.availability || "available"
  };
}

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [sarees, setSarees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const adminSession = JSON.parse(localStorage.getItem("sahanvi-admin-session") || "null");

    if (!adminSession?.token) {
      setAllowed(false);
      setAuthReady(true);
      window.location.href = "/admin/login";
      return;
    }

    fetch(apiUrl("/api/auth/me"), {
      headers: { Authorization: `Bearer ${adminSession.token}` }
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const isAdmin = data?.user?.role === "admin";
        setAllowed(isAdmin);
        setAuthReady(true);
        if (!isAdmin) {
          localStorage.removeItem("sahanvi-admin-session");
          window.location.href = "/admin/login";
        }
      })
      .catch(() => {
        setAllowed(false);
        setAuthReady(true);
        window.location.href = "/admin/login";
      });

    setSarees(JSON.parse(localStorage.getItem("sahanvi-admin-sarees") || "[]").map(normalizeSaree));
    setOrders(JSON.parse(localStorage.getItem("sahanvi-orders") || "[]"));
    setReturns(JSON.parse(localStorage.getItem("sahanvi-return-requests") || "[]"));
    setInquiries(JSON.parse(localStorage.getItem("sahanvi-inquiries") || "[]"));

    fetch(apiUrl("/api/sarees"))
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (Array.isArray(items) && items.length) {
          const normalized = items.map(normalizeSaree);
          setSarees(normalized);
          localStorage.setItem("sahanvi-admin-sarees", JSON.stringify(normalized));
        }
      })
      .catch(() => {});
  }, []);

  const typeOptions = form.category === "Sahanvi Vintage" ? ["Sahanvi Vintage"] : menus[form.category] || [];

  const stats = useMemo(() => {
    const soldItems = orders.flatMap((order) => order.items || []);
    return {
      uploaded: sarees.length,
      orders: orders.length,
      sold: soldItems.length,
      revenue: soldItems.reduce((sum, item) => sum + priceNumber(item.price), 0),
      returns: returns.length
    };
  }, [sarees, orders, returns]);

  const soldCodes = useMemo(() => {
    return new Set(
      orders
        .flatMap((order) => order.items || [])
        .map((item) => item.code)
        .filter(Boolean)
    );
  }, [orders]);

  const availableSarees = useMemo(() => {
    return sarees.filter((saree) =>
      !soldCodes.has(saree.code) &&
      String(saree.availability || "available").toLowerCase() === "available"
    );
  }, [sarees, soldCodes]);

  const soldItems = useMemo(() => {
    const orderedItems = orders.flatMap((order) =>
      (order.items || []).map((item) => ({
        ...item,
        orderId: order.id,
        customer: order.customer,
        delivery: order.delivery,
        status: "Sold"
      }))
    );
    const manuallySold = sarees
      .filter((saree) =>
        String(saree.availability || "").toLowerCase() === "sold" &&
        !soldCodes.has(saree.code)
      )
      .map((saree) => ({
        ...saree,
        image: saree.imageUrl,
        status: "Sold",
        orderId: "Manual"
      }));

    return [...orderedItems, ...manuallySold];
  }, [orders, sarees, soldCodes]);

  function groupByType(items) {
    return items.reduce((groups, saree) => {
      const key = `${saree.category} / ${saree.type}`;
      groups[key] = groups[key] || [];
      groups[key].push(saree);
      return groups;
    }, {});
  }

  const groupedSarees = useMemo(() => groupByType(availableSarees), [availableSarees]);

  const typeCounts = useMemo(() => {
    return sarees.reduce((counts, saree) => {
      const key = `${saree.category} / ${saree.type}`;
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }, [sarees]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    if (name === "category") {
      const nextType = value === "Sahanvi Vintage" ? "Sahanvi Vintage" : menus[value]?.[0] || "";
      setForm((current) => ({ ...current, category: value, type: nextType }));
      return;
    }
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function toggleStockDetail(name, option) {
    setForm((current) => {
      const selected = toArray(current[name]);
      const next = selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option];

      return { ...current, [name]: next };
    });
  }

  async function submit(event) {
    event.preventDefault();
    const nextSaree = {
      ...form,
      id: editingId || `SR-${Date.now()}`,
      uploadedAt: editingId ? sarees.find((item) => item.id === editingId)?.uploadedAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const adminSession = JSON.parse(localStorage.getItem("sahanvi-admin-session") || "null");
    let savedSaree = normalizeSaree(nextSaree);

    try {
      const formData = new FormData();
      Object.entries(nextSaree).forEach(([key, value]) => {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });
      const response = await fetch(apiUrl("/api/sarees"), {
        method: editingId ? "PUT" : "POST",
        headers: adminSession?.token ? { Authorization: `Bearer ${adminSession.token}` } : undefined,
        body: formData
      });

      if (response.status === 401) {
        setStatus("Your admin session expired. Please sign in again.");
        localStorage.removeItem("sahanvi-admin-session");
        window.location.href = "/admin/login";
        return;
      }

      if (response.ok) {
        savedSaree = normalizeSaree(await response.json());
      } else {
        setStatus("Could not save to the server. Please try again.");
        return;
      }
    } catch {
      setStatus("Could not reach the server. Please try again.");
      return;
    }

    const nextSarees = editingId
      ? sarees.map((item) => (item.id === editingId ? savedSaree : item))
      : [savedSaree, ...sarees];

    setSarees(nextSarees);
    localStorage.setItem("sahanvi-admin-sarees", JSON.stringify(nextSarees));
    setStatus(editingId ? "Saree details updated." : "Saree uploaded and listed in admin.");
    setActiveTab("available");
    setEditingId("");
    setForm(emptyForm);
  }

  function editSaree(saree) {
    const normalized = normalizeSaree(saree);
    setEditingId(normalized.id);
    setForm({
      category: normalized.category,
      type: normalized.type,
      name: normalized.name,
      code: normalized.code,
      price: normalized.price,
      stock: normalized.stock ?? 1,
      imageUrl: normalized.imageUrl,
      palluImageUrl: normalized.palluImageUrl,
      borderImageUrl: normalized.borderImageUrl,
      bodyImageUrl: normalized.bodyImageUrl,
      description: normalized.description,
      fabric: normalized.fabric,
      style: normalized.style,
      zariType: normalized.zariType,
      occasion: normalized.occasion,
      length: normalized.length,
      blouseStatus: normalized.blouseStatus,
      vendorId: normalized.vendorId,
      vendorName: normalized.vendorName,
      fallPico: normalized.fallPico,
      customBlouseStitching: normalized.customBlouseStitching,
      material: normalized.material,
      design: normalized.design,
      border: normalized.border,
      blouse: normalized.blouse,
      zariColour: normalized.zariColour,
      weave: normalized.weave,
      palluColour: normalized.palluColour,
      availability: normalized.availability || "available"
    });
    setActiveTab("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeSaree(id) {
    const nextSarees = sarees.filter((item) => item.id !== id);
    setSarees(nextSarees);
    localStorage.setItem("sahanvi-admin-sarees", JSON.stringify(nextSarees));
    if (editingId === id) {
      setEditingId("");
      setForm(emptyForm);
    }
  }

  return (
    <div className="next-page">
      <Header />
      {!authReady ? (
        <section className="admin-denied">
          <h1>Checking Admin Access</h1>
          <p>Please wait while we load the admin panel.</p>
        </section>
      ) : !allowed ? (
        <section className="admin-denied">
          <h1>Admin Sign In Required</h1>
          <p>Please sign in with an approved admin account to manage sarees.</p>
          <a className="hero-button" href="/login">Sign In</a>
        </section>
      ) : (
        <main className="admin-page">
          <section className="admin-hero">
            <p className="eyebrow">Sahanvi Admin</p>
            <h1>Manage saree uploads, stock visibility, orders, and selling information.</h1>
          </section>

          <section className="admin-metrics" aria-label="Admin summary">
            <article><span>{stats.uploaded}</span><p>Sarees uploaded</p></article>
            <article><span>{stats.orders}</span><p>Orders placed</p></article>
            <article><span>{stats.sold}</span><p>Sarees selling</p></article>
            <article><span>₹{stats.revenue.toLocaleString("en-IN")}</span><p>Order value</p></article>
            <article><span>{stats.returns}</span><p>Return requests</p></article>
          </section>

          <nav className="admin-tabs" aria-label="Admin panel sections">
            {[
              ["upload", "Upload"],
              ["sold", "Sold Out"],
              ["available", "Available Stock"],
              ["inquiries", "Inquiries"]
            ].map(([key, label]) => (
              <button
                aria-pressed={activeTab === key}
                className={activeTab === key ? "active" : ""}
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          {activeTab === "upload" ? <section className="admin-panel">
            <form className="admin-form" onSubmit={submit}>
              <h2>{editingId ? "Edit Saree" : "Upload Saree"}</h2>
              <div className="form-grid">
                <label>
                  <span>Category</span>
                  <select name="category" value={form.category} onChange={updateField}>
                    <option>Heritage Sarees</option>
                    <option>Signature Sarees</option>
                    <option>Sarees</option>
                    <option>Sahanvi Vintage</option>
                  </select>
                </label>
                <label>
                  <span>Saree Type</span>
                  <select name="type" value={form.type} onChange={updateField} required>
                    {typeOptions.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label><span>Saree Name</span><input name="name" value={form.name} onChange={updateField} required /></label>
                <label><span>Code</span><input name="code" value={form.code} onChange={updateField} placeholder="S123456" required /></label>
                <label><span>Price</span><input name="price" value={form.price} onChange={updateField} placeholder="21020" required /></label>
                <label><span>Stock</span><input name="stock" type="number" min="0" value={form.stock} onChange={updateField} required /></label>
                <label><span>Cloudinary Image URL</span><input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} placeholder="https://res.cloudinary.com/..." required /></label>
                <label><span>Pallu Close-up URL</span><input name="palluImageUrl" type="url" value={form.palluImageUrl} onChange={updateField} placeholder="https://res.cloudinary.com/..." /></label>
                <label><span>Border Close-up URL</span><input name="borderImageUrl" type="url" value={form.borderImageUrl} onChange={updateField} placeholder="https://res.cloudinary.com/..." /></label>
                <label><span>Body Close-up URL</span><input name="bodyImageUrl" type="url" value={form.bodyImageUrl} onChange={updateField} placeholder="https://res.cloudinary.com/..." /></label>
                <label><span>Fabric</span><input name="fabric" value={form.fabric} onChange={updateField} placeholder="Silk, Cotton, Organza" /></label>
                <label><span>Weave / Style</span><input name="style" value={form.style} onChange={updateField} placeholder="Banarasi, Kanjeevaram, Chikankari" /></label>
                <label><span>Zari Type</span><input name="zariType" value={form.zariType} onChange={updateField} placeholder="Pure Gold, Tested, Silver" /></label>
                <label><span>Occasion</span><input name="occasion" value={form.occasion} onChange={updateField} placeholder="Bridal, Casual, Festive" /></label>
                <label>
                  <span>Length</span>
                  <select name="length" value={form.length} onChange={updateField}>
                    <option>5.5 meters</option>
                    <option>6.3 meters with blouse</option>
                    <option>Custom length</option>
                  </select>
                </label>
                <label>
                  <span>Blouse Status</span>
                  <select name="blouseStatus" value={form.blouseStatus} onChange={updateField}>
                    <option>Unstitched</option>
                    <option>Stitched</option>
                    <option>No Blouse</option>
                  </select>
                </label>
                <label><span>Vendor / Artisan ID</span><input name="vendorId" value={form.vendorId} onChange={updateField} placeholder="Cluster or vendor ID" /></label>
                <label><span>Vendor / Artisan Name</span><input name="vendorName" value={form.vendorName} onChange={updateField} placeholder="Weaver cluster or vendor name" /></label>
                <label>
                  <span>Availability</span>
                  <select name="availability" value={form.availability} onChange={updateField}>
                    <option value="available">Available - show to customers</option>
                    <option value="sold">Sold - hide from list</option>
                    <option value="hidden">Hidden - do not show</option>
                  </select>
                </label>
              </div>
              <div className="admin-service-options">
                <label>
                  <input type="checkbox" name="fallPico" checked={form.fallPico} onChange={updateField} />
                  <span>Saree Fall & Edging (Pico) available</span>
                </label>
                <label>
                  <input type="checkbox" name="customBlouseStitching" checked={form.customBlouseStitching} onChange={updateField} />
                  <span>Custom blouse stitching available</span>
                </label>
              </div>
              <div className="admin-stock-details">
                <div>
                  <h3>Stock Filter Details</h3>
                  <p>Add only the details available for this saree. Customer filter sections stay hidden until uploaded stock has values here.</p>
                </div>
                <div className="admin-option-grid">
                  {stockDetailFields.map(([name, label, options]) => {
                    const selectedCount = toArray(form[name]).length;
                    return (
                      <details className="admin-option-group" key={name}>
                        <summary>
                          <span>{label}</span>
                          {selectedCount > 0 ? <span className="admin-option-count">{selectedCount}</span> : null}
                        </summary>
                        <div>
                          {options.map((option) => (
                            <label key={option}>
                              <input
                                type="checkbox"
                                checked={toArray(form[name]).includes(option)}
                                onChange={() => toggleStockDetail(name, option)}
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
              <label><span>Description</span><textarea name="description" rows="4" value={form.description} onChange={updateField}></textarea></label>
              <div className="admin-form-actions">
                <button className="checkout-primary" type="submit">{editingId ? "Update Saree" : "Upload Saree"}</button>
                {editingId ? <button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }}>Cancel Edit</button> : null}
              </div>
              <p className="admin-status">{status}</p>
            </form>

            <aside className="admin-preview">
              <h2>Saree Types Added</h2>
              <div className="admin-type-list">
                {Object.entries(menus).map(([category, types]) => (
                  <div key={category}>
                    <h3>{category}</h3>
                    <ul>
                      {types.map((type) => (
                        <li key={type}>
                          <span>{type}</span>
                          <strong>{typeCounts[`${category} / ${type}`] || 0}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3>Sahanvi Vintage</h3>
                  <ul>
                    <li>
                      <span>Sahanvi Vintage</span>
                      <strong>{typeCounts["Sahanvi Vintage / Sahanvi Vintage"] || 0}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </section> : null}

          {activeTab === "available" ? <section className="admin-inventory">
            <div className="admin-section-heading">
              <h2>Available Stock</h2>
              <p>{availableSarees.length} saree(s) currently available, grouped by category and saree type.</p>
            </div>
            {!availableSarees.length ? (
              <div className="admin-empty">No sarees uploaded yet. Add the first saree using the form above.</div>
            ) : Object.entries(groupedSarees).map(([group, items]) => (
              <div className="admin-inventory-group" key={group}>
                <h3>{group} <span>{items.length}</span></h3>
                <div className="admin-saree-table">
                  {items.map((saree) => (
                    <article className="admin-saree-row" key={saree.id}>
                      <img src={saree.imageUrl} alt={saree.name} />
                      <div>
                        <strong>{saree.name}</strong>
                        <p>{saree.code} · ₹{priceNumber(saree.price).toLocaleString("en-IN")}</p>
                        <small>Stock: {saree.stock ?? 1} · Fabric: {saree.fabric || "Not added"} · Blouse: {saree.blouseStatus || "Not added"}</small>
                        <small>Vendor: {saree.vendorName || saree.vendorId || "Not linked"}</small>
                        <small>{saree.description || "No description added"}</small>
                        <small>Availability: {saree.availability || "available"}</small>
                      </div>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => editSaree(saree)}>Edit</button>
                        <button type="button" onClick={() => removeSaree(saree.id)}>Remove</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section> : null}

          {activeTab === "sold" ? <section className="admin-orders">
            <div className="admin-section-heading">
              <h2>Sold Out</h2>
              <p>{soldItems.length} sold saree(s) from customer orders.</p>
            </div>
            {!soldItems.length ? (
              <div className="admin-empty">No sold sarees yet. Sold items will appear here after customers place orders.</div>
            ) : soldItems.map((item, index) => (
              <article className="admin-order-card" key={`${item.orderId}-${item.code || index}`}>
                {item.image ? <img src={item.image} alt={item.name || "Sold saree"} /> : null}
                <div>
                  <h3>{item.name || "Sahanvi Saree"}</h3>
                  <p>{item.code || item.orderId} · Order {item.orderId}</p>
                  <p>{item.customer?.name} · {item.customer?.phone}</p>
                  <p>{item.delivery?.address}</p>
                </div>
                <div>
                  <strong>{item.status}</strong>
                  <span>Sold</span>
                  <span>₹{priceNumber(item.price).toLocaleString("en-IN")}</span>
                </div>
              </article>
            ))}
          </section> : null}

          {activeTab === "inquiries" ? <section className="admin-orders">
            <div className="admin-section-heading">
              <h2>Customer Inquiries</h2>
              <p>{inquiries.length} message{inquiries.length === 1 ? "" : "s"} submitted from the website.</p>
            </div>
            {!inquiries.length ? (
              <div className="admin-empty">No customer inquiries yet.</div>
            ) : inquiries.map((inquiry) => (
              <article className="admin-order-card" key={inquiry.id}>
                <div>
                  <h3>{inquiry.subject}</h3>
                  <p>{inquiry.name} · {inquiry.phone}</p>
                  <p>{inquiry.email}</p>
                  <p>{inquiry.message}</p>
                </div>
                <div>
                  <strong>{inquiry.status}</strong>
                  <span>{new Date(inquiry.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </article>
            ))}
          </section> : null}
        </main>
      )}
    </div>
  );
}
