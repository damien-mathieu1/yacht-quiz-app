export interface YachtData {
  name: string;
  builder: string;
  value: string;
  owner: string;
  flag: string;
  year_delivered: string;
  refit: string;
  length: string;
  beam: string;
  gross_tonnage: string;
  cruising_speed: string;
  top_speed: string;
  naval_architect: string;
  exterior_designer: string;
  interior_designer: string;
  rank: string;
  profile_picture: string;
}

export function parseCSV(csvText: string): YachtData[] {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 3) return []; // Need at least header + 1 data row

  // Headers are on the second line (index 1). Skip the first empty column.
  const headers = lines[1].split(',').map(h => h.trim()).slice(1);
  const yachts: YachtData[] = [];

  // Data starts from the third line (index 2).
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip the first empty column in data rows as well.
    const values = parseCSVLine(line).slice(1);
    
    if (values.length < headers.length) continue;

    const yacht: any = {};
    headers.forEach((header, index) => {
      if (header) {
        yacht[header] = values[index]?.trim() || '';
      }
    });

    if (yacht.name) {
      yachts.push(yacht as YachtData);
    }
  }

  return yachts;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}