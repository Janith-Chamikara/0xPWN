import { FaqItem, NavItem } from "@lib/types";
import { Gem, Shield, Sparkles, Star, Trophy } from "lucide-react";

export const navItems: NavItem[] = [
  { name: "About", href: "/" },
  { name: "Leaderboard", href: "/" },
  { name: "Challenges", href: "/challenges" },
  { name: "FAQ", href: "/#faq" },
];

export const faqItem: FaqItem[] = [
  {
    question: "What is 0xpwn?",
    answer:
      "0xpwn is a Capture The Flag (CTF) platform that offers hands-on experience in ethical hacking. Participants can solve challenges across various categories to earn points and show off their skills in cybersecurity.",
  },
  {
    question: "How do I participate in CTF challenges on 0xpwn?",
    answer:
      "Simply sign up on the platform, choose a challenge, and start solving. The challenges range from web exploitation to cryptography and binary exploitation. The more challenges you complete, the more points you earn!",
  },
  {
    question: "What are the rewards for completing challenges?",
    answer:
      "While 0xpwn is designed to improve your skills and knowledge, we do have a point-based leaderboard. High-performing players can earn recognition and exclusive in-game rewards. We're exploring adding blockchain-based rewards like NFTs in the future.",
  },
  {
    question: "Do I need a wallet to participate?",
    answer:
      "No, you can participate in the CTF challenges without a wallet. However, if you wish to earn and trade NFTs or receive rewards on the blockchain, you will need a Cardano-compatible wallet like Nami, Eternl, or Lace.",
  },
  {
    question: "Is 0xpwn free to play?",
    answer:
      "Yes, 0xpwn is completely free to play. However, optional actions such as minting blockchain-based rewards or trading NFTs may require small network fees in ADA (Cardano's native token).",
  },
  {
    question: "What technologies power 0xpwn?",
    answer:
      "0xpwn is powered by Next.js for the frontend, MeshJS for Cardano blockchain integration, Aiken for smart contracts, and Cardano for decentralized and secure NFT minting and asset management.",
  },
  {
    question: "Can I trade NFTs earned on 0xpwn?",
    answer:
      "Yes! If 0xpwn incorporates blockchain-based rewards in the future, NFTs earned through challenges can be stored in your Cardano wallet and traded on any Cardano-compatible NFT marketplace, such as JPG Store.",
  },
];

export const recentActivity = [
  {
    id: 1,
    action: "Completed Quest: Digital Heist",
    reward: "+500 XP",
    time: "2 hours ago",
    icon: Trophy,
  },
  {
    id: 2,
    action: "Minted Quantum Blade NFT",
    reward: "+0.5 ADA",
    time: "4 hours ago",
    icon: Sparkles,
  },
  {
    id: 3,
    action: "Defeated Cyber Dragon",
    reward: "+1000 XP",
    time: "6 hours ago",
    icon: Shield,
  },
  {
    id: 4,
    action: "Found Data Crystal",
    reward: "+250 XP",
    time: "8 hours ago",
    icon: Gem,
  },
  {
    id: 5,
    action: "Joined Guild: Neo Hackers",
    reward: "+100 XP",
    time: "1 day ago",
    icon: Star,
  },
];

export const commands = {
  whoami: "0XPWN User", // Placeholder for the user's identity
  help: "Available commands: whoami, help, clear, faq, about, challenges, leaderboard, rules", // List of available commands
  clear: "", // Clears the terminal
  about: `
    0xpwn is a Capture The Flag (CTF) platform designed for both beginners and seasoned hackers. 
    Our mission is to provide hands-on experience in ethical hacking through a variety of challenges. 
    Join us to sharpen your cybersecurity skills and learn real-world hacking techniques. 
    Visit us at: https://0xpwn.com
  `,
  challenges: `
    At 0xpwn, we offer a wide range of challenges designed to test your skills:
    - Web Exploitation challenges focus on vulnerabilities in web applications.
    - Cryptography challenges will have you solving puzzles and decrypting messages.
    - Reverse Engineering challenges push you to analyze and reverse software.
    - Binary Exploitation challenges allow you to find and exploit bugs in compiled binaries.
  `,
  leaderboard: `
    Our leaderboard tracks the top players based on their points earned in challenges. 
    The current top 5 players are performing exceptionally well, with jackharper leading the pack.
    Compete and climb up the ranks to show your skills to the community!
  `,
  rules: `
    Here at 0xpwn, we believe in fair play and learning through ethical hacking. 
    Please follow these rules to ensure a positive experience for all participants:
    - Always respect others in the CTF community.
    - Brute-forcing and DDoS attacks are strictly prohibited.
    - Stay within the boundaries of ethical hacking; no illegal activities.
    - Have fun, learn new things, and improve your skills!
  `,
};
