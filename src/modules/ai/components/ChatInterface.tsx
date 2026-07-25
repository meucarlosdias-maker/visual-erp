'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from '@/constants/icons';
import { useConversations } from '../hooks/use-conversations';
import { chatService } from '../services/chat-service';

interface ChatInterfaceProps {
  conversationId: string;
  systemPrompt?: string;
}

export function ChatInterface({ conversationId, systemPrompt }: ChatInterfaceProps) {
  const { sendMessage } = useConversations();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.getConversation(conversationId).then((conv) => {
      if (conv) {
        setMessages(conv.messages.map((m) => ({ role: m.role, content: m.content })));
      }
    });
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setSending(true);
    const result = await sendMessage(conversationId, content, systemPrompt);
    setSending(false);
    if (result) {
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <Card className="flex-1 overflow-y-auto mb-4">
        <CardContent className="p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Inicie uma conversa com o assistente de IA.
            </p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Pensando...</p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          disabled={sending}
        />
        <Button onClick={handleSend} disabled={sending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
