// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import { mockAssessmentsData } from './mock-data/assessments';
import { mockAuthData } from './mock-data/auth';
import { mockDashboardData } from './mock-data/dashboard';
import { mockPathsData } from './mock-data/paths';
import { mockProfilesData } from './mock-data/profiles';
import { mockSessionsData } from './mock-data/sessions';
import { mockSubjectsData } from './mock-data/subjects';

// Environment variable to control mock mode
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export type MockRouterConfig = {
  useMockData: boolean;
  mockDelay?: number;
  logRequests?: boolean;
};

export class MockRouter {
  private config: MockRouterConfig;

  constructor(config: MockRouterConfig = { useMockData: USE_MOCK_DATA }) {
    this.config = {
      mockDelay: 500,
      logRequests: true,
      ...config,
    };
  }

  private log(message: string, data?: any): void {
    if (this.config.logRequests) {
      console.log(`[MockRouter] ${message}`, data || ''); // eslint-disable-line no-console
    }
  }

  // Auth routes
  async authRegister(data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Auth Register', data);
    return mockAuthData.register(data);
  }

  async authLogin(data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Auth Login', data);
    return mockAuthData.login(data);
  }

  async authGetMe(token: string) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Auth GetMe', { token: `${token.substring(0, 10)}...` });
    return mockAuthData.getMe(token);
  }

  // Subjects routes
  async subjectsGet() {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Subjects Get');
    return mockSubjectsData.getSubjects();
  }

  // Profiles routes
  async profilesGenerate(data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Profiles Generate', data);
    return mockProfilesData.generateProfile(data);
  }

  async profilesGet(learnerId: string) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Profiles Get', { learnerId });
    return mockProfilesData.getProfile(learnerId);
  }

  // Paths routes
  async pathsGenerate(data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Paths Generate', data);
    return mockPathsData.generatePath(data);
  }

  async pathsGet(learnerId: string, subjectId: string) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Paths Get', { learnerId, subjectId });
    return mockPathsData.getPath(learnerId, subjectId);
  }

  // Sessions routes
  async sessionsGenerate(data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Sessions Generate', data);
    return mockSessionsData.generateSession(data);
  }

  async sessionsGet(sessionId: string) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Sessions Get', { sessionId });
    return mockSessionsData.getSession(sessionId);
  }

  async sessionsStart(sessionId: string) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Sessions Start', { sessionId });
    return mockSessionsData.startSession(sessionId);
  }

  async sessionsSubmitActivity(sessionId: string, activityId: string, data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Sessions Submit Activity', { sessionId, activityId });
    return mockSessionsData.submitActivityResult(sessionId, activityId, data);
  }

  async sessionsComplete(sessionId: string, data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Sessions Complete', { sessionId });
    return mockSessionsData.completeSession(sessionId, data);
  }

  // Dashboard routes
  async dashboardGet(learnerId: string) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Dashboard Get', { learnerId });
    return mockDashboardData.getDashboard(learnerId);
  }

  // Assessments routes
  async assessmentsGetSurveys(locale = 'en') {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Assessments Get Surveys', { locale });
    return mockAssessmentsData.getSurveys(locale);
  }

  async assessmentsGetSurveyDetail(surveyKey: string, locale = 'en') {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Assessments Get Survey Detail', { surveyKey, locale });
    return mockAssessmentsData.getSurveyDetail(surveyKey, locale);
  }

  async assessmentsSubmit(data: any) {
    if (!this.config.useMockData) {
      throw new Error('Mock data not enabled');
    }
    this.log('Assessments Submit', data);
    return mockAssessmentsData.submitAssessment(data);
  }
}

// Create singleton instance
export const mockRouter = new MockRouter();

// Helper function to check if mock mode is enabled
export const isMockModeEnabled = () => USE_MOCK_DATA;

// Helper function to enable/disable mock mode
// Note: process.env variables are read-only in production builds
// This function is for development/testing purposes only
export const setMockMode = (enabled: boolean) => {
  // In development, we can modify the environment variable
  if (process.env.NODE_ENV === 'development') {
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = enabled.toString();
  }
  // In production, this is a no-op since env vars are read-only
};
