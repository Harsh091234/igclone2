import { Link, useLocation } from "react-router-dom";
import {
  User,
  Bell,
  Lock,
  Users,
  Ban,
  MapPin,
  MessageSquare,
  AtSign,
  MessageCircle,
  Repeat,
  Shield,
  Download,
  Accessibility,
  Globe,
  Monitor,
  BadgeHelp,
  HelpCircle,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

const sections = [
  {
    title: "How you use Instagram",
    items: [
      { label: "Edit profile", icon: User, path: "/settings/edit-profile" },
      { label: "Notifications", icon: Bell, path: "/settings/notifications" },
    ],
  },
  {
    title: "Who can see your content",
    items: [
      {
        label: "Account privacy",
        icon: Lock,
        path: "/settings/account-privacy",
      },
      { label: "Close Friends", icon: Users, path: "/settings/close-friends" },
      { label: "Blocked", icon: Ban, path: "/settings/blocked" },
      {
        label: "Story and location",
        icon: MapPin,
        path: "/settings/story-location",
      },
    ],
  },
  {
    title: "How others interact with you",
    items: [
      {
        label: "Messages and story replies",
        icon: MessageSquare,
        path: "/settings/messages",
      },
      { label: "Tags and mentions", icon: AtSign, path: "/settings/tags" },
      { label: "Comments", icon: MessageCircle, path: "/settings/comments" },
      { label: "Sharing and reuse", icon: Repeat, path: "/settings/sharing" },
      {
        label: "Restricted accounts",
        icon: Shield,
        path: "/settings/restricted",
      },
    ],
  },
  {
    title: "Your app and media",
    items: [
      {
        label: "Archiving and downloading",
        icon: Download,
        path: "/settings/archive",
      },
      {
        label: "Accessibility",
        icon: Accessibility,
        path: "/settings/accessibility",
      },
      { label: "Language", icon: Globe, path: "/settings/language" },
      {
        label: "Website permissions",
        icon: Monitor,
        path: "/settings/permissions",
      },
    ],
  },
  {
    title: "For professionals",
    items: [
      {
        label: "Account type and tools",
        icon: LayoutDashboard,
        path: "/settings/tools",
      },
      {
        label: "Meta Verified",
        icon: BadgeHelp,
        path: "/settings/meta-verified",
      },
    ],
  },
  {
    title: "More info",
    items: [
      { label: "Help", icon: HelpCircle, path: "/settings/help" },
      {
        label: "Privacy Center",
        icon: ShieldCheck,
        path: "/settings/privacy-center",
      },
      {
        label: "Account Status",
        icon: ShieldCheck,
        path: "/settings/account-status",
      },
    ],
  },
];

export default function SettingsMenu() {
  const location = useLocation();

  return (
    <div className="w-full max-h-screen overflow-y-auto p-4 space-y-6">
      {/* META CARD */}
      <h1 className="pl-8 font-bold text-2xl">Settings</h1>
      {/* <div className="bg-white shadow-sm rounded-xl p-4 border">
        <h2 className="font-semibold text-lg">Meta</h2>
        <p className="text-sm mt-1 text-gray-600">
          Manage your connected experiences and account settings across Meta
          technologies.
        </p>

        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-700">• Personal details</p>
          <p className="text-sm text-gray-700">• Password and security</p>
          <p className="text-sm text-gray-700">• Ad preferences</p>
        </div>

        <Link className="text-blue-600 text-sm mt-2 inline-block" to="#">
          See more in Accounts Center
        </Link>
      </div> */}

      {/* MENU SECTIONS */}
      {sections.map((section, index) => (
        <div key={index}>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={i}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition 
                    ${
                      active ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
