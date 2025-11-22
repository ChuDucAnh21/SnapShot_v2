import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import axios from 'axios';

const BASE_URL = 'https://iruka-learning-api-1037337851453.asia-southeast1.run.app';
const OUTPUT_DIR = join(process.cwd(), 'scripts', 'api-responses');

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

const endpoints = [
  {
    name: 'health',
    url: `${BASE_URL}/health`,
    method: 'GET',
  },
  {
    name: 'subjects',
    url: `${BASE_URL}/subjects`,
    method: 'GET',
  },
  {
    name: 'courses',
    url: `${BASE_URL}/courses?subject=vi`,
    method: 'GET',
  },
  {
    name: 'tracks',
    url: `${BASE_URL}/tracks?course=vi-34`,
    method: 'GET',
  },
  {
    name: 'track-path',
    url: `${BASE_URL}/tracks/vi-34-sgk-be-lam-quen-voi-chu-cai/path`,
    method: 'GET',
  },
  {
    name: 'lesson-detail',
    url: `${BASE_URL}/lessons/vi-34-sgk-be-lam-quen-voi-chu-cai-l1`,
    method: 'GET',
  },
  {
    name: 'anchor-equivalents',
    url: `${BASE_URL}/anchors/letter-o/equivalents?course=vi-34`,
    method: 'GET',
  },
  {
    name: 'catalog-subjects',
    url: `${BASE_URL}/catalog/subjects`,
    method: 'GET',
  },
  {
    name: 'catalog-track-overview',
    url: `${BASE_URL}/catalog/tracks/vi-34-sgk-be-lam-quen-voi-chu-cai`,
    method: 'GET',
  },
];

async function fetchEndpoint(endpoint) {
  try {
    console.log(`Fetching ${endpoint.name}...`);
    const response = await axios({
      method: endpoint.method,
      url: endpoint.url,
      timeout: 30000,
    });

    const outputPath = join(OUTPUT_DIR, `${endpoint.name}.json`);
    writeFileSync(outputPath, JSON.stringify(response.data, null, 2), 'utf-8');
    console.log(`✅ Saved ${endpoint.name} to ${outputPath}`);
    return { name: endpoint.name, success: true, data: response.data };
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint.name}:`, error.message);
    if (error.response) {
      const errorData = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      };
      const outputPath = join(OUTPUT_DIR, `${endpoint.name}-error.json`);
      writeFileSync(outputPath, JSON.stringify(errorData, null, 2), 'utf-8');
      console.log(`⚠️  Saved error response to ${outputPath}`);
    }
    return { name: endpoint.name, success: false, error: error.message };
  }
}

async function main() {
  console.log('Starting API fetch script...\n');
  const results = [];

  for (const endpoint of endpoints) {
    const result = await fetchEndpoint(endpoint);
    results.push(result);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== Summary ===');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  // Save summary
  const summaryPath = join(OUTPUT_DIR, 'summary.json');
  writeFileSync(
    summaryPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        total: results.length,
        successful,
        failed,
        results: results.map(r => ({
          name: r.name,
          success: r.success,
        })),
      },
      null,
      2,
    ),
    'utf-8',
  );
  console.log(`\n📄 Summary saved to ${summaryPath}`);
}

main().catch(console.error);
