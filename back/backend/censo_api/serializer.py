from rest_framework import serializers
from censo_api.models import Pessoa, Residencia


class ResidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residencia
        fields = ("cidade", "bairro", "estado", "cep", "numero", "id")


class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = ("nome", "cpf", "idade", "escolaridade", "residencia")
