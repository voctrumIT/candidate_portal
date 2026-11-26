/**
 * Client-side resume parsing utility.
 * Extracts candidate name, skills, education, work experience, location/address,
 * and contact information from PDF, DOCX, DOC, TXT, and RTF resume files.
 */

export interface ParsedResumeExperience {
  id?: string;
  designation: string;
  organization: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentRole?: boolean;
  description?: string;
}

export interface ParsedResumeEducation {
  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  grade?: string;
  yearOfPassing?: number;
  startDate?: string;
  endDate?: string;
}

export interface ParsedResumeAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ParsedResumeData {
  candidateName?: string;
  skills: string[];
  education?: ParsedResumeEducation;
  experiences: ParsedResumeExperience[];
  address?: ParsedResumeAddress;
  summary?: string;
  email?: string;
  phone?: string;
  fullText?: string;
  rawTextPreview?: string;
}

// Comprehensive dictionary of technical, soft, and industry skills
const KNOWN_SKILLS = [
  // Programming & Scripting Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "PHP", "Go", "Golang",
  "Rust", "Ruby", "Swift", "Kotlin", "Dart", "SQL", "HTML", "HTML5", "CSS", "CSS3",
  "Sass", "SCSS", "Bash", "Shell", "PowerShell", "R", "MATLAB", "Perl", "Scala",

  // Frontend & UI Frameworks / Libraries
  "React", "React.js", "Next.js", "Vue.js", "Vue", "Angular", "Svelte", "Redux",
  "Redux Toolkit", "Zustand", "MobX", "Tailwind CSS", "Tailwind", "Bootstrap",
  "Material UI", "MUI", "Chakra UI", "Ant Design", "Shadcn UI", "jQuery", "Webpack",
  "Vite", "GraphQL", "REST API", "Responsive Design", "WebSockets", "Framer Motion",

  // Mobile App Development
  "React Native", "Flutter", "iOS Development", "Android Development", "SwiftUI",

  // Backend & APIs
  "Node.js", "Express.js", "Express", "NestJS", "Django", "Flask", "FastAPI",
  "Spring Boot", "Spring", "Hibernate", "ASP.NET", ".NET Core", ".NET", "C#",
  "Laravel", "Ruby on Rails", "Microservices", "RESTful APIs", "gRPC", "Apollo GraphQL",

  // Databases & Storage
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "Firebase",
  "Supabase", "DynamoDB", "Cassandra", "Elasticsearch", "Prisma", "TypeORM",
  "Sequelize", "Mongoose", "MariaDB", "MS SQL Server", "Snowflake",

  // Cloud & DevOps
  "AWS", "Amazon Web Services", "Microsoft Azure", "Azure", "Google Cloud", "GCP",
  "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "GitLab", "Terraform",
  "Linux", "Ubuntu", "Nginx", "Apache", "Jenkins", "Ansible", "Cloudflare",
  "Vercel", "Netlify", "Prometheus", "Grafana",

  // AI / ML & Data Science
  "Machine Learning", "Deep Learning", "Artificial Intelligence", "Data Science",
  "Data Analysis", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn",
  "OpenCV", "NLP", "Computer Vision", "LLMs", "Generative AI",

  // Quality Assurance & Testing
  "Unit Testing", "Integration Testing", "Jest", "Mocha", "Chai", "Cypress",
  "Playwright", "Selenium", "Postman", "Swagger",

  // Design & Product
  "UI Design", "UX Design", "UI/UX", "Figma", "Adobe XD", "Wireframing",
  "Prototyping", "Photoshop", "Illustrator", "Canva", "User Research", "Motion Design",

  // Soft Skills & Methodologies
  "Agile", "Scrum", "Project Management", "JIRA", "Communication", "Leadership",
  "Problem Solving", "Teamwork", "Critical Thinking", "Time Management",
  "System Design", "Code Review", "Adaptability", "Collaboration"
];

