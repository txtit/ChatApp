import axios from "axios";

const API_KEY = "YOUR_API_KEY"; // Thay bằng API Key của bạn

export async function analyzeComment(text) {
  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;
  const body = {
    comment: { text },
    languages: ["vi"], // hoặc "en" nếu là tiếng Anh
    requestedAttributes: { TOXICITY: {} }
  };
  try {
    const res = await axios.post(url, body);
    // Trả về điểm TOXICITY (0-1)
    return res.data.attributeScores.TOXICITY.summaryScore.value;
  } catch (err) {
    console.error(err);
    return null;
  }
}