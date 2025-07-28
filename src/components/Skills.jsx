import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGit, FaGithub, FaLinux } from "react-icons/fa";
import {  SiTailwindcss, SiExpress, SiFramer, SiMongodb, SiPostman} from "react-icons/si";
// import { SiTypescript, SiNextdotjs, SiTailwindcss, SiFramer, SiShadcnui, SiExpress, SiMongodb, SiMysql, SiPostgresql, SiPrisma, SiZod, SiVercel, SiPostman, SiPnpm } from "react-icons/si";
import "./Skills.scss";

const skills = [
  { name: "HTML", icon: <FaHtml5 color="#E34F26" /> },
  { name: "CSS", icon: <FaCss3Alt color="#1572B6" /> },
  { name: "JavaScript", icon: <FaJs color="#F7DF1E" /> },
//   { name: "TypeScript", icon: <SiTypescript color="#3178C6" /> },
  { name: "ReactJS", icon: <FaReact color="#61DAFB" /> },
  // { name: "NextJS", icon: <SiNextdotjs color="black" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss color="#06B6D4" /> },
  { name: "Framer Motion", icon: <SiFramer color="#0055FF" /> },
//   { name: "Shadcn", icon: <SiShadcnui color="black" /> },
  { name: "NodeJS", icon: <FaNodeJs color="#339933" /> },
  { name: "ExpressJS", icon: <SiExpress color="black" /> },
  { name: "MongoDB", icon: <SiMongodb color="#47A248" /> },
//   { name: "MySQL", icon: <SiMysql color="#4479A1" /> },
//   { name: "PostgreSQL", icon: <SiPostgresql color="#336791" /> },
//   { name: "Prisma", icon: <SiPrisma color="black" /> },
//   { name: "Zod", icon: <SiZod color="#945DD6" /> },
  { name: "Git", icon: <FaGit color="#F05032" /> },
  { name: "GitHub", icon: <FaGithub color="black" /> },
//   { name: "Vercel", icon: <SiVercel color="black" /> },
  { name: "Postman", icon: <SiPostman color="#FF6C37" /> },
//   { name: "Java", icon: <FaJava color="#007396" /> },
  { name: "Linux", icon: <FaLinux color="black" /> },
//   { name: "pnpm", icon: <SiPnpm color="#F69220" /> },
];

export default function SkillIcons() {
  return (
    <div className="skill-icons">
    <h1>My skills</h1>
    <h2>-- Everyday Im struggling --</h2>
    <div className="skill-container">
      {skills.map((skill, index) => (
        <div key={index} className="skill">
          <span className="icon">{skill.icon}</span>
          <span className="name">{skill.name}</span>
        </div>
      ))}
    </div>
    </div>
  );
}
