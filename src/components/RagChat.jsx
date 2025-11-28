// src/components/RagChat.jsx
import { useState } from "react";
import { Container, Form, Button, Card, Spinner, Alert } from "react-bootstrap";

function RagChat() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          history: history
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setAnswer(data.answer);
        setSources(data.sources || []);
        setHistory(data.history || []);
      }
    } catch (err) {
      setError("Could not connect to backend.");
    }

    setLoading(false);
  };

  return (
    <Container className="my-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">RAG System — Ask a Question</h2>

      <Form onSubmit={sendMessage}>
        <Form.Group className="mb-3">
          <Form.Label>Your Question</Form.Label>
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            required
          />
        </Form.Group>

        <Button
          type="submit"
          className="black-btn"
          variant=""
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Ask"}
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {answer && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title className="answer-title">Answer</Card.Title>
            <Card.Text className="answer-text">{answer}</Card.Text>

            {sources.length > 0 && (
              <div className="mt-3">
                <strong>Sources:</strong>
                <ul>
                  {sources.map((src, idx) => (
                    <li key={idx}>{src.filename || JSON.stringify(src)}</li>
                  ))}
                </ul>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-3">
                <strong>Chat History:</strong>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(history, null, 2)}
                </pre>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default RagChat;
