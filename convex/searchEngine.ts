// SEO-Style Search Engine for Cepat Hire Job Matching
// Provides keyword matching, synonym expansion, fuzzy search, and relevance scoring

// ============================================
// JOB SYNONYMS - Maps keywords to related terms
// ============================================
export const JOB_SYNONYMS: Record<string, string[]> = {
  // F&B Industry
  'waiter': ['waiter', 'waitress', 'server', 'waitstaff', 'f&b', 'fnb', 'food', 'restaurant', 'cafe', 'dining', 'service crew'],
  'waitress': ['waiter', 'waitress', 'server', 'waitstaff', 'f&b', 'fnb', 'food', 'restaurant', 'cafe', 'dining', 'service crew'],
  'server': ['waiter', 'waitress', 'server', 'waitstaff', 'f&b', 'fnb', 'food', 'restaurant', 'cafe'],
  'barista': ['barista', 'coffee', 'cafe', 'beverage', 'drinks'],
  'cook': ['cook', 'chef', 'kitchen', 'culinary', 'food preparation', 'line cook', 'prep cook'],
  'chef': ['chef', 'cook', 'head chef', 'sous chef', 'kitchen', 'culinary', 'pastry'],
  'bartender': ['bartender', 'bar', 'mixologist', 'drinks', 'beverage'],
  'dishwasher': ['dishwasher', 'kitchen helper', 'kitchen', 'cleaning'],

  // Retail
  'cashier': ['cashier', 'checkout', 'counter', 'sales', 'retail', 'pos', 'point of sale'],
  'sales': ['sales', 'salesperson', 'sales associate', 'retail', 'shop assistant', 'store'],
  'retail': ['retail', 'sales', 'shop', 'store', 'customer service', 'merchandiser'],
  'promoter': ['promoter', 'brand ambassador', 'marketing', 'roadshow', 'events', 'sales'],

  // Delivery & Logistics
  'driver': ['driver', 'delivery', 'rider', 'courier', 'dispatch', 'transport', 'lorry', 'van'],
  'delivery': ['delivery', 'driver', 'rider', 'courier', 'despatch', 'food delivery', 'parcel'],
  'rider': ['rider', 'delivery', 'motorcycle', 'grab', 'foodpanda', 'lalamove'],
  'warehouse': ['warehouse', 'logistics', 'inventory', 'storage', 'picker', 'packer', 'fulfillment'],

  // Office & Admin
  'admin': ['admin', 'administrative', 'clerk', 'office', 'secretary', 'receptionist', 'data entry'],
  'receptionist': ['receptionist', 'front desk', 'office', 'admin', 'customer service', 'front office'],
  'clerk': ['clerk', 'admin', 'office', 'data entry', 'filing', 'administrative'],
  'secretary': ['secretary', 'admin', 'personal assistant', 'pa', 'executive assistant'],
  'accountant': ['accountant', 'accounting', 'finance', 'bookkeeper', 'accounts'],

  // Education
  'tutor': ['tutor', 'teacher', 'educator', 'instructor', 'teaching', 'academic', 'coaching'],
  'teacher': ['teacher', 'tutor', 'educator', 'instructor', 'lecturer', 'teaching'],

  // Cleaning & Maintenance
  'cleaner': ['cleaner', 'cleaning', 'housekeeping', 'janitor', 'hygiene', 'sanitation', 'maid'],
  'housekeeping': ['housekeeping', 'cleaner', 'room attendant', 'hotel', 'cleaning'],
  'security': ['security', 'guard', 'security guard', 'watchman', 'patrol'],

  // Tech & IT
  'developer': ['developer', 'programmer', 'software engineer', 'coder', 'web developer', 'frontend', 'backend'],
  'designer': ['designer', 'graphic designer', 'ui designer', 'ux designer', 'visual designer', 'creative'],
  'it': ['it', 'information technology', 'tech support', 'helpdesk', 'technical'],

  // Healthcare
  'nurse': ['nurse', 'nursing', 'healthcare', 'medical', 'caregiver', 'clinic'],
  'caregiver': ['caregiver', 'care assistant', 'nursing aide', 'eldercare', 'childcare', 'babysitter'],

  // Customer Service
  'customer service': ['customer service', 'cs', 'call center', 'support', 'helpdesk', 'service'],

  // Events & Hospitality
  'event': ['event', 'events', 'event crew', 'event staff', 'usher', 'banquet', 'convention'],
  'hotel': ['hotel', 'hospitality', 'front desk', 'housekeeping', 'concierge'],
};

