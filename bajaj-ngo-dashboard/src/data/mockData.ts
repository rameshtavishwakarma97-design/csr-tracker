// Comprehensive mock data for all dashboard screens

export const PROGRAM_STATS = {
  totalBeneficiaries: 42850,
  activeNGOs: 14,
  districtsCovered: 28,
  surveyCompletion: 92,
  overduePartners: 2,
  onTrackPartners: 12,
  qoqGrowth: 12,
};

export const COHORT_BREAKDOWN = [
  { phase: 'Phase 1', label: 'Enrolled & Profiling', count: 8200, color: '#b8c3d5' },
  { phase: 'Phase 2', label: 'Training & Early Signals', count: 12650, color: '#3d9fd9' },
  { phase: 'Phase 3', label: 'Impact Assessment', count: 22000, color: '#0c0f14' },
];

export const NGO_PARTNERS = [
  { name: 'Pratham Foundation', state: 'Maharashtra', cohorts: 4, enrolled: 12450, completion: 98, surveyStatus: 'on-track', incomeChange: 28, phase: 3 },
  { name: 'Smile Foundation', state: 'MP', cohorts: 5, enrolled: 15100, completion: 94, surveyStatus: 'on-track', incomeChange: 22, phase: 3 },
  { name: 'Magic Bus', state: 'Maharashtra', cohorts: 3, enrolled: 8200, completion: 85, surveyStatus: 'overdue', incomeChange: 12, phase: 2 },
  { name: 'Goonj', state: 'MP', cohorts: 2, enrolled: 4100, completion: 91, surveyStatus: 'on-track', incomeChange: 19, phase: 2 },
  { name: 'Akanksha Foundation', state: 'Maharashtra', cohorts: 2, enrolled: 3000, completion: 78, surveyStatus: 'overdue', incomeChange: 8, phase: 1 },
];

// F-02 Baseline Profile
export const OCCUPATION_BREAKDOWN = [
  { occupation: 'Vegetable & Fruit Vendors', pct: 38, count: 16283 },
  { occupation: 'Tailors & Garment Workers', pct: 24, count: 10284 },
  { occupation: 'Mobile & Electronics Repair', pct: 17, count: 7285 },
  { occupation: 'Daily Wage Workers', pct: 12, count: 5142 },
  { occupation: 'Others', pct: 9, count: 3856 },
];

export const GENDER_SPLIT = { female: 58, male: 42 };

export const INCOME_RANGE_BASELINE = [
  { range: 'Below ₹5,000', pct: 41, count: 17569 },
  { range: '₹5,000 – ₹10,000', pct: 44, count: 18854 },
  { range: 'Above ₹10,000', pct: 15, count: 6428 },
];

export const BUSINESS_STATUS_BASELINE = [
  { status: 'Already Running Business', pct: 61, count: 26139 },
  { status: 'Planning to Start', pct: 28, count: 12000 },
  { status: 'No Business Activity', pct: 11, count: 4711 },
];

export const FINANCIAL_ACCESS_BASELINE = {
  bankAccount: 54,
  formalCredit: 14,
  digitalPayments: 31,
};

export const TECH_ACCESS = {
  smartphone: 68,
  appDownloaded: 61,
  surveyOnly: 32,
};

// F-03 Training & Early Signals
export const TRAINING_COMPLETION = {
  overall: 84,
  byNGO: [
    { ngo: 'Pratham', rate: 89, gender_f: 91, gender_m: 87 },
    { ngo: 'Smile Foundation', rate: 86, gender_f: 88, gender_m: 83 },
    { ngo: 'Magic Bus', rate: 71, gender_f: 74, gender_m: 68 },
    { ngo: 'Goonj', rate: 82, gender_f: 83, gender_m: 81 },
  ],
};

export const EARLY_BUSINESS_ACTIVITY = {
  startedNewBusiness: 34,
  existingGrowth: 48,
  noChange: 18,
};

export const EARLY_DIGITAL_ADOPTION = {
  upiAdopters: 29,
  whatsappBusiness: 22,
  bookkeepingApp: 11,
};

export const EARLY_FINANCIAL_ACCESS = {
  newBankAccounts: 18,
  firstFormalCredit: 12,
};

// F-04 Income Change
export const INCOME_TRAJECTORY = [
  { round: 'M0 Baseline', median: 5400, label: 'Enrollment' },
  { round: 'M3 Follow-up', median: 5900, label: '3 Months' },
  { round: 'M6 Endline', median: 6900, label: '6 Months' },
];

export const INCOME_CHANGE_DISTRIBUTION = [
  { range: 'Declined (>10%)', pct: 8, count: 3428 },
  { range: 'No Change (±10%)', pct: 19, count: 8142 },
  { range: 'Moderate Growth (10–30%)', pct: 38, count: 16283 },
  { range: 'Strong Growth (30–50%)', pct: 24, count: 10284 },
  { range: 'Very Strong (>50%)', pct: 11, count: 4714 },
];

