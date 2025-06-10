import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useClients } from '@/common/hooks/useClients';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const MerchantClients = () => {
  const navigate = useNavigate();
  const { data: clients = [], isLoading } = useClients();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Клиенты</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Текущий долг</TableHead>
                <TableHead>Последний платеж</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.userId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/merchant/clients/${client.userId}`)}
                >
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    {client.totalDebt > 0 ? (
                      <Badge variant="destructive" className="text-sm">
                        {formatPrice(client.totalDebt)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-sm">
                        {formatPrice(0)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {client.lastPaymentDate
                      ? format(new Date(client.lastPaymentDate), 'dd.MM.yyyy', { locale: ru })
                      : 'Нет платежей'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantClients; 