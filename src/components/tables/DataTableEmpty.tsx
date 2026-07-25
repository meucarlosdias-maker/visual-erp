import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Inbox } from '@/constants/icons';

interface DataTableEmptyProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function DataTableEmpty({
  message = 'Nenhum registro encontrado',
  description = 'Nenhum dado disponível para exibição.',
  icon,
}: DataTableEmptyProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={999} className="h-48 text-center">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                {icon ?? <Inbox className="h-12 w-12" />}
                <p className="font-medium">{message}</p>
                <p className="text-sm">{description}</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
