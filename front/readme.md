# Sumário

-   Ambiente de desenvolvimento
    -   [NodeJS](#nodejs)
    -   [Yarn](#yarn)
-   [Rodar o projeto](#rodar-o-projeto)

# NodeJS

> **Atenção:** É recomendável sempre instalar a versão LTS para evitar problemas pois ela é a versão estável que já foi testada!

Para instalar, basta clicar no botão de download no site oficial do [NodeJS](https://nodejs.org/en/download/).

Para verificar se instalou com sucesso, rodar o comando:

```
node -v
```

# Yarn

Yarn é um gerenciador de pacotes.

Para instalar o Yarn, é mais prático de forma global com o seguinte comando para que seja usado ele ao invés do `npm`:

```
npm install --global yarn
```

Dessa forma podemos adicionar bibliotecas usando:

```
yarn add nome_da_biblioteca
```

Yarn é mais rápido e prático do que o `npm`

# VSCode

<h2 id="instalacao-vscode">Instalação:</h2>

Baixar e instalar o VSCode a partir [deste link](https://code.visualstudio.com/).

## Extensões necessárias

-   **Tailwind CSS IntelliSense** - Ferramenta de auto complete para classes do Tailwind CSS
-   **EditorConfig for VS Code** - Suporte para o Editor Config utilizado no projeto
-   **ESLint** - Apontar melhorias no código
-   **Prettier - Code formatter** - Aplica embelzamentos ao código para legibilidade

## Extensões recomendadas (famosos "frufrus" opcionais)

-   **Material Icon Theme** - Pacote de icones para a árvore de arquivos do VSCode
-   **React Hooks Snippets** - Adiciona Snippets para hooks no React
-   **Color Hightlight** - Adiciona ferramentas para utilização de cores na hora de programar

# Rodar o projeto

Primeiro, é necessário instalar as dependências. Para isso devemos abrir um terminal na pasta do projeto do frontend:

```
PS C:\caminho\para\o\projeto> cd .\front\
PS C:\caminho\para\o\projeto\front>
```

Para instalar as dependências, rodar o seguinte comando:

```
yarn
```

Para o **Frontend**, podemos executar o seguinte comando na pasta do projeto pelo terminal:

```
yarn dev
```
