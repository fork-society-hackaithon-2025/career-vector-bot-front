import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <h1 className="text-2xl font-bold">Доступ запрещен</h1>
      <p className="text-muted-foreground">У вас нет прав для доступа к этой странице.</p>
      <Button onClick={() => navigate('/')}>
        Вернуться на главную
      </Button>
    </div>
  );
};

export default UnauthorizedPage; 