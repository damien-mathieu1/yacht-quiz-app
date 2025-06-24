import { Yacht } from '../types/yacht';
import { parseCSV, YachtData } from '../utils/csvParser';

// This will be populated from CSV data
let generatedYachts: Yacht[] = [];

// Load CSV data and convert to yacht objects
export async function loadYachtsFromCSV(): Promise<Yacht[]> {
  try {
    const response = await fetch('/data.csv');
    const csvText = await response.text();
    const yachtData = parseCSV(csvText);
    generatedYachts = yachtData.map(convertToYacht);
    return generatedYachts;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return getSampleYachts();
  }
}

function convertToYacht(data: YachtData): Yacht {
  return {
    name: data.name,
    builder: data.builder,
    value: data.value,
    owner: data.owner,
    flag: data.flag,
    year_delivered: data.year_delivered,
    refit: data.refit,
    length: data.length,
    beam: data.beam,
    gross_tonnage: data.gross_tonnage,
    cruising_speed: data.cruising_speed,
    top_speed: data.top_speed,
    naval_architect: data.naval_architect,
    exterior_designer: data.exterior_designer,
    interior_designer: data.interior_designer,
    rank: data.rank,
    profile_picture: data.profile_picture
  };
}

export function getYachts(): Yacht[] {
  return generatedYachts;
}

// Sample yachts as fallback
function getSampleYachts(): Yacht[] {
  return [
    {
      name: "Azzam",
      builder: "Lürssen Yachts (Germany)",
      value: "600 000 000 $",
      owner: "Mohammed bin Zayed Al Nahyan",
      flag: "United Arab Emirates",
      year_delivered: "2013",
      refit: "",
      length: "180.61m",
      beam: "20.8m",
      gross_tonnage: "13,136",
      cruising_speed: "12 kn",
      top_speed: "33 kn",
      naval_architect: "Lürssen Yachts (Germany)",
      exterior_designer: "Nauta Yachts S.R.L (Italy)",
      interior_designer: "Christophe Leoni (France)",
      rank: "1",
      profile_picture: "https://image.yachtcharterfleet.com/w1277/h618/qh/ca/m2/k1aa9e49e/vessel/resource/124097/charter-azzam-yacht.jpg"
    }
  ];
}