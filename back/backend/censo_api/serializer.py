from rest_framework import serializers
from censo_api.models import Pessoa, Residencia


class ResidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residencia
        fields = ("cidade", "bairro", "estado", "cep", "numero", "id")


class PessoaSerializer(serializers.ModelSerializer):
    # residencia = ResidenciaSerializer(
    #     read_only=False,
    # )

    # class Meta:
    #     model = Pessoa
    #     fields = ("nome", "cpf", "idade", "escolaridade", "residencia")
        
    # my_field = ResidenciaSerializer(
    #     read_only=True
    # )

    cidade = serializers.CharField(source='residencia.cidade', read_only=True)
    estado = serializers.CharField(source='residencia.estado', read_only=True)
    bairro = serializers.CharField(source='residencia.bairro', read_only=True)

    class Meta:
        model = Pessoa
        fields = ("nome", "cpf", "idade", "escolaridade","residencia", "cidade", "estado", "bairro")
