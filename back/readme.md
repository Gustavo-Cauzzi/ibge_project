# Rodar o projeto

1. Configurar o ambiente

- [Python 3](https://www.python.org/downloads/)
- (Windows) ExecutionPolicy setado para `RemoteSigned` (para a `venv`)

  Para checar isso basta rodar um Windows PowerShell **como admin** e rodar o seguinte comando:

  ```shell
  Get-ExecutionPolicy
  ```

  Caso o output mostrar `Restricted`, deve-se rodar o seguinte comando:

  ```shell
  Set-ExecutionPolicy RemoteSigned
  ```

  Se rodar de novo o primeiro comando, deve-se ter sido setado para o valor correto agora.

  PS: Precisa executar um script mais a frente, e precisa dar a permissão de execução (ao menos precisou no meu vscode). [Mais informações aqui](https://pt.stackoverflow.com/questions/220078/o-que-significa-o-erro-execu%C3%A7%C3%A3o-de-scripts-foi-desabilitada-neste-sistema).

2. Criar uma Venv

   Venv é uma pasta onde todas as bibliotecas necessárias ficam dentro dessa pasta nesse projeto, onde sem ela todas as libs ficam globais no seu computador ocupando espaço desnecessário.

   Com um terminal aberto na pasta do projeto, garantir que estamos na pasta do backend.

   ```shell
   PS C:\caminho\para\o\projeto> cd .\back\
   PS C:\caminho\para\o\projeto\back> |
   ```

   Após isso, basta criar a pasta ./venv através desse comando

   ```
   python -m venv venv
   ```

3. Ativar a venv

   ```
   # Windows
   .\venv\scripts\activate
   # Linux
   ./venv/bin/activate
   ```

   Se estiver correto, deverá aparecer um `(venv)` no caminho do terminal.

   ```shell
   (venv) PS C:\caminho\para\o\projeto\back>
   ```

4. Instalar as dependências

   Rodar:

   ```
   pip install -r requirements.txt
   ```

5. Rodar a aplicação
   ```shell
   py .\app\manage.py runserver
   ```

# Rotas

Se acessarmos `http://loaclhost:8000 ` temos uma interface para melhor visualização dos dados.

```
http://loaclhost:8000/pessoas
http://loaclhost:8000/residencias
```

# Notas do desenvolvimento (Yago)

Não foi criado nenhum filtro para os registros de residências.
Filtros sobre cidades, bairros e estados foram aplicados diretamente para as pessoas

Exemplo de url para acessar pessoas com filtros:

http://localhost:8000/pessoas/?escolaridade=7&residencia**cidade=Caxias+do+Sul&residencia**bairro=Santa+Catarina&residencia\_\_estado=Rio+Grande+do+Sul

Filtros:

- escolaridade

- cidade

- estado

- bairro

A url de exemplo já mostra como são passados os argumentos para os parâmetros, todos que tem
haver com a residencia (cidade, estado e bairro), seguem o padrõa: residencia\_\_(nome do campo)
