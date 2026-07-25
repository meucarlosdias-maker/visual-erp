import type { ComplianceFramework, ComplianceCheck, ComplianceCheckItem } from '../types';

const frameworkChecks: Record<ComplianceFramework, ComplianceCheckItem[]> = {
  LGPD: [
    { rule: 'LGPD-01', status: 'passed', description: 'Consentimento para tratamento de dados' },
    { rule: 'LGPD-02', status: 'passed', description: 'Direito de exclusão de dados' },
    { rule: 'LGPD-03', status: 'warning', description: 'Registro de operações de tratamento' },
    { rule: 'LGPD-04', status: 'passed', description: 'Política de privacidade publicada' },
  ],
  ISO_27001: [
    { rule: 'ISO-01', status: 'passed', description: 'Política de segurança da informação' },
    { rule: 'ISO-02', status: 'warning', description: 'Controle de acesso lógico' },
    { rule: 'ISO-03', status: 'passed', description: 'Gestão de incidentes' },
    { rule: 'ISO-04', status: 'failed', description: 'Auditoria interna programada' },
  ],
  SOC_2: [
    { rule: 'SOC-01', status: 'passed', description: 'Segurança de dados' },
    { rule: 'SOC-02', status: 'warning', description: 'Disponibilidade do serviço' },
    { rule: 'SOC-03', status: 'failed', description: 'Integridade de processamento' },
  ],
  OWASP: [
    { rule: 'OWASP-01', status: 'passed', description: 'Proteção contra XSS' },
    { rule: 'OWASP-02', status: 'passed', description: 'Proteção contra SQL Injection' },
    { rule: 'OWASP-03', status: 'warning', description: 'Autenticação segura' },
    { rule: 'OWASP-04', status: 'passed', description: 'Controle de acesso' },
    { rule: 'OWASP-05', status: 'failed', description: 'Proteção de dados sensíveis' },
  ],
};

export function checkCompliance(framework: ComplianceFramework): ComplianceCheck {
  const checks = frameworkChecks[framework];
  const passed = checks.filter((c) => c.status === 'passed').length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);
  const status = score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non_compliant';
  return { framework, status, score, checks };
}

export function listFrameworks(): ComplianceFramework[] {
  return ['LGPD', 'ISO_27001', 'SOC_2', 'OWASP'];
}

export function getAllComplianceChecks(): ComplianceCheck[] {
  return listFrameworks().map(checkCompliance);
}
