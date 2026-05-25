import {
  Sparkles,
  FileText,
  BookOpen,
} from "lucide-react";

export const templatesList = [
  {
    id: 1,
    category: "Captions",
    popular: true,
    usageCount: 0,
    title: "Viral Instagram Hook",
    desc: "Craft an energetic social caption for a lifestyle post focusing on mindfulness and growth.",
    tool: "caption",
    params:
      "topic=sustainable lifestyle changes&platform=Instagram&tone=Energetic&keywords=mindfulness,growth",
    color:
      "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 hover:border-neon-cyan/50",
    icon: Sparkles,
  },

  {
    id: 2,
    category: "Captions",
    popular: false,
    usageCount: 0,
    title: "LinkedIn Authority Builder",
    desc: "Professional LinkedIn caption discussing business strategy and leadership.",
    tool: "caption",
    params:
      "topic=compounding strategy improvements in remote teams&platform=LinkedIn&tone=Professional&keywords=strategy,leadership",
    color:
      "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 hover:border-neon-cyan/50",
    icon: Sparkles,
  },

  {
    id: 3,
    category: "Blogs",
    popular: true,
    usageCount: 0,
    title: "Programming Habit Blog",
    desc: "Generate a blog article about deep work and software engineering habits.",
    tool: "blog",
    params:
      "title=Senior programming habits and deep focus workflows&audience=Junior engineers&keywords=productivity,focus,programming&length=medium",
    color:
      "text-neon-blue border-neon-blue/20 bg-neon-blue/5 hover:border-neon-blue/50",
    icon: FileText,
  },

  {
    id: 4,
    category: "Notes",
    popular: true,
    usageCount: 0,
    title: "Quantum Physics Sheet",
    desc: "Comprehensive notes on Quantum Entanglement and Bell's theorem.",
    tool: "notes",
    params:
      "subject=Quantum Physics&topicText=Quantum Entanglement and Bell theorem&detailLevel=comprehensive",
    color:
      "text-neon-violet border-neon-violet/20 bg-neon-violet/5 hover:border-neon-violet/50",
    icon: BookOpen,
  },

  {
    id: 5,
    category: "Notes",
    popular: false,
    usageCount: 0,
    title: "Psychology Summary Sheet",
    desc: "Brief cheatsheet for cognitive dissonance and belief adjustment.",
    tool: "notes",
    params:
      "subject=Cognitive Psychology&topicText=Cognitive Dissonance and belief adjustment&detailLevel=brief",
    color:
      "text-neon-violet border-neon-violet/20 bg-neon-violet/5 hover:border-neon-violet/50",
    icon: BookOpen,
  },
];