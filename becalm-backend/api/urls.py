from django.urls import path
from .views import DiarioVivoView, MensajeAlmaView, PromptView

urlpatterns = [
    path('diario/', DiarioVivoView.as_view()),
    path('mensajes-alma/', MensajeAlmaView.as_view()),
    path('prompt/<str:section>/', PromptView.as_view()),
]
