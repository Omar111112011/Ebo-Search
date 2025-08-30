
import React, { useState, useCallback } from 'react';
import { MainContent } from './components/MainContent';
import { RightPanel } from './components/RightPanel';
import { EboSearchService } from './services/geminiService';
import { ChatMessage, MessageSender, Source } from './types';
import { INITIAL_MESSAGES } from './constants';

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [currentUrl, setCurrentUrl] = useState<string | null>('about:blank');
    const [isLoading, setIsLoading] = useState(false);
    const [service] = useState(() => new EboSearchService());

    const handleSendMessage = useCallback(async (prompt: string) => {
        if (!prompt || isLoading) return;

        setIsLoading(true);
        const userMessage: ChatMessage = { sender: MessageSender.USER, text: prompt };
        const thinkingMessage: ChatMessage = { sender: MessageSender.AI, text: 'Thinking...', isThinking: true };

        setMessages(prev => [...prev, userMessage, thinkingMessage]);

        try {
            const result = await service.runQuery(prompt);
            const aiMessage: ChatMessage = { sender: MessageSender.AI, text: result.text, sources: result.sources };
            
            setMessages(prev => [...prev.slice(0, -1), aiMessage]);
            if (result.sources && result.sources.length > 0) {
                setCurrentUrl(result.sources[0].uri);
            }
        } catch (error) {
            console.error("Error querying Gemini:", error);
            const errorMessage: ChatMessage = { sender: MessageSender.AI, text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, service]);

    const handleSourceClick = (url: string) => {
        setCurrentUrl(url);
    };
    
    const handleInitialPrompt = (prompt: string) => {
        handleSendMessage(prompt);
    }

    return (
        <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-black">
            <MainContent 
                url={currentUrl} 
                onSearch={handleSendMessage} 
                isLoading={isLoading} 
                onUrlChange={setCurrentUrl}
                showWelcome={messages.length <= INITIAL_MESSAGES.length}
                onInitialPrompt={handleInitialPrompt}
            />
            <RightPanel 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                onSourceClick={handleSourceClick}
            />
        </div>
    );
};

export default App;
