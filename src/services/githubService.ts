import axios from 'axios';

// Interface para os dados do repositório
export interface RepoData {
  name: string;
  description: string;
  homepage: string | null;
  clone_url: string;
  languages_url: string;
  html_url: string;
  owner: {
    login: string;
    html_url: string;
  };
  license: {
    name: string;
  } | null;
  topics: string[];
  language: string;
  languages: Record<string, number>;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  existingReadme?: string;
}

// Função para buscar dados do repositório
export const fetchRepoData = async (owner: string, repo: string): Promise<RepoData> => {
  try {
    // Buscar informações básicas do repositório
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    
    if (repoResponse.status !== 200) {
      throw new Error("Repositório não encontrado ou limite de API excedido");
    }
    
    const repoData = repoResponse.data;
    
    // Buscar informações de linguagens
    const languagesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`);
    const languages = languagesResponse.data;
    
    // Buscar o conteúdo do README.md existente, se houver
    let existingReadme = null;
    try {
      const readmeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`);
      if (readmeResponse.status === 200) {
        const readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
        existingReadme = readmeContent;
      }
    } catch (error) {
      // Ignorar erro se não existir README
      console.log('README não encontrado no repositório, será criado um novo');
    }

    // Combinar todos os dados
    return {
      ...repoData,
      languages,
      existingReadme
    } as RepoData;
  } catch (error: any) {
    console.error('Erro ao buscar dados do repositório:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar dados do repositório');
  }
}; 