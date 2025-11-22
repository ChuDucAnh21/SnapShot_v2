'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useMe } from '@/features/auth/hooks';
import { useGeneratePath, usePath } from '@/features/paths/hooks';
import { useSubjects } from '@/features/subjects/hooks';
import { useProfileStatusCheck } from '@/hooks/useProfileStatusCheck';
import { useAuthStore } from '@/lib/auth/auth-store';
import LearnLandingContainer from './LearnLandingContainer';

export function LearnPageClient() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: meData, isLoading: meLoading, isError } = useMe(true);
  const { isLoading: profileCheckLoading } = useProfileStatusCheck();
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const learnerId = user?.learner_id || meData?.learner.learner_id;

  // Fetch subjects
  const { data: subjectsData, isLoading: subjectsLoading } = useSubjects();

  // Fetch existing path
  const { data: pathData, isLoading: pathLoading, isError: pathError } = usePath(
    learnerId || '',
    selectedSubject,
    Boolean(learnerId && selectedSubject),
  );

  // Generate path mutation
  const generatePathMutation = useGeneratePath();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!meLoading && isError && !user) {
      // router.push('/login');
    }
  }, [meLoading, isError, user, router]);

  // Auto-generate path only if no existing path data
  useEffect(() => {
    if (
      selectedSubject
      && learnerId
      && !pathLoading
      && !pathData
      && !generatePathMutation.isPending
      && !generatePathMutation.isSuccess
    ) {
      // Only generate if there's no existing path
      generatePathMutation.mutate({
        learner_id: learnerId,
        subject_id: selectedSubject,
      });
    }
  }, [selectedSubject, learnerId, pathLoading, pathData, generatePathMutation]);

  const handleGeneratePath = async () => {
    if (!learnerId || !selectedSubject) {
      return;
    }

    try {
      await generatePathMutation.mutateAsync({
        learner_id: learnerId,
        subject_id: selectedSubject,
      });
    } catch (error) {
      console.error('Failed to generate path:', error);
    }
  };

  if (meLoading || profileCheckLoading || !learnerId) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    );
  }

  // Show loading while generating path
  if (generatePathMutation.isPending) {
    return (
      <div className="flex h-full items-center justify-center p-4 bg-white">
        <Card className="w-full max-w-md bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">Setting Up Your Learning</CardTitle>
            <CardDescription className="text-center text-gray-600">
              We're preparing your personalized learning path...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Spinner className="mx-auto mb-4 h-8 w-8 text-blue-500" />
            <p className="text-sm text-gray-600">
              Generating your learning path for
              {' '}
              {subjectsData?.subjects.find(s => s.subject_id === selectedSubject)?.name || 'your subject'}
              ...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show subject selection UI if no subject selected or no path exists
  if (!selectedSubject || pathError || (!pathLoading && !pathData)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🌟</div>
        <div className="absolute top-20 right-20 text-3xl opacity-10 animate-bounce delay-1000">🎈</div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🎨</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-bounce delay-3000">📚</div>

        <div className="flex h-full items-center justify-center">
          <Card className="w-full max-w-4xl bg-white border-gray-200 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <span className="animate-bounce">🎯</span>
                Chọn Môn Học Của Bạn
                <span className="animate-bounce delay-500">📚</span>
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Hãy chọn môn học bạn muốn học để bắt đầu hành trình học tập cá nhân hóa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {subjectsLoading
                ? (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <Spinner className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <p className="text-lg text-gray-700">Đang tải danh sách môn học...</p>
                    </div>
                  </div>
                )
                : (
                  <>
                    <div>
                      <h3 className="mb-6 text-xl font-bold text-gray-800 text-center">📖 Môn Học Có Sẵn</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {subjectsData?.subjects.map(subject => (
                          <Button
                            key={subject.subject_id}
                            variant={selectedSubject === subject.subject_id ? 'default' : 'outline'}
                            onClick={() => setSelectedSubject(subject.subject_id)}
                            className={`h-auto flex-col py-6 px-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                              selectedSubject === subject.subject_id
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-lg'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-3xl mb-3">{subject.code}</span>
                            <span className="font-medium text-sm">{subject.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedSubject && (
                      <div className="text-center">
                        <Button
                          onClick={handleGeneratePath}
                          disabled={generatePathMutation.isPending}
                          className="w-full max-w-md bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
                          size="lg"
                        >
                          {generatePathMutation.isPending
                            ? (
                              <>
                                <Spinner className="mr-3 h-5 w-5" />
                                🎨 Đang tạo lộ trình học tập...
                              </>
                            )
                            : (
                              <>
                                🚀 Bắt Đầu Học Tập
                              </>
                            )}
                        </Button>
                      </div>
                    )}

                    {generatePathMutation.isError && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                        <p className="text-red-600 font-medium">
                          😔 Không thể tạo lộ trình học tập. Vui lòng thử lại!
                        </p>
                      </div>
                    )}
                  </>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <LearnLandingContainer learnerId={learnerId} subjectId={selectedSubject} />;
}
