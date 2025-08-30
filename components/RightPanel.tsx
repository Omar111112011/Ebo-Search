
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageSender, Source } from '../types';
import { SendIcon, LinkIcon, ThinkingIcon, UserIcon, BotIcon } from './icons';

interface RightPanelProps {
    messages: ChatMessage[];
    onSendMessage: (prompt: string) => void;
    isLoading: boolean;
    onSourceClick: (url: string) => void;
}

const Message: React.FC<{ message: ChatMessage; onSourceClick: (url: string) => void }> = ({ message, onSourceClick }) => {
    const isUser = message.sender === MessageSender.USER;

    if (message.isThinking) {
        return (
            <div className="flex items-start gap-3">
                <BotIcon />
                <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 rounded-xl p-3">
                    <ThinkingIcon />
                    <span className="text-gray-600 dark:text-gray-300 animate-pulse">Thinking...</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {isUser ? <UserIcon /> : <BotIcon />}
            <div className={`flex flex-col max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-xl ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 w-full">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sources:</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {message.sources.map((source, index) => (
                                <button key={index} onClick={() => onSourceClick(source.uri)} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left">
                                    <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-xs text-blue-500 dark:text-blue-400 truncate">{source.title || new URL(source.uri).hostname}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const RightPanel: React.FC<RightPanelProps> = ({ messages, onSendMessage, isLoading, onSourceClick }) => {
    const [prompt, setPrompt] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSendMessage(prompt);
            setPrompt('');
        }
    };

    return (
        <aside className="w-[480px] flex-shrink-0 border-l border-gray-200 dark:border-gray-800 flex flex-col h-screen bg-gray-50 dark:bg-gray-900/50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">AI Assistant</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                       <Message key={index} message={msg} onSourceClick={onSourceClick} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Send a message..."
                        rows={1}
                        className="w-full p-3 pr-12 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !prompt.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </aside>
    );
};
