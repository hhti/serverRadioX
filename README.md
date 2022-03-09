# atpf-server-ea

O ATPF(Agile Testing Process Framework) é uma ferramenta que tem por objetivo aproximar as duas principais vertentes do teste de software, testes manuais e automatizados,
criando uma cultura colaborativa entre todos os envolvidos.

## Pré-Requisitos

- node >= 16.18.x - [instalação Node](https://nodejs.org/en/download/)
- yarn >= 1.19.x - [instalação Yarn](https://yarnpkg.com/en/docs/install#debian-stable)
- python >= 3.6 - [Instalação Python](https://www.python.org/downloads/)

### 1. Artifactory Softplan

Caso nunca tenha entrado no Artifactory realize o login da seguinte forma:

```bash
npm config set registry https://artifactory.softplan.com.br/artifactory/api/npm/npm/
npm config set always-auth=true
npm login
```

### 2. Baixar dependências e iniciar o projeto localmente

```bash
yarn install
```

```bash
yarn dev
```
