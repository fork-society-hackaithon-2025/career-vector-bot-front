import React from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

interface EmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
  onAddProduct: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onClearSearch, onAddProduct }) => {
  return (
    <Card className="py-8">
      <CardContent className="flex flex-col items-center justify-center text-center">
        {searchQuery ? (
          <>
            <p className="text-muted-foreground mb-4">Нет товаров, соответствующих "{searchQuery}"</p>
            <Button variant="outline" onClick={onClearSearch}>
              Clear search
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">Товаров не найдено</p>
            {onAddProduct}
          </>
        )}
      </CardContent>
    </Card>
  );
}; 