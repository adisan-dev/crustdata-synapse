// API service for handling chat requests
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  currentMessage: string;
}

export interface ChatResponse {
  message: string;
  candidates?: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  summary: string;
  contact?: {
    email?: string;
    linkedin?: string;
    phone?: string;
  };
}

class ApiService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    // These will be configurable via environment variables
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.apiKey = import.meta.env.VITE_API_KEY;
  }

  /**
   * Send a chat message with conversation history and get AI response
   */
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // For now, return mock response until API endpoint is ready
      return this.getMockResponse(request);

      // Uncomment this when API is ready:
      /*
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Failed to get response from AI service');
    }
  }

  /**
   * Mock response for development/testing
   */
  private async getMockResponse(request: ChatRequest): Promise<ChatResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        experience: '6 years',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
        matchScore: 95,
        summary: 'Experienced React developer with strong TypeScript skills and cloud architecture experience.',
        contact: {
          email: 'sarah.chen@example.com',
          linkedin: 'https://linkedin.com/in/sarahchen',
        }
      },
      {
        id: '2',
        name: 'Michael Rodriguez',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        experience: '5 years',
        skills: ['React', 'Python', 'PostgreSQL', 'Docker', 'Kubernetes'],
        matchScore: 88,
        summary: 'Full-stack engineer with expertise in React frontend and Python backend development.',
        contact: {
          email: 'michael.r@example.com',
          linkedin: 'https://linkedin.com/in/michaelrodriguez',
        }
      },
      {
        id: '3',
        name: 'Emily Johnson',
        title: 'Frontend Developer',
        company: 'DesignStudio',
        location: 'San Francisco, CA',
        experience: '4 years',
        skills: ['React', 'Vue.js', 'CSS', 'JavaScript', 'Figma'],
        matchScore: 82,
        summary: 'Creative frontend developer with strong design sensibilities and modern framework expertise.',
        contact: {
          email: 'emily.johnson@example.com',
          linkedin: 'https://linkedin.com/in/emilyjohnson',
        }
      }
    ];

    const responses = [
      `I found ${mockCandidates.length} candidates matching your requirements for "${request.currentMessage}". Here are the top matches:

**Top Candidates:**

🏆 **Sarah Chen** - Senior React Developer at TechCorp Inc.
• 6 years experience in San Francisco, CA
• Skills: React, TypeScript, Node.js, GraphQL, AWS
• Match Score: 95%
• Summary: Experienced React developer with strong TypeScript skills and cloud architecture experience.

🥈 **Michael Rodriguez** - Full Stack Engineer at StartupXYZ  
• 5 years experience in San Francisco, CA
• Skills: React, Python, PostgreSQL, Docker, Kubernetes
• Match Score: 88%
• Summary: Full-stack engineer with expertise in React frontend and Python backend development.

🥉 **Emily Johnson** - Frontend Developer at DesignStudio
• 4 years experience in San Francisco, CA  
• Skills: React, Vue.js, CSS, JavaScript, Figma
• Match Score: 82%
• Summary: Creative frontend developer with strong design sensibilities and modern framework expertise.

Would you like me to search for more candidates or provide additional details about any of these profiles?`,

      `Based on your job description, I've identified several strong candidates. Here's my analysis:

**Search Summary:**
- Found 3 highly qualified candidates
- Average match score: 88%
- All candidates are located in San Francisco as requested
- Strong React/TypeScript skill alignment

**Key Insights:**
- Sarah Chen stands out with 6 years of experience and AWS cloud skills
- Michael Rodriguez brings valuable full-stack capabilities
- Emily Johnson offers strong design collaboration experience

The candidates show excellent technical alignment with your requirements. Sarah Chen appears to be the strongest match with her senior-level experience and comprehensive skill set.

Would you like me to:
1. Search for additional candidates?
2. Provide more detailed profiles?
3. Filter by specific criteria?`,

      `Great! I've analyzed your requirements and found some excellent matches. Here's what I discovered:

**Candidate Pipeline Analysis:**
✅ 3 qualified candidates identified
✅ All meet location requirements (San Francisco)
✅ Strong technical skill alignment
✅ Experience range: 4-6 years

**Standout Profiles:**

**Sarah Chen** is your top match with:
- Senior-level React expertise (6 years)
- Strong TypeScript and cloud architecture background
- Currently at TechCorp Inc.
- 95% compatibility score

The other candidates (Michael Rodriguez and Emily Johnson) also show strong potential with complementary skills in full-stack development and design collaboration.

Next steps: Would you like me to reach out to these candidates or search for additional profiles with different criteria?`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      message: randomResponse,
      candidates: mockCandidates,
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
