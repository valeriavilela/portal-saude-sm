# Portal-Saude-SM
Sistema de agendamento de consultas nas UBS de Santa Maria – DF, com painel administrativo para gestão de unidades e agendamentos.
# 🏥 Portal Saúde SM

Sistema de agendamento de consultas nas Unidades Básicas de Saúde (UBS) da Região Administrativa de Santa Maria – Distrito Federal, desenvolvido para a Secretaria de Saúde do Distrito Federal.

O portal permite que os cidadãos agendem consultas online de forma simples e gratuita, consultem e cancelem seus agendamentos, e visualizem endereços e horários das unidades de saúde disponíveis. Conta também com um painel administrativo para gestão das UBS e dos agendamentos realizados.

🔗 **Acesse o sistema em produção:** [https://portalsaudesm.web.app/]

## ✨ Funcionalidades

### Área do cidadão
- Agendamento online de consultas, com seleção de UBS, especialidade, data e horário
- Calendário interativo com dias e horários disponíveis
- Consulta de agendamentos por CPF
- Cancelamento de agendamentos ativos
- Geração de comprovante de agendamento em PDF
- Listagem de postos de saúde com endereços e horários de funcionamento
- Suporte a múltiplos idiomas (i18n)
- Interface acessível, com suporte a leitores de tela, navegação por teclado e atributos ARIA

### Área administrativa
- Login restrito para administradores
- Cadastro de novas UBS (dados gerais, especialidades atendidas e horários de atendimento por dia da semana)
- Gerenciamento de agendamentos com filtros por status (confirmados, realizados, cancelados) e por UBS
- Visualização das UBS cadastradas no sistema

## 🛠️ Tecnologias utilizadas

- **HTML5**, **CSS3** e **JavaScript** (módulos ES6)
- **Firebase Hosting** para publicação do site
- Estrutura de internacionalização própria (`translations.js`)
- Módulo dedicado de acessibilidade (`accessibility.js`)

## 📁 Estrutura do projeto

```
portal-saude-sm/
├── firebase.json
├── .firebaserc
├── .gitignore
├── package-lock.json
│
├── index.html                 # Página inicial
├── agendar.html                # Formulário de agendamento
├── meus-agendamentos.html      # Consulta e cancelamento de agendamentos
├── postos-de-saude.html        # Lista de UBS
├── loginadmin.html             # Login administrativo
├── admin.html                  # Painel administrativo
├── cadastrar-ubs.html          # Cadastro/edição de UBS
│
├── img/
│   └── favicon.png
│
└── js/
    ├── translations.js
    ├── accessibility.js
    ├── index.js
    ├── agendar.js
    ├── meus-agendamentos.js
    ├── postos-de-saude.js
    ├── loginadmin.js
    ├── admin.js
    ├── cadastrar-ubs.js
    └── css/
        └── style.css
```

## 🚀 Como executar localmente

Como o projeto é totalmente estático (HTML, CSS e JS), basta servir a pasta com qualquer servidor local:

```bash
# Usando o Firebase CLI
firebase serve

# ou usando um servidor HTTP simples
npx serve .
```

Depois, acesse `http://localhost:5000` (ou a porta indicada pelo servidor escolhido).

## ☁️ Deploy

O projeto é publicado através do Firebase Hosting:

```bash
firebase deploy
```

## ♿ Acessibilidade

O sistema foi desenvolvido com atenção a boas práticas de acessibilidade, incluindo uso de landmarks (`role`, `aria-label`, `aria-live`), navegação por teclado, foco visível e textos alternativos em imagens.

## 📄 Licença

Este projeto está sob a licença MIT.

---

Contribuições, sugestões e relatórios de problemas são bem-vindos através de issues e pull requests.
