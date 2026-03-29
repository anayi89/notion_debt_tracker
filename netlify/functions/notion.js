const NOTION_SECRET = process.env.NOTION_SECRET;
const NOTION_VERSION = "2022-06-28";

// Notion database IDs must be UUID-formatted with dashes
// e.g. 3324d4d0-d797-80cc-b214-f6dbe7a31340
function formatUUID(id) {
  const clean = id.replace(/-/g, "");
  if (clean.length !== 32) return id; // return as-is if not a valid ID
  return `${clean.slice(0,8)}-${clean.slice(8,12)}-${clean.slice(12,16)}-${clean.slice(16,20)}-${clean.slice(20)}`;
}

exports.handler = async (event) => {
  // Re-format any UUID-like segments in the path
  const rawPath = event.path
    .replace(/^\/.netlify\/functions\/notion/, "")
    .replace(/^\/api/, "");

  // Insert dashes into any 32-char hex segment (database/page IDs)
  const path = rawPath.replace(/[a-f0-9]{32}/gi, match => formatUUID(match));
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

  return {
    statusCode: response.status,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data),
  };
};
