// DOM Elements
const menuToggle = document.querySelector(".menu-toggle");
const closeMenu = document.querySelector(".close-menu");
const sidebar = document.querySelector(".sidebar");

// Toggle menu with error handling
menuToggle?.addEventListener("click", () => {
  try {
    sidebar.classList.add("active");
    menuToggle.style.display = "none";
  } catch (error) {
    console.error("Error toggling menu:", error);
  }
});

// Close menu with error handling
closeMenu?.addEventListener("click", () => {
  try {
    sidebar.classList.remove("active");
    menuToggle.style.display = "flex";
  } catch (error) {
    console.error("Error closing menu:", error);
  }
});

// Mock admin data with fallback image
const admin = {
  userName: "Mohamed Hassan",
  image: "Img/mo.jpg",
  fallbackImage: "https://via.placeholder.com/45x45",
};

// Helper function to get first name
function getFirstName(fullName) {
  return fullName?.split(" ")[0] || "User";
}

// Memoized format functions for better performance
const memoizedFormatCurrency = (() => {
  const cache = new Map();
  return (number) => {
    if (cache.has(number)) return cache.get(number);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
    cache.set(number, formatted);
    return formatted;
  };
})();

const memoizedFormatNumber = (() => {
  const cache = new Map();
  return (number) => {
    if (cache.has(number)) return cache.get(number);
    const formatted =
      number >= 1000 ? (number / 1000).toFixed(1) + "k" : number.toString();
    cache.set(number, formatted);
    return formatted;
  };
})();

