import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, CreditCard, Bell, Shield, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    allowSignups: true,
    requireApproval: false,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    debugMode: false,
    maintenanceMode: false,
    stripeIntegration: true,
    squareIntegration: false,
    multiLanguage: false,
    darkModeDefault: false,
    analyticsEnabled: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const sections = [
    {
      title: "General",
      icon: Globe,
      items: [
        { key: "allowSignups" as const, label: "Allow New Signups", desc: "Enable new restaurant registrations" },
        { key: "requireApproval" as const, label: "Require Approval", desc: "Manually approve new tenant registrations" },
        { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Put the platform in maintenance mode" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { key: "emailNotifications" as const, label: "Email Notifications", desc: "Send email alerts for important events" },
        { key: "smsNotifications" as const, label: "SMS Notifications", desc: "Send SMS alerts for critical events" },
      ],
    },
    {
      title: "Payments",
      icon: CreditCard,
      items: [
        { key: "stripeIntegration" as const, label: "Stripe Integration", desc: "Enable Stripe payment processing" },
        { key: "squareIntegration" as const, label: "Square Integration", desc: "Enable Square payment processing" },
      ],
    },
    {
      title: "System",
      icon: Shield,
      items: [
        { key: "autoBackup" as const, label: "Auto Backup", desc: "Automatically backup database daily" },
        { key: "debugMode" as const, label: "Debug Mode", desc: "Enable debug logging" },
        { key: "analyticsEnabled" as const, label: "Analytics", desc: "Collect usage analytics" },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { key: "darkModeDefault" as const, label: "Dark Mode Default", desc: "Use dark mode as default theme" },
        { key: "multiLanguage" as const, label: "Multi-Language", desc: "Enable multiple language support" },
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">Configure platform-wide settings</p>
        </div>
        <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="w-5 h-5 text-amber-500" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings[item.key]}
                      onCheckedChange={() => toggle(item.key)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
