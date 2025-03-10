# Zig - Viva o Local

Zig é uma plataforma que conecta viajantes com moradores locais, oferecendo uma nova forma de vivenciar os destinos de forma autêntica e personalizada. Ao invés de seguir roteiros turísticos tradicionais, a Zig permite que os usuários vivenciem experiências exclusivas, criadas e oferecidas por moradores apaixonados por sua cidade.

Este repositório contém o MVP (Minimum Viable Product) do app Zig, que conecta turistas a moradores locais.

## 🚀 Visão Geral

O Zig propõe uma nova forma de turismo, focada em experiências autênticas e pessoais, guiadas por quem realmente conhece o local. A plataforma funciona como um catálogo onde qualquer morador pode oferecer suas experiências, e turistas podem explorar e participar dessas vivências de maneira personalizada e única.

### Funcionalidades Principais:
- **Conectar turistas com moradores**: A plataforma permite que os moradores da cidade criem e compartilhem experiências locais autênticas e personalizadas para os turistas.
- **Catálogo de experiências**: O Zig funciona como um catálogo onde os turistas podem encontrar experiências variadas, organizadas por tipo de atividade, local e interesses, e participar delas.
- **Avaliações e feedback**: Sistema de avaliações que garante qualidade e segurança das experiências oferecidas.
- **Busca personalizada**: Filtros de pesquisa para que os turistas encontrem experiências de acordo com sua localização e preferências pessoais.

## 🛠 Tecnologias Utilizadas

- **Frontend**: React Native
- **Backend**: Node.js (Express)
- **Banco de Dados**: MongoDB (ou outra solução escalável)
- **Autenticação**: JWT (JSON Web Token)
- **Geolocalização**: APIs de geolocalização para sugerir experiências baseadas na localização do usuário

## ⚡ Iniciando o Projeto

Para rodar o projeto localmente, siga os passos abaixo.

### 1. Clone este repositório

```bash
git clone https://github.com/ajlraujo/zig-app
```
### 2. Instale as dependências\

```bash
cd zig-app
npm install
```
### 3. Configuração do Ambiente

```bash
JWT_SECRET=
```
### 4. Rode o servidor
```bash
npm run dev
```
### 5. Inicie o App

```bash
npm start
```
## 💡 Funcionalidades do MVP

O MVP incluirá as seguintes funcionalidades:

- **Cadastro de Usuários**: Moradores e turistas podem criar suas contas.
- **Cadastro de Experiências**: Moradores podem adicionar suas experiências, como roteiros, tours e atividades exclusivas, sem custos para os turistas.
- **Catálogo de Experiências**: Turistas podem procurar e se inscrever nas experiências criadas pelos moradores.

## 📅 Roadmap

- **Fase 1**: MVP com funcionalidades de cadastro e participação em experiências gratuitas.
- **Fase 2**: Integração de geolocalização para sugestões automáticas de experiências.
- **Fase 3**: Expansão para incluir novas categorias de experiências locais.

## 🧑‍💻 Como Contribuir

1. Faça o fork do repositório.
2. Crie uma nova branch para a sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

