const https = require('https');

function parseCSV(csvText) {
  const lines = [];
  let currentLine = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentToken.trim());
      if (currentLine.length > 1 || currentLine[0] !== '') {
        lines.push(currentLine);
      }
      currentLine = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  if (currentToken !== '') {
    currentLine.push(currentToken.trim());
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Cache on Vercel CDN for 1 hour (3600 seconds)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.setHeader('Content-Type', 'application/json');

  const url = 'https://companiesmarketcap.com/?download=csv';

  try {
    const csvData = await new Promise((resolve, reject) => {
      https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download data, status: ${response.statusCode}`));
          return;
        }
        let body = '';
        response.on('data', chunk => { body += chunk; });
        response.on('end', () => resolve(body));
      }).on('error', reject);
    });

    const parsed = parseCSV(csvData);
    if (parsed.length <= 1) {
      throw new Error("No data rows found in CSV");
    }

    // Map rows to compact format: {r, n, s, m, p, c}
    const rows = parsed.slice(1)
      .filter(row => row.length >= 6 && row[0] && row[1] && row[3])
      .map(row => ({
        r: parseInt(row[0]),
        n: row[1],
        s: row[2] || '',
        m: parseFloat(row[3]) || 0,
        p: parseFloat(row[4]) || 0,
        c: row[5] || ''
      }));

    const now = new Date();
    const fetchedAt = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    res.status(200).json({
      fetchedAt,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
