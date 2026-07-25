import { redirect } from 'next/navigation';
import { Routes } from '@/config/routes';

export default function ConfiguracoesPage() {
  redirect(Routes.CONFIGURACOES_EMPRESA);
}
