# Instrucciones para el Backend - Endpoint de Música para Meditación

## Nuevo Endpoint Requerido

Para soportar la nueva funcionalidad de música de fondo en "Medita Conmigo", necesitas agregar o modificar el endpoint existente en tu backend.

### Opción 1: Usar el endpoint existente `/v1/generate` 

Tu endpoint actual ya debería funcionar con estas modificaciones en `prompts.py`:

```python
# Agregar a PROMPTS en prompts.py
PROMPTS = {
    # ... otros prompts existentes ...
    'meditacion': 'Eres un guía de meditación experto. Crea una guía suave y reconfortante para {tipo_meditacion}. Usa un lenguaje calmado y reconfortante.',
    'Playlist': 'Eres un curador musical especializado en música relajante. Selecciona {cantidad} pistas instrumentales perfectas para meditación y relajación. Responde solo con los nombres de las canciones, una por línea.',
}
```

### Opción 2: Endpoint específico para música (recomendado)

Agrega este nuevo endpoint a tu `main.py`:

```python
@app.post("/meditation/music")
async def get_meditation_music(
    req: GenerateRequest,
    current_user: models.User = Depends(get_current_user)
):
    try:
        # Usar el endpoint de Playlist que ya tienes
        if req.mode == "Playlist":
            tracks = []
            with open("lista.txt", "r", encoding="utf-8") as f:
                for i, line in enumerate(f):
                    if i >= 5: break  # Máximo 5 canciones
                    if line.strip():
                        tracks.append(line.strip())
            return {"tracks": tracks}
        else:
            # Generar recomendaciones con IA
            prompt_text = f"Recomienda 5 canciones instrumentales relajantes para meditación de {req.prompt}. Lista solo los nombres."
            resp = client.chat.completions.create(
                model=MILO_MODEL_ID,
                messages=[{"role": "user", "content": prompt_text}],
                temperature=0.7,
                max_tokens=200
            )
            
            # Parsear la respuesta en una lista
            response_text = resp.choices[0].message.content.strip()
            tracks = [track.strip() for track in response_text.split('\n') if track.strip()]
            
            return {"tracks": tracks[:5]}  # Máximo 5 canciones
            
    except Exception as e:
        # Fallback con canciones predefinidas
        fallback_tracks = [
            "Sonidos del Océano - Meditación Profunda",
            "Bosque Encantado - Música Ambient", 
            "Lluvia Suave - Relajación Total",
            "Campanas Tibetanas - Armonía Interior",
            "Naturaleza Serena - Paz Mental"
        ]
        return {"tracks": fallback_tracks}
```

### Ejemplos de uso desde el Frontend

```javascript
// Para obtener playlist predefinida
const response = await fetch('http://localhost:8011/meditation/music', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ 
    prompt: "", 
    mode: "Playlist" 
  })
});

// Para generar recomendaciones con IA
const response = await fetch('http://localhost:8011/meditation/music', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ 
    prompt: "meditación para el estrés", 
    mode: "text" 
  })
});

const data = await response.json();
console.log(data.tracks); // Array de canciones
```
        # Usar el endpoint de Playlist que ya tienes
        if req.mode == "Playlist":
            tracks = []
            with open("lista.txt", "r", encoding="utf-8") as f:
                for i, line in enumerate(f):
                    if i >= 5: break  # Máximo 5 canciones
                    if line.strip():
                        tracks.append(line.strip())
            return {"tracks": tracks}
        else:
            # Generar recomendaciones con IA
            prompt_text = f"Recomienda 5 canciones instrumentales relajantes para meditación de {req.prompt}. Lista solo los nombres."
            resp = client.chat.completions.create(
                model=MILO_MODEL_ID,
                messages=[{"role": "user", "content": prompt_text}],
                temperature=0.7,
                max_tokens=200
            )
            
            # Parsear la respuesta en una lista
            response_text = resp.choices[0].message.content.strip()
            tracks = [track.strip() for track in response_text.split('\n') if track.strip()]
            
            return {"tracks": tracks[:5]}  # Máximo 5 canciones
            
    except Exception as e:
        # Fallback con canciones predefinidas
        fallback_tracks = [
            "Sonidos del Océano - Meditación Profunda",
            "Bosque Encantado - Música Ambient", 
            "Lluvia Suave - Relajación Total",
            "Campanas Tibetanas - Armonía Interior",
            "Naturaleza Serena - Paz Mental"
        ]
        return {"tracks": fallback_tracks}
```

### Archivo lista.txt (para la opción de Playlist)

Crea un archivo `lista.txt` en la raíz de tu proyecto con canciones relajantes:

```
Ludovico Einaudi - Nuvole Bianche
Max Richter - On The Nature of Daylight
Ólafur Arnalds - Near Light
Nils Frahm - Says
Brian Eno - Music for Airports
Max Richter - Sleep
Kiasmos - Blurred EP
Jon Hopkins - Immunity
Emancipator - Soon It Will Be Cold Enough
Bonobo - Kong
```

## Cómo funciona en el Frontend

1. El usuario selecciona "Con música de fondo" antes de iniciar la meditación
2. Al comenzar la sesión, se hace una llamada al endpoint con `mode: 'Playlist'`
3. La IA selecciona música apropiada o se usan las canciones del archivo `lista.txt`
4. Se muestra el nombre de la canción seleccionada durante la meditación
5. (Opcional) En una implementación completa, se reproduciría audio real

## Configuración CORS

Asegúrate de que tu backend permita las peticiones desde el frontend agregando el puerto 3000 a CORS si no está ya incluido:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend React
        "http://localhost:8011",  # Backend
        # ... otros orígenes
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Notas Importantes

- El frontend está preparado para recibir una lista de canciones en el formato `{"tracks": ["canción1", "canción2", ...]}`
- Si el endpoint falla, el frontend usa canciones predeterminadas
- Esta implementación es conceptual - para audio real necesitarías integrar con servicios como Spotify, YouTube Music, o archivos de audio locales
