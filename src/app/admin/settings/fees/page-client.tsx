"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Save } from "lucide-react";

export function FeeSettingsClient({ initialSettings, categories }: { initialSettings: Record<string, string>, categories: string[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Save each setting sequentially or create an API that saves multiple
      // We will just do a Promise.all over existing /api/admin/settings which takes single key-value
      await Promise.all(Object.entries(settings).map(([key, value]) => 
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: value.toString() }),
        })
      ));
      alert("Settings saved successfully!");
    } catch (e) {
      console.error("Failed to save settings", e);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (category: string, value: string) => {
    setSettings(prev => ({ ...prev, [`fee_${category}`]: value }));
  };

  return (
    <div className="max-w-2xl">
      <Card className="rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">Faculty Category Fees</CardTitle>
              <CardDescription className="text-slate-500 mt-1">Set monthly recurring amounts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors">
                  <div className="font-medium text-slate-900">{cat}</div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                    <input 
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={settings[`fee_${cat}`] || ""}
                      onChange={(e) => handleChange(cat, e.target.value)}
                      className="w-full sm:w-32 pl-7 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" disabled={isSaving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium shadow-md px-6">
                {isSaving ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Saving...</span>
                ) : (
                  <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Fees</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