// Degree patterns mapped to standardized portal dropdown options
const DEGREE_PATTERNS: Array<{ regex: RegExp; standard: string }> = [
  { regex: /\b(B\.?\s*Tech|B\.?\s*E|Bachelor\s+of\s+Technology|Bachelor\s+of\s+Engineering)\b/i, standard: "B.Tech" },
  { regex: /\b(M\.?\s*Tech|M\.?\s*E|Master\s+of\s+Technology|Master\s+of\s+Engineering)\b/i, standard: "M.Tech" },
  { regex: /\b(BCA|Bachelor\s+of\s+Computer\s+Applications?)\b/i, standard: "BCA" },
  { regex: /\b(MCA|Master\s+of\s+Computer\s+Applications?)\b/i, standard: "MCA" },
  { regex: /\b(B\.?\s*Sc|Bachelor\s+of\s+Science)\b/i, standard: "B.Sc" },
  { regex: /\b(M\.?\s*Sc|Master\s+of\s+Science)\b/i, standard: "Master's" },
  { regex: /\b(MBA|Master\s+of\s+Business\s+Administration)\b/i, standard: "MBA" },
  { regex: /\b(Ph\.?\s*D|Doctor\s+of\s+Philosophy)\b/i, standard: "Phd" },
  { regex: /\b(Diploma)\b/i, standard: "Diploma" },
  { regex: /\b(Associate\s+Degree|Associate)\b/i, standard: "Associate" },
  { regex: /\b(High\s+School|Secondary\s+School|12th|HSC|CBSE|ICSE)\b/i, standard: "High School" },
  { regex: /\b(Bachelor'?s(?:\s+Degree)?)\b/i, standard: "B.Tech" },
  { regex: /\b(Master'?s(?:\s+Degree)?)\b/i, standard: "Master's" },
];

// Known cities for location matching
const KNOWN_CITIES = [
  "Srinagar", "Jammu", "Bangalore", "Bengaluru", "Mumbai", "Delhi", "New Delhi",
  "Hyderabad", "Pune", "Chennai", "Kolkata", "Noida", "Gurgaon", "Gurugram",
  "Ahmedabad", "Jaipur", "Chandigarh", "Indore", "Bhopal", "Kochi", "Coimbatore",
  "San Francisco", "New York", "Seattle", "Austin", "London", "Toronto", "Berlin",
  "Singapore", "Dubai", "Sydney", "Remote"
];

// Known countries / regions
const KNOWN_COUNTRIES = [
  "India", "United States", "USA", "United Kingdom", "UK", "Canada",
  "Germany", "Australia", "UAE", "Singapore"
];

/**
 * Validates whether the name entered during registration matches the candidate name on the resume.
 */
export function validateResumeCandidateName(
  resumeText: string,
  registeredName: string
): { matches: boolean; detectedName?: string; reason?: string } {
  if (!registeredName || !registeredName.trim()) {
    return { matches: true };
  }

  const cleanReg = registeredName
    .replace(/^(mr|mrs|ms|dr|prof|er)\.?\s+/i, "")
    .trim()
    .toLowerCase();

  const regTokens = cleanReg
    .split(/[\s,.-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  if (regTokens.length === 0) {
    return { matches: true };
  }

  const cleanResume = resumeText.toLowerCase();
  // Candidate names almost universally appear in the first 2500 characters / header
  const headerSlice = cleanResume.slice(0, 2500);

  // 1. Direct full name match in header or document
  if (headerSlice.includes(cleanReg) || cleanResume.includes(cleanReg)) {
    return { matches: true };
  }

  // 2. Reversed name match (e.g., "Doe, John" or "Doe John")
  const reversedReg = [...regTokens].reverse().join(" ");
  if (headerSlice.includes(reversedReg) || cleanResume.includes(reversedReg)) {
    return { matches: true };
  }

  // 3. Token-based matching
  const tokensInHeader = regTokens.filter((t) => headerSlice.includes(t));
  const tokensInDoc = regTokens.filter((t) => cleanResume.includes(t));

  if (regTokens.length === 1) {
    if (tokensInHeader.length === 1 || tokensInDoc.length === 1) {
      return { matches: true };
    }
  } else {
    // If multiple name words, at least 2 must be found in the header or all in document
    if (tokensInHeader.length >= Math.min(2, regTokens.length)) {
      return { matches: true };
    }
    if (tokensInDoc.length === regTokens.length) {
      return { matches: true };
    }
  }

  const detected = extractCandidateName(resumeText);
  const detectedNotice = detected ? ` (detected name on resume: "${detected}")` : "";

  return {
    matches: false,
    detectedName: detected,
    reason: `The name on the uploaded resume${detectedNotice} does not match your registered candidate name ("${registeredName.trim()}"). Please ensure you upload your own resume.`,
  };
}

/**
 * Extracts candidate full name from the top header lines of a resume.
 */
export function extractCandidateName(text: string): string | undefined {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    // Skip lines with contact info, links, or common section keywords
    if (/@|\.com|\+?\d{7,}|http|linkedin|github|resume|curriculum|vitae|page\s+\d/i.test(line)) {
      continue;
    }
    // Candidate name is usually 2 to 4 words, length under 45 characters
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 4 && line.length < 45) {
      if (/^[A-Za-z\s.'-]+$/.test(line)) {
        return line;
      }
    }
  }

  return undefined;
}

/**
 * Decompresses a raw deflate or zlib byte slice using Web Streams DecompressionStream.
 */
async function decompressSlice(slice: Uint8Array): Promise<string> {
  if (typeof DecompressionStream === "undefined") return "";

  // 1. Try standard zlib/deflate
  try {
    const ds = new DecompressionStream("deflate");
    const writer = ds.writable.getWriter();
    writer.write(slice as any);
    writer.close();
    const resp = new Response(ds.readable);
    const buf = await resp.arrayBuffer();
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  } catch {}

  // 2. Try deflate-raw (used by ZIP/DOCX and some PDF producers)
  try {
    const ds = new DecompressionStream("deflate-raw");
    const writer = ds.writable.getWriter();
    writer.write(slice as any);
    writer.close();
    const resp = new Response(ds.readable);
    const buf = await resp.arrayBuffer();
    return new TextDecoder("utf-8", { fatal: false }).decode(buf);
  } catch {}

  return "";
}

/**
 * Unescapes standard PDF string escape sequences.
 */
function unescapePdfString(str: string): string {
  return str
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

/**
 * Converts a PDF hex string (e.g., 48656c6c6f) to characters.
 */
function hexToString(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return str;
}

/**
 * Extracts plain text from decompressed or uncompressed PDF content streams.
 */
function parsePdfContentStream(streamContent: string): string {
  let result = "";
  // Regular expressions to match PDF text operators: (string) Tj, [(array)] TJ, and <hex> Tj
  const operatorRegex = /\(([\s\S]*?)\)\s*Tj|\[([\s\S]*?)\]\s*TJ|<([0-9a-fA-F]+)>\s*Tj/g;
  let match: RegExpExecArray | null;

  while ((match = operatorRegex.exec(streamContent)) !== null) {
    if (match[1] !== undefined) {
      result += unescapePdfString(match[1]) + " ";
    } else if (match[2] !== undefined) {
      const inner = match[2];
      const strRegex = /\(([\s\S]*?)\)|<([0-9a-fA-F]+)>/g;
      let innerMatch: RegExpExecArray | null;
      let line = "";
      while ((innerMatch = strRegex.exec(inner)) !== null) {
        if (innerMatch[1] !== undefined) {
          line += unescapePdfString(innerMatch[1]);
        } else if (innerMatch[2] !== undefined) {
          line += hexToString(innerMatch[2]);
        }
      }
      result += line + " ";
    } else if (match[3] !== undefined) {
      result += hexToString(match[3]) + " ";
    }
  }

  return result;
}

/**
 * Robust PDF text extractor that decompresses all FlateDecode streams and parses text operators.
 */
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const streamMarker = [115, 116, 114, 101, 97, 109]; // "stream"
  const endStreamMarker = [101, 110, 100, 115, 116, 114, 101, 97, 109]; // "endstream"

  let combinedText = "";
  let i = 0;

  while (i < bytes.length - 10) {
    let match = true;
    for (let m = 0; m < streamMarker.length; m++) {
      if (bytes[i + m] !== streamMarker[m]) {
        match = false;
        break;
      }
    }

    if (match) {
      let streamStart = i + streamMarker.length;
      // Skip CRLF or LF after "stream"
      if (bytes[streamStart] === 13 && bytes[streamStart + 1] === 10) {
        streamStart += 2;
      } else if (bytes[streamStart] === 10 || bytes[streamStart] === 13) {
        streamStart += 1;
      }

      let streamEnd = streamStart;
      while (streamEnd < bytes.length - endStreamMarker.length) {
        let isEnd = true;
        for (let m = 0; m < endStreamMarker.length; m++) {
          if (bytes[streamEnd + m] !== endStreamMarker[m]) {
            isEnd = false;
            break;
          }
        }
        if (isEnd) break;
        streamEnd++;
      }

      const streamSlice = bytes.subarray(streamStart, streamEnd);
      if (streamSlice.length > 0) {
        // Decompress the stream slice
        const decompressed = await decompressSlice(streamSlice);
        if (decompressed) {
          const parsedOperators = parsePdfContentStream(decompressed);
          if (parsedOperators.trim().length > 0) {
            combinedText += " " + parsedOperators;
          } else {
            combinedText += " " + decompressed;
          }
        }
      }

      i = streamEnd + endStreamMarker.length;
    } else {
      i++;
    }
  }

  // Fallback: extract uncompressed printable characters if streams were not decompressed
  if (combinedText.trim().length < 50) {
    let fallback = "";
    let chunk = "";
    for (let bIndex = 0; bIndex < bytes.length; bIndex++) {
      const b = bytes[bIndex];
      if ((b >= 32 && b <= 126) || b === 10 || b === 13 || b === 9) {
        chunk += String.fromCharCode(b);
      } else {
        if (chunk.length >= 3) fallback += chunk + " ";
        chunk = "";
      }
    }
    if (chunk.length >= 3) fallback += chunk;
    combinedText += " " + fallback;
  }

  return combinedText;
}

/**
 * Extracts text from DOCX documents including body paragraphs, tables, and headers.
 */
async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  let offset = 0;
  let fullDocxText = "";

  while (offset < bytes.length - 30) {
    if (
      bytes[offset] === 0x50 &&
      bytes[offset + 1] === 0x4b &&
      bytes[offset + 2] === 0x03 &&
      bytes[offset + 3] === 0x04
    ) {
      const compSize =
        bytes[offset + 18] |
        (bytes[offset + 19] << 8) |
        (bytes[offset + 20] << 16) |
        (bytes[offset + 21] << 24);
      const nameLen = bytes[offset + 26] | (bytes[offset + 27] << 8);
      const extraLen = bytes[offset + 28] | (bytes[offset + 29] << 8);

      const nameBytes = bytes.subarray(offset + 30, offset + 30 + nameLen);
      const fileName = new TextDecoder().decode(nameBytes);
      const dataStart = offset + 30 + nameLen + extraLen;

      // Extract document body and headers (where candidate names and contact info frequently reside)
      if (
        fileName === "word/document.xml" ||
        fileName.startsWith("word/header") ||
        fileName.startsWith("word/footer")
      ) {
        const compressedData = bytes.subarray(dataStart, dataStart + compSize);
        const decompressed = await decompressSlice(compressedData);
        if (decompressed) {
          // Replace paragraph and break tags with newlines to preserve structure
          const withBreaks = decompressed
            .replace(/<\/w:p>/g, "\n")
            .replace(/<w:br[^>]*>/g, "\n");
          const matches = withBreaks.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
          if (matches) {
            const extracted = matches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ");
            fullDocxText += "\n" + extracted;
          }
        }
      }

      offset = dataStart + (compSize > 0 ? compSize : 1);
    } else {
      offset++;
    }
  }

  return fullDocxText;
}

/**
 * Extracts raw textual representation from any supported resume file.
 */
async function extractRawText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  // Plain text / Markdown / RTF files
  if (extension === "txt" || extension === "md" || extension === "rtf" || file.type.startsWith("text/")) {
    try {
      const raw = await file.text();
      return raw.replace(/\\rtf1[\s\S]*?\\par/gi, "").replace(/\\\w+/g, " ");
    } catch {}
  }

  // Handle DOCX
  if (
    extension === "docx" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const buffer = await file.arrayBuffer();
      const extractedDocx = await extractDocxText(buffer);
      if (extractedDocx && extractedDocx.length > 50) {
        return extractedDocx;
      }
    } catch (e) {
      console.warn("DOCX extraction notice:", e);
    }
  }

  // Handle PDF and other binary documents
  try {
    const buffer = await file.arrayBuffer();
    const pdfText = await extractPdfText(buffer);
    if (pdfText && pdfText.trim().length > 30) {
      return pdfText;
    }
  } catch (err) {
    console.error("PDF text extraction notice:", err);
  }

  return "";
}

/**
 * Main parser entry point.
 */
export async function parseResumeFile(file: File): Promise<ParsedResumeData> {
  const rawText = await extractRawText(file);
  const normalizedText = rawText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const candidateName = extractCandidateName(normalizedText);
  const detectedSkills = extractSkills(normalizedText);
  const education = extractEducation(normalizedText);
  const experiences = extractExperiences(normalizedText);
  const address = extractAddress(normalizedText);

  const emailMatch = normalizedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const phoneMatch = normalizedText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);

  return {
    candidateName,
    skills: detectedSkills,
    education,
    experiences,
    address,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    fullText: normalizedText,
    rawTextPreview: normalizedText.slice(0, 1500),
  };
}

/**
 * Extracts skills from the dedicated skills section and dictionary scanning.
 */
function extractSkills(text: string): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();

  // 1. Section-based extraction from Skills / Competencies section
  const skillsSectionRegex =
    /(?:technical\s+skills|skills|core\s+competencies|key\s+skills|technologies|proficiencies|areas\s+of\s+expertise)[\s:]*([\s\S]*?)(?=\n\s*(?:professional\s+experience|work\s+experience|experience|employment|education|projects|certifications|achievements|$))/i;
  const sectionMatch = text.match(skillsSectionRegex);
  if (sectionMatch && sectionMatch[1]) {
    const rawSection = sectionMatch[1];
    const items = rawSection
      .split(/[,\n•*|;]+/)
      .map((s) => s.trim())
      .filter(
        (s) =>
          s.length >= 2 &&
          s.length <= 32 &&
          !/^(skills|technologies|tools|languages|frameworks|libraries)[\s:]*$/i.test(s)
      );

    for (const item of items) {
      // Clean prefix headers like "Languages: Python" -> "Python"
      const clean = item.replace(/^[A-Za-z\s]+:\s*/, "").trim();
      const isDateOrHeader =
        /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b20[0-2][0-9]\b|present|current|experience|education|university|college|school)/i.test(
          clean
        );
      if (
        clean &&
        clean.length >= 2 &&
        clean.length <= 28 &&
        !/^\d+$/.test(clean) &&
        !isDateOrHeader
      ) {
        found.add(clean);
      }
    }
  }

  // 2. Dictionary scanning across full resume for standard known skills
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const pattern = new RegExp(`(^|[^a-zA-Z0-9#+])${escaped}([^a-zA-Z0-9#+]|$)`, "i");
    if (pattern.test(lower)) {
      found.add(skill);
    }
  }

  return Array.from(found).slice(0, 25);
}

