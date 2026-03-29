const NOTION_SECRET = process.env.NOTION_SECRET;
const NOTION_VERSION = "2022-06-28";

exports.handler = async (event) => {
  // Debug logging — check Netlify Function logs to see these
  console.log("RAW event.path:", event.path);
  console.log("RAW event.rawUrl:", event.rawUrl);

  // Strip both possible prefixes
  const path = event.path
    .replace(/^\/.netlify\/functions\/notion/, "")
    .replace(/^\/api/, "");

  const url = `https://api.notion.com/v1${path}`;
  console.log("CONSTRUCTED url:", url);

  const headers = {
    "Authorization": `Bearer ${NOTION_SECRET}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: event.httpMethod,
    headers,
    body: event.body || undefined,
  });

  const data = await response.json();
  console.log("NOTION response status:", response.status);
  console.log("NOTION response body:", JSON.stringify(data));

  return {
    statusCode: response.status,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data),
  };
};
