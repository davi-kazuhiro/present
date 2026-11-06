# Present

> **Ensinar é o que importa.** Chamada acadêmica automática, com validação de presença por geolocalização.

O professor abre a chamada com um clique, e o aluno confirma a presença em dois toques pelo celular. O sistema verifica se o aluno está mesmo na sala, comparando a localização dele com a do professor. Quando o GPS falha, existe um plano B: o aluno pede presença manual e o professor aprova.

O projeto nasceu na disciplina de **Experiência Criativa** do curso de Ciência da Computação da **PUCPR** (5º período, 2026). Antes de virar código, a ideia passou por um processo completo de inovação: Design Thinking, Canvas do Modelo de Negócios e **dois ciclos de validação Lean Startup, com 20 entrevistas com alunos e professores**.

## Sumário

- [O problema](#o-problema)
- [A solução](#a-solução)
- [Processo de inovação](#processo-de-inovação)
  - [Linha do tempo](#linha-do-tempo)
  - [Descoberta: Design Thinking](#descoberta-design-thinking)
  - [Concorrentes](#concorrentes)
  - [Validação com usuários](#validação-com-usuários)
  - [Ciclo 1: o que aprendemos com o MVP 1](#ciclo-1-o-que-aprendemos-com-o-mvp-1)
  - [Ciclo 2: o que aprendemos com o MVP 2](#ciclo-2-o-que-aprendemos-com-o-mvp-2)
  - [Do aprendizado ao código](#do-aprendizado-ao-código)
- [Modelo de negócio](#modelo-de-negócio)
- [Uso de IA no desenvolvimento](#uso-de-ia-no-desenvolvimento)
- [Arquitetura](#arquitetura)
- [Como executar](#como-executar)
- [Roadmap](#roadmap)
- [Equipe](#equipe)

---

## O problema

Em sala de aula, só **67% do tempo é dedicado a ensinar**. Os outros 20% vão para a manutenção da ordem e **13% para burocracia, incluindo a chamada manual** (Banco Mundial, 15.600 salas avaliadas no Brasil / TALIS-INEP).

Na prática, isso dá cerca de 6,5 minutos de burocracia por aula. Com 20 aulas por semana e 40 semanas letivas, são **86 horas por ano**: quase duas semanas inteiras de aula perdidas.

As entrevistas mostraram outras dores além do tempo:
- **Para o aluno:** falta lançada errado e sem como contestar, chamada por bluetooth que nem sempre funciona e professores que só lançam as faltas no fim do semestre.
- **Para o professor:** a chamada oral é cansativa, e os sistemas acadêmicos atuais não foram feitos para isso.

**Declaração de necessidade** (resultado da etapa de empatia):

> Uma maneira de automatizar o processo de chamada para professores e alunos, a fim de aumentar o tempo produtivo da aula e melhorar a precisão das chamadas.

## A solução

1. **O professor abre a chamada.** Com um clique, define o título, a duração e o **raio permitido** (de 5 a 200 m). A localização do professor no momento vira o centro da chamada.
2. **O aluno faz o check-in.** Ele vê o aviso de chamada aberta, e o app mostra **em tempo real a que distância ele está e qual é o raio permitido**. Se estiver dentro do raio, confirma a presença.
3. **O sistema atualiza tudo.** A frequência é atualizada para o aluno e para o professor. A chamada se encerra sozinha quando o prazo termina.

**Plano B:** se o aluno estiver fora do raio, por exemplo com o GPS impreciso dentro do prédio, ele pode **pedir presença manual**. O professor vê o pedido, junto com a distância registrada, e aprova ou não. Esse fluxo veio direto das entrevistas: foi a funcionalidade que os professores mais valorizaram no ciclo 2.

### Funcionalidades implementadas

| Perfil | Funcionalidade |
|---|---|
| Professor | Criar turmas, com horários semanais e cor |
| Professor | Convidar alunos por link (com regeneração do link) ou adicioná-los manualmente |
| Professor | Abrir uma chamada com raio e prazo, e acompanhar as respostas ao vivo |
| Professor | Aprovar pedidos de presença manual |
| Professor | Ver o painel com as aulas do dia, a distribuição de presenças e as chamadas recentes |
| Aluno | Entrar numa turma pelo link de convite |
| Aluno | Receber, dentro do app, o aviso de chamada aberta |
| Aluno | Fazer o check-in com validação por GPS, vendo a distância e o raio em tempo real |
| Aluno | Pedir presença manual quando estiver fora do raio |
| Aluno | Ver o histórico de presença por turma |
| Ambos | Usar como **PWA**: o site pode ser instalado na tela inicial do celular, como um app |

## Processo de inovação

### Linha do tempo

| Etapa | Ferramentas | Resultado |
|---|---|---|
| 1. Empatia | Levantamento de necessidades, tipos de usuário, dados de mercado, soluções existentes, **mapa de empatia** | Declaração de necessidade |
| 2. Definição | **Personas** (aluno e professor) | Foco nos dois segmentos: alunos e professores universitários |
| 3. Ideação | Brainstorming, **Canvas da Proposta de Valor**, processos atuais e propostos | Ideia de chamada automática integrada ao sistema acadêmico |
| 4. Modelo de negócio | **Canvas do Modelo de Negócios** | Proposta de valor por segmento, canais e fontes de receita |
| 5. MVP 1 + Ciclo 1 | Protótipo de alta fidelidade e 10 entrevistas (Construir → Medir → Aprender) | 6 mudanças priorizadas para o MVP 2 |
| 6. MVP 2 + Ciclo 2 | Protótipo revisado e 10 entrevistas com as mesmas pessoas | 7 ajustes para o MVP 3 |
| 7. Pitch e fomento | Pitch, análise de mercado, projeções e estratégias de captação | Modelo open core e plano de aceleração |
| 8. Produto | Este repositório | Aplicação web funcional (React + Node + MySQL) |

### Descoberta: Design Thinking

- **Necessidade:** a chamada consome tempo de aula e é pouco confiável, tanto para quem chama quanto para quem responde.
- **Usuários:** alunos e professores universitários. A instituição é quem paga.
- **Proposta de valor** (Canvas):
  - **Para o professor:** recuperar de 10 a 15 minutos por aula, com esforço zero (funciona sozinho), sem treinamento ou demonstração longa, e com um painel de presença em tempo real.
  - **Para o aluno:** check-in em segundos, confirmação visível no app e fim da chamada oral cansativa.
  - **Para a instituição:** dados confiáveis, integração com o ERP existente e conformidade com a LGPD.

### Concorrentes

| Critério | Manual / ERP | QR Code | Present |
|---|---|---|---|
| Sistema legado | Sim | Não | Não |
| Resistência à fraude | Alta, mas não 100% | Baixa | Alta, mas não 100% |
| Esforço do professor | Alto | Médio | Baixo |
| Dados em tempo real | Sim | Sim | Sim |
| Chamada como foco principal | Não | Médio | Sim |

O Present também tem limitações. A diferença é ser a única opção focada só em resolver bem a chamada.

### Validação com usuários

Seguimos o ciclo **Construir → Medir → Aprender** do Lean Startup. A cada versão do protótipo, a equipe se dividiu em duplas e entrevistou **as mesmas 10 pessoas**, o que permitiu comparar diretamente a reação de cada uma entre as versões:

- **6 alunos**, incluindo estudantes da UFPR e da Universidade Positivo;
- **4 professores**.

Cada entrevista seguiu o mesmo roteiro:
- compreensão do protótipo;
- dúvidas no fluxo de uso;
- funções sem valor e funções que faltavam;
- usabilidade;
- validação de três blocos do Canvas: relacionamento, canais e fonte de receita;
- o principal aprendizado para levar à equipe.

**Compreensão do protótipo:**

| | Compreendeu totalmente | Compreendeu parcialmente |
|---|---|---|
| MVP 1 (ciclo 1) | 6 de 9* | 3 de 9 |
| MVP 2 (ciclo 2) | **9 de 10** | 1 de 10 |

\* Em uma das entrevistas do ciclo 1, esse campo não foi registrado.

### Ciclo 1: o que aprendemos com o MVP 1

| O que ouvimos | Quem levantou | Decisão para o MVP 2 |
|---|---|---|
| "E se o GPS falhar na hora? E se eu esquecer o celular ou ficar sem bateria?" A precisão do GPS no meio dos blocos da faculdade também preocupava | Alunos e professores | **Plano B:** correção e aprovação manual de presença |
| O aluno nem sempre está olhando o app quando a chamada abre | Alunos | **Aviso de chamada aberta** |
| "Como funciona a parte de privacidade?" | Aluno | **Tela de política de privacidade** explicando o uso do GPS (LGPD) |
| Um aluno pode fazer a chamada de vários colegas trocando de login | Professor | Antifraude entra no roadmap |
| Avisar a turma toda (aula cancelada, atraso, troca de sala) | Professor e aluno | Roadmap |
| Justificar falta pelo app, anexando atestado | Alunos | Roadmap (com aprovação em lote, pedida por professor) |
| "Tem coisa demais aqui": telas pesadas, indicadores que o professor não usaria e gráficos mais úteis para a coordenação | Alunos e professores | **Telas mais enxutas**, com dashboards separados por contexto |
| O professor usa o celular em sala, não o notebook | Professores | Prioridade para mobile |
| Preferem um site a "mais um aplicativo perdido", que possa virar ícone no celular | Aluno | **PWA** |

Destaques:
- "Isso aqui já dá pra usar" (aluno).
- "Isso aqui resolve um problema real" (professor).
- "Parece um app de verdade" (aluna).

### Ciclo 2: o que aprendemos com o MVP 2

As mudanças funcionaram. O aluno que tinha dito "tem coisa demais aqui" no ciclo 1 voltou com "**agora ficou bem mais direto**". O aviso de chamada aberta e a tela de privacidade foram elogiados por quase todos.

A **correção manual** foi a mudança mais valorizada pelos professores:
- "Agora dá pra confiar" no sistema.
- "Agora sim tá pronto pra entrar em uma sala de aula."

O que continuou aparecendo, e virou plano para o MVP 3:

| Aprendizado | Ajuste definido |
|---|---|
| O professor quer registrar **por que** corrigiu uma presença | Campo de motivo obrigatório na correção manual |
| Muitos pedidos de justificativa por semestre | Aprovação em lote, quando a justificativa for implementada |
| O aviso precisa se destacar das outras notificações | Personalizar o aviso (som específico e contador visível) |
| Texto de privacidade longo demais | Versão resumida e visual da política |
| Escolas públicas não têm verba | Avaliar uma modalidade reduzida do plano pago |
| Mais de uma chamada na mesma aula | Considerar múltiplas chamadas por aula |
| O professor corrige presenças ainda em sala, pelo celular | Garantir a correção manual no mobile |

A fraude por troca de login continuou sendo **a preocupação número 1 dos professores**. Um deles resumiu: enquanto ela não for resolvida, o sistema "ainda vai ter o mesmo problema da chamada manual em termos de confiabilidade". Por isso ela é o primeiro item do [roadmap](#roadmap).

### Do aprendizado ao código

| Aprendizado das entrevistas | Situação neste repositório |
|---|---|
| Plano B quando o GPS falha | Implementado: pedido de presença manual pelo aluno e aprovação pelo professor, com a distância registrada |
| Saber o raio antes do check-in | Implementado: o aluno vê "X m de Y m" em tempo real |
| Aviso de chamada aberta | Implementado como aviso dentro do app; a notificação push nativa está no roadmap |
| Site que vira app no celular | Implementado: PWA com manifest e service worker |
| Uso pelo celular | Implementado: layout responsivo com navegação inferior no mobile |
| Chamada com prazo | Implementado: encerramento automático (verificado a cada minuto no backend) |
| Tela de privacidade (LGPD) | Validada no protótipo do MVP 2; ainda não está no código |
| Motivo obrigatório na correção | Roadmap |
| Justificativa de falta e aprovação em lote | Roadmap |
| Avisar ou cancelar aula para a turma | Roadmap |
| Antifraude contra troca de login | Roadmap |

## Modelo de negócio

**Open core:** os professores usam de graça e, quando a instituição vê valor, contrata o plano completo.

| | Present Free | Present Pro |
|---|---|---|
| Preço | Gratuito, código aberto | Por aluno ativo/mês (premissa: R$ 2 a R$ 5) |
| Hospedagem | Auto-hospedagem | Hospedagem completa e suporte |
| Professores | Até 10 por organização | Ilimitados |
| Extras | Comunidade open source | Integração com o sistema da instituição, personalização e módulo de eventos (em breve) |

As entrevistas confirmaram esse modelo:
- todos os alunos concordaram que **quem paga é a instituição**, e vários disseram que não usariam se tivessem de pagar individualmente;
- um professor sugeriu um **período de teste gratuito** antes da contratação;
- um aluno lembrou das **escolas públicas sem verba**, o que levou a avaliar uma modalidade reduzida.

**Mercado:** o Censo da Educação Superior 2024 (INEP/MEC) registra 2.561 instituições de ensino superior e 10 milhões de estudantes. Dessas instituições, 2.244 são privadas, e elas são o foco inicial.

| Ano | Instituições | Alunos ativos | Receita recorrente anual estimada |
|---|---|---|---|
| 1 | 3 | 5 mil | R$ 150 mil |
| 2 | 15 | 30 mil | R$ 1 milhão |
| 3 | 50 | 120 mil | R$ 6 milhões |

**Fomento:** o problema da equipe hoje não é dinheiro, e sim acesso às instituições. A estratégia tem duas frentes:
1. **Aceleração** pelos programas da própria PUCPR (SPiNE e Hotmilk), cuja rede já está conectada a startups que vendem para instituições de ensino.
2. **Recursos não reembolsáveis** (FINEP Centelha, Tecnova e Fundação Araucária), que se encaixam na pesquisa aplicada do produto (validação por GPS e antifraude) e no impacto na educação.

## Uso de IA no desenvolvimento

A equipe usou IA como **ferramenta de apoio**: o código foi escrito pela equipe, e a IA ajudou a ir mais rápido sem tirar das pessoas as decisões de produto e de arquitetura.

| Onde | Ferramentas | Como ajudou |
|---|---|---|
| Protótipos e telas | Ferramentas de prototipação com IA (v0, Lovable, Figma AI) | Transformar o feedback de cada ciclo de entrevistas em telas novas rapidamente. Isso permitiu levar uma versão revisada às mesmas pessoas a tempo do ciclo seguinte |
| Código da aplicação | Claude / Claude Code e ChatGPT / Codex | Dúvidas de implementação, trechos de código e alternativas de solução no frontend (React) e no backend (Express + TypeScript) |
| Revisão e debug | Claude e ChatGPT | Explicar erros, revisar trechos e encontrar bugs |
| Documentação | Claude Code | Este README foi organizado com ajuda do Claude Code, a partir dos relatórios de entrevistas, dos canvas e do pitch da equipe |

**Como a equipe trabalhou com IA:**
- **A equipe decide e escreve; a IA acelera.** A arquitetura (validação no backend, regras de negócio isoladas em services, validação de entrada com Zod) e as prioridades vieram da equipe e das entrevistas.
- **A validação vem dos usuários, não da IA.** A IA ajudou a produzir protótipos mais rápido, mas o que entrava em cada versão era decidido pelo que os alunos e professores disseram nas entrevistas.
- **Tudo passa por revisão humana.** Sugestões da IA eram lidas, testadas e ajustadas antes de entrar no código.

## Arquitetura

### Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router 7, Zustand, React Hook Form, Zod, Recharts, PWA (manifest + service worker) |
| Backend | Node.js, Express 5, TypeScript, Zod, JWT (access + refresh token), bcrypt |
| Banco de dados | MySQL (mysql2) |

### Como a presença é validada

1. Ao abrir a chamada, o navegador do professor obtém a localização precisa, e o backend grava latitude, longitude, raio e prazo (`aberta_ate`).
2. No check-in, o backend calcula a distância entre o aluno e o professor com a **fórmula de Haversine** (distância sobre a superfície da Terra).
3. Se a distância for maior que o raio, o check-in é recusado com a distância exata. O aluno pode então abrir um **pedido manual**, que guarda a localização dele para o professor avaliar.
4. Uma rotina no backend encerra a cada minuto as chamadas cujo prazo terminou.

Toda a validação acontece no **backend**. O frontend só envia a localização e nunca decide sozinho se o aluno está presente.

### Estrutura de pastas

```
present/
├── backend/
│   └── src/
│       ├── config/        # variáveis de ambiente validadas com Zod
│       ├── db/            # conexão MySQL e criação automática do schema
│       ├── middleware/    # autenticação, perfis, validação e erros
│       ├── routes/        # auth, classes (turmas) e sessions (chamadas)
│       ├── services/      # regras de negócio (inclui o cálculo de distância)
│       ├── utils/         # datas, senhas, tokens e perfis
│       └── validators/    # schemas Zod de entrada
├── database/
│   └── present_db.sql     # schema do banco
└── frontend/
    ├── public/            # manifest e service worker (PWA)
    └── src/
        ├── components/    # componentes reutilizáveis (Button, Card, Input...)
        ├── features/      # módulos por domínio (auth, classes, dashboard...)
        ├── layout/        # Header, Sidebar, BottomNav
        ├── pages/         # telas do professor e do aluno
        ├── services/      # chamadas à API
        └── utils/         # geolocalização e utilitários
```

### API

| Grupo | Endpoints principais |
|---|---|
| `/auth` | `register`, `login`, `refresh`, `logout`, `me` |
| `/classes` | Turmas do professor (criar, listar, detalhar), alunos da turma, link de convite, turmas do aluno e `join/:token` |
| `/sessions` | `open`, `close`, `check-in`, `manual-request`, aprovação de pedidos, notificações e histórico por turma |

## Como executar

**Pré-requisitos:** Node.js 20.19+ (exigido pelo Vite 8), MySQL 8 e Git.

```bash
git clone https://github.com/davi-kazuhiro/present.git
cd present
```

**Backend:**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Edite o `backend/.env` com o usuário e a senha do seu MySQL e defina um `JWT_ACCESS_SECRET` longo e aleatório. Na primeira execução, o backend **cria o banco e as tabelas automaticamente**, a partir de `database/present_db.sql`. Ele roda em `http://localhost:8800`.

**Frontend** (em outro terminal):

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Para testar o check-in, abra o app no celular (na mesma rede) ou use a simulação de localização das ferramentas de desenvolvedor do navegador. O navegador só libera o GPS em `localhost` ou em HTTPS.

> Nunca envie o arquivo `.env` real para o Git.

## Roadmap

**Produto**, a partir das entrevistas:
- [ ] Antifraude contra troca de login (prioridade número 1 dos professores)
- [ ] Notificação push nativa, personalizável
- [ ] Tela de privacidade (versão resumida e visual)
- [ ] Motivo obrigatório e histórico das correções manuais
- [ ] Justificativa de falta pelo app, com aprovação em lote
- [ ] Avisar ou cancelar aula para a turma toda
- [ ] Relatório semanal de presença por e-mail
- [ ] Perfil de coordenação, com indicadores institucionais

**Negócio:**
- Q3 2026: piloto em uma turma real da PUCPR
- Q4 2026: lançamento comercial
- 2027: módulo de eventos (palestras e workshops)

**Técnico:**
- [ ] Testes automatizados (backend e frontend)
- [ ] Corrigir os erros restantes do ESLint (regras de hooks nos `useEffect` das telas)

## Equipe

Equipe 11 de Experiência Criativa, Ciência da Computação, PUCPR.

| Nome | Papel |
|---|---|
| Davi Kazuhiro | CTO |
| Eduardo Teodoro | CSO |
| Lucas Pelanda | PO |
| Pedro Favero | Tech Lead |