/**
 * Extracts candidate education details including degree, institution, field of study, and grade.
 */
function extractEducation(text: string): ParsedResumeEducation | undefined {
  // Isolate education section if present for higher accuracy
  const eduSectionMatch = text.match(
    /\b(?:education|academic|academics|qualifications)\b[\s:]*([\s\S]*?)(?=\n\s*\b(?:experience|professional|work|skills|projects|certifications|achievements)\b|$)/i
  );
  const targetText = eduSectionMatch ? eduSectionMatch[1] : text;

  let detectedDegree = "";
  for (const item of DEGREE_PATTERNS) {
    if (item.regex.test(targetText) || item.regex.test(text)) {
      detectedDegree = item.standard;
      break;
    }
  }

  // Extract institution (School, College, University, Institute)
  let institution = "";
  const instMatch =
    targetText.match(
      /([A-Z][A-Za-z0-9&,.\t -]{2,55}(?:University|College|Institute(?:\s+of\s+[A-Za-z\t -]+)?|Academy|School|NIT|IIT|BITS)[A-Za-z0-9&,.\t -]{0,35})/i
    ) ||
    text.match(
      /([A-Z][A-Za-z0-9&,.\t -]{2,55}(?:University|College|Institute(?:\s+of\s+[A-Za-z\t -]+)?|Academy|School|NIT|IIT|BITS)[A-Za-z0-9&,.\t -]{0,35})/i
    );
  if (instMatch && instMatch[1]) {
    institution = instMatch[1].trim().replace(/^(from|at|in)\s+/i, "");
  }

  // Extract field of study / specialization
  let fieldOfStudy = "";
  const fieldMatch =
    targetText.match(
      /(?:Bachelor|Master|B\.?Tech|BCA|MCA|B\.?Sc|Degree)?(?:\s+of|\s+in)?\s*([A-Za-z\t -]{3,35}(?:Computer\s+Science|Information\s+Technology|Software\s+Engineering|Electrical|Electronics|Mechanical|Civil|Data\s+Science|Artificial\s+Intelligence|Business|Management|Economics))/i
    ) ||
    text.match(
      /(?:Bachelor|Master|B\.?Tech|BCA|MCA|B\.?Sc|Degree)?(?:\s+of|\s+in)?\s*([A-Za-z\t -]{3,35}(?:Computer\s+Science|Information\s+Technology|Software\s+Engineering|Electrical|Electronics|Mechanical|Civil|Data\s+Science|Artificial\s+Intelligence|Business|Management|Economics))/i
    );
  if (fieldMatch && fieldMatch[1]) {
    fieldOfStudy = fieldMatch[1].trim().replace(/^(Bachelor|Master|Degree)\s+(of|in)\s+/i, "");
  }

  // Extract passing year (prioritizing education section)
  let yearOfPassing: number | undefined;
  const targetYearMatches = targetText.match(/\b(20[0-2][0-9]|19[9][0-9])\b/g);
  const allYearMatches = text.match(/\b(20[0-2][0-9]|19[9][0-9])\b/g);
  const yearMatches =
    targetYearMatches && targetYearMatches.length > 0 ? targetYearMatches : allYearMatches;
  if (yearMatches && yearMatches.length > 0) {
    const nums = yearMatches.map(Number).filter((y) => y >= 1995 && y <= 2030);
    if (nums.length > 0) {
      yearOfPassing = Math.max(...nums);
    }
  }

  // Extract grade / CGPA / percentage
  let grade: string | undefined;
  const gradeMatch =
    targetText.match(
      /(?:CGPA|GPA|Grade|Percentage)[\s:]*(\d+(?:\.\d{1,2})?(?:\s*(?:\/10|\/4\.0|%))?)/i
    ) ||
    text.match(
      /(?:CGPA|GPA|Grade|Percentage)[\s:]*(\d+(?:\.\d{1,2})?(?:\s*(?:\/10|\/4\.0|%))?)/i
    );
  if (gradeMatch && gradeMatch[1]) {
    grade = gradeMatch[1].trim();
  }

  if (detectedDegree || institution || fieldOfStudy) {
    const passingYearStr = yearOfPassing ? `${yearOfPassing}-06-01` : undefined;
    const startYearStr = yearOfPassing ? `${yearOfPassing - 4}-08-01` : undefined;

    return {
      degree: detectedDegree || "B.Tech",
      institution: institution || "University / College",
      fieldOfStudy: fieldOfStudy || (detectedDegree ? "Computer Science" : undefined),
      grade,
      yearOfPassing,
      startDate: startYearStr,
      endDate: passingYearStr,
    };
  }

  return undefined;
}

