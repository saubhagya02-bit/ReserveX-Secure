import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

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

        <button onClick={login} style={styles.button}>
          🔐 Login with Asgardeo
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#888",
            marginTop: "16px",
          }}
        >
          Secured by OpenID Connect (OIDC)
        </p>
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
  logo: { height: "50px", width: "auto", objectFit: "contain" },
  title: { margin: "0 0 5px 0", color: "#333" },
  subtitle: { margin: 0, color: "#666", fontSize: "14px" },
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
};

export default Login;
