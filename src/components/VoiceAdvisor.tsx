import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  ArrowLeft, 
  Volume2, 
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Bot
} from "lucide-react";

import { translations } from "@/utils/translations";

interface VoiceAdvisorProps {
  onBack: () => void;
  language: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

const sampleQuestions = [
  "When should I plant tomatoes?",
  "How to control aphids naturally?",
  "Best fertilizer for wheat crop?",
  "Ideal spacing for cotton plants?"
];

export function VoiceAdvisor({ onBack, language }: VoiceAdvisorProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant", 
      content: "Hello! I'm your AI farming advisor. Ask me anything about crops, soil, weather, or farming techniques. You can speak or type your questions.",
      timestamp: new Date()
    }
  ]);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "When is the best time to plant cotton in Gujarat?",
          timestamp: new Date(),
          isAudio: true
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: "The best time to plant cotton in Gujarat is from mid-April to mid-May, during the pre-monsoon period. Soil temperature should be above 18°C. Plant after the first pre-monsoon shower for optimal germination. Ensure soil moisture is adequate and avoid planting during extreme heat.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1500);
        
        setIsListening(false);
      }, 3000);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: textInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant", 
        content: getAIResponse(textInput),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    const responses = {
      "fertilizer": "For balanced nutrition, use NPK fertilizer in 4:2:1 ratio. Apply nitrogen in split doses - 50% at sowing, 25% at 30 days, and 25% at flowering stage.",
      "watering": "Water crops early morning or evening. Avoid midday watering. Maintain soil moisture at 60-70% field capacity for optimal growth.",
      "pest": "Use integrated pest management (IPM). Start with neem-based organic solutions. Monitor weekly and apply targeted treatments only when pest threshold is crossed.",
      "default": "Based on your farming conditions, I recommend following proper agricultural practices. Could you provide more specific details about your crop and location for better guidance?"
    };
    
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes("fertilizer") || lowerQ.includes("nutrition")) return responses.fertilizer;
    if (lowerQ.includes("water") || lowerQ.includes("irrigation")) return responses.watering;
    if (lowerQ.includes("pest") || lowerQ.includes("disease")) return responses.pest;
    return responses.default;
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setTextInput(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t.askAdvisor}</h1>
        </div>
        <p className="text-white/90">{t.askAdvisorDesc}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'assistant' && (
                  <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.isAudio && (
                      <Badge variant="outline" className="text-xs">
                        Voice
                      </Badge>
                    )}
                  </div>
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSpeak(message.content)}
                        className="h-8 px-2"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Questions */}
        {messages.length === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        {/* Voice Button */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={handleVoiceInput}
            className={`w-16 h-16 rounded-full transition-smooth ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-primary hover:bg-primary-hover'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
        </div>
        
        {isListening && (
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Listening... Speak now</p>
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-2 h-4 bg-primary rounded animate-pulse"></div>
              <div className="w-2 h-6 bg-primary rounded animate-pulse delay-75"></div>
              <div className="w-2 h-4 bg-primary rounded animate-pulse delay-150"></div>
            </div>
          </div>
        )}

        {/* Text Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Type your farming question here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            className="flex-1"
          />
          <Button 
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="bg-gradient-primary hover:bg-primary-hover"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}