// ============================================
// LOCATION MAPPINGS - Malaysia-specific
// ============================================
export const LOCATION_MAPPINGS: Record<string, string[]> = {
  // Kuala Lumpur
  'kl': ['kuala lumpur', 'kl', 'klang valley', 'city centre', 'bukit bintang', 'klcc', 'bangsar', 'mont kiara', 'cheras'],
  'kuala lumpur': ['kuala lumpur', 'kl', 'klang valley'],

  // Selangor
  'pj': ['petaling jaya', 'pj', 'selangor', 'ss2', 'damansara'],
  'petaling jaya': ['petaling jaya', 'pj', 'selangor'],
  'shah alam': ['shah alam', 'selangor', 'section'],
  'subang': ['subang jaya', 'subang', 'usj', 'ss15', 'sunway'],
  'sunway': ['sunway', 'subang', 'bandar sunway'],
  'cyberjaya': ['cyberjaya', 'putrajaya'],
  'putrajaya': ['putrajaya', 'cyberjaya'],
  'klang': ['klang', 'port klang', 'selangor'],
  'selangor': ['selangor', 'pj', 'petaling jaya', 'shah alam', 'subang', 'klang', 'cyberjaya', 'kajang', 'ampang'],
  'kajang': ['kajang', 'selangor', 'bangi'],
  'ampang': ['ampang', 'selangor', 'kl'],
  'damansara': ['damansara', 'pj', 'ttdi', 'ss2'],
  'puchong': ['puchong', 'selangor'],

  // Other States
  'jb': ['johor bahru', 'jb', 'johor'],
  'johor bahru': ['johor bahru', 'jb', 'johor'],
  'johor': ['johor', 'jb', 'johor bahru'],
  'penang': ['penang', 'pulau pinang', 'georgetown', 'butterworth', 'bayan lepas'],
  'ipoh': ['ipoh', 'perak'],
  'perak': ['perak', 'ipoh'],
  'melaka': ['melaka', 'malacca'],
  'malacca': ['melaka', 'malacca'],
  'kuching': ['kuching', 'sarawak'],
  'sarawak': ['sarawak', 'kuching'],
  'kota kinabalu': ['kota kinabalu', 'kk', 'sabah'],
  'sabah': ['sabah', 'kota kinabalu', 'kk'],
  'kedah': ['kedah', 'alor setar', 'langkawi'],
  'langkawi': ['langkawi', 'kedah'],
  'terengganu': ['terengganu', 'kuala terengganu'],
  'pahang': ['pahang', 'kuantan', 'cameron highlands'],
  'negeri sembilan': ['negeri sembilan', 'seremban', 'nilai'],
  'seremban': ['seremban', 'negeri sembilan'],

  // Remote
  'remote': ['remote', 'work from home', 'wfh', 'online', 'anywhere', 'hybrid'],
  'wfh': ['remote', 'work from home', 'wfh'],
  'work from home': ['remote', 'work from home', 'wfh', 'online'],
};

// ============================================
// WORD STEMMING - Reduce words to root form
// ============================================
export function stemWord(word: string): string {
  const w = word.toLowerCase();

  // Handle common suffixes
  const suffixRules: Array<{ suffix: string; minLength: number }> = [
    { suffix: 'tion', minLength: 4 },
    { suffix: 'sion', minLength: 4 },
    { suffix: 'ment', minLength: 4 },
    { suffix: 'ness', minLength: 4 },
    { suffix: 'ing', minLength: 3 },
    { suffix: 'ers', minLength: 3 },
    { suffix: 'er', minLength: 2 },
    { suffix: 'ed', minLength: 2 },
    { suffix: 'es', minLength: 2 },
    { suffix: 'ly', minLength: 2 },
    { suffix: 's', minLength: 1 },
  ];

  for (const rule of suffixRules) {
    if (w.length > rule.suffix.length + rule.minLength && w.endsWith(rule.suffix)) {
      let stem = w.slice(0, -rule.suffix.length);
      // Handle doubled consonants (e.g., "serving" -> "serv")
      if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2] && !/[aeiou]/.test(stem[stem.length - 1])) {
        stem = stem.slice(0, -1);
      }
      return stem;
    }
  }

  return w;
}

