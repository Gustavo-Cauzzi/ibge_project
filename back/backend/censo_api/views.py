from rest_framework import viewsets
from rest_framework.response import Response
from censo_api.models import Pessoa, Residencia
from censo_api.serializer import PessoaSerializer, ResidenciaSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

class PessoaViewSet(viewsets.ModelViewSet):
    queryset = Pessoa.objects.all()
    serializer_class = PessoaSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['escolaridade', 'residencia__cidade', 'residencia__bairro', 'residencia__estado']
    search_fields = ['nome']


class ResidenciaViewSet(viewsets.ModelViewSet):
    queryset = Residencia.objects.all()
    serializer_class = ResidenciaSerializer