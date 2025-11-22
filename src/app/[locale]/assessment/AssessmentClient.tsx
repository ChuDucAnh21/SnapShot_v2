'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useSubmitAssessment, useSurveys } from '@/features/assessments/hooks';
import { useMe } from '@/features/auth/hooks';
import { useGenerateProfile } from '@/features/profiles/hooks';
import { useAuthStore } from '@/lib/auth/auth-store';

export function AssessmentClient() {
  const surveysQuery = useSurveys('en');
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: meData } = useMe();
  const submitAssessment = useSubmitAssessment();
  const generateProfile = useGenerateProfile();

  const [step, setStep] = useState<'survey' | 'profile' | 'complete'>('survey');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const learnerId = user?.learner_id || meData?.learner.learner_id;

  const handleSubmitAssessment = async () => {
    if (!learnerId) {
      return;
    }

    try {
      await submitAssessment.mutateAsync({
        learner_id: learnerId,
        parent_survey: {
          interests: selectedInterests,
          learning_style: ['visual'],
          strengths: ['quick_learner'],
          weaknesses: [],
        },
        minigame_results: [
          {
            game_type: 'math',
            metadata: { score: 0.85, time_spent: 120 },
          },
        ],
      });

      setStep('profile');
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  };

  const handleGenerateProfile = async () => {
    if (!learnerId) {
      return;
    }

    try {
      await generateProfile.mutateAsync({ learner_id: learnerId });
      setStep('complete');
    } catch (error) {
      console.error('Failed to generate profile:', error);
    }
  };

  if (!learnerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🔍</div>
        <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse delay-1000">📝</div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🎯</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse delay-3000">✨</div>

        <Card className="w-full max-w-md bg-white border-gray-200 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="mb-4 text-6xl animate-bounce">🔐</div>
            <CardTitle className="text-3xl font-bold text-gray-800">Cần đăng nhập</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Vui lòng đăng nhập để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/login')}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <span className="mr-2 text-xl">🚀</span>
              Đi đến đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🎉</div>
        <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse delay-1000">🌟</div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🎊</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse delay-3000">🎈</div>

        <Card className="w-full max-w-md bg-white border-gray-200 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="mb-4 text-6xl animate-bounce">🎉</div>
            <CardTitle className="text-3xl font-bold text-gray-800">Hoàn thành! 🎊</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Hồ sơ học tập cá nhân của bạn đã được tạo thành công!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button
              onClick={() => router.push('/learn')}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <span className="mr-2 text-xl">🚀</span>
              Bắt đầu học tập
            </Button>
            <Button
              onClick={() => router.push('/profile')}
              className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300 rounded-xl transition-all duration-200"
            >
              <span className="mr-2 text-lg">👤</span>
              Xem hồ sơ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🤖</div>
        <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse delay-1000">⚡</div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🎯</div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse delay-3000">✨</div>

        <Card className="w-full max-w-md bg-white border-gray-200 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="mb-4 text-6xl animate-bounce">🤖</div>
            <CardTitle className="text-3xl font-bold text-gray-800">Tạo hồ sơ cá nhân</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Chúng tôi sẽ tạo hồ sơ học tập cá nhân dựa trên đánh giá của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateProfile}
              disabled={generateProfile.isPending}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {generateProfile.isPending
                ? (
                  <>
                    <Spinner className="mr-3 h-5 w-5" />
                    Đang tạo hồ sơ...
                  </>
                )
                : (
                  <>
                    <span className="mr-2 text-xl">⚡</span>
                    Tạo hồ sơ cá nhân
                  </>
                )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">📚</div>
      <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse delay-1000">🎨</div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🔬</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse delay-3000">🎵</div>

      <Card className="w-full max-w-2xl bg-white border-gray-200 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="mb-4 text-6xl animate-bounce">📝</div>
          <CardTitle className="text-3xl font-bold text-gray-800">Đánh giá học tập</CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Hãy cho chúng tôi biết về sở thích học tập của bạn! 🌟
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {surveysQuery.isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Spinner className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600 text-lg">Đang tải câu hỏi...</p>
              </div>
            </div>
          )}

          {surveysQuery.data && (
            <div>
              <h3 className="mb-6 font-bold text-gray-800 text-xl flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Môn học nào bạn quan tâm?
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  { key: 'math', label: 'Toán học', icon: '🔢' },
                  { key: 'science', label: 'Khoa học', icon: '🔬' },
                  { key: 'art', label: 'Nghệ thuật', icon: '🎨' },
                  { key: 'music', label: 'Âm nhạc', icon: '🎵' },
                  { key: 'sports', label: 'Thể thao', icon: '⚽' },
                  { key: 'reading', label: 'Đọc sách', icon: '📚' },
                ].map(interest => (
                  <Button
                    key={interest.key}
                    variant={selectedInterests.includes(interest.key) ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedInterests(prev =>
                        prev.includes(interest.key)
                          ? prev.filter(i => i !== interest.key)
                          : [...prev, interest.key],
                      );
                    }}
                    className={`h-16 flex-col gap-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      selectedInterests.includes(interest.key)
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold border-transparent'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-pink-400'
                    }`}
                  >
                    <span className="text-2xl">{interest.icon}</span>
                    <span className="text-sm font-medium">{interest.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmitAssessment}
            disabled={submitAssessment.isPending || selectedInterests.length === 0}
            className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitAssessment.isPending
              ? (
                <>
                  <Spinner className="mr-3 h-6 w-6" />
                  Đang gửi đánh giá...
                </>
              )
              : (
                <>
                  <span className="mr-2 text-2xl">🚀</span>
                  Gửi đánh giá
                </>
              )}
          </Button>

          {selectedInterests.length === 0 && (
            <p className="text-center text-gray-600 text-sm">
              Vui lòng chọn ít nhất một môn học bạn quan tâm
            </p>
          )}
        </CardContent>
      </Card>
    </div>

  );
}
