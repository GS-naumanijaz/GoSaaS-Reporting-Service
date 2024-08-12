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
export const mainDashboardHeight = "90vh";
export const pinnedRequestHeight = "50vh";
export const statusSummaryHeight = "40vh";

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
};

// App Validations
export const minimumAppName = 3;
export const maximumAppName = 20;
export const minimumAppDescription = 20;
export const maximumAppDescription = 250;
