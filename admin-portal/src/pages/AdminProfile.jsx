import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminProfile.css";
import "../components/NavBar.css";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminProfile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const clearMessageSoon = () => {
    window.setTimeout(() => setMessage(null), 3500);
  };

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get("/users/me");
      setProfile(res.data);
    } catch (err) {
      setProfile(null);
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to load profile." });
      clearMessageSoon();
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const passwordChecks = useMemo(() => {
    const pwd = form.newPassword || "";
    return {
      minLength: pwd.length >= 8,
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[^A-Za-z\d]/.test(pwd),
      matchesConfirm:
        form.confirmPassword.length > 0 && pwd.length > 0 && pwd === form.confirmPassword,
    };
  }, [form.confirmPassword, form.newPassword]);

  const canSubmit = useMemo(() => {
    const checksOk =
      passwordChecks.minLength &&
      passwordChecks.hasLower &&
      passwordChecks.hasNumber &&
      passwordChecks.hasSpecial &&
      (form.newPassword?.length ?? 0) > 0 &&
      form.newPassword === form.confirmPassword;

    return !submitting && checksOk;
  }, [form.confirmPassword, form.newPassword, passwordChecks, submitting]);

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." });
      clearMessageSoon();
      return;
    }

    const policyOk =
      passwordChecks.minLength &&
      passwordChecks.hasLower &&
      passwordChecks.hasNumber &&
      passwordChecks.hasSpecial;

    if (!policyOk) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters and include lowercase, number, and special character.",
      });
      clearMessageSoon();
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/users/me/password", {
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully." });
      setForm({ newPassword: "", confirmPassword: "" });
      await loadProfile(); // refresh lastUpdatedAt
      clearMessageSoon();
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to change password." });
      clearMessageSoon();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="adminProfilePage">
      <div className="adminProfileTopbar">
        <div className="adminProfileTitle">
          <h1>
            Profile <span className="adminProfileBadge">ReserveX Admin Portal</span>
          </h1>
          <p>Account details and security settings.</p>
        </div>

        <div className="adminProfileTopbarActions">
          <Link to="/dashboard" className="apBtn apBtnSecondary">
            Back to Dashboard
          </Link>
          <button
            type="button"
            className="apBtn apBtnDanger"
              onClick={() => setShowLogoutModal(true)}
          >
            Sign Out
          </button>
        </div>
      </div>

      {message && (
        <div className={`apAlert ${message.type === "success" ? "success" : "error"}`}>
          {message.text}
        </div>
      )}

      <div className="adminProfileLayout">
        <aside className="adminProfileCard">
          <div className="adminProfileCardHeader">
            <div className="adminProfileAvatar" aria-hidden="true">
              {profile?.username?.slice(0, 1)?.toUpperCase() || "A"}
            </div>
            <div className="adminProfileCardMeta">
              <div className="adminProfileName">
                {profile?.username || user?.username || "—"}
              </div>
              <div className="adminProfileSub">
                {profile?.email || user?.sub || "—"}
              </div>
              <div className="adminProfileRolePill">
                {(profile?.role || user?.role || "EMPLOYEE").toString().replace("ROLE_", "")}
              </div>
                <div className="adminProfileStatusRow">
                  <span className="adminProfileStatusDot" />
                  <span className="adminProfileStatusText">Active</span>
                </div>
            </div>
          </div>

          <div className="adminProfileCardBody">
            <div className="adminProfileKV">
              <div className="k">Created at</div>
              <div className="v">{formatDateTime(profile?.createdAt)}</div>
            </div>
            <div className="adminProfileKV">
              <div className="k">Last updated</div>
              <div className="v">{formatDateTime(profile?.lastUpdatedAt)}</div>
            </div>
          </div>
        </aside>

        <main className="adminProfileMain">
          <section className="apSection">
            <div className="apSectionHeader">
              <h2>Account Details</h2>
              <p>Username and email are managed by super admins.</p>
            </div>

            <div className="apStack">
              <div className="apField apFieldSpaced">
                <label htmlFor="username">Username</label>
                <input id="username" value={profile?.username || ""} readOnly />
              </div>
              <div className="apField apFieldSpaced">
                <label htmlFor="email">Email</label>
                <input id="email" value={profile?.email || ""} readOnly />
              </div>
            </div>

            {loadingProfile && <div className="apHint">Loading profile…</div>}
            {!loadingProfile && !profile && (
              <div className="apHint apHintError">
                Couldn’t load profile. Please try again.
              </div>
            )}
          </section>

          <section className="apSection">
            <div className="apSectionHeader">
              <h2>Change Password</h2>
              <p>Use a strong password that you don’t reuse elsewhere.</p>
            </div>

            <form onSubmit={handleChangePassword} className="apForm">
              <div className="apGrid2">
                <div className="apField apSpan2">
                  <label htmlFor="currentPassword">Current password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value="********"
                    readOnly
                  />
                </div>

                <div className="apField">
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                    placeholder="New password"
                    required
                  />
                </div>

                <div className="apField">
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              {form.newPassword.length > 0 && (
                <div className="apPolicy">
                  <div className={`apPolicyItem ${passwordChecks.minLength ? "ok" : "bad"}`}>At least 8 characters</div>
                  <div className={`apPolicyItem ${passwordChecks.hasLower ? "ok" : "bad"}`}>At least 1 lowercase letter</div>
                  <div className={`apPolicyItem ${passwordChecks.hasNumber ? "ok" : "bad"}`}>At least 1 number</div>
                  <div className={`apPolicyItem ${passwordChecks.hasSpecial ? "ok" : "bad"}`}>At least 1 special character</div>
                  <div className={`apPolicyItem ${passwordChecks.matchesConfirm ? "ok" : "bad"}`}>Matches confirmation</div>
                </div>
              )}

              <div className="apActions">
                <button
                  type="button"
                  className="apBtn apBtnSecondary"
                  onClick={() => {
                    setForm({ newPassword: "", confirmPassword: "" });
                    setMessage(null);
                    loadProfile();
                  }}
                  disabled={submitting}
                >
                  Refresh
                </button>
                <button type="submit" className="apBtn apBtnPrimary" disabled={!canSubmit}>
                  {submitting ? "Changing…" : "Change Password"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>

      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-buttons">
              <button
                type="button"
                className="logout-modal-btn confirm-btn"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  navigate("/");
                }}
              >
                Yes, Logout
              </button>
              <button
                type="button"
                className="logout-modal-btn cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
