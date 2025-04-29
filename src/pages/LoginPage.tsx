import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {useTelegramLogin} from "@/common/hooks/useTelegramLogin.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {UserResponse} from '@/types/user';
import WebApp from "@twa-dev/sdk";

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useTelegramLogin();

  // If user is already logged in, redirect to appropriate page
  React.useEffect(() => {
    if (user) {
      if (user?.role === "ADMIN") {
        navigate('/merchant');
      } else {
        navigate('/catalogue');
      }
    }
  }, [user, navigate]);

  // Handle Telegram WebApp authentication
  React.useEffect(() => {
    const initTelegramAuth = async () => {
      try {
        // Initialize Telegram WebApp
        WebApp.ready();
        WebApp.expand();

        // Get Telegram WebApp data from URL path if present
        let webAppData = WebApp.initData;
        
        // If no WebApp data in initData, check URL path
        if (!webAppData && location.pathname.startsWith('/tgWebAppData=')) {
          webAppData = decodeURIComponent(location.pathname.substring(1)); // Remove leading '/'
          // Clean up the URL by removing the WebApp data
          window.history.replaceState({}, '', '/');
        }

        // if (!webAppData) {
        //   console.error('No Telegram WebApp data available');
        //   return;
        // }

        // Attempt to login with Telegram data
        mutate(webAppData, {
          onSuccess: (data: UserResponse) => {
            login(data.user, data.token);
          },
          onError: (error) => {
            console.error('Telegram login failed:', error);
          }
        });
      } catch (error) {
        console.error('Failed to initialize Telegram WebApp:', error);
      }
    };

    initTelegramAuth();
  }, [mutate, login, location]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Загрузка...</CardTitle>
          <CardDescription className="text-center">
            Пожалуйста, подождите, пока мы авторизуем вас через Telegram
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
