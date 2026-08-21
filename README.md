# Desentupimentos 24h — Site

Site institucional para um serviço de desentupimentos de emergência, disponível 24 horas por dia. Projeto **standalone**, feito em HTML, CSS e JavaScript puros (sem frameworks nem etapa de build) — não depende de nenhum outro repositório.

## Estrutura

```
.
├── index.html   # Estrutura e conteúdo da página
├── style.css    # Todo o estilo visual
├── script.js    # Menu mobile, contadores animados, FAQ e validação do formulário
└── README.md
```

## Como usar

Não é preciso instalar nada. Basta abrir `index.html` num navegador, ou servir a pasta com qualquer servidor estático:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

## Personalizar

Procure por `EDITAR:` dentro de `index.html` para encontrar rapidamente os pontos a ajustar:

- Nome da empresa (`.logo__text`, `<title>`, rodapé)
- Números de telefone e WhatsApp (todos os `tel:` e `wa.me` links) — atualmente 925 375 475
- Zonas de cobertura (secção "Onde atuamos") — atualmente região do Porto
- Métodos de pagamento aceites (FAQ)
- Número que recebe os pedidos do formulário (`WHATSAPP_NUMBER` no topo de `script.js`)

### Formulário de contacto

O formulário não usa email nem backend algum. Ao submeter, os dados (nome, telefone, descrição do problema) são formatados automaticamente e o WhatsApp abre-se já com a mensagem pronta a enviar para o número da empresa — funciona assim que publicar o site, sem precisar de criar conta em nenhum serviço externo.

Se no futuro preferir receber os pedidos por email em vez de WhatsApp, pode substituir essa lógica em `script.js` por um serviço como o Formspree ou o EmailJS (ambos exigem criar uma conta gratuita nesse serviço).

## Publicar num novo repositório

```bash
git init
git add .
git commit -m "Site inicial - Desentupimentos 24h"
git branch -M main
git remote add origin <URL-DO-SEU-NOVO-REPOSITORIO>
git push -u origin main
```

Pode publicar gratuitamente em GitHub Pages, Netlify ou Vercel, já que é um site 100% estático.
