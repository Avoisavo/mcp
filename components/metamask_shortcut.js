import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MetamaskShortcut.module.css';

export default function MetamaskShortcut({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [conversationStage, setConversationStage] = useState('initial');
  const [actionCount, setActionCount] = useState(0);
  const chatContainerRef = useRef(null);
  
  // Define conversation flow
  const conversationFlow = {
    initial: {
      message: '',  // Removed the initial greeting
      options: [
        { id: 'check-balance', text: 'Check my transaction' },
        { id: 'send-transaction', text: 'Send a transaction' },
        { id: 'swap-tokens', text: 'Swap tokens' }
      ]
    },
    'done': {
      message: 'Thank you for using MetaMask Assistant. Is there anything else I can help you with?',
      options: [
        { id: 'initial', text: 'Yes, I have another question' },
        { id: 'close', text: 'No, close the assistant' }
      ]
    },
    'exit': {
      message: 'Done! Thank you for using MetaMask Assistant.',
      options: [
        { id: 'close', text: 'Close' }
      ]
    }
  };

  // Initialize conversation
  useEffect(() => {
    // Start with initial options only, no message
    const initialStage = conversationFlow.initial;
    setCurrentOptions(initialStage.options);
    setConversationStage('initial');
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentOptions]);

  const handleOptionSelect = (optionId) => {
    // Add user selection to messages
    const selectedOption = currentOptions.find(option => option.id === optionId);
    setMessages(prev => [...prev, { sender: 'User', text: selectedOption.text }]);
    
    // Handle special cases
    if (optionId === 'close' || optionId === 'exit') {
      // Show a closing message
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'AI', 
          text: 'Thank you for using MetaMask Assistant. Closing now...' 
        }]);
        
        // Close the component after a short delay
        setTimeout(() => onClose(), 1000);
      }, 600);
      return;
    }
    
    // If we're in the initial stage or any other stage except 'done' or 'exit',
    // go straight to 'done' after selecting an option
    if (conversationStage === 'initial' || 
        (conversationStage !== 'done' && conversationStage !== 'exit' && conversationStage !== 'action-limit')) {
      setTimeout(() => {
        // Get the 'done' stage
        const doneStage = conversationFlow['done'];
        setMessages(prev => [...prev, { sender: 'AI', text: doneStage.message }]);
        setCurrentOptions(doneStage.options);
        setConversationStage('done');
      }, 600);
      return;
    }
    
    // Special case for 'continue' option after 3 actions
    if (optionId === 'continue') {
      setTimeout(() => {
        setCurrentOptions(conversationFlow.initial.options);
        setConversationStage('initial');
      }, 600);
      return;
    }
    
    // For any other option, proceed to the next stage as before
    const nextStage = conversationFlow[optionId];
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'AI', text: nextStage.message }]);
      setCurrentOptions(nextStage.options);
      setConversationStage(optionId);
    }, 600);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/icon/metamask.png" alt="MetaMask" className={styles.logo} />
            <div className={styles.logoGlow}></div>
          </div>
          <h2>MetaMask Assistant</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.chatContainer} ref={chatContainerRef}>
          <div className={styles.lowPolyBackground}></div>
          {messages && messages.length > 0 && (
            messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.sender === 'AI' ? styles.aiMessage : styles.userMessage}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.senderName}>{msg.sender === 'AI' ? 'MetaMask AI' : 'You'}</div>
                  <p>{msg.text}</p>
                  <div className={styles.messageCorner}></div>
                </div>
              </div>
            ))
          )}
          
          {currentOptions && currentOptions.length > 0 && (
            <div className={styles.optionsContainer}>
              {currentOptions.map(option => (
                <button 
                  key={option.id} 
                  className={`${styles.optionButton} ${option.id === 'exit' ? styles.exitButton : ''}`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 