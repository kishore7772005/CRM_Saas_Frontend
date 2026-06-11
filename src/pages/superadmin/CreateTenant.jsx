import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, Mail, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { superApi } from "../../services/api";

const CreateTenant = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    if (!name || !slug || !adminName || !adminEmail || !adminPassword) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await superApi.post("/tenants/create", {
        name,
        slug,
        adminEmail,
        adminName,
        adminPassword,
      });

      // Clear fields & navigate
      setName("");
      setSlug("");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
      navigate("/superadmin/tenants");
    } catch (err) {
      console.error("Failed to create tenant:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to provision database for new tenant."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/superadmin/tenants")}
          className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Register New Tenant</h2>
          <p className="text-slate-500 text-sm">Provision a new isolated database and tenant organization.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-start space-x-2">
          <ShieldAlert className="flex-shrink-0 mt-0.5" size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center space-x-2">
          <Building2 className="text-amber-500" size={22} />
          <h3 className="text-lg font-bold">Organization & Database Setup</h3>
        </div>

        <form onSubmit={handleCreateTenant} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stark Industries"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Tenant Slug
              </label>
              <input
                type="text"
                required
                placeholder="e.g. stark-ind"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all font-mono text-xs shadow-inner"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-6" />

          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2 text-slate-600 mb-6">
            <User className="flex-shrink-0 mt-0.5" size={16} />
            <span className="text-xs">
              This setup automatically spawns a dedicated database, registers Admin and Sales roles, and provisions the initial Administrator account below.
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Administrator Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tony Stark"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. tony@stark.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Administrator Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/superadmin/tenants")}
              className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer text-sm shadow-md flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Provisioning Database...</span>
                </>
              ) : (
                <span>Provision Organization</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenant;
