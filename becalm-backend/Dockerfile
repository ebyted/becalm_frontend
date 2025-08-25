# Dockerfile para backend Django REST
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV DJANGO_SETTINGS_MODULE=becalm_backend.settings
CMD ["gunicorn", "becalm_backend.wsgi:application", "--bind", "0.0.0.0:8034"]
