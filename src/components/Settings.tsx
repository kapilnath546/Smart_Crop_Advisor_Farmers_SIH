import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Bell, 
  Shield, 
  Trash2, 
  Save,
  Languages,
  Moon,
  Sun,
  Volume2
} from "lucide-react";
import { translations } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SettingsProps {
  onBack: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  userProfile?: any;
}

export function Settings({ onBack, language, onLanguageChange, userProfile }: SettingsProps) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || 'Rajkot, Gujarat',
  });
  
  const [notifications, setNotifications] = useState({
    weather_alerts: true,
    pest_warnings: true,
    market_updates: false,
    farming_tips: true,
  });
  
  const [preferences, setPreferences] = useState({
    dark_mode: false,
    voice_enabled: true,
    auto_scan: false,
  });

  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          preferred_language: language
        })
        .eq('user_id', userProfile?.user_id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Navigation will be handled by the auth state change
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // First delete profile
        await supabase.from('profiles').delete().eq('user_id', userProfile?.user_id);
        
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account. Please contact support.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">{t.settings}</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Your city, state"
              />
            </div>

            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              className="w-full bg-gradient-primary hover:bg-primary-hover"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Languages className="w-5 h-5 mr-2 text-primary" />
              Language Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  className={`justify-start h-12 ${
                    language === lang.code 
                      ? "bg-gradient-primary text-white" 
                      : "hover:bg-accent"
                  }`}
                  onClick={() => onLanguageChange(lang.code)}
                >
                  <span className="text-2xl mr-3">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={key} className="text-sm font-medium">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {key === 'weather_alerts' && 'Get notified about weather changes'}
                    {key === 'pest_warnings' && 'Receive pest and disease alerts'}
                    {key === 'market_updates' && 'Get market price notifications'}
                    {key === 'farming_tips' && 'Receive daily farming tips'}
                  </p>
                </div>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch
                checked={preferences.dark_mode}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, dark_mode: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Voice Assistant</Label>
                <p className="text-xs text-muted-foreground">Enable voice responses</p>
              </div>
              <Switch
                checked={preferences.voice_enabled}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, voice_enabled: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Scan</Label>
                <p className="text-xs text-muted-foreground">Automatically analyze uploaded images</p>
              </div>
              <Switch
                checked={preferences.auto_scan}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, auto_scan: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-soft border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="w-5 h-5 mr-2" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            
            <Separator />
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}