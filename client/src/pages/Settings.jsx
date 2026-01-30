import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import authService from "../services/authService";
import notificationService from "../services/notificationService";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchNotificationSettings = async () => {
    try {
      const settings = await notificationService.getNotificationSettings();
      if (settings) {
        setNotifications(settings);
      }
    } catch {
      /* empty */
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await authService.updateProfile(profile);
      toast.success("Profile updated successfully");
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
      await authService.changePassword(
        passwords.currentPassword,
        passwords.newPassword,
      );
      toast.success("Password changed successfully");
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
      await notificationService.updateNotificationSettings(notifications);
      toast.success("Preferences saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      desc: "Manage account details",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      desc: "Password & authentication",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      desc: "Email preferences",
    },
  ];

  const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    icon: Icon,
    onClickIcon,
  }) => (
    <div className='w-full'>
      <label className='block text-sm font-medium text-gray-700 mb-1.5'>
        {label}
      </label>
      <div className='relative group'>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='flex w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-[14px] text-sm font-bricolage text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#14412B]/30 focus:bg-white focus:ring-4 focus:ring-[#14412B]/5 transition-all duration-200'
        />
        {Icon && (
          <button
            type='button'
            onClick={onClickIcon}
            className='absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
          >
            <Icon className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-auto overflow-visible lg:h-full lg:overflow-hidden'>
      <div className='shrink-0 mb-2 md:mb-5 px-1'>
        <h1 className='md:text-2xl text-[22px] text-black tracking-wide font-dmsans text-center md:text-start mb-1'>
          Settings
        </h1>
        <p className='md:text-base text-[13px] text-gray-500 font-bricolage text-center md:text-start'>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Main Layout */}
      <div className='flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-[17px] pb-4'>
        {/* Sidebar Navigation */}
        <div className='lg:col-span-3 lg:h-full lg:overflow-y-auto pr-1'>
          <div className='bg-white rounded-[24px] p-2 border border-gray-200/60 shadow-xs space-y-2'>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center text-left p-3.5 rounded-[17.5px] transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                    isActive
                      ? "bg-[#14412B] text-white shadow-md shadow-[#14412B]/20"
                      : "bg-transparent text-gray-600 hover:bg-gray-100/60"
                  }`}
                >
                  <div
                    className={`p-2 rounded-[10px] mr-3.5 transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <tab.icon className='h-4.5 w-4.5' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p
                      className={`font-dmsans text-[14px] font-medium leading-tight ${isActive ? "text-white" : "text-gray-900"}`}
                    >
                      {tab.label}
                    </p>
                    <p
                      className={`font-bricolage text-[11px] truncate ${isActive ? "text-emerald-100/70" : "text-gray-400"}`}
                    >
                      {tab.desc}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight className='h-4 w-4 text-emerald-100/50' />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className='lg:col-span-9 h-full flex flex-col'>
          <div className='bg-white rounded-[28px] border border-gray-200/60 flex-1 p-6 md:p-8 lg:overflow-y-auto custom-scrollbar'>
            {activeTab === "profile" && (
              <div className='max-w-2xl animate-fade-in-up'>
                <div className='pb-4'>
                  <h2 className='text-xl font-bold font-dmsans text-center md:text-start text-gray-900 mb-0.5'>
                    Profile Details
                  </h2>
                  <p className='text-sm text-gray-500 font-bricolage text-center md:text-start'>
                    Update your personal information
                  </p>
                </div>

                <div className='md:space-y-5 space-y-3'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-5'>
                    <InputField
                      label='Full Name'
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder='e.g. John Doe'
                    />
                    <InputField
                      label='Company'
                      value={profile.company}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                      placeholder='e.g. Acme Corp'
                    />
                  </div>
                  <InputField
                    label='Email Address'
                    type='email'
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder='name@example.com'
                  />

                  <div className='pt-6'>
                    <Button
                      onClick={handleProfileSave}
                      isLoading={loading}
                      className='w-full md:w-auto bg-[#14412B] hover:bg-[#1a5438] text-white rounded-full px-8 py-3.5 md:px-8 md:py-3 text-sm font-bricolage transition-all cursor-pointer'
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className='max-w-xl animate-fade-in-up'>
                <div className='pb-4'>
                  <h2 className='text-xl font-bold font-dmsans text-center md:text-start text-gray-900 mb-0.5'>
                    Password & Security
                  </h2>
                  <p className='text-sm text-gray-500 font-bricolage text-center md:text-start'>
                    Manage your login credentials
                  </p>
                </div>

                <div className='md:space-y-5 space-y-3'>
                  <InputField
                    label='Current Password'
                    type={showPasswords.current ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    icon={showPasswords.current ? EyeOff : Eye}
                    onClickIcon={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                  />

                  <div className='md:space-y-5 space-y-3'>
                    <InputField
                      label='New Password'
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      icon={showPasswords.new ? EyeOff : Eye}
                      onClickIcon={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                    />
                    <InputField
                      label='Confirm New Password'
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      icon={showPasswords.confirm ? EyeOff : Eye}
                      onClickIcon={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Button
                      onClick={handlePasswordChange}
                      isLoading={loading}
                      disabled={
                        !passwords.currentPassword || !passwords.newPassword
                      }
                      className='w-full md:w-auto bg-[#14412B] hover:bg-[#1a5438] text-white rounded-full px-8 py-3.5 md:px-8 md:py-3 text-sm font-bricolage transition-all disabled:opacity-50'
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className='max-w-3xl animate-fade-in-up'>
                <div className='pb-4'>
                  <h2 className='text-xl font-bold font-dmsans text-gray-900 mb-0.5'>
                    Email Preferences
                  </h2>
                  <p className='text-sm text-gray-500 font-bricolage'>
                    Choose what updates you want to receive
                  </p>
                </div>

                <div className='grid grid-cols-1 gap-4'>
                  {[
                    {
                      key: "emailAlerts",
                      label: "Email Alerts",
                      desc: "Receive critical alerts immediately via email.",
                    },
                    {
                      key: "errorNotifications",
                      label: "Error Notifications",
                      desc: "Get notified whenever an API returns a 500 error.",
                    },
                    {
                      key: "slaBreach",
                      label: "SLA Beach Alerts",
                      desc: "Notification when an API misses its uptime target.",
                    },
                    {
                      key: "regressionAlerts",
                      label: "Regression Detection",
                      desc: "Alerts when response times degrade significantly.",
                    },
                    {
                      key: "weeklyReport",
                      label: "Weekly Summary",
                      desc: "A weekly digest of your API ecosystem's performance.",
                    },
                  ].map((setting) => (
                    <label
                      key={setting.key}
                      className='flex items-center justify-between gap-4 py-2 px-4 rounded-[15px] border border-gray-200/60 bg-gray-50/50 hover:bg-white hover:border-[#14412B]/20 hover:shadow-sm transition-all cursor-pointer group'
                    >
                      <div className='flex-1'>
                        <p className='text-[15px] font-medium font-dmsans text-gray-900 group-hover:text-[#14412B] transition-colors'>
                          {setting.label}
                        </p>
                        <p className='text-[13px] text-gray-500 font-bricolage mt-0.5'>
                          {setting.desc}
                        </p>
                      </div>
                      <div className='relative flex items-center shrink-0'>
                        <input
                          type='checkbox'
                          checked={notifications[setting.key]}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [setting.key]: e.target.checked,
                            })
                          }
                          className='peer sr-only'
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14412B]"></div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className='pt-4'>
                  <Button
                    onClick={handleNotificationSave}
                    isLoading={loading}
                    className='w-full md:w-auto bg-[#14412B] hover:bg-[#1a5438] text-white rounded-full px-8 py-3.5 md:px-8 md:py-3 text-sm font-bricolage transition-all'
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
