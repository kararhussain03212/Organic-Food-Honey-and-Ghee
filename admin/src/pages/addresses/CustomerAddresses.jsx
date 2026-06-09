import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendRoot } from "../../api/runtimeApi";

export default function CustomerAddresses() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomerAddresses();
  }, []);

  const fetchCustomerAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getBackendRoot()}/api/admin/customers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Failed to fetch customers");
      }

      const result = await response.json();
      setCustomers(result.data || []);
    } catch (err) {
      setError(err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.addresses?.some(
        (addr) =>
          addr.city?.toLowerCase().includes(searchLower) ||
          addr.street_address?.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Customer Addresses</h1>
          <p className="text-muted">Manage customer delivery and billing addresses</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="pi pi-exclamation-circle"></span>
          {error}
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="pi pi-search"></span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="pi pi-spin pi-spinner"></span>
          <p>Loading customer addresses...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <span className="pi pi-inbox"></span>
          <p>{searchTerm ? "No customers found matching your search" : "No customer addresses yet"}</p>
        </div>
      ) : (
        <div className="customers-list">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-info">
                  <h3>{customer.name}</h3>
                  <p className="email">{customer.email}</p>
                  <span className="address-count">
                    {customer.addresses?.length || 0} address{customer.addresses?.length !== 1 ? "es" : ""}
                  </span>
                </div>
              </div>

              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="addresses-list">
                  {customer.addresses.map((address) => (
                    <div key={address.id} className={`address-item ${address.is_default ? "default" : ""}`}>
                      {address.is_default && <span className="badge-default">Default</span>}
                      <div className="address-info">
                        {address.label && <div className="address-label">{address.label}</div>}
                        <p className="name">
                          {address.first_name} {address.last_name}
                        </p>
                        <p className="street">{address.street_address}</p>
                        {address.apartment && <p className="apartment">{address.apartment}</p>}
                        <p className="city">
                          {address.city}
                          {address.state && `, ${address.state}`}
                          {address.postal_code && ` ${address.postal_code}`}
                        </p>
                        <p className="country">{address.country}</p>
                        <p className="phone">{address.phone}</p>
                        {address.email && <p className="email">{address.email}</p>}
                      </div>
                      <div className="address-meta">
                        <small className="text-muted">
                          Added: {new Date(address.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-addresses">
                  <p className="text-muted">No addresses saved</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-container {
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: var(--admin-primary);
          margin-bottom: 0.5rem;
        }

        .page-header .text-muted {
          color: var(--admin-muted);
        }

        .alert {
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .alert-error {
          background: rgba(192, 57, 43, 0.1);
          color: #c0392b;
          border: 1px solid #f5b3b1;
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1.5px solid var(--admin-border);
          border-radius: 10px;
          background: var(--admin-card);
          color: var(--admin-primary);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-box input:focus {
          border-color: var(--admin-accent);
        }

        .search-box .pi {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--admin-muted);
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: var(--admin-card);
          border: 1.5px dashed var(--admin-border);
          border-radius: 12px;
          color: var(--admin-muted);
        }

        .loading-state .pi,
        .empty-state .pi {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--admin-muted);
        }

        .customers-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .customer-card {
          background: var(--admin-card);
          border: 1.5px solid var(--admin-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .customer-header {
          padding: 1.5rem;
          border-bottom: 1.5px solid var(--admin-border);
          background: rgba(199, 166, 107, 0.05);
        }

        .customer-info h3 {
          margin: 0 0 0.3rem 0;
          color: var(--admin-primary);
          font-size: 1.1rem;
        }

        .customer-info .email {
          margin: 0;
          color: var(--admin-muted);
          font-size: 0.9rem;
        }

        .address-count {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.25rem 0.7rem;
          background: rgba(73, 99, 72, 0.1);
          color: var(--admin-primary);
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .addresses-list {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .address-item {
          background: var(--admin-bg);
          border: 1px solid var(--admin-border);
          border-radius: 10px;
          padding: 1rem;
          position: relative;
        }

        .address-item.default {
          background: rgba(73, 99, 72, 0.05);
          border-color: var(--admin-primary);
        }

        .badge-default {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--admin-primary);
          color: white;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .address-info {
          margin-bottom: 0.8rem;
        }

        .address-label {
          color: var(--admin-accent);
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .address-info .name {
          margin: 0 0 0.3rem 0;
          font-weight: 600;
          color: var(--admin-primary);
        }

        .address-info .street {
          margin: 0 0 0.1rem 0;
          color: var(--admin-primary);
          font-size: 0.95rem;
        }

        .address-info .apartment {
          margin: 0 0 0.3rem 0;
          color: var(--admin-muted);
          font-size: 0.85rem;
        }

        .address-info .city {
          margin: 0 0 0.2rem 0;
          color: var(--admin-primary);
          font-size: 0.9rem;
        }

        .address-info .country {
          margin: 0 0 0.3rem 0;
          color: var(--admin-muted);
          font-size: 0.85rem;
        }

        .address-info .phone {
          margin: 0 0 0.1rem 0;
          color: var(--admin-primary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .address-info .email {
          margin: 0;
          color: var(--admin-muted);
          font-size: 0.85rem;
        }

        .address-meta {
          padding-top: 0.8rem;
          border-top: 1px solid var(--admin-border);
        }

        .no-addresses {
          padding: 2rem 1rem;
          text-align: center;
          color: var(--admin-muted);
        }

        .text-muted {
          color: var(--admin-muted);
        }
      `}</style>
    </div>
  );
}
