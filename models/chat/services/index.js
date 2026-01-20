const Chat = require("../chatModel");
const fs = require("fs");

module.exports.uploadChat = async (file) => {
  try {
    if (!file) {
      return { error: "No file provided" };
    }

    // Read file
    const text = fs.readFileSync(file.path, "utf-8");
    const lines = text.split("\n");

    const activeUsersDay = {};
    const newUsersDay = {};
    const userActivity = {};

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toDateString();
    }).reverse();

    const msgRegex = /\[(\d{1,2}\/\d{1,2}\/\d{4}), \d{1,2}:\d{2}\] (.*?): .*/;
    const joinRegex =
      /\[(\d{1,2}\/\d{1,2}\/\d{4}), \d{1,2}:\d{2}\] (.*?) joined using this group's invite link/;

    lines.forEach((line) => {
      const msgMatch = msgRegex.exec(line);
      const joinMatch = joinRegex.exec(line);

      if (msgMatch) {
        const [, dateStr, user] = msgMatch;
        const [day, month, year] = dateStr.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day); // month is 0-indexed
        const dateKey = dateObj.toDateString();

        if (last7Days.includes(dateKey)) {
          activeUsersDay[dateKey] ||= new Set();
          activeUsersDay[dateKey].add(user);

          userActivity[user] ||= new Set();
          userActivity[user].add(dateKey);
        }
      }

      if (joinMatch) {
        const [, dateStr, user] = joinMatch;
        const [day, month, year] = dateStr.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day); // month is 0-indexed
        const dateKey = dateObj.toDateString();

        if (last7Days.includes(dateKey)) {
          newUsersDay[dateKey] ||= new Set();
          newUsersDay[dateKey].add(user);
        }
      }
    });

    // Prepare graphData
    const graphData = last7Days.map((day) => ({
      date: day,
      activeUsers: activeUsersDay[day]?.size || 0,
      newUsers: newUsersDay[day]?.size || 0,
    }));

    const active4DaysUsers = Object.entries(userActivity)
      .filter(([, dates]) => dates.size >= 4)
      .map(([user]) => user);

    // Save to DB
    const chat = new Chat({
      fileName: file.originalname,
      graphData,
      active4DaysUsers,
    });

    await chat.save();

    // Delete temp file
    fs.unlinkSync(file.path);

    return {
      message: "Chat uploaded and saved successfully",
      data: { graphData, active4DaysUsers },
    };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports.getChatData = async () => {
  try {
    const chats = await Chat.find().sort({ uploadedAt: -1 });

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
    return { error: error.message };
  }
};
