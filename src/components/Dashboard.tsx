  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { 
    TestTube, 
    Bug, 
    Mic, 
    Sun, 
    TrendingUp, 
    ScrollText,
    Bell,
    Settings,
    MapPin,
    Languages
  } from "lucide-react";
  import { translations } from "@/utils/translations";

  interface DashboardProps {
    onNavigate: (page: string) => void;
    language: string;
    onLanguageChange?: (language?: string) => void;
    userProfile?: any;
  }

  const featureIcons = [
    { id: "soil", icon: TestTube, gradient: "from-amber-400 to-orange-500", shadowColor: "shadow-amber-500/20" },
    { id: "pest", icon: Bug, gradient: "from-red-400 to-pink-500", shadowColor: "shadow-red-500/20" },
    { id: "advisor", icon: Mic, gradient: "from-blue-400 to-cyan-500", shadowColor: "shadow-blue-500/20" },
    { id: "weather", icon: Sun, gradient: "from-orange-400 to-yellow-500", shadowColor: "shadow-orange-500/20" },
    { id: "market", icon: TrendingUp, gradient: "from-green-400 to-emerald-500", shadowColor: "shadow-green-500/20" },
    { id: "feedback", icon: ScrollText, gradient: "from-purple-400 to-violet-500", shadowColor: "shadow-purple-500/20" },
  ];

  export function Dashboard({ onNavigate, language, onLanguageChange, userProfile }: DashboardProps) {
    const t = translations[language as keyof typeof translations] || translations.en;
    const userName = userProfile?.full_name?.split(' ')[0] || 'Farmer';
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-glow"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-primary rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-primary rounded-full opacity-10 animate-float" style={{ animationDelay: "1s" }}></div>

        {/* Enhanced Header */}
        <div className="relative bg-gradient-shimmer bg-[length:400%_400%] animate-shimmer text-white p-6 pb-8 shadow-magical">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{userProfile?.location || t.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20 rounded-full transition-magical hover:scale-110"
                onClick={onLanguageChange}
              >
                <Languages className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20 rounded-full transition-magical hover:scale-110"
                onClick={() => onNavigate("settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20 rounded-full transition-magical hover:scale-110 relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text">{t.greeting}, {userName}! 🌟</h1>
            <p className="text-white/90 text-lg font-medium">{t.subtitle}</p>
          </div>
        </div>

        {/* Enhanced Alert Banner */}
        <div className="mx-6 -mt-4 mb-6 relative">
          <Card className="bg-gradient-to-r from-warning/20 to-orange-500/20 border-warning/30 backdrop-blur-sm shadow-glow animate-bounce-in">
            <CardContent className="p-5 flex items-center space-x-4">
              <div className="relative">
                <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-warning rounded-full animate-ping"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">{t.weatherAlert} ⚡</p>
                <p className="text-xs text-muted-foreground font-medium">{t.weatherAlertText}</p>
            </div>

              <Badge 
              variant="outline" 
              className="text-xs bg-green-100 border-green-600 text-green-700 font-bold animate-glow">
              Refresh
            </Badge>

            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Grid */}
        <div className="px-6 pb-6 relative">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">{t.smartFarmingTools} ✨</h2>
          <div className="grid grid-cols-2 gap-5">
            {featureIcons.map((feature, index) => {
              const IconComponent = feature.icon;
              const featureData = t.features[feature.id as keyof typeof t.features];
              return (
                <Card   
                  key={feature.id}
                  className="cursor-pointer hover:shadow-magical transition-magical transform hover:scale-105 active:scale-95 bg-gradient-card border-0 backdrop-blur-sm animate-bounce-in group relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    if (feature.id === "market") {
                      // open the external site
                      window.open("https://mandi-rates-4e8ee3f4.base44.app/", "_self");
                    } 
                    else if (feature.id === "pest") {
                      // Pest scan (local app)
                      window.open("http://172.16.9.90:8502", "_self");
                    }
                    else if (feature.id === "soil") {
                      // ✅ New soil scan link
                      window.open("http://172.16.9.90:8503", "_self");
                    }
                    else if (feature.id === "weather") {
                      // open external weather page
                      window.open("https://agri-cast-fb58a78c.base44.app/", "_self");
                    }
                    else {
                      onNavigate(feature.id);
                    }
                  }}

                >
                  <div className="absolute inset-0 bg-gradient-feature opacity-0 group-hover:opacity-100 transition-magical"></div>
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="relative mb-4">
                      <div className={`w-18 h-18 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-magical ${feature.shadowColor} group-hover:shadow-float transition-magical group-hover:rotate-3`}>
                        <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-magical animate-pulse"></div>
                    </div>
                    <h3 className="font-bold text-sm mb-2 text-primary group-hover:text-primary-foreground transition-magical">{featureData.title}</h3>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-magical">{featureData.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        {/* <div className="px-6 pb-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">{t.quickStats} 📊</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-magical transition-magical group cursor-pointer">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-black bg-gradient-to-br from-primary to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-magical">23</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{t.scansLabel}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-magical transition-magical group cursor-pointer">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-black bg-gradient-to-br from-primary to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-magical">₹45</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{t.avgPriceLabel}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-magical transition-magical group cursor-pointer">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-black bg-gradient-to-br from-primary to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-magical">85%</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{t.accuracyLabel}</div>
              </CardContent>
            </Card>
          </div>
        </div> */}
      </div>
    );
  }