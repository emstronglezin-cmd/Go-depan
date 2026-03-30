import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { ArrowLeft, Send, Phone, MoreVertical } from 'lucide-react';

export function Chat() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuthStore();
  const { getMessagesByRequest, sendMessage, requests } = useDataStore();
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = getMessagesByRequest(requestId || '');
  const request = requests.find(r => r.id === requestId);
  
  const otherPartyName = user?.role === 'client' 
    ? request?.depanneurName 
    : request?.clientName;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !user || !requestId) return;
    
    sendMessage({
      requestId,
      senderId: user.id,
      senderName: user.name,
      content: newMessage.trim()
    });
    
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        
        <Avatar name={otherPartyName} size="md" />
        
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 truncate">{otherPartyName}</h1>
          <p className="text-sm text-green-500">En ligne</p>
        </div>
        
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun message</p>
            <p className="text-sm text-gray-400 mt-1">Commencez la conversation</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    isOwn
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 safe-area-pb">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              newMessage.trim()
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
