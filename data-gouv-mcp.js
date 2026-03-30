/**
 * data-gouv-mcp.js
 *
 * Demonstrates how to use the official data.gouv.fr MCP server
 * (https://mcp.data.gouv.fr/mcp) to explore and query the
 * "Données des entreprises utilisées dans l'Annuaire des Entreprises" dataset.
 *
 * MCP Server: https://mcp.data.gouv.fr/mcp  (Streamable HTTP transport)
 * Dataset:    https://www.data.gouv.fr/datasets/donnees-des-entreprises-utilisees-dans-lannuaire-des-entreprises
 *
 * No API key required for read-only access.
 *
 * Usage:
 *   node data-gouv-mcp.js
 */

// ─── Dataset identifier ────────────────────────────────────────────────────────
// Taken from the slug in the dataset URL on data.gouv.fr
const DATASET_ID = "donnees-des-entreprises-utilisees-dans-lannuaire-des-entreprises";

const MCP_URL = "https://mcp.data.gouv.fr/mcp";

// ─── Minimal MCP JSON-RPC client ──────────────────────────────────────────────
let _requestId = 1;

/**
 * Calls a single MCP tool via the Streamable HTTP transport.
 * The server speaks JSON-RPC 2.0 over POST /mcp.
 *
 * @param {string} toolName   - One of the tool names listed below
 * @param {object} toolArgs   - Arguments for that tool
 * @returns {Promise<any>}    - Parsed tool result content
 */
async function callMcpTool(toolName, toolArgs = {}) {
  const body = JSON.stringify({
    jsonrpc: "2.0",
    id: _requestId++,
    method: "tools/call",
    params: {
      name: toolName,
      arguments: toolArgs,
    },
  });

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    throw new Error(`MCP HTTP error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(`MCP tool error: ${JSON.stringify(json.error)}`);
  }

  // The result lives in json.result.content – an array of content blocks.
  const content = json.result?.content;
  if (!content || content.length === 0) return null;

  // Most tools return a single text block; parse it as JSON when possible.
  const text = content[0]?.text ?? "";
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ─── Available MCP Tools ──────────────────────────────────────────────────────
//
//  Dataset tools
//  ┌──────────────────────────────┬────────────────────────────────────────────────────┐
//  │ Tool                         │ Required params                                    │
//  ├──────────────────────────────┼────────────────────────────────────────────────────┤
//  │ search_datasets              │ query (string)                                     │
//  │ get_dataset_info             │ dataset_id (string)                                │
//  │ list_dataset_resources       │ dataset_id (string)                                │
//  │ get_resource_info            │ resource_id (string)                               │
//  │ query_resource_data          │ question (string), resource_id (string)            │
//  │ download_and_parse_resource  │ resource_id (string)                               │
//  │ get_metrics                  │ dataset_id | resource_id (optional)                │
//  ├──────────────────────────────┼────────────────────────────────────────────────────┤
//  │ search_dataservices          │ query (string)                                     │
//  │ get_dataservice_info         │ dataservice_id (string)                            │
//  │ get_dataservice_openapi_spec │ dataservice_id (string)                            │
//  └──────────────────────────────┴────────────────────────────────────────────────────┘

// ─── Step 1 – Get dataset metadata ────────────────────────────────────────────
async function getDatasetInfo() {
  console.log("📦 Fetching dataset metadata…");
  const info = await callMcpTool("get_dataset_info", { dataset_id: DATASET_ID });
  console.log("Title      :", info?.title ?? info);
  console.log("Description:", (info?.description ?? "").slice(0, 200));
  console.log("Organization:", info?.organization?.name);
  console.log("Last update:", info?.last_modified);
  console.log("License    :", info?.license);
  console.log();
  return info;
}

// ─── Step 2 – List resources (files) in the dataset ───────────────────────────
async function listResources() {
  console.log("📂 Listing resources inside the dataset…");
  const resources = await callMcpTool("list_dataset_resources", {
    dataset_id: DATASET_ID,
  });

  const list = Array.isArray(resources) ? resources : resources?.data ?? [];
  list.forEach((r, i) => {
    console.log(
      `  [${i + 1}] ${r.title ?? r.id}  |  format: ${r.format ?? "?"}  |  id: ${r.id}`
    );
  });
  console.log();
  return list;
}

// ─── Step 3 – Query a resource via the Tabular API ────────────────────────────
async function queryResource(resourceId, question) {
  console.log(`🔍 Querying resource ${resourceId}…`);
  console.log(`   Question: "${question}"`);

  const result = await callMcpTool("query_resource_data", {
    resource_id: resourceId,
    question,
    page: 1,
    page_size: 10, // fetch up to 10 rows
  });

  console.log("Result:", JSON.stringify(result, null, 2));
  console.log();
  return result;
}

// ─── Step 4 – Enrich French Tech funding data with company details ─────────────
/**
 * Given a SIREN number, query the Annuaire des Entreprises resource for
 * key company fields useful for the funding tracker:
 *   - Dénomination sociale (legal name)
 *   - Code APE / NAF (activity sector)
 *   - Forme juridique (legal form)
 *   - Tranche d'effectif (headcount band)
 *   - Siège social (registered address)
 *
 * @param {string} resourceId  - The Tabular-API-enabled resource from the dataset
 * @param {string} siren       - 9-digit SIREN identifier
 */
async function enrichCompanyBySiren(resourceId, siren) {
  const question = `Give me all available fields for the company with SIREN ${siren}`;
  return queryResource(resourceId, question);
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("  data.gouv.fr MCP – Annuaire des Entreprises explorer");
  console.log("=".repeat(60));
  console.log();

  // 1. Metadata
  await getDatasetInfo();

  // 2. Resources
  const resources = await listResources();

  if (resources.length === 0) {
    console.log("No resources found. Check the dataset ID.");
    return;
  }

  // Pick the first resource that supports the Tabular API (preferred for queries).
  // Fall back to the first resource if none is explicitly flagged.
  const tabulaResource =
    resources.find((r) => r.tabular_api_available === true) ?? resources[0];

  console.log(`✅ Using resource: ${tabulaResource.title ?? tabulaResource.id}`);
  console.log();

  // 3. Example queries – adapt these for your French Tech funding tracker
  await queryResource(
    tabulaResource.id,
    "List the first 10 companies with their name, SIREN, and sector (code APE)"
  );

  // 4. Targeted lookup by SIREN (example: Doctolib – 794 914 762)
  await enrichCompanyBySiren(tabulaResource.id, "794914762");

  // 5. Lookup for SIREN 994 675 254
  console.log("=".repeat(60));
  console.log("  Looking up SIREN 994 675 254");
  console.log("=".repeat(60));
  console.log();
  await enrichCompanyBySiren(tabulaResource.id, "994675254");
}

main().catch(console.error);
