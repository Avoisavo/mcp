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
      message: 'Hello! I see you want to access your MetaMask wallet. What would you like to do?',
      options: [
        { id: 'check-balance', text: 'Check my balance' },
        { id: 'send-transaction', text: 'Send a transaction' },
        { id: 'swap-tokens', text: 'Swap tokens' }
      ]
    },
    'check-balance': {
      message: 'Which balance would you like to check?',
      options: [
        { id: 'eth-balance', text: 'ETH Balance' },
        { id: 'token-balance', text: 'Token Balances' },
        { id: 'all-balances', text: 'All Balances' }
      ]
    },
    'eth-balance': {
      message: 'Your current ETH balance is 1.45 ETH. What would you like to do next?',
      options: [
        { id: 'send-eth', text: 'Send ETH' },
        { id: 'check-token-balance', text: 'Check token balances' },
        { id: 'done', text: 'That\'s all for now' }
      ]
    },
    'token-balance': {
      message: 'Which token balance would you like to check?',
      options: [
        { id: 'usdt-balance', text: 'USDT' },
        { id: 'uni-balance', text: 'UNI' },
        { id: 'link-balance', text: 'LINK' }
      ]
    },
    'all-balances': {
      message: 'Here are all your balances:\n- ETH: 1.45\n- USDT: 250.00\n- UNI: 15.75\n- LINK: 25.30\nWhat would you like to do next?',
      options: [
        { id: 'send-transaction', text: 'Send a transaction' },
        { id: 'swap-tokens', text: 'Swap tokens' },
        { id: 'done', text: 'That\'s all for now' }
      ]
    },
    'send-transaction': {
      message: 'What type of transaction would you like to send?',
      options: [
        { id: 'send-eth', text: 'Send ETH' },
        { id: 'send-token', text: 'Send Token' },
        { id: 'back', text: 'Go back' }
      ]
    },
    'send-eth': {
      message: 'How much ETH would you like to send?',
      options: [
        { id: 'send-0.1', text: '0.1 ETH' },
        { id: 'send-0.5', text: '0.5 ETH' },
        { id: 'send-1.0', text: '1.0 ETH' },
        { id: 'custom-amount', text: 'Custom amount' }
      ]
    },
    'send-token': {
      message: 'Which token would you like to send?',
      options: [
        { id: 'send-usdt', text: 'USDT' },
        { id: 'send-uni', text: 'UNI' },
        { id: 'send-link', text: 'LINK' },
        { id: 'back', text: 'Go back' }
      ]
    },
    'swap-tokens': {
      message: 'Which tokens would you like to swap?',
      options: [
        { id: 'eth-to-usdt', text: 'ETH → USDT' },
        { id: 'eth-to-uni', text: 'ETH → UNI' },
        { id: 'usdt-to-eth', text: 'USDT → ETH' },
        { id: 'back', text: 'Go back' }
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
    // Start with initial message
    const initialStage = conversationFlow.initial;
    setMessages([{ sender: 'AI', text: initialStage.message }]);
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
    
    // Increment action count for meaningful actions (exclude navigation like 'back')
    if (optionId !== 'back' && optionId !== 'close') {
      const newActionCount = actionCount + 1;
      setActionCount(newActionCount);
      
      // After 3 actions, show the exit message
      if (newActionCount >= 3) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            sender: 'AI', 
            text: 'You\'ve completed 3 actions. Would you like to continue or exit?' 
          }]);
          setCurrentOptions([
            { id: 'continue', text: 'Continue using assistant' },
            { id: 'exit', text: 'Done, please quit' }
          ]);
          setConversationStage('action-limit');
          return;
        }, 600);
        return;
      }
    }
    
    // Get next conversation stage
    const nextStage = conversationFlow[optionId];
    
    // Special case for 'continue' option after 3 actions
    if (optionId === 'continue') {
      const previousStage = conversationFlow[conversationStage];
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'AI', text: 'What would you like to do next?' }]);
        setCurrentOptions(conversationFlow.initial.options);
        setConversationStage('initial');
      }, 600);
      return;
    }
    
    // Add AI response after a delay
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
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.sender === 'AI' ? styles.aiMessage : styles.userMessage}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.senderName}>{msg.sender === 'AI' ? 'MetaMask AI' : 'You'}</div>
                  <p>{msg.text}</p>
                  <div className={styles.messageCorner}></div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.loadingMessages}>
              <div className={styles.loadingDot}></div>
              <div className={styles.loadingDot}></div>
              <div className={styles.loadingDot}></div>
            </div>
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