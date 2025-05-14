const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Criar diretório dist se não existir
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Criando diretório dist...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Compilar TypeScript
console.log('Compilando TypeScript...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('Compilação concluída com sucesso.');
} catch (error) {
  console.error('Erro na compilação:', error.message);
  process.exit(1);
}

// Verificar se o arquivo index.js foi criado no diretório dist
const indexJsPath = path.join(distDir, 'index.js');
if (fs.existsSync(indexJsPath)) {
  console.log(`O arquivo ${indexJsPath} foi criado com sucesso.`);
} else {
  console.error(`Erro: O arquivo ${indexJsPath} não foi criado.`);
  
  // Listar arquivos no diretório dist
  console.log('Arquivos no diretório dist:');
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir);
    files.forEach(file => {
      console.log(`- ${file}`);
    });
  } else {
    console.log('O diretório dist não existe.');
  }
  
  process.exit(1);
}

console.log('Deploy pronto para execução!'); 