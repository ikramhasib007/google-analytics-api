// Imports the Data library
const { BetaAnalyticsDataClient } = require("@google-analytics/data").v1beta;
const analyticsDataClient = new BetaAnalyticsDataClient();

const propertyId = process.env.PROPERTY_ID;

let googleAnalyticsApi = class {
  getAnalyticsData = async (startDate = "", endDate = "") => {
    try {
      let dateRange = {
        startDate: startDate ? startDate : "30daysAgo",
        endDate: endDate ? endDate : "today",
      };

      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dimensions: [{ name: "unifiedPagePathScreen" }],
        metrics: [
          { name: "activeUsers" },
          { name: "totalUsers" },
          { name: "sessions" },
          { name: "eventCount" },
        ],
        dateRanges: [dateRange],
        dimensionFilter: {
          filter: {
            fieldName: "unifiedPagePathScreen",
            stringFilter: {
              matchType: "CONTAINS",
              value: "products",
              caseSensitive: false,
            },
          },
        },
      });

      return { response };
    } catch (err) {
      throw err;
    }
  };
};

module.exports = {
  googleAnalyticsApi,
  // formats a number with thousand separator
  numberWithCommas: (x) => {
    try {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    } catch (err) {
      throw err;
    }
  }
}
