export interface SoilDiagnosticResult {
  status: 'Optimal' | 'Deficient' | 'Needs Balancing' | 'Critical';
  overallScore: number; // 0-100
  nitrogenStatus: 'Low' | 'Medium' | 'High';
  phosphorusStatus: 'Low' | 'Medium' | 'High';
  potassiumStatus: 'Low' | 'Medium' | 'High';
  phStatus: 'Acidic' | 'Neutral' | 'Alkaline';
  moistureStatus: 'Low' | 'Optimal' | 'Waterlogged';
  recommendations: string[];
  organicRemedies: string[];
  suitableCrops: string[];
}

export function analyzeSoilHealth(
  nitrogen: number,
  phosphorus: number,
  potassium: number,
  ph: number,
  moisture: number,
  cropName?: string
): SoilDiagnosticResult {
  const recommendations: string[] = [];
  const organicRemedies: string[] = [];
  const suitableCrops: string[] = [];
  let score = 100;

  // 1. Nitrogen (N) Evaluation (Benchmark: 250 - 450 kg/ha)
  let nitrogenStatus: 'Low' | 'Medium' | 'High' = 'Medium';
  if (nitrogen < 250) {
    nitrogenStatus = 'Low';
    score -= 18;
    recommendations.push(
      `Nitrogen is critically low (${nitrogen} kg/ha). Apply Urea (46% N) at 55 kg/acre in split doses during active vegetative stage.`
    );
    organicRemedies.push('Incorporate well-decomposed Farm Yard Manure (FYM) or vermicompost at 2.5 tonnes/acre.');
  } else if (nitrogen > 450) {
    nitrogenStatus = 'High';
    score -= 8;
    recommendations.push(
      `Excess nitrogen detected (${nitrogen} kg/ha). Reduce chemical nitrogen applications to avoid succulent vegetative growth prone to sap-sucking pests.`
    );
  } else {
    recommendations.push(`Nitrogen level (${nitrogen} kg/ha) is in the optimal agronomic threshold.`);
  }

  // 2. Phosphorus (P) Evaluation (Benchmark: 25 - 55 kg/ha)
  let phosphorusStatus: 'Low' | 'Medium' | 'High' = 'Medium';
  if (phosphorus < 25) {
    phosphorusStatus = 'Low';
    score -= 15;
    recommendations.push(
      `Phosphorus deficiency detected (${phosphorus} kg/ha). Apply Single Super Phosphate (SSP) at 75 kg/acre as basal dose near root zone.`
    );
    organicRemedies.push('Treat seeds with Phosphate Solubilizing Bacteria (PSB) bio-inoculant at 250g per 10kg seeds.');
  } else if (phosphorus > 65) {
    phosphorusStatus = 'High';
    score -= 6;
    recommendations.push(`Phosphorus is high (${phosphorus} kg/ha). Avoid DAP/SSP applications for the current cropping cycle.`);
  } else {
    recommendations.push(`Phosphorus level (${phosphorus} kg/ha) supports vigorous root development.`);
  }

  // 3. Potassium (K) Evaluation (Benchmark: 150 - 300 kg/ha)
  let potassiumStatus: 'Low' | 'Medium' | 'High' = 'Medium';
  if (potassium < 150) {
    potassiumStatus = 'Low';
    score -= 15;
    recommendations.push(
      `Potassium is below threshold (${potassium} kg/ha). Apply Muriate of Potash (MOP) at 30 kg/acre to boost drought tolerance and grain weight.`
    );
    organicRemedies.push('Apply wood ash or green foliage mulching rich in natural potash.');
  } else if (potassium > 320) {
    potassiumStatus = 'High';
    score -= 5;
    recommendations.push(`Potassium is abundant (${potassium} kg/ha). Adequate cellular turgor guaranteed.`);
  } else {
    recommendations.push(`Potassium reserve (${potassium} kg/ha) is balanced.`);
  }

  // 4. pH Evaluation (Benchmark: 6.2 - 7.5)
  let phStatus: 'Acidic' | 'Neutral' | 'Alkaline' = 'Neutral';
  if (ph < 6.0) {
    phStatus = 'Acidic';
    score -= 20;
    recommendations.push(
      `Soil is acidic (pH ${ph.toFixed(1)}). Apply agricultural lime or dolomite at 200-300 kg/acre 3 weeks before sowing to neutralize acidity.`
    );
  } else if (ph > 7.8) {
    phStatus = 'Alkaline';
    score -= 20;
    recommendations.push(
      `Soil is alkaline/calcareous (pH ${ph.toFixed(1)}). Apply agricultural Gypsum at 400 kg/acre accompanied by sulfur dust to restore soil permeability.`
    );
    organicRemedies.push('Incorporate press mud or green manuring with Dhaincha (Sesbania bispinosa).');
  } else {
    recommendations.push(`Soil pH (${ph.toFixed(1)}) is neutral and optimal for broad nutrient bioavailability.`);
  }

  // 5. Moisture Evaluation (Benchmark: 40% - 70%)
  let moistureStatus: 'Low' | 'Optimal' | 'Waterlogged' = 'Optimal';
  if (moisture < 35) {
    moistureStatus = 'Low';
    score -= 12;
    recommendations.push(`Soil moisture is low (${moisture}%). Initiate drip irrigation cycle for 90 minutes; apply organic paddy straw mulch.`);
  } else if (moisture > 75) {
    moistureStatus = 'Waterlogged';
    score -= 15;
    recommendations.push(`Excess soil moisture (${moisture}%). Open field drainage furrows to prevent root hypoxia and collar rot.`);
  }

  // Determine overall status
  let status: 'Optimal' | 'Deficient' | 'Needs Balancing' | 'Critical' = 'Optimal';
  if (score >= 82) {
    status = 'Optimal';
  } else if (score >= 68) {
    status = 'Needs Balancing';
  } else if (score >= 50) {
    status = 'Deficient';
  } else {
    status = 'Critical';
  }

  // Suitable crops calculation based on pH and texture
  if (ph >= 6.0 && ph <= 7.5) {
    suitableCrops.push('Paddy (Rice)', 'Cotton', 'Wheat', 'Maize', 'Soybean', 'Groundnut', 'Tomato');
  } else if (ph < 6.0) {
    suitableCrops.push('Tea', 'Coffee', 'Potato', 'Sweet Potato', 'Rye', 'Oats');
  } else {
    suitableCrops.push('Barley', 'Mustard', 'Sugar Beet', 'Cotton', 'Pomegranate', 'Date Palm');
  }

  return {
    status,
    overallScore: Math.max(20, Math.min(100, score)),
    nitrogenStatus,
    phosphorusStatus,
    potassiumStatus,
    phStatus,
    moistureStatus,
    recommendations,
    organicRemedies,
    suitableCrops,
  };
}
