"use client";

import { useState, useTransition, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { sendMessageAction, getMessagesAction } from '@/app/dashboard/pacts/actions/chat-actions';
import { format } from 'date-fns';

type Message = {
    _id: string;
    senderId: string;
    message: string;
    createdAt: string;
};

export function ChatBox({ pactId }: { pactId: string }) {
    const { user, isLoaded } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, startSendingTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchMessages = async () => {
        // Prevent multiple simultaneous fetches
        if (isFetching) {
            return;
        }
        setIsFetching(true);
        const result = await getMessagesAction(pactId);
        if (result.success && result.messages) {
            setMessages(result.messages);
        } else {
            console.error("Failed to fetch messages:", result.error);
        }
        setIsFetching(false);
    };

    useEffect(() => {
        // CORRECTED: Only start fetching when Clerk user is loaded
        if (!isLoaded) {
            return;
        }
        
        fetchMessages();
        
        // Use a timeout to prevent the initial "thundering herd"
        intervalRef.current = setInterval(fetchMessages, 3000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [pactId, isLoaded]); // Depend on isLoaded state

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        startSendingTransition(async () => {
            const result = await sendMessageAction(pactId, newMessage);
            if(result.success) {
                setNewMessage('');
                fetchMessages();
            } else {
                console.error("Failed to send message:", result.error);
            }
        });
    };
    
    // Show a loading state until the user is loaded
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-lg p-4">
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {messages.length === 0 && !isFetching && (
                    <p className="text-center text-neutral-500 mt-10">Start the conversation!</p>
                )}
                {messages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col p-3 rounded-lg max-w-[75%] ${msg.senderId === user?.id ? 'bg-blue-600 text-white self-end' : 'bg-slate-700 text-neutral-200 self-start'}`}>
                            <span className="text-sm">{msg.message}</span>
                            <span className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-blue-200' : 'text-neutral-400'}`}>
                                {format(new Date(msg.createdAt), 'h:mm a')}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex mt-4 pt-4 border-t border-slate-700">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow bg-slate-700 text-white border-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSending}
                />
                <Button type="submit" className="ml-2 bg-blue-600 hover:bg-blue-700" disabled={isSending}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
}