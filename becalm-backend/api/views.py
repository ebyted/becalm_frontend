from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DiarioVivo, MensajeAlma
from .serializers import DiarioVivoSerializer, MensajeAlmaSerializer
from prompts import get_prompt
import openai
import os

class DiarioVivoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        diarios = DiarioVivo.objects.filter(user=request.user)
        serializer = DiarioVivoSerializer(diarios, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = DiarioVivoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class MensajeAlmaView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        mensajes = MensajeAlma.objects.filter(user=request.user)
        serializer = MensajeAlmaSerializer(mensajes, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = MensajeAlmaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class PromptView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, section):
        user_data = request.data
        prompt = get_prompt(section, user_data)
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return Response({"result": response.choices[0].message["content"]})
