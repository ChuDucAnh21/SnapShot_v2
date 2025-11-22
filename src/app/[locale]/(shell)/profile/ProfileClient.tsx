'use client';

import { useEffect } from 'react';
import ResponsiveNavBar from '@/components/molecules/ResponsiveNavBar';
import WithRightRailTemplate from '@/components/templates/WithRightRailTemplate';
import { Spinner } from '@/components/ui/spinner';
import { RightRailProvider } from '@/context';
import { useMe } from '@/features/auth/hooks';
import { useProfile } from '@/features/profiles';
import { useProfileStatusCheck } from '@/hooks/useProfileStatusCheck';

const numberFormatter = new Intl.NumberFormat('en-US');
const abilityTone: Record<string, string> = {
  math: 'text-green-600', // Green
  language: 'text-blue-600', // Blue
  creativity: 'text-purple-600', // Purple
  logic: 'text-pink-600', // Pink
};

export default function ProfileClient() {
  const { data: meData, isLoading: meLoading } = useMe();
  const { isLoading: profileCheckLoading } = useProfileStatusCheck();

  const learnerId = meData?.learner?.learner_id;
  const { data: profileResponse, isLoading, isError, refetch, error } = useProfile(
    learnerId || '',
    Boolean(learnerId),
  );

  // Rule: no-console — Unexpected console statement. Only these console methods are allowed: warn, error.
  // Rule: React Hooks - useEffect dependency array should have constant size/order between renders.
  useEffect(() => {
    // For debugging: only log important info on error or with warnings
    console.warn('ProfileClient effect:', {
      learnerId,
      isLoading,
      isError,
      profileResponse,
      error,
    });
  }, [learnerId, profileResponse, isLoading, isError, error]);

  if (meLoading || isLoading || profileCheckLoading || !learnerId) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <p className="text-lg text-gray-600">
            {meLoading ? 'Đang tải thông tin người dùng...' : 'Đang tải hồ sơ học tập...'}
          </p>
        </div>
      </div>
    );
  }

  if (isError || !profileResponse?.profile) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-600 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="space-y-4 text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-lg text-gray-800">Không thể tải hồ sơ ngay bây giờ.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-3 text-sm font-bold text-white transition-all duration-200 transform hover:scale-105"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const profile = profileResponse.profile;
  const abilityEntries = Object.entries(profile.abilities);
  const abilityGrid = abilityEntries.map(([key, value]) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return {
      key,
      label,
      value,
      tone: abilityTone[key] ?? 'text-white',
    };
  });

  const strengths = profile.strengths.length > 0 ? profile.strengths : ['No strengths recorded yet.'];
  const weaknesses = profile.weaknesses.length > 0 ? profile.weaknesses : ['No focus areas recorded yet.'];
  const interests = profile.interests.length > 0 ? profile.interests : ['Exploring interests...'];

  return (
    <RightRailProvider initialSections={[]}>
      <WithRightRailTemplate stickyTop={0} railWidth={352}>
        <ResponsiveNavBar title="Profile" />
        <main className="mx-auto w-full max-w-[1024px] px-4 py-4 text-gray-800 sm:px-6 sm:py-6 relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
          {/* Floating decorative elements */}
          <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🌟</div>
          <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse delay-1000">🎈</div>
          <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🎨</div>
          <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse delay-3000">📚</div>
          {/* User Information from /me API */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg relative z-10">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-4xl animate-bounce">👤</span>
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-mono">User ID</div>
                  <div className="text-sm font-medium text-gray-600 font-mono">{meData?.user?.user_id || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    Email
                  </div>
                  <div className="text-xl font-bold text-gray-800">{meData?.user?.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span className="text-lg">👨‍👩‍👧‍👦</span>
                    Tên đầy đủ
                  </div>
                  <div className="text-xl font-bold text-gray-800">{meData?.user?.full_name || 'N/A'}</div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1 font-mono">Learner ID</div>
                  <div className="text-sm font-medium text-gray-600 font-mono">{meData?.learner?.learner_id || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span className="text-lg">👶</span>
                    Tên của bé
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{meData?.learner?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎂</span>
                    Tuổi
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {meData?.learner?.age || 'N/A'}
                    {' '}
                    tuổi
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    Trạng thái hồ sơ
                  </div>
                  <div className={`text-lg font-bold capitalize px-4 py-2 rounded-full inline-block ${
                    meData?.learner?.profile_status === 'complete'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : meData?.learner?.profile_status === 'ready'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                  }`}
                  >
                    {meData?.learner?.profile_status === 'complete'
                      ? 'Hoàn thành'
                      : meData?.learner?.profile_status === 'ready'
                        ? 'Sẵn sàng'
                        : meData?.learner?.profile_status === 'incomplete' ? 'Chưa hoàn thành' : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Information from /profiles API */}
          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg relative z-10">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-4xl animate-bounce">📊</span>
              Hồ sơ học tập
            </h2>

            {/* Abilities */}
            <div className="mb-8">
              <h3 className="mb-6 text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Khả năng học tập
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {abilityGrid.map((item) => {
                  const bgColors: Record<string, string> = {
                    math: 'bg-green-50 border-green-200 hover:bg-green-100',
                    language: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
                    creativity: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
                    logic: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
                  };
                  const bgClass = bgColors[item.key] || 'bg-gray-50 border-gray-200 hover:bg-gray-100';
                  return (
                    <div key={item.key} className={`text-center p-6 rounded-xl border ${bgClass} transition-all duration-200 transform hover:scale-105`}>
                      <div className={`text-4xl font-bold mb-2 ${item.tone}`}>{numberFormatter.format(item.value)}</div>
                      <div className="text-sm text-gray-600 capitalize font-medium">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Style */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                Phong cách học tập
              </h3>
              <div className="text-2xl font-bold text-blue-600 capitalize px-6 py-4 rounded-xl bg-blue-50 border border-blue-200 inline-block">
                {profile.learning_style}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <h3 className="mb-6 text-xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                Sở thích
              </h3>
              <div className="flex flex-wrap gap-4">
                {interests.map(interest => (
                  <span key={interest} className="rounded-full bg-pink-100 px-6 py-3 text-lg text-pink-600 font-bold border border-pink-200 hover:bg-pink-200 transition-all duration-200 transform hover:scale-105">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-6 text-xl font-bold text-green-600 flex items-center gap-3">
                  <span className="text-2xl">💪</span>
                  Điểm mạnh
                </h3>
                <div className="space-y-3">
                  {strengths.map(item => (
                    <div key={item} className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-200">
                      <span className="text-green-600 text-2xl">✓</span>
                      <span className="text-gray-800 text-lg font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-6 text-xl font-bold text-yellow-600 flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  Cần cải thiện
                </h3>
                <div className="space-y-3">
                  {weaknesses.map(item => (
                    <div key={item} className="flex items-center gap-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-all duration-200">
                      <span className="text-yellow-600 text-2xl">⚡</span>
                      <span className="text-gray-800 text-lg font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </WithRightRailTemplate>
    </RightRailProvider>
  );
}
