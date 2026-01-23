import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, changePassword } from "../services/authService";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../services/notificationService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    errorNotifications: true,
    weeklyReport: false,
    slaBreach: true,
    regressionAlerts: true,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
      });
    }
    fetchNotificationSettings();
  }, [user]);

  const fetchNotificationSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      if (settings) {
        setNotifications(settings);
      }
    } catch {}
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await updateProfile(profile);
      toast.success("Profile updated");
      refreshUser && refreshUser();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success("Password changed");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      await updateNotificationSettings(notifications);
      toast.success("Notification settings updated");
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account and preferences
        </p>
      </div>

      <div className='flex gap-6'>
        <div className='w-48 space-y-1'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <tab.icon className='h-4 w-4' />
              {tab.label}
            </button>
          ))}
        </div>

        <div className='flex-1 bg-card border border-border rounded-xl p-6'>
          {activeTab === "profile" && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-lg font-semibold mb-4'>Profile Settings</h2>
                <div className='space-y-4'>
                  <div>
                    <label className='text-sm text-muted-foreground block mb-1'>
                      Name
                    </label>
                    <input
                      type='text'
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
                    />
                  </div>
                  <div>
                    <label className='text-sm text-muted-foreground block mb-1'>
                      Email
                    </label>
                    <input
                      type='email'
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
                    />
                  </div>
                  <div>
                    <label className='text-sm text-muted-foreground block mb-1'>
                      Company
                    </label>
                    <input
                      type='text'
                      value={profile.company}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                      placeholder='Optional'
                      className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors'
              >
                {loading ? (
                  <LoadingSpinner size='sm' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-lg font-semibold mb-4'>Change Password</h2>
                <div className='space-y-4 max-w-md'>
                  <div className='relative'>
                    <label className='text-sm text-muted-foreground block mb-1'>
                      Current Password
                    </label>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className='absolute right-3 top-8 text-muted-foreground'
                    >
                      {showPasswords.current ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                  <div className='relative'>
                    <label className='text-sm text-muted-foreground block mb-1'>
                      New Password
                    </label>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className='absolute right-3 top-8 text-muted-foreground'
                    >
                      {showPasswords.new ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                  <div className='relative'>
                    <label className='text-sm text-muted-foreground block mb-1'>
                      Confirm New Password
                    </label>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className='absolute right-3 top-8 text-muted-foreground'
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePasswordChange}
                disabled={
                  loading ||
                  !passwords.currentPassword ||
                  !passwords.newPassword
                }
                className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors'
              >
                {loading ? (
                  <LoadingSpinner size='sm' />
                ) : (
                  <Shield className='h-4 w-4' />
                )}
                Update Password
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-lg font-semibold mb-4'>
                  Notification Preferences
                </h2>
                <div className='space-y-4'>
                  {[
                    {
                      key: "emailAlerts",
                      label: "Email Alerts",
                      description: "Receive critical alerts via email",
                    },
                    {
                      key: "errorNotifications",
                      label: "Error Notifications",
                      description: "Get notified when APIs return errors",
                    },
                    {
                      key: "slaBreach",
                      label: "SLA Breach Alerts",
                      description: "Alert when SLA targets are missed",
                    },
                    {
                      key: "regressionAlerts",
                      label: "Regression Alerts",
                      description: "Notify on performance regressions",
                    },
                    {
                      key: "weeklyReport",
                      label: "Weekly Report",
                      description: "Receive weekly summary emails",
                    },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'
                    >
                      <div>
                        <p className='font-medium'>{setting.label}</p>
                        <p className='text-sm text-muted-foreground'>
                          {setting.description}
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={notifications[setting.key]}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [setting.key]: e.target.checked,
                            })
                          }
                          className='sr-only peer'
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleNotificationSave}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors'
              >
                {loading ? (
                  <LoadingSpinner size='sm' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
