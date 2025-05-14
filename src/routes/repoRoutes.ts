import { Router } from 'express';
import { generateReadme } from '../controllers/repoController';

const router = Router();

// Rota para gerar o README com base nos dados do repositório
router.post('/generate-readme', generateReadme);

export { router as repoRoutes }; 