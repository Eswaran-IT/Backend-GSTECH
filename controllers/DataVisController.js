const { getConnection } = require("../config/db");

// Helper to safely parse JSON
const safeParseJSON = (str, fallback = []) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// Helper to map object counts to array
const mapToArray = (map) =>
  Object.entries(map).map(([name, count]) => ({ name, count }));

// Main Controller
const getDetailedAnalytics = async (req, res) => {
  try {
    const db = getConnection();
    const [rows] = await db.query("SELECT * FROM user_tracking");

    const {
      startDate,
      endDate,
      country,
      device,
      os,
      browser,
      userType,
      section,
    } = req.query;

    let filteredRows = [...rows];

    // ✅ Filters
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredRows = filteredRows.filter((row) => {
        const date = new Date(row.entry_date);
        return date >= start && date <= end;
      });
    }

    if (country) {
      filteredRows = filteredRows.filter(
        (r) => r.country?.toLowerCase() === country.toLowerCase()
      );
    }

    if (device) {
      filteredRows = filteredRows.filter((r) =>
        r.device_info?.toLowerCase().includes(device.toLowerCase())
      );
    }

    if (os) {
      filteredRows = filteredRows.filter((r) =>
        r.os_info?.toLowerCase().includes(os.toLowerCase())
      );
    }

    if (browser) {
      filteredRows = filteredRows.filter((r) =>
        r.browser_info?.toLowerCase().includes(browser.toLowerCase())
      );
    }

    if (userType === "new") {
      filteredRows = filteredRows.filter((r) => r.is_new_user === 1);
    } else if (userType === "returning") {
      filteredRows = filteredRows.filter((r) => r.is_new_user === 0);
    }

    if (section) {
      filteredRows = filteredRows.filter((r) => {
        const viewed = safeParseJSON(r.section_viewed);
        return viewed.some((s) => s.section === section);
      });
    }

    // ✅ Total Visitors
    const totalVisitors = filteredRows.length;

    // ✅ Visitors Per Day (last 7)
    const now = new Date();
    const visitorsPerDay = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const dateStr = day.toISOString().split("T")[0];
      const count = filteredRows.filter(
        (r) => new Date(r.entry_date).toISOString().split("T")[0] === dateStr
      ).length;
      return { date: dateStr, count };
    });

    // ✅ Country Breakdown
    const countryMap = {};
    filteredRows.forEach((r) => {
      const c = r.country || "Unknown";
      countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const visitorsByCountry = mapToArray(countryMap);

    // ✅ Section Views
    const sectionMap = {};
    filteredRows.forEach((r) => {
      const viewed = safeParseJSON(r.section_viewed);
      viewed.forEach(({ section }) => {
        if (section) sectionMap[section] = (sectionMap[section] || 0) + 1;
      });
    });
    const sectionCounts = mapToArray(sectionMap).map(({ name, count }) => ({
      section: name,
      views: count,
    }));

    // ✅ Avg. Time Spent
    const totalTime = filteredRows.reduce(
      (sum, r) => sum + (r.time_spent || 0),
      0
    );
    const avgTimeSpent = totalVisitors
      ? Math.round(totalTime / totalVisitors)
      : 0;

    // ✅ New vs Returning Users
    const newUsers = filteredRows.filter((r) => r.is_new_user === 1).length;
    const returningUsers = totalVisitors - newUsers;

    // ✅ Peak Hours
    const hourMap = {};
    filteredRows.forEach((r) => {
      const hour = r.entry_time?.split(":")[0];
      if (hour !== undefined) {
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      }
    });
    const peakHours = mapToArray(hourMap)
      .map(({ name, count }) => ({
        hour: `${name}:00`,
        count,
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // ✅ Device, OS, Browser Stats
    const deviceMap = {},
      osMap = {},
      browserMap = {};

    filteredRows.forEach((r) => {
      if (r.device_info)
        deviceMap[r.device_info] = (deviceMap[r.device_info] || 0) + 1;
      if (r.os_info) osMap[r.os_info] = (osMap[r.os_info] || 0) + 1;
      if (r.browser_info)
        browserMap[r.browser_info] =
          (browserMap[r.browser_info] || 0) + 1;
    });

    // ✅ Final Response
    return res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        avgTimeSpent,
        visitorsPerDay,
        visitorsByCountry,
        sectionCounts,
        userTypeStats: { newUsers, returningUsers },
        peakHours,
        devices: mapToArray(deviceMap),
        os: mapToArray(osMap),
        browsers: mapToArray(browserMap),
      },
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
};

module.exports = { getDetailedAnalytics };