// ============================================
// FUZZY MATCHING - Levenshtein Distance
// ============================================
export function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[s2.length][s1.length];
}

export function isFuzzyMatch(s1: string, s2: string, threshold: number = 2): boolean {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  return distance <= threshold && distance < maxLen * 0.35; // Max 35% difference
}

// ============================================
// QUERY PARSER - Extract intent from search
// ============================================
export interface ParsedQuery {
  keywords: string[];
  expandedKeywords: string[]; // includes synonyms
  location: string | null;
  locationVariants: string[];
  jobType: string | null;
  salaryExpectation: number | null;
  isRemote: boolean;
  rawQuery: string;
}

export function parseQuery(query: string): ParsedQuery {
  const normalized = query.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  const result: ParsedQuery = {
    keywords: [],
    expandedKeywords: [],
    location: null,
    locationVariants: [],
    jobType: null,
    salaryExpectation: null,
    isRemote: false,
    rawQuery: query,
  };

  // Detect job types
  const jobTypePatterns: Record<string, string[]> = {
    'part-time': ['part-time', 'part time', 'parttime', 'pt'],
    'full-time': ['full-time', 'full time', 'fulltime', 'ft'],
    'contract': ['contract', 'freelance', 'project-based', 'project based'],
    'internship': ['internship', 'intern', 'industrial training', 'praktikum'],
    'temporary': ['temporary', 'temp', 'casual', 'ad-hoc'],
  };

  for (const [type, patterns] of Object.entries(jobTypePatterns)) {
    if (patterns.some(p => normalized.includes(p))) {
      result.jobType = type;
      break;
    }
  }

  // Detect locations (check multi-word locations first)
  const sortedLocationKeys = Object.keys(LOCATION_MAPPINGS).sort((a, b) => b.length - a.length);
  for (const key of sortedLocationKeys) {
    const variants = LOCATION_MAPPINGS[key];
    if (normalized.includes(key) || variants.some(v => normalized.includes(v))) {
      result.location = key;
      result.locationVariants = variants;
      break;
    }
  }

  // Detect remote preference
  if (normalized.includes('remote') || normalized.includes('wfh') || normalized.includes('work from home') || normalized.includes('online')) {
    result.isRemote = true;
  }

  // Detect salary expectations
  const salaryMatch = normalized.match(/rm\s*(\d+)|(\d+)\s*(?:per hour|\/hr|hourly|per day|\/day)/);
  if (salaryMatch) {
    result.salaryExpectation = parseInt(salaryMatch[1] || salaryMatch[2]);
  }

  // Stopwords to filter out
  const stopwords = new Set([
    'i', 'am', 'looking', 'for', 'a', 'an', 'the', 'in', 'at', 'job', 'jobs', 'work',
    'near', 'around', 'want', 'need', 'find', 'me', 'with', 'and', 'or', 'to', 'of',
    'is', 'are', 'my', 'can', 'any', 'some', 'good', 'best', 'please', 'help', 'get'
  ]);

  // Words to exclude from keyword extraction
  const locationWords = new Set<string>();
  for (const key of Object.keys(LOCATION_MAPPINGS)) {
    locationWords.add(key);
    LOCATION_MAPPINGS[key].forEach(v => locationWords.add(v));
  }
  const typeWords = new Set(Object.values(jobTypePatterns).flat());

  // Extract keywords
  result.keywords = words.filter(word =>
    word.length > 2 &&
    !stopwords.has(word) &&
    !locationWords.has(word) &&
    !typeWords.has(word)
  );

  // Expand keywords with synonyms and stemmed forms
  const expandedSet = new Set<string>();
  for (const keyword of result.keywords) {
    expandedSet.add(keyword);
    expandedSet.add(stemWord(keyword));

    // Add synonyms if this keyword matches any
    for (const [key, synonyms] of Object.entries(JOB_SYNONYMS)) {
      if (key === keyword || synonyms.includes(keyword)) {
        synonyms.forEach(s => expandedSet.add(s));
      }
    }
  }
  result.expandedKeywords = Array.from(expandedSet);

  return result;
}

