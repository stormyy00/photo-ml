"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Settings as SettingsIcon,
  Mail,
  Palette,
  Shield,
  Save,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/db/queries/settings";
import { toast } from "sonner";

const Settings = () => {
  const queryClient = useQueryClient();
  const { data: settingsData } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => getSettings(),
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: false,
    darkMode: false,
    dataSharing: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setSettings((prev) => ({
        ...prev,
        ...settingsData,
      }));
    }
  }, [settingsData]);

  useEffect(() => {
    if (settingsData) {
      const changed = Object.keys(settings).some(
        (key) =>
          settings[key as keyof typeof settings] !==
          settingsData[key as keyof typeof settingsData],
      );
      setHasChanges(changed);
    }
  }, [settings, settingsData]);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: (body: typeof settings) => updateSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      if (typeof window !== "undefined") {
        if (settings.darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      setHasChanges(false);
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-photo-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-photo-green-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-photo-green-100 flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-photo-green-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-photo-green-300">
                Settings
              </h1>
              <p className="text-photo-green-300/70 text-lg mt-1">
                Manage your preferences
              </p>
            </div>
          </div>
          {hasChanges && (
            <Button
              onClick={() => saveSettings(settings)}
              className="bg-photo-green-300 hover:bg-photo-green-300/90 text-white rounded-full shadow-lg px-6"
              disabled={isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-photo-green-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-photo-green-300" />
              </div>
              <div>
                <CardTitle className="text-xl text-photo-green-300 font-bold">
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-photo-green-300/60">
                  Control how and when you receive updates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-notifications"
                  className="text-photo-green-300 font-semibold"
                >
                  Email notifications
                </Label>
                <p className="text-sm text-photo-green-300/60 mt-1">
                  Receive important updates and alerts via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>

            <Separator className="bg-photo-green-100/50" />

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="weekly-digest"
                  className="text-photo-green-300 font-semibold"
                >
                  Weekly digest
                </Label>
                <p className="text-sm text-photo-green-300/60 mt-1">
                  Get a weekly summary of your photo organization activity
                </p>
              </div>
              <Switch
                id="weekly-digest"
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) =>
                  handleSettingChange("weeklyDigest", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-photo-green-100 flex items-center justify-center">
                <Palette className="h-5 w-5 text-photo-green-300" />
              </div>
              <div>
                <CardTitle className="text-xl text-photo-green-300 font-bold">
                  Appearance
                </CardTitle>
                <CardDescription className="text-photo-green-300/60">
                  Customize how the app looks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="dark-mode"
                  className="text-photo-green-300 font-semibold"
                >
                  Dark mode
                </Label>
                <p className="text-sm text-photo-green-300/60 mt-1">
                  Switch to dark theme for better viewing in low light
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  handleSettingChange("darkMode", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-photo-green-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-photo-green-300" />
              </div>
              <div>
                <CardTitle className="text-xl text-photo-green-300 font-bold">
                  Privacy & Data
                </CardTitle>
                <CardDescription className="text-photo-green-300/60">
                  Control how your data is used
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="data-sharing"
                  className="text-photo-green-300 font-semibold"
                >
                  Anonymous data sharing
                </Label>
                <p className="text-sm text-photo-green-300/60 mt-1">
                  Help improve the service by sharing anonymous usage data
                </p>
              </div>
              <Switch
                id="data-sharing"
                checked={settings.dataSharing}
                onCheckedChange={(checked) =>
                  handleSettingChange("dataSharing", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-photo-green-300/40 pt-4">
          {hasChanges
            ? "You have unsaved changes. Click Save Settings to apply them."
            : "All changes are saved"}
        </p>
      </div>
    </div>
  );
};

export default Settings;
