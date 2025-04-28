import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {useTelegramLogin} from "@/common/hooks/useTelegramLogin.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {UserResponse} from '@/types/user';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        initData: string;
      };
    };
  }
}

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useTelegramLogin();

  // If user is already logged in, redirect to appropriate page
  React.useEffect(() => {
    if (user) {
      console.log(user);
      if (user?.role === "ADMIN") {
        console.log('tippy and zelba')
        navigate('/merchant');
      } else {
        navigate('/catalogue');
      }
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    console.log('tg.initData', tg.initData);

    // auto-kick off login as soon as WebApp loads
    mutate(tg.initData, {
      onSuccess: (data: UserResponse) => {
        login(data.user, data.token);
      },
      onError: (error) => {
        console.error('Telegram login failed:', error);
      }
    });
  }, [mutate, login]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Loading...</CardTitle>
          <CardDescription className="text-center">
            Please wait while we authenticate you with Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {isPending && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