export const INCOME_BY_OCCUPATION = [
  { occupation: 'Tailors', baseline: 5800, endline: 7600, change: 31 },
  { occupation: 'Mobile Repair', baseline: 6200, endline: 8100, change: 31 },
  { occupation: 'Veg. Vendors', baseline: 4800, endline: 5900, change: 23 },
  { occupation: 'Daily Wage', baseline: 4200, endline: 4900, change: 17 },
  { occupation: 'Others', baseline: 5100, endline: 6100, change: 20 },
];

// F-05 Entrepreneurship
export const ENTREPRENEURSHIP = {
  businessEntryRate: { baseline: 61, endline: 79, new_entrants: 7739 },
  growthRate: { pct: 68, count: 14978 },
  wageToSelfEmploy: { pct: 24, count: 10284 },
};

// F-06 Business Sustainability
export const SUSTAINABILITY = {
  survivalRate6M: 78,
  byOccupation: [
    { occupation: 'Mobile Repair', rate: 87 },
    { occupation: 'Tailors', rate: 82 },
    { occupation: 'Veg. Vendors', rate: 71 },
    { occupation: 'Daily Wage', rate: 64 },
  ],
};

// F-07 Digital Adoption
export const DIGITAL_ADOPTION = {
  upiPayments: { baseline: 31, endline: 64, change: 33 },
  whatsappBusiness: { baseline: 18, endline: 47, change: 29 },
  bookkeepingApp: { baseline: 6, endline: 28, change: 22 },
};

// F-08 Financial Access
export const FINANCIAL_ACCESS = {
  bankAccount: { baseline: 54, endline: 76, change: 22 },
  formalCredit: { baseline: 14, endline: 31, change: 17 },
  savingsBehaviour: { baseline: 34, endline: 58, change: 24 },
};

// F-09 Pre/Post Summary
export const PRE_POST_SUMMARY = [
  { metric: 'Business Running', baseline: 61, endline: 79, unit: '%', highlight: true },
  { metric: 'Median Monthly Income', baseline: 5400, endline: 6900, unit: '₹', highlight: false },
  { metric: 'Bank Account Access', baseline: 54, endline: 76, unit: '%', highlight: false },
  { metric: 'Digital Payments', baseline: 31, endline: 64, unit: '%', highlight: true },
  { metric: 'Formal Credit Access', baseline: 14, endline: 31, unit: '%', highlight: false },
  { metric: 'Business Survival (6M)', baseline: null, endline: 78, unit: '%', highlight: false },
];

// F-10 Geographic Comparison
export const GEO_COMPARISON = [
  { district: 'Pune', state: 'MH', enrolled: 8200, incomeChange: 28, businessEntry: 81, survival: 84, digitalAdoption: 71, creditAccess: 38 },
  { district: 'Nagpur', state: 'MH', enrolled: 5100, incomeChange: 21, businessEntry: 76, survival: 79, digitalAdoption: 62, creditAccess: 29 },
  { district: 'Aurangabad', state: 'MH', enrolled: 4200, incomeChange: 19, businessEntry: 74, survival: 67, digitalAdoption: 58, creditAccess: 24 },
  { district: 'Bhopal', state: 'MP', enrolled: 6400, incomeChange: 25, businessEntry: 78, survival: 81, digitalAdoption: 64, creditAccess: 33 },
  { district: 'Indore', state: 'MP', enrolled: 5800, incomeChange: 22, businessEntry: 77, survival: 80, digitalAdoption: 67, creditAccess: 30 },
  { district: 'Jabalpur', state: 'MP', enrolled: 4100, incomeChange: 18, businessEntry: 71, survival: 73, digitalAdoption: 52, creditAccess: 22 },
];

// F-11 NGO Performance
export const NGO_PERFORMANCE = [
  { ngo: 'Pratham Foundation', enrolled: 12450, completion: 98, baselineIncome: 5200, endlineIncome: 6800, businessEntry: 81, survival: 84, digitalAdoption: 71 },
  { ngo: 'Smile Foundation', enrolled: 15100, completion: 94, baselineIncome: 5400, endlineIncome: 6900, businessEntry: 79, survival: 78, digitalAdoption: 64 },
  { ngo: 'Magic Bus', enrolled: 8200, completion: 85, baselineIncome: 5100, endlineIncome: 5700, businessEntry: 65, survival: 67, digitalAdoption: 58 },
  { ngo: 'Goonj', enrolled: 4100, completion: 91, baselineIncome: 4800, endlineIncome: 5900, businessEntry: 74, survival: 76, digitalAdoption: 61 },
];

// F-12 Training vs Outcome
export const TRAINING_VS_OUTCOME = [
  { completionBracket: 'Below 60%', avgIncomeChange: 9, businessEntry: 54, n: 4280 },
  { completionBracket: '60–75%', avgIncomeChange: 16, businessEntry: 64, n: 8560 },
  { completionBracket: '75–90%', avgIncomeChange: 24, businessEntry: 76, n: 18420 },
  { completionBracket: 'Above 90%', avgIncomeChange: 32, businessEntry: 86, n: 11590 },
];
