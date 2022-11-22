import requests
# pip install requests

url = 'http://localhost:8000'
residencias = [
    {
        "cidade": "Caxias do Sul",
        "bairro": "Santa Catarina",
        "estado": "Rio Grande do Sul",
        "cep": "95032480",
        "numero": 101,
    },
    {
        "cidade": "Caxias do Sul",
        "bairro": "Santa Catarina",
        "estado": "Rio Grande do Sul",
        "cep": "95032480",
        "numero": 102,
    },
]

pessoas = [
    #mesmo
]

for residencia in residencias:
    x = requests.post(url + '/residencias/', json = residencia)

    print(x.text)


for pessoa in pessoas:
    x = requests.post(url + '/pessoa/', json = pessoa)

    print(x.text)