import axios from "axios";

const API_KEY = "AIzaSyBJSBYNkRyHMHUKe8dkdySIaVXZg6MPx4U"; // Thay bằng API Key của bạn

export async function moderateComment(text) {
  console.log("Moderating comment:", text);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  // const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  const prompt = `
Hãy phân tích bình luận sau và trả lời "YES" nếu nó chứa nội dung bạo lực, đe dọa, hoặc toxic. Nếu không, trả lời "NO".
Bình luận: "${text}"
Chỉ trả lời YES hoặc NO.
  `;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  try {
    const res = await axios.post(url, body);
    const reply = res.data.candidates[0].content.parts[0].text.trim().toUpperCase();
    console.log("Gemini reply:", reply);
    return reply === "YES";
  } catch (err) {
    console.error(err);
    return false;
  }
}