
import tileGameScreenshot from "../assets/tile-game-screenshot.png";
import toastTesterScreenshot from "../assets/toast-tester-screenshot.png"
import theLongestBoxScreenshot from "../assets/the-longest-box-screenshot.png"
import dowdSolarPumpScreenshot from "../assets/DSP_Logo.png"
import thePirateGameScreenshot from "../assets/unity.png"


export const ProjectList = [
  {
    title: "N-Puzzle",
    description: `The N-Puzzle is a fun take on an old classic, the 8-puzzle.
      You can choose your board size anywhere from a 3-puzzle to a 99-puzzle! 
      You can undo, restart, or shuffle for a new board. All boards are 
      guaranteed solvable.`,
    tags: ["JavaScript REACT", "HTML", "CSS"],
    screenshot: tileGameScreenshot,
    type: "iframe",
    src: process.env.PUBLIC_URL +  "/projects/tile-game/index.html",
  },
  { 
    title: "Toast Tester", 
    description: `Taste the toast! A toast simulator that is almost as 
      exciting as making real toast! Realistic gradient toasting, functional
      smoke alarm, and relaxing background music are just SOME of the features 
      you can expect. Toast so good you can almost taste it, Toast Tester! (TM) --
      This was a group project for a Computer Graphics class I took at UMass 
      Dartmouth, despite it's tongue-in-cheek style it earned a perfect score 
      and high reviews from the Professor who had us present the project to a 
      touring group of local high schoolers`,
    tags: ["JavaScript", "Three.js"],
    screenshot: toastTesterScreenshot, 
    type: "iframe", 
    src: process.env.PUBLIC_URL + "/projects/toast-tester/index.html" 
  },
  {
    title: "The Longest Box",
    description: `The Longest Box is a comic book cataloging app that allows you 
    to scan in images of your comics and store all the info about all your comics 
    in one place, and when you want to go out and buy some more comics you can hit 
    the pin in the toolbar and find local comic book stores in your area.`,
    tags: ["Java", "Android Studio", "XML", "SQLite"],
    screenshot: theLongestBoxScreenshot,
    type: "video",
    src: "/projects/the-longest-box/demo.mp4"
  },
];
  /*{
    title: "Dowd Solar Pump",
    description: `The DSP was an interdisciplinary senior design project, at UMass Dartmouth. 
      In total our members covered 4 disciplines:Electrical, Mechanical and Computer Engineering 
      as well as Computer Science. I led the App Team and communicated with the Engineering Team
      and customer to deliver a fully functioning iOS app capable of global communication with the 
      IoT style pump which is able to set schedules and provide diagnostics and event tracking.`,
    tags: ["Swift", "XCode", "Postman", "AWS"],
    screenshot: dowdSolarPumpScreenshot,
    type: "video",
    src: "/src/needed"
  },
  {
    title: "The Pirate Game: A Working Title",
    description: `Sail the seven seas and avast yee jibber jabber! Experience the fun
      of this 2.5D pirate game. Retro visuals and procedurally generated environments.
      Sail the endless oceans in a simulated 3D top-down view engaging in battles with
      other ships. Then seamlessly switch into side scrolling smash and grabs, boarding
      the boat and taking the spoils of war. Enjoy matey!`,
    tags: ["Unity", "C#"],
    screenshot: thePirateGameScreenshot,
    type: "iframe",
    src: process.env.PUBLIC_URL + "/projects/the-pirate-game/index.html" 
  }*/
