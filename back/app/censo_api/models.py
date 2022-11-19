from django.db import models


ESCOLARIDADE = [
    (1, "Analfabeto"),
    (2,"Ensino básico"),
    (3, "Fundamental incompleto"),
    (4, "Fundamental completo"),
    (5, "Ensino médio incompleto"),
    (6, "Ensino médio completo"),
    (7, "Ensino superior incompleto"),
    (8, "Ensino superior completo"),
    (9, "Mestrado/Doutorado")
]


class Residencia(models.Model):

    class Meta:
        unique_together = ("cep", "numero_residencia")
        verbose_name = "Cadastro de residência"
    
    cidade = models.CharField(max_length=40, verbose_name="Cidade")

    bairro = models.CharField(max_length=40, verbose_name="Bairro")

    estado = models.CharField(max_length=40, verbose_name="Estado")

    cep = models.CharField(max_length=8, verbose_name="CEP")

    numero_residencia = models.IntegerField(verbose_name="Número da residência")

    def __str__(self):
        return "Nº residência " + str(self.numero_residencia) + f" - Bairro {self.bairro} - {self.cidade}"


class Pessoa(models.Model):

    nome = models.CharField(max_length=30, verbose_name="Nome")

    cpf = models.CharField(max_length=11, primary_key=True, verbose_name="CPF")

    idade = models.IntegerField(verbose_name="Idade")

    escolaridade = models.IntegerField(choices=ESCOLARIDADE, verbose_name="Escolaridade")

    residencia = models.ForeignKey(Residencia, on_delete=models.CASCADE, verbose_name="Residência")


    def __str__(self):
        return self.nome