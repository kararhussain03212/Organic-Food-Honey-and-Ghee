import { useEffect, useState } from "react";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../api/apiClient";
import "../styles/UserAddresses.css";

export default function UserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    label: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      if (editingId) {
        await updateAddress(editingId, form);
        setSuccess("Address updated successfully!");
      } else {
        await createAddress(form);
        setSuccess("Address created successfully!");
      }

      resetForm();
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (address) => {
    setForm({
      label: address.label,
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      email: address.email,
      street_address: address.street_address,
      apartment: address.apartment,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      setError("");
      await deleteAddress(id);
      setSuccess("Address deleted successfully!");
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setError("");
      await updateAddress(id, { is_default: true });
      setSuccess("Default address updated!");
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      label: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      street_address: "",
      apartment: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="user-addresses">
      <div className="addresses-header">
        <h2>My Addresses</h2>
        {!showForm && (
          <button className="btn-add-address" onClick={() => setShowForm(true)}>
            + Add New Address
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="address-form-container">
          <form className="address-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Address Label (e.g., Home, Office)</label>
                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  placeholder="e.g., Home"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street_address"
                  value={form.street_address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Apartment / Suite (Optional)</label>
                <input
                  type="text"
                  name="apartment"
                  value={form.apartment}
                  onChange={handleChange}
                  placeholder="Apt, Suite, etc."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  name="is_default"
                  id="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                />
                <label htmlFor="is_default">Set as default address</label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="empty-state">
          <p>No addresses yet.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add your first address
          </button>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div key={address.id} className={`address-card ${address.is_default ? "default" : ""}`}>
              {address.is_default && <span className="badge-default">Default</span>}
              {address.label && <div className="address-label">{address.label}</div>}
              <div className="address-content">
                <p className="address-name">
                  {address.first_name} {address.last_name}
                </p>
                <p className="address-street">{address.street_address}</p>
                {address.apartment && <p className="address-apartment">{address.apartment}</p>}
                <p className="address-city">
                  {address.city}
                  {address.state && `, ${address.state}`}
                  {address.postal_code && ` ${address.postal_code}`}
                </p>
                <p className="address-country">{address.country}</p>
                <p className="address-phone">{address.phone}</p>
                {address.email && <p className="address-email">{address.email}</p>}
              </div>
              <div className="address-actions">
                {!address.is_default && (
                  <button
                    className="btn-link"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </button>
                )}
                <button className="btn-link edit" onClick={() => handleEdit(address)}>
                  Edit
                </button>
                <button
                  className="btn-link delete"
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
