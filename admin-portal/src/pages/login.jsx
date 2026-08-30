import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedMessage = sessionStorage.getItem("portalAccessError");
    const storedType = sessionStorage.getItem("portalAccessType");

    if (storedMessage && storedType === "organizer-only") {
      setErrorMessage(storedMessage);

      sessionStorage.removeItem("portalAccessError");
      sessionStorage.removeItem("portalAccessType");
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerContainer}>
          <img src="/logo.jpeg" alt="Logo" style={styles.logo} />

          <div>
            <h2 style={styles.title}>Admin Portal</h2>

            <p style={styles.subtitle}>Colombo International Bookfair</p>
          </div>
        </div>

        {/* ACCESS RESTRICTED MESSAGE */}
        {errorMessage && (
          <div role="alert" style={styles.errorBox}>
            <div style={styles.errorHeader}>
              <div style={styles.errorIcon}>!</div>

              <div style={styles.errorContent}>
                <div style={styles.errorTitle}>Access Restricted</div>

                <div style={styles.errorMessage}>{errorMessage}</div>
              </div>

              <button
                type="button"
                onClick={() => setErrorMessage("")}
                style={styles.closeButton}
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <button onClick={login} style={styles.button}>
          🔐 Login with Asgardeo
        </button>

        <p style={styles.footer}>Secured by OpenID Connect (OIDC)</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  },

  logo: {
    height: "50px",
    width: "auto",
    objectFit: "contain",
  },

  title: {
    margin: "0 0 5px 0",
    color: "#333",
  },

  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
  },

  errorBox: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginBottom: "20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    textAlign: "left",
  },

  errorHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  errorIcon: {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    borderRadius: "50%",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    color: "#991b1b",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "4px",
  },

  errorMessage: {
    color: "#b91c1c",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  closeButton: {
    background: "none",
    border: "none",
    color: "#b91c1c",
    fontSize: "20px",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#005bb5",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "#888",
    marginTop: "16px",
    borderTop: "1px solid #eee",
    paddingTop: "16px",
  },
};

export default Login;
