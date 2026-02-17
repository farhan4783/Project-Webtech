import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { chatAPI } from '../utils/api';
import './dashboard.css';

export default function AgentChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Load conversation history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      if (response.success && response.data) {
        // Convert history to message format
        const historyMessages = response.data.flatMap(conv => [
          { type: 'user', content: conv.message, timestamp: conv.timestamp },
          {
            type: 'agent',
            content: conv.response,
            agentType: conv.agentType,
            timestamp: conv.timestamp
          }
        ]);
        setMessages(historyMessages.slice(0, 20)); // Show last 10 conversations (20 messages)
      }
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage);

      if (response.success && response.data.responses) {
        // Add agent responses to UI
        response.data.responses.forEach(agentResponse => {
          setMessages(prev => [...prev, {
            type: 'agent',
            content: agentResponse.response || agentResponse.analysis,
            agentType: agentResponse.agent,
            agentName: agentResponse.agentName,
            agentRole: agentResponse.agentRole,
            agentIcon: agentResponse.agentIcon,
            timestamp: new Date()
          }]);
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAgentInfo = (agentType) => {
    const agents = {
      wolf: { name: 'The Wolf', role: 'Investment Analyst', icon: '🐺', color: 'positive' },
      sage: { name: 'The Sage', role: 'Financial Coach', icon: '🧘', color: 'warning' },
      sniper: { name: 'The Sniper', role: 'Coordinator', icon: '🎯', color: 'neutral' }
    };
    return agents[agentType] || agents.sage;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Agent Chat" />
        <div className="chat-content">
          <div className="chat-container">
            {messages.length === 0 && !loading && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                <h3 style={{ marginBottom: '10px' }}>Welcome to FinSync AI</h3>
                <p>Ask about investments, budgeting, or financial decisions</p>
                <p style={{ fontSize: '14px', marginTop: '20px' }}>
                  Try: "Should I buy Tesla stock?" or "I want to buy a new laptop"
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}-message`}>
                {msg.type === 'user' ? (
                  <>
                    <div className="message-avatar user-avatar">👤</div>
                    <div className="message-bubble user-bubble">
                      {msg.content}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="message-avatar agent-avatar">
                      <span className="agent-icon">
                        {msg.agentIcon || getAgentInfo(msg.agentType).icon}
                      </span>
                    </div>
                    <div className="message-info">
                      <div className="agent-name">
                        {msg.agentName || getAgentInfo(msg.agentType).name}
                      </div>
                      <div className="agent-role">
                        {msg.agentRole || getAgentInfo(msg.agentType).role}
                      </div>
                    </div>
                    <div className={`message-bubble agent-bubble ${getAgentInfo(msg.agentType).color}`}>
                      {msg.content}
                    </div>
                  </>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-message agent-message">
                <div className="message-avatar agent-avatar">
                  <span className="agent-icon">🎯</span>
                </div>
                <div className="message-info">
                  <div className="agent-name">Analyzing...</div>
                  <div className="agent-role">Processing your request</div>
                </div>
                <div className="message-bubble agent-bubble neutral">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px',
                margin: '10px 0',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about investments, budgeting, or financial decisions..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="chat-input-button"
              disabled={loading || !inputMessage.trim()}
              style={{
                opacity: (loading || !inputMessage.trim()) ? 0.5 : 1,
                cursor: (loading || !inputMessage.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              ✨
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
