import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import API_CONFIG from '../config/api';

function DiarioVivo() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const saveEntry = async () => {
    if (!newEntry.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          prompt: `Reflexiona sobre esta entrada de diario: "${newEntry}". Proporciona una perspectiva reflexiva y alentadora.`,
          mode: 'diario_vivo'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const entry = {
          text: newEntry,
          reflection: data.text,
          timestamp: new Date(),
          id: Date.now()
        };
        setEntries(prev => [entry, ...prev]);
        setNewEntry('');
      } else {
        throw new Error('Error al guardar la entrada');
      }
    } catch (err) {
      setError('No se pudo guardar la entrada');
      // Save locally as fallback
      const entry = {
        text: newEntry,
        reflection: 'Tu reflexión es valiosa. Cada palabra escrita es un paso hacia el autoconocimiento.',
        timestamp: new Date(),
        id: Date.now()
      };
      setEntries(prev => [entry, ...prev]);
      setNewEntry('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid>
      <div className="text-center mb-4">
        <h1 className="text-success">📖 Diario Vivo</h1>
        <p className="text-muted">Registra tus pensamientos y reflexiones diarias</p>
      </div>

      {error && <Alert variant="warning" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <h5>Nueva entrada</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => { e.preventDefault(); saveEntry(); }}>
            <Form.Control
              as="textarea"
              rows={4}
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="¿Qué está pasando en tu mente y corazón hoy?"
              disabled={isLoading}
            />
            <div className="d-flex justify-content-end mt-3">
              <Button 
                variant="success" 
                type="submit" 
                disabled={isLoading || !newEntry.trim()}
              >
                {isLoading ? 'Guardando...' : 'Guardar Entrada'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>Entradas anteriores</h5>
        </Card.Header>
        <Card.Body>
          {entries.length === 0 ? (
            <div className="text-center text-muted">
              <p>Aún no tienes entradas. ¡Comienza escribiendo tu primera reflexión!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {entries.map(entry => (
                <ListGroup.Item key={entry.id} className="border-0 mb-3">
                  <div className="mb-2">
                    <strong>📝 Tu reflexión:</strong>
                    <p className="mt-1">{entry.text}</p>
                  </div>
                  <div className="mb-2 bg-light p-3 rounded">
                    <strong>🤔 Perspectiva:</strong>
                    <p className="mt-1 mb-0">{entry.reflection}</p>
                  </div>
                  <small className="text-muted">
                    {entry.timestamp.toLocaleDateString()} - {entry.timestamp.toLocaleTimeString()}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DiarioVivo;