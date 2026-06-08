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
  imageUrl: "",
  description: ""
};

function priceNumber(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
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
  const [status, setStatus] = useState("");

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    const phone = String(auth?.user?.phone || "").replace(/\D/g, "");
    setAllowed(auth?.user?.role === "admin" || ["9704888933", "9949779227"].includes(phone));
    setSarees(JSON.parse(localStorage.getItem("sahanvi-admin-sarees") || "[]"));
    setOrders(JSON.parse(localStorage.getItem("sahanvi-orders") || "[]"));
    setReturns(JSON.parse(localStorage.getItem("sahanvi-return-requests") || "[]"));
    setAuthReady(true);
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
    return sarees.filter((saree) => !soldCodes.has(saree.code));
  }, [sarees, soldCodes]);

  const soldItems = useMemo(() => {
    return orders.flatMap((order) =>
      (order.items || []).map((item) => ({
        ...item,
        orderId: order.id,
        customer: order.customer,
        delivery: order.delivery,
        status: order.status
      }))
    );
  }, [orders]);

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
    const { name, value } = event.target;
    if (name === "category") {
      const nextType = value === "Sahanvi Vintage" ? "Sahanvi Vintage" : menus[value]?.[0] || "";
      setForm((current) => ({ ...current, category: value, type: nextType }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const nextSaree = {
      ...form,
      id: editingId || `SR-${Date.now()}`,
      uploadedAt: editingId ? sarees.find((item) => item.id === editingId)?.uploadedAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const nextSarees = editingId
      ? sarees.map((item) => (item.id === editingId ? nextSaree : item))
      : [nextSaree, ...sarees];

    setSarees(nextSarees);
    localStorage.setItem("sahanvi-admin-sarees", JSON.stringify(nextSarees));
    setStatus(editingId ? "Saree details updated." : "Saree uploaded and listed in admin.");
    setActiveTab("available");

    try {
      const formData = new FormData();
      Object.entries(nextSaree).forEach(([key, value]) => formData.append(key, value));
      await fetch(apiUrl("/api/sarees"), { method: "POST", body: formData });
    } catch {
      setStatus("Saved in admin. Backend upload will sync when server is available.");
    }

    setEditingId("");
    setForm(emptyForm);
  }

  function editSaree(saree) {
    setEditingId(saree.id);
    setForm({
      category: saree.category,
      type: saree.type,
      name: saree.name,
      code: saree.code,
      price: saree.price,
      imageUrl: saree.imageUrl,
      description: saree.description
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
              ["available", "Available Stock"]
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
                <label><span>Cloudinary Image URL</span><input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} placeholder="https://res.cloudinary.com/..." required /></label>
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
                        <small>{saree.description || "No description added"}</small>
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
        </main>
      )}
    </div>
  );
}
