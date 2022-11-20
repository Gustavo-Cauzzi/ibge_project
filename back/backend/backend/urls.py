from django.contrib import admin
from django.urls import path, include
from censo_api.views import PessoaViewSet, ResidenciaViewSet
from rest_framework import routers


router = routers.DefaultRouter()

router.register(r"pessoas", PessoaViewSet)
router.register(r"residencias", ResidenciaViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls))
]
