// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isMockModeEnabled, mockRouter } from '@/v1';

// Helper function to parse request body
async function parseRequestBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Helper function to create error response
function createErrorResponse(status: number, message: string, data?: any) {
  return NextResponse.json({ status: 'error', message, data }, { status });
}

// Helper function to create success response
function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json({ status: 'success', ...data }, { status });
}

// POST endpoints (no auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const p = await params;

  try {
    // Auth endpoints
    if (pathname.endsWith('/api/v1/auth/register')) {
      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.authRegister(body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    if (pathname.endsWith('/api/v1/auth/login')) {
      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.authLogin(body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // Subjects endpoints
    if (pathname.endsWith('/api/v1/subjects')) {
      if (isMockModeEnabled()) {
        const result = await mockRouter.subjectsGet();
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // Profiles endpoints
    if (pathname.endsWith('/api/v1/profiles/generate')) {
      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.profilesGenerate(body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // Paths endpoints
    if (pathname.endsWith('/api/v1/paths/generate')) {
      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.pathsGenerate(body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // Sessions endpoints
    if (pathname.endsWith('/api/v1/sessions/generate')) {
      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.sessionsGenerate(body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // Assessments endpoints
    if (pathname.endsWith('/api/v1/assessments')) {
      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.assessmentsSubmit(body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // Sessions action endpoints (moved to POST per interface/types)
    // /api/v1/sessions/[sessionId]/start
    if (
      Array.isArray(p.resource)
      && p.resource[0] === 'sessions'
      && p.resource.length === 3
      && p.resource[2] === 'start'
    ) {
      const sessionId = p.resource[1];
      if (!sessionId) {
        return createErrorResponse(400, 'Missing session ID');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.sessionsStart(sessionId);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // /api/v1/sessions/[sessionId]/activities/[activityId]/result
    if (
      Array.isArray(p.resource)
      && p.resource[0] === 'sessions'
      && p.resource.length === 5
      && p.resource[2] === 'activities'
      && p.resource[4] === 'result'
    ) {
      const sessionId = p.resource[1];
      const activityId = p.resource[3];

      if (!sessionId || !activityId) {
        return createErrorResponse(400, 'Missing session ID or activity ID');
      }

      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.sessionsSubmitActivity(sessionId, activityId, body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // /api/v1/sessions/[sessionId]/complete
    if (
      Array.isArray(p.resource)
      && p.resource[0] === 'sessions'
      && p.resource.length === 3
      && p.resource[2] === 'complete'
    ) {
      const sessionId = p.resource[1];
      if (!sessionId) {
        return createErrorResponse(400, 'Missing session ID');
      }

      const body = await parseRequestBody(request);
      if (!body) {
        return createErrorResponse(400, 'Invalid request body');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.sessionsComplete(sessionId, body);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    return createErrorResponse(404, 'Endpoint not found');
  } catch (error) {
    console.error('V1 API Error:', error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'Internal server error');
  }
}

// GET endpoints (no auth)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const p = await params;
  const resource = Array.isArray(p.resource) ? p.resource[0] : p.resource;

  try {
    // Auth endpoints
    if (resource === 'auth') {
      // GET /api/v1/auth/me
      if (p.resource.length === 2 && p.resource[1] === 'me') {
        const authHeader = request.headers.get('authorization');
        let token = authHeader?.replace('Bearer ', '') || '';

        if (!token) {
          token = 'pnt_024acaeb-5c0c-44e8-88e7-54e9fbe2acfb';
          // return createErrorResponse(401, 'Missing authorization token');
          const result = await mockRouter.authGetMe(token);
          return createSuccessResponse(result);
        }

        if (isMockModeEnabled()) {
          const result = await mockRouter.authGetMe(token);
          return createSuccessResponse(result);
        }

        return createErrorResponse(501, 'Real API not implemented yet');
      }

      return createErrorResponse(404, 'Auth endpoint not found');
    }

    if (resource === 'subjects') {
      if (isMockModeEnabled()) {
        const result = await mockRouter.subjectsGet();
        return createSuccessResponse(result);
      }
      return createErrorResponse(501, 'Real API not implemented yet');
    }

    if (resource === 'profiles') {
      // /api/v1/profiles/[learnerId]
      const url = new URL(request.url);
      const parts = url.pathname.split('/');
      let learnerId = parts.at(-1);

      if (!learnerId || learnerId === 'profiles') {
        learnerId = '3a787847-e996-4718-aa36-12a15ebef784';
        // return createErrorResponse(400, 'Missing learner ID');
        const result = await mockRouter.profilesGet(learnerId);
        return createSuccessResponse(result);
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.profilesGet(learnerId);
        return createSuccessResponse(result);
      }
      return createErrorResponse(501, 'Real API not implemented yet');
    }

    if (resource === 'paths') {
      // /api/v1/paths/[...resource] → /api/v1/paths/[learnerId]/[subjectId]
      // Support dynamic segments via params.resource
      const learnerId = Array.isArray(p.resource) && p.resource.length > 1 ? p.resource[1] : undefined;
      const subjectId = Array.isArray(p.resource) && p.resource.length > 2 ? p.resource[2] : undefined;

      if (!learnerId || !subjectId) {
        return createErrorResponse(400, 'Missing learner ID or subject ID');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.pathsGet(learnerId, subjectId);
        return createSuccessResponse(result);
      }
      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // [...resource] support for sessions and dashboard endpoints

    // /api/v1/sessions/[sessionId]
    if (resource === 'sessions') {
      const sessionId = p.resource.length > 1 ? p.resource[1] : undefined;
      if (!sessionId) {
        return createErrorResponse(400, 'Missing session ID');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.sessionsGet(sessionId);
        return createSuccessResponse(result);
      }
      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // /api/v1/dashboard/[learnerId]
    if (resource === 'dashboard') {
      const learnerId = p.resource.length > 1 ? p.resource[1] : undefined;
      if (!learnerId) {
        return createErrorResponse(400, 'Missing learner ID');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.dashboardGet(learnerId);
        return createSuccessResponse(result);
      }
      return createErrorResponse(501, 'Real API not implemented yet');
    }

    return createErrorResponse(404, 'Endpoint not found');
  } catch (error) {
    console.error('V1 API Error:', error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'Internal server error');
  }
}

// PUT endpoints for session actions (no auth)
export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string[] }> },
) {
  const p = await params;
  const resource = Array.isArray(p.resource) ? p.resource[0] : p.resource;

  try {
    // /api/v1/sessions/[sessionId]/start → moved to POST
    if (resource === 'sessions' && p.resource.length === 3 && p.resource[2] === 'start') {
      return createErrorResponse(405, 'Use POST /api/v1/sessions/{session_id}/start');
    }

    // /api/v1/sessions/[sessionId]/activities/[activityId]/result → moved to POST
    if (
      resource === 'sessions'
      && p.resource.length === 5
      && p.resource[2] === 'activities'
      && p.resource[4] === 'result'
    ) {
      return createErrorResponse(405, 'Use POST /api/v1/sessions/{session_id}/activities/{activity_id}/result');
    }

    // /api/v1/sessions/[sessionId]/complete → moved to POST
    if (
      resource === 'sessions'
      && p.resource.length === 3
      && p.resource[2] === 'complete'
    ) {
      return createErrorResponse(405, 'Use POST /api/v1/sessions/{session_id}/complete');
    }

    return createErrorResponse(404, 'Endpoint not found');
  } catch (error) {
    console.error('V1 API Error:', error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'Internal server error');
  }
}
