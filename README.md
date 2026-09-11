# indisponibilidade-publica-web

Aplicação Pública do **Monitoramento de Indisponibilidade** (TCE-MG) — Angular 20 standalone, PrimeNG 20, Tailwind 4.

Publicada em **rede isolada (DMZ)**, com **acesso sem autenticação** (sem guard, login ou proxy de sessão). Telas:

- `/tempo-real` — acompanhamento em tempo real (atualização automática a cada 1 min + botão manual);
- `/consulta` — consulta do relatório por limiar (d-1) com download de PDF.

## Executar

```
npm install
npm start                # http://localhost:4201
npm run build:homolog
npm run build:prod
```

API consumida: `indisponibilidade-publica-api` (endpoints anônimos `/api/publico/*`; configurar `apiUrl` em `src/environments/`).
