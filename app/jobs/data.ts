export interface JobListing {
  id: string;
  tenantId?: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  postedDate: string;
  applyByDate: string;
  salaryRange: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  keySkills: string[];
  aboutCompany: string;
}

const defaultDetails = {
  overview:
    'We are looking for a passionate and detail-oriented Product Designer to create intuitive, user-centered digital experiences. You will work closely with product managers, developers, and stakeholders to design solutions that solve real user problems while aligning with business goals. In this role, you will be responsible for the end-to-end design process—from research and ideation to prototyping and final UI delivery. The ideal candidate has a strong understanding of design principles, usability, and modern design tools.',
  responsibilities: [
    'Design intuitive and user-friendly interfaces for web and mobile products.',
    'Collaborate with product managers and developers to define user flows and features.',
    'Conduct user research and translate insights into design solutions.',
    'Create wireframes, prototypes, and high-fidelity designs.',
    'Improve user experience through usability testing and feedback.',
    'Work closely with developers to ensure accurate implementation.',
  ],
  qualifications: [
    "Bachelor's degree in Design, Human-Computer Interaction (HCI), Computer Science, or a related field.",
    '2-6 years of experience in Product Design / UI/UX Design.',
    'Strong portfolio demonstrating end-to-end design process and problem-solving skills.',
    'Experience working in agile or cross-functional teams.',
    'Understanding of user-centered design principles and methodologies.',
  ],
  keySkills: [
    'Figma',
    'Wireframing',
    'Prototyping',
    'UX Research',
    'Interaction Design',
    'Design Systems',
    'Usability Testing',
    'Problem Solving',
  ],
  aboutCompany:
    'Software Development 51-200 employees\n\nWe are a product-driven company focused on building impactful digital experiences. Our team values innovation, collaboration, and user-centric design to create solutions that make a difference. We are a fast-growing, product-driven company focused on building meaningful digital experiences that solve real-world problems. Our team is passionate about innovation, collaboration, and creating user-centric solutions that deliver impact.',
};

export const dummyJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Niscala.io',
    location: 'San Francisco',
    tags: ['Remote', 'Full-time', 'Senior'],
    postedDate: 'Posted 2 days ago',
    applyByDate: 'Apply by 30 April',
    salaryRange: '$520k - $660k/yr',
    ...defaultDetails,
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'SAMTIV',
    location: 'New York',
    tags: ['Onsite', 'Part-time'],
    postedDate: 'Posted 2 days ago',
    applyByDate: 'Apply by 30 April',
    salaryRange: '$920k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'SAMTIV',
    location: 'New York',
    tags: ['Onsite', 'Part-time'],
    postedDate: 'Posted 2 days ago',
    applyByDate: 'Apply by 30 April',
    salaryRange: '$920k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '4',
    title: 'Data Scientiest',
    company: 'UNICA',
    location: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    postedDate: 'Posted 1 day ago',
    applyByDate: 'Apply by 10 April',
    salaryRange: '$720k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '5',
    title: 'Data Scientiest',
    company: 'UNICA',
    location: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    postedDate: 'Posted 1 day ago',
    applyByDate: 'Apply by 10 April',
    salaryRange: '$720k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '6',
    title: 'Data Scientiest',
    company: 'UNICA',
    location: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    postedDate: 'Posted 1 day ago',
    applyByDate: 'Apply by 10 April',
    salaryRange: '$720k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '7',
    title: 'Data Scientiest',
    company: 'UNICA',
    location: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    postedDate: 'Posted 1 day ago',
    applyByDate: 'Apply by 10 April',
    salaryRange: '$720k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '8',
    title: 'Data Scientiest',
    company: 'UNICA',
    location: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    postedDate: 'Posted 1 day ago',
    applyByDate: 'Apply by 10 April',
    salaryRange: '$720k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '9',
    title: 'Senior Product Designer',
    company: 'Niscala.io',
    location: 'San Francisco',
    tags: ['Remote', 'Full-time', 'Senior'],
    postedDate: 'Posted 2 days ago',
    applyByDate: 'Apply by 30 April',
    salaryRange: '$520k - $660k/yr',
    ...defaultDetails,
  },
  {
    id: '10',
    title: 'Senior Product Designer',
    company: 'Niscala.io',
    location: 'San Francisco',
    tags: ['Remote', 'Full-time', 'Senior'],
    postedDate: 'Posted 2 days ago',
    applyByDate: 'Apply by 30 April',
    salaryRange: '$520k - $660k/yr',
    ...defaultDetails,
  },
  {
    id: '11',
    title: 'Full Stack Engineer',
    company: 'SAMTIV',
    location: 'New York',
    tags: ['Onsite', 'Part-time'],
    postedDate: 'Posted 2 days ago',
    applyByDate: 'Apply by 30 April',
    salaryRange: '$920k - $960k/yr',
    ...defaultDetails,
  },
  {
    id: '12',
    title: 'Data Scientiest',
    company: 'UNICA',
    location: 'Berlin',
    tags: ['Onsite', 'Full-time', 'Senior'],
    postedDate: 'Posted 1 day ago',
    applyByDate: 'Apply by 10 April',
    salaryRange: '$720k - $960k/yr',
    ...defaultDetails,
  },
];
