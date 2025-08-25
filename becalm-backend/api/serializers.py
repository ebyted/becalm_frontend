from rest_framework import serializers
from .models import DiarioVivo, MensajeAlma

class DiarioVivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiarioVivo
        fields = '__all__'

class MensajeAlmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MensajeAlma
        fields = '__all__'
