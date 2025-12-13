import React from "react";
import Navbar from "./components/Navbar";
import AboutMe from "./components/AboutMe";
import Projects from "./components/Projects";
import Testimonials from "./components/Testimonials";
import GetInTouch from "./components/GetInTouch"
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <section id="AboutMe"><AboutMe/></section>
      <section id="Projects"><Projects/></section>
      <section id="Testimonials"><Testimonials/></section>
    </div>
  );
}

export default App;
