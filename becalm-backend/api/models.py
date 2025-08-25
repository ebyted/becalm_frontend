from django.db import models
from django.contrib.auth.models import User

class DiarioVivo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    entrada = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

class MensajeAlma(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

# Puedes agregar más modelos según las secciones
