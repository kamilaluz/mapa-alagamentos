# Mapa de Alagamentos - Protótipo

Sistema colaborativo para monitoramento de alagamentos na cidade. Permite:

- Visualizar mapa com status de bairros (normal, alagado leve, médio, severo, bloqueado)  
- Registrar ocorrências de alagamentos  
- Consultar histórico de ocorrências  
- Calcular rotas seguras considerando áreas alagadas  

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- Navegador moderno (Chrome, Firefox, Edge, etc.)

---

## Estrutura do projeto
```text

mapa-alagamentos/
│
├─ data/                  # Arquivos JSON para armazenamento
│   ├─ ocorrencias.json
│   └─ statusBairros.json
│
├─ public/                # Arquivos do frontend
│   ├─ index.html
│   ├─ style.css
│   └─ script.js
│
├─ server.js              # Backend em Node.js
├─ package.json           # Dependências e scripts
└─ README.md              # Instruções do projeto
```

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/mapa-alagamentos.git
cd mapa-alagamentos
```

2. Instale as dependências:
```
npm install
```

O projeto utiliza apenas Express como dependência principal.

## Como rodar

Inicie o servidor:
```
node server.js
```

Abra o navegador e acesse:
```
http://localhost:3000
```

O sistema estará disponível para:

- Visualizar o mapa de alagamentos

- Registrar ocorrências

- Consultar histórico

- Calcular rotas seguras

