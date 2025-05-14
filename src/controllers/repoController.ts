import { Request, Response } from 'express';
import axios from 'axios';
import { generateReadmeWithGemini } from '../services/geminiService';
import { fetchRepoData } from '../services/githubService';

// Interface para os dados de entrada
interface GenerateReadmeRequest {
  repoUrl: string;
}

// Controlador para gerar README
export const generateReadme = async (req: Request, res: Response) => {
  try {
    const { repoUrl } = req.body as GenerateReadmeRequest;

    if (!repoUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL do repositório é obrigatória' 
      });
    }

    // Extrair informações do repositório da URL
    const { owner, repo } = extractRepoInfo(repoUrl);

    // Buscar dados do repositório usando o serviço de GitHub
    const repoData = await fetchRepoData(owner, repo);

    // Gerar README usando o serviço do Gemini
    const readmeContent = await generateReadmeWithGemini(repoData);

    return res.status(200).json({
      success: true,
      readme: readmeContent
    });

  } catch (error: any) {
    console.error('Erro ao gerar README:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao gerar README',
      error: error.response?.data || error
    });
  }
};

// Função para extrair informações do repositório da URL
const extractRepoInfo = (url: string) => {
  try {
    // Extract owner/repo from different GitHub URL formats
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    
    if (!match) throw new Error("URL do GitHub inválida");
    
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  } catch (error) {
    throw new Error("Não foi possível analisar a URL do GitHub");
  }
}; 