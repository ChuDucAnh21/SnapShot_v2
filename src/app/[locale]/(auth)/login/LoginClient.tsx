'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { doLogin, doRegister } from '@/features/auth/service';

export function LoginClient() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    child_name: '',
    child_age: 6,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (isRegisterMode) {
      if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (formData.child_age < 3 || formData.child_age > 12) {
        errors.child_age = 'Tuổi của bé phải từ 3 đến 12';
      }
      if (!formData.full_name.trim()) {
        errors.full_name = 'Vui lòng nhập tên của bạn';
      }
      if (!formData.child_name.trim()) {
        errors.child_name = 'Vui lòng nhập tên của bé';
      }
    } else {
      if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        await doRegister({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          child_name: formData.child_name,
          child_age: formData.child_age,
        });
      } else {
        await doLogin({
          email: formData.email,
          password: formData.password,
        });
      }


      router.push('/listChild');


    } catch (err: any) {
      // Extract error message from ApiError or fallback to default
      const errorMessage = err?.message || err?.response?.data?.detail || err?.response?.data?.message || 'Authentication failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-10 animate-pulse">🌟</div>
      <div className="absolute top-20 right-20 text-3xl opacity-10 animate-pulse delay-1000">🎈</div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-pulse delay-2000">🎨</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-10 animate-pulse delay-3000">📚</div>

      <Card className="w-full max-w-md bg-white border-gray-200 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="mb-4 text-6xl animate-bounce">🎓</div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            {isRegisterMode ? 'Chào mừng đến với Iruka! 🌟' : 'Chào mừng trở lại! 👋'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {isRegisterMode ? 'Tạo tài khoản để bắt đầu hành trình học tập thú vị! 🎉' : 'Đăng nhập để tiếp tục cuộc phiêu lưu học tập! 🚀'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">😔</span>
                  <span>{error}</span>
                </div>
                {(error.toLowerCase().includes('already registered') || error.toLowerCase().includes('email already')) && isRegisterMode
                  ? (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <p className="text-xs text-red-600 mb-2">Email này đã được đăng ký. Bạn có muốn đăng nhập không?</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full bg-white border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setIsRegisterMode(false);
                          setError('');
                          setFieldErrors({});
                        }}
                      >
                        Chuyển sang đăng nhập
                      </Button>
                    </div>
                  )
                  : null}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                <span className="text-lg">📧</span>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={isLoading}
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                <span className="text-lg">🔒</span>
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.password;
                      return next;
                    });
                  }
                }}
                required
                minLength={6}
                disabled={isLoading}
                className={`bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                  fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            {isRegisterMode && (
              <>
                <div className="space-y-3">
                  <Label htmlFor="full_name" className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    Tên của bạn
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.full_name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, full_name: e.target.value }));
                      if (fieldErrors.full_name) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.full_name;
                          return next;
                        });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                      fieldErrors.full_name ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.full_name && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{fieldErrors.full_name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="child_name" className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">👶</span>
                    Tên của bé
                  </Label>
                  <Input
                    id="child_name"
                    type="text"
                    placeholder="Minh"
                    value={formData.child_name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, child_name: e.target.value }));
                      if (fieldErrors.child_name) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.child_name;
                          return next;
                        });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                      fieldErrors.child_name ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.child_name && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{fieldErrors.child_name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="child_age" className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">🎂</span>
                    Tuổi của bé
                  </Label>
                  <Input
                    id="child_age"
                    type="number"
                    min="3"
                    max="12"
                    value={formData.child_age}
                    onChange={(e) => {
                      const age = Number.parseInt(e.target.value, 10) || 0;
                      setFormData(prev => ({ ...prev, child_age: age }));
                      if (fieldErrors.child_age) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.child_age;
                          return next;
                        });
                      }
                    }}
                    required
                    disabled={isLoading}
                    className={`bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12 text-lg ${
                      fieldErrors.child_age ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.child_age && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{fieldErrors.child_age}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading
                ? (
                  <>
                    <Spinner className="mr-3 h-5 w-5" />
                    {isRegisterMode ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...'}
                  </>
                )
                : (
                  <>
                    <span className="mr-2 text-xl">{isRegisterMode ? '🚀' : '🎯'}</span>
                    {isRegisterMode ? 'Tạo tài khoản' : 'Đăng nhập'}
                  </>
                )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200"
              onClick={() => {
                setIsRegisterMode(prev => !prev);
                setError('');
                setFieldErrors({});
              }}
              disabled={isLoading}
            >
              <span className="mr-2 text-lg">{isRegisterMode ? '↩️' : '✨'}</span>
              {isRegisterMode ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
