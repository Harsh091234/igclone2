import { Link, useLocation, useNavigate } from "react-router-dom";
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
   UserPlus,
  LogOut,

  ShieldOff,
  LayoutDashboard,
  Sun,
} from "lucide-react";
import { useLogoutMutation } from "../services/authApi";
import { setUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

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
        label: "Switch appearance",
        icon: Sun,
        path: "/settings/appearance",
      },
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
  {
  title: "Account",
  items: [
    {
      label: "Add Account",
      icon: UserPlus,
      path: "/auth/add-account",
    },
    {
      label: "Switch Accounts",
      icon: Users,
      path: "/auth/switch-account",
    },
    {
      label: "Logout",
      icon: LogOut,
         action: "logout",
    },
    {
      label: "Logout All Accounts",
      icon: ShieldOff,
      action: "logout_all",
    },
  ],
}
];

interface SettingsMenuProps {
  onClose: () => void;
}

export default function SettingsMenu({ onClose }: SettingsMenuProps) {
  const location = useLocation();
  const [logout] = useLogoutMutation()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleLogout = async() => { try {
      const res = await logout(undefined).unwrap();
      console.log("Logged out", res.message);
      dispatch(setUser(null));
      navigate("/login");
    } catch (err: any) {
      console.log("Error logging out:", err?.data?.message || "Something went wrong!");
    }}

  return (
    <div className="w-full h-full overflow-y-auto  p-4 flex flex-col gap-5 sm:gap-8">
      {/* PAGE HEADER */}
      <h1 className=" pl-3 sm:pl-6 font-bold text-2xl ">Settings</h1>

      <div className="flex flex-col gap-2 sm:gap-5">
        {/* MENU SECTIONS */}
        {sections.map((section, index) => (
          
          <div key={index} className="flex flex-col  ">
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-0 sm:mb-2">
              {section.title}
            </h3>

          <div className="-space-y-1 sm:space-x-2">
  {section.items.map((item, i) => {
    const Icon = item.icon;
  

    const active = location.pathname === item.path;

    // 🔴 ACTION BUTTONS (logout / logout all)
    if (item.action) {
      return (
        <button
          key={i}
          onClick={() => {
            onClose();

            if (item.action === "logout") {
              console.log("Logout user");
             handleLogout();
              // call logout API
            }

            if (item.action === "logout_all") {
              console.log("Logout all accounts");
              // call logout all API
            }
          }}
          className="
            flex items-center gap-2.5 p-2.5 rounded-md transition
            text-red-500 hover:text-red-600 hover:bg-red-500/10
            w-full text-left
          "
        >
          <Icon className="w-4 h-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm">{item.label}</span>
        </button>
      );
    }

    // 🔵 NORMAL LINKS
    return (
      <Link
        onClick={onClose}
        key={i}
        to={item.path!}
        className={`
          flex items-center gap-2.5 p-2.5 rounded-md transition
          active:bg-accent active:text-accent-foreground

          ${
            active
              ? "sm:bg-secondary sm:text-foreground sm:font-medium"
              : "sm:hover:bg-accent"
          }
        `}
      >
        <Icon className="w-4 h-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm">{item.label}</span>
      </Link>
    );
  })}
</div>
          </div>
        ))}
      </div>
    </div>
  );
}
