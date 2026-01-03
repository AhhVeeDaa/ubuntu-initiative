'use client';

import { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export function IngaChat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome-message',
                role: 'assistant',
                content: "Hello. I am Inga GPT, the voice of the Ubuntu Initiative. I have access to our live funding databases—ask me about our mission or our current Phase 0 progress."
            }
        ]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="w-full h-[600px] flex flex-col bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center bg-white/5">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-purple-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center">
                        Inga GPT
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                            ONLINE
                        </span>
                    </h3>
                    <p className="text-gray-400 text-xs">Powered by Ubuntu Intelligence</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex items-start max-w-[85%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        {/* Avatar */}
                        <div className={clsx(
                            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1",
                            msg.role === 'user'
                                ? "ml-3 bg-white/10"
                                : "mr-3 bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/30"
                        )}>
                            {msg.role === 'user' ? (
                                <User className="h-4 w-4 text-gray-300" />
                            ) : (
                                <Bot className="h-4 w-4 text-[hsl(var(--primary))]" />
                            )}
                        </div>

                        {/* Bubble */}
                        <div className={clsx(
                            "rounded-2xl px-5 py-3 text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-white text-black font-medium rounded-tr-none"
                                : "bg-white/5 text-gray-200 border border-white/10 rounded-tl-none hover:bg-white/10 transition-colors"
                        )}>
                            {msg.content}
                            {/* Render tool invocations if any (optional enhancement, but good for debugging) */}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start mr-auto max-w-[80%]">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/30 flex items-center justify-center mr-3 mt-1">
                            <Bot className="h-4 w-4 text-[hsl(var(--primary))]" />
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none px-5 py-4 border border-white/10 flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center my-4">
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Unable to connect to Inga Intelligence Network.
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10 p-4">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about Inga, progress, or funding..."
                        disabled={isLoading}
                        className="w-full bg-black/20 text-white placeholder-gray-500 rounded-xl pl-4 pr-12 py-4 border border-white/10 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary))]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">Inga GPT accesses real-time mission data. Mistakes possible.</p>
                </div>
            </div>
        </div>
    );
}
