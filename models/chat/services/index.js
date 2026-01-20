const Chat = require("../chatModel");
const fs = require("fs");

module.exports.uploadChat = async (file) => {
  try {
    if (!file) {
      return { error: "No file provided" };
    }

    const text = fs.readFileSync(file.path, "utf-8");
    const lines = text.split("\n");

    const activeUsersDay = {};
    const newUsersDay = {};
    const userActivity = {};

    // ───────────────────────────────────────────────
    // 1. First pass: find the latest date in the chat
    // ───────────────────────────────────────────────
    let latestDate = null;

    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),/;
    lines.forEach((line) => {
      const match = dateRegex.exec(line.trim());
      if (match) {
        let [, month, day, yearStr] = match;
        const year =
          yearStr.length === 2 ? 2000 + Number(yearStr) : Number(yearStr);
        const date = new Date(year, Number(month) - 1, Number(day));
        if (!isNaN(date.getTime()) && (!latestDate || date > latestDate)) {
          latestDate = date;
        }
      }
    });

    if (!latestDate) {
      return { error: "Could not detect any valid dates in the chat file" };
    }

    // Calculate last 7 days based on the chat's latest date
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(latestDate);
      d.setDate(latestDate.getDate() - i);
      return d.toDateString();
    }).reverse();

    // ───────────────────────────────────────────────
    // 2. Regexes (flexible whitespace handling)
    // ───────────────────────────────────────────────
    const msgRegex =
      /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s+(\d{1,2}:\d{2})\s+(AM|PM)\s*-\s*(.+?):\s*(.*)$/i;

    const joinRegex =
      /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s+(\d{1,2}:\d{2})\s+(AM|PM)\s*-\s*(.+?)(?:joined using this group's invite link|added .+?|created group)/i;

    // ───────────────────────────────────────────────
    // 3. Parse each line
    // ───────────────────────────────────────────────
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Try message first
      let match = msgRegex.exec(trimmed);
      if (match) {
        const [, month, day, yearStr, time, ampm, user, msg] = match;
        const year =
          yearStr.length === 2 ? 2000 + Number(yearStr) : Number(yearStr);
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

        if (isNaN(dateObj.getTime())) return;

        const dateKey = dateObj.toDateString();
        const trimmedUser = user.trim();

        if (last7Days.includes(dateKey)) {
          activeUsersDay[dateKey] = activeUsersDay[dateKey] || new Set();
          activeUsersDay[dateKey].add(trimmedUser);

          userActivity[trimmedUser] = userActivity[trimmedUser] || new Set();
          userActivity[trimmedUser].add(dateKey);
        }
        return;
      }

      // Then try join/added/created
      match = joinRegex.exec(trimmed);
      if (match) {
        const [, month, day, yearStr, time, ampm, rest] = match;
        const year =
          yearStr.length === 2 ? 2000 + Number(yearStr) : Number(yearStr);
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

        if (isNaN(dateObj.getTime())) return;

        const dateKey = dateObj.toDateString();
        // Extract name before "added", "joined", etc.
        const userMatch = rest.match(
          /^(.+?)(?:\s+added|\s+joined|\s+created)/i,
        );
        const user = userMatch ? userMatch[1].trim() : rest.trim();

        if (last7Days.includes(dateKey)) {
          newUsersDay[dateKey] = newUsersDay[dateKey] || new Set();
          newUsersDay[dateKey].add(user);
        }
      }
    });

    // ───────────────────────────────────────────────
    // 4. Build graph data
    // ───────────────────────────────────────────────
    const graphData = last7Days.map((day) => ({
      date: day,
      activeUsers: activeUsersDay[day]?.size || 0,
      newUsers: newUsersDay[day]?.size || 0,
    }));

    // Users active on ≥ 4 of the last 7 days
    const active4DaysUsers = Object.entries(userActivity)
      .filter(([, dates]) => dates.size >= 4)
      .map(([user]) => user);

    // ───────────────────────────────────────────────
    // 5. Save to database
    // ───────────────────────────────────────────────
    const chat = new Chat({
      fileName: file.originalname,
      graphData,
      active4DaysUsers,
      periodStart: last7Days[0],
      periodEnd: last7Days[last7Days.length - 1],
    });

    await chat.save();
    fs.unlinkSync(file.path);

    return {
      message: "Chat uploaded and analyzed successfully",
      data: {
        graphData,
        active4DaysUsers,
        period: {
          start: last7Days[0],
          end: last7Days[last7Days.length - 1],
        },
        totalActiveDaysDetected: Object.keys(activeUsersDay).length,
      },
    };
  } catch (error) {
    console.error("Upload chat error:", error);
    return { error: error.message || "Failed to process chat file" };
  }
};

module.exports.getChatData = async () => {
  try {
    const chats = await Chat.find().sort({ uploadedAt: -1 }).limit(20); // optional limit

    if (!chats || chats.length === 0) {
      return {
        message: "No chat data available",
        data: [],
      };
    }

    return {
      message: "Chat data fetched successfully",
      data: chats,
    };
  } catch (error) {
    console.error("Get chat data error:", error);
    return { error: error.message };
  }
};