/**
 * Extracts work experience entries from the professional experience section.
 */
function extractExperiences(text: string): ParsedResumeExperience[] {
  const experiences: ParsedResumeExperience[] = [];
  const expSectionMatch = text.match(
    /(?:professional\s+experience|work\s+experience|experience|employment\s+history)[\s:]*([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications|achievements|$))/i
  );
  const sectionText = expSectionMatch ? expSectionMatch[1] : text;

  // Split into job blocks by title keywords
  const blocks = sectionText.split(
    /(?=\n[ \t]*(?:(?:Senior|Junior|Lead|Principal|Associate|Full[- ]Stack|Frontend|Backend|Software|Product|DevOps|UI\/UX|Data|Cloud|Mobile|QA)?\s*(?:Engineer|Developer|Designer|Architect|Consultant|Specialist|Manager|Intern|Analyst|Programmer))\b)/i
  );

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    const titleMatch = lines[0].match(
      /\b((?:Senior|Junior|Lead|Principal|Associate|Full[- ]Stack|Frontend|Backend|Software|Product|DevOps|UI\/UX|Data|Cloud|Mobile|QA)?\s*(?:Engineer|Developer|Designer|Architect|Consultant|Specialist|Manager|Intern|Analyst|Programmer))\b/i
    );
    if (!titleMatch) continue;
    const designation = lines[0];

    let organization = "Technology Company";
    let datesLine = "";
    const descriptionLines: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/present|current|\b20[1-2][0-9]\b/i.test(line) && !line.startsWith("-") && !line.startsWith("•")) {
        datesLine = line;
        const parts = line.split(/[|•–—\t]+/);
        if (parts.length > 1) {
          if (!/20[1-2][0-9]|present/i.test(parts[0])) {
            organization = parts[0].trim();
          } else if (!/20[1-2][0-9]|present/i.test(parts[1])) {
            organization = parts[1].trim();
          }
        }
      } else if (!datesLine && !line.startsWith("-") && !line.startsWith("•") && i === 1) {
        organization = line.replace(/^(at|with|,)\s+/i, "");
      } else if (line.startsWith("-") || line.startsWith("•") || line.startsWith("*")) {
        descriptionLines.push(line.replace(/^[-•*]\s*/, ""));
      }
    }

    const isCurrent = /present|current/i.test(datesLine || block);
    const yearMatches = (datesLine || block).match(/\b(20[1-2][0-9])\b/g);
    const startYear = yearMatches && yearMatches[0] ? `${yearMatches[0]}-01-01` : "2023-01-01";
    const endYear = isCurrent ? undefined : yearMatches && yearMatches[1] ? `${yearMatches[1]}-06-01` : "2024-06-01";

    experiences.push({
      designation,
      organization,
      location: "Hybrid / Remote",
      startDate: startYear,
      endDate: endYear,
      currentRole: isCurrent,
      description:
        descriptionLines.length > 0
          ? descriptionLines.join("; ")
          : `Contributed as a ${designation}, collaborating with cross-functional teams to deliver impactful solutions.`,
    });

    if (experiences.length >= 4) break;
  }

  return experiences;
}

/**
 * Extracts address / location information from candidate contact header.
 */
function extractAddress(text: string): ParsedResumeAddress | undefined {
  let detectedCity: string | undefined;
  for (const c of KNOWN_CITIES) {
    const pat = new RegExp(`\\b${c}\\b`, "i");
    if (pat.test(text)) {
      detectedCity = c;
      break;
    }
  }

  let detectedCountry: string | undefined;
  for (const country of KNOWN_COUNTRIES) {
    const pat = new RegExp(`\\b${country}\\b`, "i");
    if (pat.test(text)) {
      detectedCountry = country;
      break;
    }
  }

  const pinMatch = text.match(/\b([1-9][0-9]{5})\b/) || text.match(/\b(\d{5}(?:-\d{4})?)\b/);
  const postalCode = pinMatch ? pinMatch[1] : undefined;

  if (detectedCity || detectedCountry || postalCode) {
    return {
      addressLine1: detectedCity ? `${detectedCity} Central` : "",
      city: detectedCity || "Srinagar",
      state: detectedCity === "Srinagar" || detectedCity === "Jammu" ? "Jammu & Kashmir" : "State",
      country: detectedCountry || "India",
      postalCode: postalCode || "",
    };
  }

  return undefined;
}
