import { GoogleGenerativeAI } from '@google/generative-ai';
import { RepoData } from './githubService';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Configura a API do Google Generative AI
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY não definida nas variáveis de ambiente');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Função para gerar README usando a API do Gemini
export const generateReadmeWithGemini = async (repoData: RepoData): Promise<string> => {
  try {
    // Cria o modelo usando a API do Gemini - tenta com gemini-1.5-pro se gemini-pro falhar
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
      console.log('Erro ao usar gemini-pro, tentando gemini-1.5-pro...');
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    }

    // Prepara os dados para o prompt
    const languages = Object.keys(repoData.languages).join(', ');
    const topics = repoData.topics ? repoData.topics.join(', ') : 'Nenhum tópico disponível';

    // Constrói o prompt para o Gemini com instruções claras sobre formatação
    const prompt = `
      Crie um README.md profissional, bem formatado e detalhado para o seguinte repositório do GitHub:
      
      Nome: ${repoData.name}
      Descrição: ${repoData.description || 'Nenhuma descrição fornecida'}
      Linguagens: ${languages}
      Tópicos: ${topics}
      Proprietário: ${repoData.owner.login}
      URL do Repositório: ${repoData.html_url}
      
      IMPORTANTE: O README deve seguir estas REGRAS DE FORMATAÇÃO:
      1. Use uma estrutura clara e consistente
      2. Deixe espaço entre as seções (linha em branco)
      3. Use headers de tamanho adequado (# para título principal, ## para seções, ### para subseções)
      4. Crie listas com marcadores claros
      5. Use blocos de código com a linguagem especificada
      6. Mantenha o alinhamento consistente
      7. Evite linhas muito longas
      8. Use tabelas para informações que façam sentido em formato tabular
      9. Links devem estar formatados corretamente
      10. Adicione emojis no início das seções para melhorar a visualização

      O README deve incluir as seguintes seções (nesta ordem):
      1. Título grande e chamativo com o nome do projeto
      2. Descrição curta e badges (estrelas, forks, licença)
      3. Tabela de Conteúdo com links para as seções
      4. Visão geral do projeto
      5. Demonstração ou Screenshots (se aplicável)
      6. Tecnologias utilizadas (com lista de tecnologias)
      7. Instalação e configuração (com blocos de código bash)
      8. Como usar (com exemplos claros)
      9. Estrutura do projeto (em lista ou tabela)
      10. Funcionalidades (lista com marcadores)
      11. Roadmap ou Próximos Passos (opcional)
      12. Como contribuir
      13. Licença: ${repoData.license ? repoData.license.name : 'Não especificada'}
      14. Autor ou Contato
      
      Faça o README completamente em Português Brasileiro.
      Use a formatação markdown de forma limpa e consistente.
      
      No rodapé do README, adicione OBRIGATORIAMENTE a seguinte linha, formatada exatamente assim:
      
      "---
      
      Gerado com ❤️ e ☕."
      
      Se o repositório já tiver um README existente, use-o como referência, mas melhore-o:
      ${repoData.existingReadme ? 'README existente: ' + repoData.existingReadme : 'Não há README existente.'}
    `;

    // Gera o conteúdo do README
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Processa o texto para garantir formatação consistente
      return processMarkdown(text);
    } catch (e) {
      console.error('Erro específico ao gerar conteúdo:', e);
      
      // Caso a API falhe, gerar um README básico como fallback
      return gerarReadmeBemFormatado(repoData, languages);
    }
  } catch (error: any) {
    console.error('Erro na API do Gemini:', error);
    
    // Se houver erro na API, gerar um README básico como fallback
    const languages = Object.keys(repoData.languages).join(', ');
    return gerarReadmeBemFormatado(repoData, languages);
  }
};

// Função para processar e garantir a boa formatação do markdown
const processMarkdown = (markdown: string): string => {
  // Remove espaços em branco extras no início e fim
  let processedMarkdown = markdown.trim();
  
  // Garante espaço adequado após os cabeçalhos
  processedMarkdown = processedMarkdown.replace(/^(#{1,6}.+)$/gm, '$1\n');
  
  // Garante que blocos de código tenham a formatação correta
  processedMarkdown = processedMarkdown.replace(/```([a-zA-Z]*)\s+/g, '```$1\n');
  processedMarkdown = processedMarkdown.replace(/\s+```/g, '\n```');
  
  // Adiciona espaço após listas
  processedMarkdown = processedMarkdown.replace(/^(- .+)$/gm, '$1\n');
  
  // Garante espaçamento consistente entre seções
  processedMarkdown = processedMarkdown.replace(/\n{3,}/g, '\n\n');
  
  return processedMarkdown;
};

// Função para gerar um README bem formatado caso a API falhe
const gerarReadmeBemFormatado = (repoData: RepoData, languages: string): string => {
  return `# 🚀 ${repoData.name}

${repoData.description || 'Nenhuma descrição fornecida.'}

${repoData.license ? `![Licença](https://img.shields.io/badge/licença-${encodeURIComponent(repoData.license.name)}-blue.svg)` : ''}
![Estrelas](https://img.shields.io/github/stars/${repoData.owner.login}/${repoData.name}.svg)
![Forks](https://img.shields.io/github/forks/${repoData.owner.login}/${repoData.name}.svg)

## 📋 Tabela de Conteúdos

- [📖 Visão Geral](#-visão-geral)
- [💻 Tecnologias](#-tecnologias)
- [🚀 Instalação](#-instalação)
- [📝 Como Usar](#-como-usar)
- [✨ Funcionalidades](#-funcionalidades)
- [📄 Licença](#-licença)
- [👨‍💻 Autor](#-autor)

## 📖 Visão Geral

Este repositório contém o código-fonte para ${repoData.name}. 
${repoData.topics && repoData.topics.length > 0 ? `\nTópicos relacionados: ${repoData.topics.map((topic: string) => `**${topic}**`).join(', ')}` : ''}

## 💻 Tecnologias

${languages ? languages.split(',').map(lang => `- **${lang.trim()}**`).join('\n') : '- Nenhuma informação de linguagem disponível'}

## 🚀 Instalação

\`\`\`bash
# Clone o repositório
git clone ${repoData.clone_url}

# Entre no diretório do repositório
cd ${repoData.name}

# Instale as dependências
npm install
# ou
yarn install
\`\`\`

## 📝 Como Usar

\`\`\`bash
# Execute a aplicação em modo de desenvolvimento
npm start
# ou
yarn start
\`\`\`

## ✨ Funcionalidades

- ✅ Funcionalidade 1
- ✅ Funcionalidade 2
- ✅ Funcionalidade 3

## 📄 Licença

Este projeto está licenciado sob a ${repoData.license ? repoData.license.name : 'licença não especificada'}.

## 👨‍💻 Autor

- [${repoData.owner.login}](${repoData.owner.html_url})

---

Gerado com ❤️ por [ReadmeMaker](https://readmemaker.com) | Desenvolvido por [LucaDevel0per](https://github.com/LucaDevel0per)
`;
}; 