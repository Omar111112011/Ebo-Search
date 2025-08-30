
import React, { useState } from 'react';
import { SearchIcon, SparkleIcon } from './icons';
import { DEEP_ACTION_PROMPTS } from '../constants';

interface MainContentProps {
    url: string | null;
    onSearch: (prompt: string) => void;
    isLoading: boolean;
    onUrlChange: (url: string) => void;
    showWelcome: boolean;
    onInitialPrompt: (prompt: string) => void;
}

const EboLogo: React.FC = () => (
    <h1 className="text-6xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Ebo
        </span>
        <span className="dark:text-white text-black"> Search</span>
    </h1>
);

export const MainContent: React.FC<MainContentProps> = ({ url, onSearch, isLoading, onUrlChange, showWelcome, onInitialPrompt }) => {
    const [prompt, setPrompt] = useState('');
    const [currentAddress, setCurrentAddress] = useState(url || '');

    React.useEffect(() => {
        setCurrentAddress(url || '');
    }, [url]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSearch(prompt);
            setPrompt('');
        }
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentAddress.trim()) {
            onUrlChange(currentAddress);
        }
    };

    const WelcomeScreen: React.FC = () => (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-4">
            <EboLogo />
            <form onSubmit={handleSearchSubmit} className="w-full mt-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type '?' for commands and '@' for context"
                        className="w-full p-4 pl-12 pr-4 text-md bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </form>
            <div className="mt-8 text-left w-full">
                <div className="flex items-center gap-2 mb-4">
                    <SparkleIcon className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-lg">Try deep action</h3>
                </div>
                <div className="space-y-3">
                    {DEEP_ACTION_PROMPTS.map((p, index) => (
                        <button 
                            key={index} 
                            onClick={() => onInitialPrompt(p.prompt)}
                            className="text-left w-full p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <p className="font-medium text-gray-800 dark:text-gray-200">{p.title}</p>
                            {p.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{p.subtitle}</p>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
    
    return (
        <main className="flex-1 flex flex-col bg-white dark:bg-black overflow-hidden">
            {showWelcome ? (
                <WelcomeScreen />
            ) : (
                <>
                    <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                        <form onSubmit={handleAddressSubmit} className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={currentAddress}
                                onChange={(e) => setCurrentAddress(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-900 rounded-md py-1.5 px-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search or enter web address"
                            />
                        </form>
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700">
                         <iframe
                            src={url || 'about:blank'}
                            title="Web Content"
                            className="w-full h-full border-none"
                            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </>
            )}
        </main>
    );
};
