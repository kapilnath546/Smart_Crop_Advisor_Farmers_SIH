import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bell, 
  AlertTriangle, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  Lightbulb,
  Check,
  Trash2,
  Calendar,
  Clock
} from "lucide-react";
import { translations } from "@/utils/translations";

interface NotificationsProps {
  onBack: () => void;
  language: string;
}

interface Notification {
  id: string;
  type: 'weather' | 'pest' | 'market' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  severity?: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'weather',
    title: 'Heavy Rain Alert',
    message: 'Heavy rainfall expected in the next 24 hours. Postpone fertilizer application and ensure proper drainage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    severity: 'high'
  },
  {
    id: '2',
    type: 'pest',
    title: 'Pest Outbreak Warning',
    message: 'Brown planthopper outbreak reported in nearby areas. Monitor your rice crops closely.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    severity: 'medium'
  },
  {
    id: '3',
    type: 'market',
    title: 'Cotton Price Surge',
    message: 'Cotton prices increased by ₹200/quintal in Rajkot mandi. Consider selling if ready.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: true,
    severity: 'low'
  },
  {
    id: '4',
    type: 'tip',
    title: 'Irrigation Tip',
    message: 'Morning irrigation is 30% more efficient than evening irrigation during summer months.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    severity: 'low'
  },
  {
    id: '5',
    type: 'weather',
    title: 'Temperature Drop',
    message: 'Unexpected temperature drop forecasted. Protect young seedlings from cold stress.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
    severity: 'medium'
  }
];

export function Notifications({ onBack, language }: NotificationsProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'weather': return CloudRain;
      case 'pest': return Bug;
      case 'market': return TrendingUp;
      case 'tip': return Lightbulb;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string, severity?: string) => {
    switch (type) {
      case 'weather': 
        return severity === 'high' ? 'text-red-600' : 'text-blue-600';
      case 'pest': 
        return severity === 'high' ? 'text-red-600' : 'text-orange-600';
      case 'market': 
        return 'text-green-600';
      case 'tip': 
        return 'text-purple-600';
      default: 
        return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Low</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{t.notifications}</h1>
            {unreadCount > 0 && (
              <p className="text-white/80 text-sm">{unreadCount} unread notifications</p>
            )}
          </div>
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Action Buttons */}
        <div className="flex space-x-2 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type, notification.severity);
              
              return (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead 
                      ? 'bg-primary/5 border-primary/20 shadow-soft' 
                      : 'bg-background hover:bg-accent/50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm ${iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {getSeverityBadge(notification.severity)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-2 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}