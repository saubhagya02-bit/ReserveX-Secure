export const authConfig = {
  signInRedirectURL: "http://localhost:5173",
  signOutRedirectURL: "http://localhost:5173",
  clientID: "GrByd_4rHInFKwLxguyv79OqcaIa",
  baseUrl: "https://api.asgardeo.io/t/reservex",
  scope: ["openid", "profile", "email", "roles"],
  storage: "sessionStorage",
  resourceServerURLs: ["https://localhost:8443"],

  disableTrySignInSilently: true,
  enableOIDCSessionManagement: false,
};
