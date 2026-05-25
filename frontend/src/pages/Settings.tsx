import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import api from "../utils/api";

import {
  User,
  Mail,
  Calendar,
  Lock,
  Sparkles,
  Save,
} from "lucide-react";

export const Settings: React.FC = () => {
  const { user } = useAuth();

  const { showToast } = useToast();

  const [username, setUsername] =
    useState(user?.username || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [saving, setSaving] =
    useState(false);

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      setSaving(true);

      await api.put("/users/profile", {
        username,
        email,
      });

      showToast(
        "Profile updated successfully",
        "success"
      );
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to update profile",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* PROFILE CARD */}
      <div className="glass-card p-6 border border-dark-700/50">

        {/* HEADER */}
        <div className="border-b border-dark-700/30 pb-4 mb-6">

          <h2 className="text-lg font-bold Outfit text-slate-100">
            Profile Settings
          </h2>

          <p className="text-xs text-slate-500">
            Manage your account profile
          </p>

        </div>

        {/* USER AVATAR */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center text-dark-950 font-black text-4xl shadow-lg shadow-neon-cyan/20">

            {username
              ? username
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>

          <div>

            <h3 className="text-2xl font-bold text-slate-100 Outfit">
              {username || "User"}
            </h3>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan uppercase mt-2">

              <Sparkles className="w-3.5 h-3.5" />

              Premium Creator

            </span>

          </div>

        </div>

        {/* FORM */}
        <div className="space-y-5">

          {/* USERNAME */}
          <div className="space-y-2">

            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">

              <User className="w-4 h-4" />

              Username

            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              className="glass-input w-full px-4 py-3 text-sm"
            />

          </div>

          {/* EMAIL */}
          <div className="space-y-2">

            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">

              <Mail className="w-4 h-4" />

              Email

            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter email"
              className="glass-input w-full px-4 py-3 text-sm"
            />

          </div>

          {/* JOIN DATE */}
          <div className="space-y-2">

            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">

              <Calendar className="w-4 h-4" />

              Joined Date

            </label>

            <div className="glass-input px-4 py-3 text-sm text-slate-300">

              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : "May 2026"}

            </div>

          </div>

          

        </div>

      </div>

      {/* SECURITY CARD */}
      <div className="glass-card p-6 border border-dark-700/50">

        {/* HEADER */}
        
        {/* ACTIONS */}
        

      </div>

    </div>
  );
};

export default Settings;