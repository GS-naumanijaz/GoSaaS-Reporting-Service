// URLS
// export const FrontendURL = "http://10.8.0.32.nip.io:5173";
// export const BackendURL = "http://10.8.0.32.nip.io:8080";
export const FrontendURL = "http://localhost:5173";
export const BackendURL = "http://localhost:8080";

// Color palette
export const primaryColor = "#D40B0B";
export const secondaryColor = "#D4C7B0";
export const tertiaryColor = "#F5F5F5";
export const disabledButton = "gray";

// Image Paths
export const GoSaaSLabsLogo: string =
  "https://gosaaslabs.com/wp-content/uploads/2022/02/GoSaaS-Labs-h.png";

// Main Component Heights
export const navbarHeight = "10vh";
export const sidebarHeight = "90vh";
export const mainDashboardHeight = "85vh";
export const pinnedRequestHeight = "42.5vh";
export const statusSummaryHeight = "42.5vh";

// Custom Scrollbar
export const sx = {
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: secondaryColor,
  },
  "&::-webkit-scrollbar-thumb": {
    background: primaryColor,
    borderRadius: "4px",
  },
  width: "100%",
};

// App Validations
export const minimumAppName = 3;
export const maximumAppName = 50;
export const minimumAppDescription = 20;
export const maximumAppDescription = 250;
