export interface CepResult {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  erro?: boolean;
}

class CepService {
  async fetchCep(cep: string): Promise<CepResult | null> {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return null;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.erro) return null;

      return {
        cep: data.cep,
        logradouro: data.logradouro ?? '',
        bairro: data.bairro ?? '',
        cidade: data.localidade ?? '',
        estado: data.uf ?? '',
      };
    } catch {
      return null;
    }
  }
}

export const cepService = new CepService();
