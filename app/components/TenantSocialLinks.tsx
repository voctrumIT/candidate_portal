"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube, FaGithub } from "react-icons/fa6";
import { Globe } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "./Toast";

interface TenantSocialLinksProps {
  className?: string;
  iconSize?: "sm" | "md";
}

export default function TenantSocialLinks({ className = "", iconSize = "md" }: TenantSocialLinksProps) {
  const { tenant } = useAuth();

  const companyName = tenant?.companyName || "the organization";

  // Resolve links from tenant fields
  const socialData = tenant?.socialLinks || {};
  const twitterUrl = tenant?.twitterUrl || (typeof socialData === "object" ? socialData.twitter || socialData.x : undefined);
  const facebookUrl = tenant?.facebookUrl || (typeof socialData === "object" ? socialData.facebook : undefined);
  const instagramUrl = tenant?.instagramUrl || (typeof socialData === "object" ? socialData.instagram : undefined);
  const linkedinUrl = tenant?.linkedinUrl || (typeof socialData === "object" ? socialData.linkedin : undefined);
  const youtubeUrl = tenant?.youtubeUrl || (typeof socialData === "object" ? socialData.youtube : undefined);
  const githubUrl = tenant?.githubUrl || (typeof socialData === "object" ? socialData.github : undefined);

  const handleClick = (e: React.MouseEvent, platformName: string, url?: string | null) => {
    e.preventDefault();
    if (url && typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.info("Link Not Provided", `${platformName} link has not been provided by ${companyName}.`);
    }
  };

  const isSmall = iconSize === "sm";
  const btnSize = isSmall ? "h-7 w-7" : "h-[30px] w-[30px]";
  const iconClass = isSmall ? "h-3.5 w-3.5" : "h-[14px] w-[14px]";

  const platforms = [
    {
      name: "X (Twitter)",
      url: twitterUrl,
      bg: "bg-black text-white hover:opacity-85",
      icon: <FaXTwitter className={iconClass} />,
    },
    {
      name: "Facebook",
      url: facebookUrl,
      bg: "bg-[#1877F2] text-white hover:opacity-85",
      icon: <FaFacebookF className={iconClass} />,
    },
    {
      name: "Instagram",
      url: instagramUrl,
      bg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-85",
      icon: <FaInstagram className={iconClass} />,
    },
    {
      name: "LinkedIn",
      url: linkedinUrl,
      bg: "bg-[#0A66C2] text-white hover:opacity-85",
      icon: <FaLinkedinIn className={iconClass} />,
    },
  ];

  // If tenant has additional platforms, add them dynamically
  if (youtubeUrl) {
    platforms.push({
      name: "YouTube",
      url: youtubeUrl,
      bg: "bg-[#FF0000] text-white hover:opacity-85",
      icon: <FaYoutube className={iconClass} />,
    });
  }

  if (githubUrl) {
    platforms.push({
      name: "GitHub",
      url: githubUrl,
      bg: "bg-[#24292e] text-white hover:opacity-85",
      icon: <FaGithub className={iconClass} />,
    });
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {platforms.map((p) => {
        const hasLink = Boolean(p.url && typeof p.url === "string" && (p.url.startsWith("http://") || p.url.startsWith("https://")));
        return (
          <button
            key={p.name}
            type="button"
            onClick={(e) => handleClick(e, p.name, p.url)}
            title={hasLink ? `Visit ${companyName} on ${p.name}` : `${p.name} (Link not provided)`}
            aria-label={p.name}
            className={`grid ${btnSize} place-items-center rounded-full ${p.bg} transition shadow-2xs hover:scale-105 active:scale-95 cursor-pointer`}
          >
            {p.icon}
          </button>
        );
      })}
    </div>
  );
}