// ============================================
// JOB SCORING - SEO-style relevance scoring
// ============================================
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  createdAt?: number;
  isRemote?: boolean;
}

export interface ScoredJob {
  job: Job;
  score: number;
  matchDetails: {
    titleScore: number;
    descriptionScore: number;
    locationScore: number;
    typeScore: number;
    recencyBonus: number;
  };
}

// Check if any expanded keyword matches text (direct, stemmed, or fuzzy)
function matchesKeyword(keyword: string, text: string, useFuzzy: boolean = false): { matches: boolean; strength: number } {
  const lowerText = text.toLowerCase();
  const stemmedKeyword = stemWord(keyword);

  // Exact match
  if (lowerText.includes(keyword)) {
    return { matches: true, strength: 1.0 };
  }

  // Stemmed match
  if (lowerText.includes(stemmedKeyword)) {
    return { matches: true, strength: 0.8 };
  }

  // Check each word in text for fuzzy match
  if (useFuzzy) {
    const textWords = lowerText.split(/\W+/);
    for (const word of textWords) {
      if (word.length > 3 && isFuzzyMatch(keyword, word)) {
        return { matches: true, strength: 0.5 };
      }
    }
  }

  return { matches: false, strength: 0 };
}

// Check if any synonym group matches
function matchesSynonymGroup(keyword: string, text: string): { matches: boolean; strength: number } {
  const lowerText = text.toLowerCase();

  // Find the synonym group for this keyword
  for (const [key, synonyms] of Object.entries(JOB_SYNONYMS)) {
    if (key === keyword || synonyms.includes(keyword)) {
      // Check if any synonym appears in text
      for (const synonym of synonyms) {
        if (lowerText.includes(synonym)) {
          return { matches: true, strength: 0.7 };
        }
      }
    }
  }

  return { matches: false, strength: 0 };
}

