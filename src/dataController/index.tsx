import Smitha from "../assets/images/Smitha.webp"
import Shreyas from "../assets/images/shreyas.webp"
import Adnan from "../assets/images/Adnan.webp"
import Varun from "../assets/images/Varun.webp"
import Pranav from "../assets/images/Pranav.webp"

export const modelInfo = {
  version: "V2.0", // Updated for 7 grades
  datasetSize: 100000
};

// ✅ UPDATED: 7 Grade System
// ⚠️ CRITICAL: Order must match backend TOBACCO_CLASSES array!
export const grades = [
  'Grade_1',
  'Grade_2', 
  'Grade_3',
  'Red_Thargu',
  'Black_Thargu',
  'Haccha_Hasiru',
  'Hasiru'
];

export type Grade = typeof grades[number];

// ✅ UPDATED: 7 Grade Color Mapping
export const gradeColors = {
  'Grade_1': '#10b981',        // Green - Highest quality
  'Grade_2': '#22c55e',        // Light green - High quality
  'Grade_3': '#eab308',        // Yellow - Good quality
  'Red_Thargu': '#ef4444',     // Red - Special grade
  'Black_Thargu': '#1f2937',   // Dark gray/black - Special grade
  'Haccha_Hasiru': '#84cc16',  // Lime green - Fresh green
  'Hasiru': '#16a34a'          // Medium green - Green grade
} as const;

// ✅ NEW: Grade Descriptions for Result Screen
export const gradeDescriptions = {
  'Grade_1': 'Premium quality tobacco. Highest market value with excellent characteristics.',
  'Grade_2': 'High-grade tobacco. Very good quality with strong market demand.',
  'Grade_3': 'Good quality tobacco. Moderate to high market value.',
  'Red_Thargu': 'Red special grade. Distinctive characteristics for specific markets.',
  'Black_Thargu': 'Black special grade. Unique processing requirements.',
  'Haccha_Hasiru': 'Fresh green grade. Early harvest with specific processing needs.',
  'Hasiru': 'Green grade. Requires further processing and maturation.'
} as const;

// ✅ NEW: Grade Display Info (emoji, market value, quality indicators)
export const gradeDisplayInfo = {
  'Grade_1': { 
    emoji: '🌟', 
    title: 'Premium Quality', 
    marketValue: 'Highest',
    qualityLevel: 5 
  },
  'Grade_2': { 
    emoji: '✨', 
    title: 'High Grade', 
    marketValue: 'High',
    qualityLevel: 4 
  },
  'Grade_3': { 
    emoji: '🍃', 
    title: 'Good Quality', 
    marketValue: 'Moderate-High',
    qualityLevel: 3 
  },
  'Red_Thargu': { 
    emoji: '🔴', 
    title: 'Red Special', 
    marketValue: 'Specialized',
    qualityLevel: 3 
  },
  'Black_Thargu': { 
    emoji: '⚫', 
    title: 'Black Special', 
    marketValue: 'Specialized',
    qualityLevel: 3 
  },
  'Haccha_Hasiru': { 
    emoji: '🌿', 
    title: 'Fresh Green', 
    marketValue: 'Processing Required',
    qualityLevel: 2 
  },
  'Hasiru': { 
    emoji: '🌱', 
    title: 'Green Grade', 
    marketValue: 'Low-Moderate',
    qualityLevel: 2 
  }
} as const;

// Team members (unchanged)
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  isGuide?: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Prof. Smitha Shree K P",
    role: "Project Guide",
    bio: "10+ years experience as a lecturer in MIT Mysore",
    imageUrl: Smitha,
    isGuide: true
  },
  {
    id: "2",
    name: "Shreyas N",
    role: "Team Lead & Developer",
    bio: "Develops and optimizes our core grading algorithms",
    imageUrl: Shreyas,
  },
  {
    id: "3",
    name: "Pranav S Karpur",
    role: "Model Training",
    bio: "Curates datasets and improves model accuracy",
    imageUrl: Pranav,
  },
  {
    id: "4",
    name: "Varun N S",
    role: "UX/UI Design",
    bio: "Ensures seamless user experience",
    imageUrl: Varun,
  },
  {
    id: "5",
    name: "Shaikh Adnan Iqbal",
    role: "Data Analyst",
    bio: "Maintains our robust processing pipeline & data",
    imageUrl: Adnan,
  }
];

// ✅ UPDATED: FAQs for 7-grade system
export const faqs = [
  {
    question: "How accurate is the AI model?",
    answer:
      "Our upgraded AI model supports 7 tobacco grades with 95% accuracy, ensuring precise and consistent grading across all quality categories.",
  },
  {
    question: "What grades does the system support?",
    answer:
      "The system now supports 7 grades: Grade 1, Grade 2, Grade 3, Red Thargu, Black Thargu, Haccha Hasiru, and Hasiru, covering the complete spectrum of tobacco leaf quality.",
  },
  {
    question: "How do I use this application?",
    answer:
      "Simply upload or capture an image of your tobacco leaf and our system will provide instant grading results with detailed quality insights and market information.",
  },
];
