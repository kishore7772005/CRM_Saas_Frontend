import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Building2,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Mail,
  User,
  ExternalLink,
  X,
} from "lucide-react";
import { superApi } from "../../services/api";

const SuperAdminTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await superApi.get("/tenants");
      if (res.data && Array.isArray(res.data.data)) {
        setTenants(res.data.data);
      } else if (res.data && Array.isArray(res.data)) {
        setTenants(res.data);
      } else {
        setTenants([]);
      }
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
      setError("Failed to fetch tenants from database. Please check your connection and try again.");
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Slugify helper
  const handleNameChange = (val) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/-+/g, "-"); // Collapse consecutive hyphens
    setSlug(generatedSlug);
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!name || !slug || !adminName || !adminEmail) return;

    setSubmitting(true);
    try {
      await superApi.post("/tenants/create", {
        name,
        slug,
        adminEmail,
        adminName,
      });

      // Clear fields & refresh
      setName("");
      setSlug("");
      setAdminName("");
      setAdminEmail("");
      setCreateOpen(false);
      fetchTenants();
    } catch (err) {
      console.error("Failed to create tenant:", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Failed to create tenant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      // Optimistic UI toggle
      setTenants((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isActive: !currentStatus } : t))
      );

      await superApi.patch(`/tenants/${id}/toggle`);
    } catch (err) {
      console.error("Failed to toggle tenant activation status:", err);
      // Revert UI toggle on error
      setTenants((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isActive: currentStatus } : t))
      );
      alert("Failed to change tenant state");
    }
  };

  const handleDeleteTenant = async () => {
    if (!deleteTarget) return;
    if (deleteConfirmText.toLowerCase() !== "delete") {
      alert("Please type 'delete' to confirm.");
      return;
    }

    try {
      await superApi.delete(`/tenants/${deleteTarget._id}`);
      setDeleteTarget(null);
      setDeleteConfirmText("");
      fetchTenants();
    } catch (err) {
      console.error("Failed to delete tenant:", err);
      alert("Failed to delete tenant");
    }
  };

  const filteredTenants = tenants.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.slug.toLowerCase().includes(query) ||
      t.adminEmail.toLowerCase().includes(query) ||
      t.adminName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tenant Organizations</h2>
          <p className="text-slate-500 text-sm">Provision, inspect, and configure multi-tenant databases.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTenants}
            className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer shadow-sm"
            title="Refresh database"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all shadow-md cursor-pointer text-sm"
          >
            <Plus size={18} />
            <span>Create Tenant</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
          <span>{error}</span>
        </div>
      )}

      {/* Control panel and Table */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by company name, slug, or admin details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white shadow-inner"
            />
          </div>
        </div>

        {/* Tenant Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-slate-600 uppercase text-xs font-bold border-b border-slate-200">
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="animate-spin text-slate-300" size={32} />
                      <span className="font-medium">Querying platform databases...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTenants.length > 0 ? (
                filteredTenants.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{t.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 bg-slate-50 rounded px-1.5 py-0.5 inline-block my-3 ml-6 border">
                      {t.slug}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{t.adminName}</span>
                        <span className="text-xs text-slate-500">{t.adminEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {t.createdAt ? format(new Date(t.createdAt), "MMM dd, yyyy") : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          t.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {t.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {/* Toggle active button */}
                        <button
                          onClick={() => handleToggleActive(t._id, t.isActive)}
                          className="text-slate-500 hover:text-slate-950 transition-colors cursor-pointer"
                          title={t.isActive ? "Deactivate Tenant" : "Activate Tenant"}
                        >
                          {t.isActive ? (
                            <ToggleRight size={28} className="text-slate-800" />
                          ) : (
                            <ToggleLeft size={28} className="text-slate-400" />
                          )}
                        </button>
                        {/* Launch portal button */}
                        <a
                          href={`/${t.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                          title="Open tenant portal"
                        >
                          <ExternalLink size={15} />
                        </a>
                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteTarget(t)}
                          className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-500 transition-all cursor-pointer"
                          title="Delete Tenant"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No tenants found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DIALOG MODAL */}
      {createOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="text-amber-500" size={22} />
                <h3 className="text-lg font-bold">Register New Tenant</h3>
              </div>
              <button
                onClick={() => setCreateOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stark Industries"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Tenant Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. stark-ind"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 font-mono text-xs"
                />
              </div>

              <div className="border-t border-slate-100 my-4" />

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Administrator Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tony Stark"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. tony@stark.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer text-sm shadow-md"
                >
                  {submitting ? "Provisioning..." : "Provision Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DANGER: DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-red-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={22} className="animate-bounce" />
                <h3 className="text-lg font-bold">Critical Action: Delete Tenant</h3>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800">
                <AlertTriangle size={24} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Destructive Action Warning</h4>
                  <p className="text-xs mt-1 leading-relaxed">
                    Deleting the tenant <strong>{deleteTarget.name}</strong> is permanent. This wipes all CRM leads, deals, proposals, invoices, settings, and documents under slug <strong>{deleteTarget.slug}</strong>. There is no undo.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Type <span className="font-bold text-red-600">"delete"</span> below to authorize:
                </label>
                <input
                  type="text"
                  placeholder="delete"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-mono text-center"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTenant}
                  disabled={deleteConfirmText.toLowerCase() !== "delete"}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 cursor-pointer text-sm shadow-md"
                >
                  Wipe Database
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminTenants;
