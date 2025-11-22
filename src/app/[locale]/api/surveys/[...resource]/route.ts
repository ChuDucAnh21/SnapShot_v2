// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs, antfu/no-top-level-await:off

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isMockModeEnabled, mockRouter } from '@/v1';

// Helper function to create error response
function createErrorResponse(status: number, message: string, data?: any) {
  return NextResponse.json({ status: 'error', message, data }, { status });
}

// Helper function to create success response
function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json({ status: 'success', ...data }, { status });
}

// GET /surveys - Get all surveys
export async function GET(request: NextRequest, { params }: { params: Promise<{ resource?: string[] }> }) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';
  const p = await params;

  try {
    // GET /surveys (no resource)
    if (!p.resource || p.resource.length === 0) {
      if (isMockModeEnabled()) {
        const result = await mockRouter.assessmentsGetSurveys(locale);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    // GET /surveys/:surveyKey
    if (p.resource.length === 1) {
      const surveyKey = p.resource[0];
      if (!surveyKey) {
        return createErrorResponse(400, 'Missing survey key');
      }

      if (isMockModeEnabled()) {
        const result = await mockRouter.assessmentsGetSurveyDetail(surveyKey, locale);
        return createSuccessResponse(result);
      }

      return createErrorResponse(501, 'Real API not implemented yet');
    }

    return createErrorResponse(404, 'Endpoint not found');
  } catch (error) {
    console.error('Surveys API Error:', error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'Internal server error');
  }
}
