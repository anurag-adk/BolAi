// [Imports for icons:]
//FallBack Option
import { MdCode } from "react-icons/md";

//FrontEnd Libraries
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { FaVuejs } from "react-icons/fa";
import { FaAngular } from "react-icons/fa";
import { RiSvelteFill } from "react-icons/ri";
import { TbBrandSolidjs } from "react-icons/tb";

//BackEnd Libraries
import { FaNodeJs } from "react-icons/fa";
import { SiExpress } from "react-icons/si";
import { SiDjango } from "react-icons/si";
import { SiFlask } from "react-icons/si";
import { FaLaravel } from "react-icons/fa";
import { BiLogoSpringBoot } from "react-icons/bi";
import { SiFastapi } from "react-icons/si";
import { SiNestjs } from "react-icons/si";
import { SiRubyonrails } from "react-icons/si";

//Styling And Css
import { RiTailwindCssFill } from "react-icons/ri";
import { FaBootstrap } from "react-icons/fa";
import { FaSass } from "react-icons/fa";
import { BsFiletypeScss } from "react-icons/bs";
import { FaLess } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { SiPostcss } from "react-icons/si";

//Programming Language
import { FaJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";
import { TbBrandCSharp } from "react-icons/tb";
import { FaPhp } from "react-icons/fa";
import { DiRuby } from "react-icons/di";
import { SiKotlin } from "react-icons/si";
import { FaSwift } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { FaRust } from "react-icons/fa";
import { SiDart } from "react-icons/si";

//Design Tools
import { SiAdobexd } from "react-icons/si";
import { FaFigma } from "react-icons/fa";
import { SiSketchup } from "react-icons/si";
import { SiAdobephotoshop } from "react-icons/si";
import { SiAdobeillustrator } from "react-icons/si";
import { SiFramer } from "react-icons/si";

//Database Tools
import { DiMongodb } from "react-icons/di";
import { TbBrandMysql } from "react-icons/tb";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiSqlite } from "react-icons/si";
import { SiMariadb } from "react-icons/si";
import { DiRedis } from "react-icons/di";
import { IoLogoFirebase } from "react-icons/io5";
import { RiSupabaseFill } from "react-icons/ri";

//DevOps
import { FaDocker } from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";
import { FaGitAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaGitlab } from "react-icons/fa6";
import { FaBitbucket } from "react-icons/fa";
import { SiNetlify } from "react-icons/si";
import { IoLogoVercel } from "react-icons/io5";
import { FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import { SiGooglecloud } from "react-icons/si";
import { DiHeroku } from "react-icons/di";
import { DiNginx } from "react-icons/di";

//Testing
import { SiJest } from "react-icons/si";
import { SiMocha } from "react-icons/si";
import { SiChai } from "react-icons/si";
import { SiCypress } from "react-icons/si";
import { SiSelenium } from "react-icons/si";

//Data-Science
import { SiPandas } from "react-icons/si";
import { SiNumpy } from "react-icons/si";
import { SiScikitlearn } from "react-icons/si";
import { SiTensorflow } from "react-icons/si";
import { SiPytorch } from "react-icons/si";
import { SiKeras } from "react-icons/si";
import { SiJupyter } from "react-icons/si";

//Misc-Tools
import { SiWebpack } from "react-icons/si";
import { SiVite } from "react-icons/si";
import { SiBabel } from "react-icons/si";
import { SiEslint } from "react-icons/si";
import { SiPrettier } from "react-icons/si";
import { SiPostman } from "react-icons/si";

//Map of the value
import { mappings } from "@/constants/mapIcons";

const techIconMap = {
  // Frontend
  react: FaReact,
  nextjs: RiNextjsFill,
  vue: FaVuejs,
  angular: FaAngular,
  svelte: RiSvelteFill,
  solid: TbBrandSolidjs,

  // Backend
  nodejs: FaNodeJs,
  express: SiExpress,
  django: SiDjango,
  flask: SiFlask,
  laravel: FaLaravel,
  spring: BiLogoSpringBoot,
  nest: SiNestjs,
  rails: SiRubyonrails,
  fast: SiFastapi,

  // Languages
  javascript: FaJs,
  typescript: SiTypescript,
  python: FaPython,
  java: FaJava,
  cpp: TbBrandCpp,
  csharp: TbBrandCSharp,
  php: FaPhp,
  ruby: DiRuby,
  kotlin: SiKotlin,
  swift: FaSwift,
  go: FaGolang,
  rust: FaRust,
  c: null,
  dart: SiDart,

  // Styling
  tailwind: RiTailwindCssFill,
  bootstrap: FaBootstrap,
  sass: FaSass,
  scss: BsFiletypeScss,
  less: FaLess,
  css: FaCss3Alt,
  postcss: SiPostcss,

  // Design
  figma: FaFigma,
  sketch: SiSketchup,
  adobexd: SiAdobexd,
  photoshop: SiAdobephotoshop,
  illustrator: SiAdobeillustrator,
  framer: SiFramer,

  // Databases
  mongodb: DiMongodb,
  mysql: TbBrandMysql,
  postgresql: BiLogoPostgresql,
  sqlite: SiSqlite,
  mariadb: SiMariadb,
  redis: DiRedis,
  firebase: IoLogoFirebase,
  supabase: RiSupabaseFill,

  // DevOps
  docker: FaDocker,
  kubernetes: SiKubernetes,
  git: FaGitAlt,
  github: FaGithub,
  gitlab: FaGitlab,
  bitbucket: FaBitbucket,
  netlify: SiNetlify,
  vercel: IoLogoVercel,
  aws: FaAws,
  azure: VscAzure,
  gcp: SiGooglecloud,
  heroku: DiHeroku,
  nginx: DiNginx,

  // Testing
  jest: SiJest,
  mocha: SiMocha,
  chai: SiChai,
  cypress: SiCypress,
  selenium: SiSelenium,
  playwright: null,

  //Data-Science
  pandas: SiPandas,
  numpy: SiNumpy,
  sklearn: SiScikitlearn,
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
  keras: SiKeras,
  jupyter: SiJupyter,

  //Misc Tools
  webpack: SiWebpack,
  vite: SiVite,
  babel: SiBabel,
  eslint: SiEslint,
  prettier: SiPrettier,
  postman: SiPostman,
};

const TechIcon = ({ techStack }: { techStack: string }) => {
  const key = mappings[techStack.toLowerCase()] || techStack.toLowerCase();
  const Icon = techIconMap[key as keyof typeof techIconMap];
  const displayName = techStack.toLowerCase().replace(/[^a-z0-9]/g, ""); //Fall-Back Option
  return (
    <>
      {Icon ? (
        <div className="relative group">
          <Icon className="text-xl md:text-3xl lg:text-xl font-semibold text-white mr-2" />
          <span className="absolute -top-7 md:-top-10 lg:-top-7 left-1/2 -translate-x-1/2 bg-green-600/80 text-white text-sm md:text-lg lg:text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            {key}
          </span>
        </div>
      ) : (
        <div className="relative group">
          <MdCode className="text-xl md:text-3xl lg:text-xl font-semibold text-white mr-2" />
          <span className="absolute -top-7 md:-top-10 lg:-top-7 left-1/2 -translate-x-1/2 bg-green-600/80 text-white text-sm md:text-lg lg:text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            {displayName}
          </span>
        </div>
      )}
    </>
  );
};

export default TechIcon;
