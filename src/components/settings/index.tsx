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

  useEffect(() => {
    if (settingsData) {
      setSettings((prev) => ({
        ...prev,
        ...settingsData,
      }));
    }
  }, [settingsData]);

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
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    },
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage your account preferences and notifications
            </p>
          </div>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg text-gray-900">
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Control how and when you receive email updates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-notifications"
                  className="text-gray-800 font-medium"
                >
                  Email notifications
                </Label>
                <p className="text-sm text-gray-500 mt-1">
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

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="weekly-digest"
                  className="text-gray-800 font-medium"
                >
                  Weekly digest
                </Label>
                <p className="text-sm text-gray-500 mt-1">
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

        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-purple-600" />
              <div>
                <CardTitle className="text-lg text-gray-900">
                  Appearance
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Customize how the application looks and feels
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="dark-mode"
                  className="text-gray-800 font-medium"
                >
                  Dark mode
                </Label>
                <p className="text-sm text-gray-500 mt-1">
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

        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <CardTitle className="text-lg text-gray-900">
                  Privacy & Data
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Control how your data is used and shared
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="data-sharing"
                  className="text-gray-800 font-medium"
                >
                  Anonymous data sharing
                </Label>
                <p className="text-sm text-gray-500 mt-1">
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

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => saveSettings(settings)}
            className="flex items-center gap-2 bg-photo-green-300 hover:opacity-90 text-photo-white-100"
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