export function scoreJob(job: Job, query: ParsedQuery): ScoredJob {
  const scores = {
    titleScore: 0,
    descriptionScore: 0,
    locationScore: 0,
    typeScore: 0,
    recencyBonus: 0,
  };

  const jobTitle = job.title.toLowerCase();
  const jobDesc = (job.description || '').toLowerCase();
  const jobLocation = (job.location || '').toLowerCase();
  const jobType = (job.type || '').toLowerCase();

  // TITLE MATCHING (Highest weight - 40%)
  for (const keyword of query.keywords) {
    const directMatch = matchesKeyword(keyword, jobTitle, false);
    if (directMatch.matches) {
      scores.titleScore += 10 * directMatch.strength;
      continue;
    }

    const synonymMatch = matchesSynonymGroup(keyword, jobTitle);
    if (synonymMatch.matches) {
      scores.titleScore += 8 * synonymMatch.strength;
      continue;
    }

    const fuzzyMatch = matchesKeyword(keyword, jobTitle, true);
    if (fuzzyMatch.matches) {
      scores.titleScore += 5 * fuzzyMatch.strength;
    }
  }

  // DESCRIPTION MATCHING (Medium weight - 25%)
  for (const keyword of query.keywords) {
    const directMatch = matchesKeyword(keyword, jobDesc, false);
    if (directMatch.matches) {
      scores.descriptionScore += 5 * directMatch.strength;
      continue;
    }

    const synonymMatch = matchesSynonymGroup(keyword, jobDesc);
    if (synonymMatch.matches) {
      scores.descriptionScore += 3 * synonymMatch.strength;
    }
  }

  // LOCATION MATCHING (Preference, no penalty - 20%)
  if (query.location && query.locationVariants.length > 0) {
    const locationMatch = query.locationVariants.some(loc => jobLocation.includes(loc));
    if (locationMatch) {
      scores.locationScore = 15; // Good bonus for matching location
    } else if (job.isRemote || jobLocation.includes('remote') || jobLocation.includes('wfh')) {
      scores.locationScore = 8; // Remote jobs get partial credit
    }
    // NO PENALTY for non-matching locations - just no bonus
  }

  // Remote preference
  if (query.isRemote) {
    if (job.isRemote || jobLocation.includes('remote') || jobLocation.includes('wfh') || jobDesc.includes('work from home')) {
      scores.locationScore = Math.max(scores.locationScore, 12);
    }
  }

  // JOB TYPE MATCHING (10%)
  if (query.jobType) {
    if (jobType.includes(query.jobType) || jobType.includes(query.jobType.replace('-', ' '))) {
      scores.typeScore = 8;
    } else if (query.jobType === 'part-time' && (jobType.includes('part') || jobType.includes('casual'))) {
      scores.typeScore = 6;
    } else if (query.jobType === 'full-time' && (jobType.includes('full') || jobType.includes('permanent'))) {
      scores.typeScore = 6;
    }
  }

  // RECENCY BONUS (5%)
  if (job.createdAt) {
    const daysSincePosted = (Date.now() - job.createdAt) / (1000 * 60 * 60 * 24);
    if (daysSincePosted < 3) {
      scores.recencyBonus = 5;
    } else if (daysSincePosted < 7) {
      scores.recencyBonus = 3;
    } else if (daysSincePosted < 14) {
      scores.recencyBonus = 1;
    }
  }

  const totalScore =
    scores.titleScore +
    scores.descriptionScore +
    scores.locationScore +
    scores.typeScore +
    scores.recencyBonus;

  return {
    job,
    score: totalScore,
    matchDetails: scores,
  };
}

// ============================================
// JSON EXTRACTION - Fix for AI response parsing
// ============================================
export function extractValidJSON(text: string): { matchedJobIndices: number[]; searchSummary: string } | null {
  // Try multiple extraction methods

  // Method 1: Extract from markdown code block
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (validateSearchResponse(parsed)) {
        return parsed;
      }
    } catch {
      // Continue to next method
    }
  }

  // Method 2: Find the last complete JSON object (greedy)
  const jsonMatches = text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
  if (jsonMatches) {
    // Try each match, preferring longer ones
    const sortedMatches = jsonMatches.sort((a, b) => b.length - a.length);
    for (const match of sortedMatches) {
      try {
        const parsed = JSON.parse(match);
        if (validateSearchResponse(parsed)) {
          return parsed;
        }
      } catch {
        // Continue to next match
      }
    }
  }

  // Method 3: Try to extract array and summary separately
  const indicesMatch = text.match(/matchedJobIndices["\s:]*\[([\d,\s]*)\]/i);
  const summaryMatch = text.match(/searchSummary["\s:]*["']([^"']+)["']/i);
  if (indicesMatch) {
    const indices = indicesMatch[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    return {
      matchedJobIndices: indices,
      searchSummary: summaryMatch ? summaryMatch[1] : `Found ${indices.length} matching job(s).`
    };
  }

  return null;
}

function validateSearchResponse(parsed: unknown): parsed is { matchedJobIndices: number[]; searchSummary: string } {
  if (!parsed || typeof parsed !== 'object') return false;
  const obj = parsed as Record<string, unknown>;
  return Array.isArray(obj.matchedJobIndices) && typeof obj.searchSummary === 'string';
}

// ============================================
// MAIN SEARCH FUNCTION
// ============================================
export function searchJobs(jobs: Job[], query: string): ScoredJob[] {
  const parsedQuery = parseQuery(query);

  // Score all jobs
  const scoredJobs = jobs
    .map(job => scoreJob(job, parsedQuery))
    .filter(scored => scored.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredJobs;
}
