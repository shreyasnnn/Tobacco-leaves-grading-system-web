import Smitha from "../assets/images/Smitha.jpg"
import Shreyas from "../assets/images/shreyas.jpg"

export const modelInfo = {
  version: "V1.2",
  datasetSize: 100000
};

export const grades = ["ChengShu", "JiaShu", "QianShu", "ShangShu"]; //check how the names are stored from backend file

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
    imageUrl: Smitha,
  },
  {
    id: "4",
    name: "Varun N S",
    role: "UX/UI Design",
    bio: "Ensures seamless user experience",
    imageUrl: Smitha,
  },
  {
    id: "5",
    name: "Shaikh Adnan Iqbal",
    role: "Data Analyst",
    bio: "Maintains our robust processing pipeline & data",
    imageUrl: Smitha,
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
