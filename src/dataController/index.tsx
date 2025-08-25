import Smitha from "../assets/images/Smitha.jpg"
import Shreyas from "../assets/images/shreyas.jpg"
import Adnan from "../assets/images/Adnan.jpg"
import Varun from "../assets/images/Varun.jpg"
import Pranav from "../assets/images/Pranav.jpg"

export const modelInfo = {
  version: "V1.2",
  datasetSize: 100000
};

export const grades = ['Grade_1', 'Grade_4', 'Grade_5', 'RedThargu']; //check how the names are stored from backend file
export type Grade = typeof grades[number];

// Update grade colors mapping
export const gradeColors = {
  'Grade_1': '#10b981',    // Green - High quality
  'Grade_4': '#f59e0b',    // Amber - Medium quality  
  'Grade_5': '#6b7280',    // Gray - Lower quality
  'RedThargu': '#ef4444',  // Red - Special grade
} as const;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string; // Add this field
  isGuide?: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Prof. Smitha Shree K P",
    role: "Project Guide",
    bio: "10+ years experience as a lecturer in MIT Mysore",
    imageUrl: Smitha, // Add actual path
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

export const faqs = [
  {
    question: "How accurate is the AI model?",
    answer:
      "Our AI model has an accuracy of 95%, ensuring precise and consistent grading of tobacco leaves.",
  },
  {
    question: "What types of tobacco leaves can the application grade?",
    answer:
      "The system currently supports all major varieties of Virginia, Burley, and Oriental tobacco.",
  },
  {
    question: "How do I use this application?",
    answer:
      "Simply upload or capture an image of your tobacco leaf and our system will provide instant grading results.",
  },
];
