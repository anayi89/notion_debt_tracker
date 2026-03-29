const NOTION_SECRET = process.env.NOTION_SECRET;
const NOTION_VERSION = "2022-06-28";

exports.handler = async (event) => {
  // Strip both the redirect path (/api) and the direct function path
  const path = event.path
    .replace(/^\/.netlify\/functions\/notion/, "")
    .replace(/^\/api/, "");
  const url = `https://api.notion.com/v1${path}`;

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

  return {
    statusCode: response.status,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data),
  };
};