// Display the dashboard content with error handling
const displayDashboard = function () {
  try {
    if (!analyticsData) {
      throw new Error("Analytics data is not available");
    }

    const mainContent = document.querySelector(".main-content");
    if (!mainContent) {
      throw new Error("Main content container not found");
    }

    // Create a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    const container = document.createElement("div");

    // Add image error handling
    const adminImage = `<img src="${admin.image}" alt="Admin" onerror="this.src='${admin.fallbackImage}'; this.onerror=null;" />`;

    container.innerHTML = `
      <header class="dashboard-header">
        <div class="profile">
          <h2>Welcome, <span>${getFirstName(admin.userName)}</span></h2>
        </div>
        <div class="admin-info">
          ${adminImage}
          <span>${admin.userName}</span>
        </div>
      </header>
      
      <div class="analytics-container">
        <div class="analytics-grid">
          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="analytics-details">
              <h3>Total Users</h3>
              <div class="analytics-value">${memoizedFormatNumber(
                analyticsData.kpiData.users.total
              )}</div>
              <div class="trend" style="color: ${
                analyticsData.kpiData.users.isPositive ? "#28a745" : "#dc3545"
              }">
                <i class="fas fa-arrow-${
                  analyticsData.kpiData.users.isPositive ? "up" : "down"
                }"></i>
                ${analyticsData.kpiData.users.trend}%
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="analytics-details">
              <h3>Total Orders</h3>
              <div class="analytics-value">${memoizedFormatNumber(
                analyticsData.kpiData.orders.total
              )}</div>
              <div class="trend" style="color: ${
                analyticsData.kpiData.orders.isPositive ? "#28a745" : "#dc3545"
              }">
                <i class="fas fa-arrow-${
                  analyticsData.kpiData.orders.isPositive ? "up" : "down"
                }"></i>
                ${analyticsData.kpiData.orders.trend}%
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="analytics-details">
              <h3>Revenue</h3>
              <div class="analytics-value">${memoizedFormatCurrency(
                analyticsData.kpiData.revenue.total
              )}</div>
              <div class="trend" style="color: ${
                analyticsData.kpiData.revenue.isPositive ? "#28a745" : "#dc3545"
              }">
                <i class="fas fa-arrow-${
                  analyticsData.kpiData.revenue.isPositive ? "up" : "down"
                }"></i>
                ${analyticsData.kpiData.revenue.trend}%
              </div>
            </div>
          </div>

          <div class="analytics-card">
            <div class="analytics-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="analytics-details">
              <h3>Total Products</h3>
              <div class="analytics-value">${
                analyticsData.kpiData.products.total
              }</div>
              <div class="trend" style="color: ${
                analyticsData.kpiData.products.isPositive
                  ? "#28a745"
                  : "#dc3545"
              }">
                <i class="fas fa-arrow-${
                  analyticsData.kpiData.products.isPositive ? "up" : "down"
                }"></i>
                ${Math.abs(analyticsData.kpiData.products.trend)}%
              </div>
            </div>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-container">
            <h3>Revenue Growth</h3>
            <div class="chart">
              ${analyticsData.monthlyData.months
                .map((month, index) => {
                  const monthlyHeight =
                    (analyticsData.monthlyData.revenue[index] /
                      Math.max(...analyticsData.monthlyData.revenue)) *
                    100;
                  // Calculate cumulative revenue
                  const cumulativeRevenue = analyticsData.monthlyData.revenue
                    .slice(0, index + 1)
                    .reduce((sum, val) => sum + val, 0);
                  const cumulativeHeight =
                    (cumulativeRevenue /
                      (Math.max(...analyticsData.monthlyData.revenue) *
                        (index + 1))) *
                    100;

                  return `
                  <div class="bar-wrapper">
                    <div class="bar-group">
                      <div class="bar monthly-bar" style="height: ${monthlyHeight}%" title="${memoizedFormatCurrency(
                    analyticsData.monthlyData.revenue[index]
                  )} monthly"></div>
                      <div class="bar cumulative-bar" style="height: ${cumulativeHeight}%" title="${memoizedFormatCurrency(
                    cumulativeRevenue
                  )} cumulative"></div>
                    </div>
                    <span class="month">${month}</span>
                  </div>
                `;
                })
                .reverse()
                .join("")}
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color monthly-color"></div>
                <span>Monthly Revenue</span>
              </div>
              <div class="legend-item">
                <div class="legend-color cumulative-color"></div>
                <span>Cumulative Revenue</span>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h3>Orders vs Users</h3>
            <div class="chart">
              ${analyticsData.monthlyData.months
                .map((month, index) => {
                  const ordersHeight =
                    (analyticsData.monthlyData.orders[index] /
                      Math.max(...analyticsData.monthlyData.orders)) *
                    100;
                  const usersHeight =
                    (analyticsData.monthlyData.users[index] /
                      Math.max(...analyticsData.monthlyData.users)) *
                    100;
                  return `
                  <div class="bar-wrapper">
                    <div class="bar-group">
                      <div class="bar orders-bar" style="height: ${ordersHeight}%" title="${analyticsData.monthlyData.orders[index]} orders"></div>
                      <div class="bar users-bar" style="height: ${usersHeight}%" title="${analyticsData.monthlyData.users[index]} users"></div>
                    </div>
                    <span class="month">${month}</span>
                  </div>
                `;
                })
                .join("")}
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color orders-color"></div>
                <span>Orders</span>
              </div>
              <div class="legend-item">
                <div class="legend-color users-color"></div>
                <span>Users</span>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h3>Top Products</h3>
            <div style="padding: 20px 0;">
              ${analyticsData.topProducts
                .map((product) => {
                  const width =
                    (product.revenue /
                      Math.max(
                        ...analyticsData.topProducts.map((p) => p.revenue)
                      )) *
                    100;
                  return `
                  <div class="product-bar-wrapper">
                    <span class="product-name">${product.name}</span>
                    <div class="product-bar" style="width: ${width}%">
                      <span class="product-value">${memoizedFormatCurrency(
                        product.revenue
                      )}</span>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>

          <div class="chart-container">
            <h3>Geographic Distribution</h3>
            <div style="padding: 20px 0;">
              ${analyticsData.geographicData
                .map((region) => {
                  const width =
                    (region.revenue /
                      Math.max(
                        ...analyticsData.geographicData.map((r) => r.revenue)
                      )) *
                    100;
                  return `
                  <div class="region-bar-wrapper">
                    <span class="region-name">${region.region}</span>
                    <div class="region-bar" style="width: ${width}%">
                      <span class="region-value">${memoizedFormatCurrency(
                        region.revenue
                      )} | ${memoizedFormatNumber(region.orders)} orders</span>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    fragment.appendChild(container);
    mainContent.innerHTML = "";
    mainContent.appendChild(fragment);
  } catch (error) {
    console.error("Error displaying dashboard:", error);
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="color: #dc3545; padding: 20px; text-align: center;">
          <h2>Error Loading Dashboard</h2>
          <p>Please try refreshing the page. If the problem persists, contact support.</p>
        </div>
      `;
    }
  }
};

// Initialize the page with error handling
document.addEventListener("DOMContentLoaded", () => {
  try {
    displayDashboard();
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  }
});

// Add window resize handler for responsive charts
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    try {
      displayDashboard();
    } catch (error) {
      console.error("Error resizing dashboard:", error);
    }
  }, 250);
});
