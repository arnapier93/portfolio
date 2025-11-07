import "./TestimonialCard.css";
import firasHeadshot from "../assets/firas_khatib.png";
import addyHeadshot from "../assets/addy.webp";
import codeWizLogo from "../assets/code-wiz-logo.png";

const testimonials = [
  {
    blurb: `I was lucky enough to have Andrew in 3 of my classes last year.
      He wrote a thoroughly researched term paper on Targeted Digital Advertising
      for my Social & Ethical Aspects of Computing course and created a very
      original Unity game for my Computer Game Design course. Our year long 
      Senior Design course, however, is where I really got to see Andrew flourish.
      Every other team had 3-4 students while Andrew was in an interdisciplinary 
      project so he was the only one from his team in my course. He collaborated 
      with two graduate students on any software, though, he was the only one producing 
      all the required documentation for the customer in the design process.
    `,
    name: "Firas Khatib, PhD",
    details: [
      "Associate Professor",
      "Dept of Computer and Information Science",
      "UMass Dartmouth",
    ],
    photo: firasHeadshot,
  },
  {
    blurb: `Working with Andrew on the Dowd Solar Pump Project was a good experience.
      He was organized and communicated well with our engineering team and the client.
      When issues did arise, Andrew would always help the team find a solution. I 
      appreciated his clear updates and problem-solving. I would be glad to work with him again.
    `,
    name: "Aditya Sahu",
    details: ["Software Development Engineer", "Amazon Web Services"],
    photo: addyHeadshot,
  },
  {
    blurb: `When Andrew first joined CodeWiz, he was new to working with kids, but he quickly 
      became one of our most engaging and approachable coaches. He started with our LEGO Robotics 
      classes and now teaches nearly every subject we offer — from Python and Scratch to AI and 
      game development with Roblox or MCreator. His classes are filled with fun, and he has a strong 
      ability to explain complex concepts in a kid-friedly way. As our First LEGO League (FLL) coach, he’s
      introduced students to professional tools like Python and GitHub, helping them think like real 
      developers and build innovative projects.
    `,
    name: "Serena",
    details: ["Center Director", "CodeWiz Needham"],
    photo: codeWizLogo,
  },
];

const TestimonialCard = ({ index }) => {
  const { name, details, blurb, photo } = testimonials[index];

  return (
    <div className="testimonial-card">
      <div className="colleague">
        <img className="photo" src={photo} alt={name} />
        <div className="name-and-details">
          <h1 className="title">{name}</h1>
          {details.map((d, i) => (
            <p className="text" key={i}>
              {d}
            </p>
          ))}
        </div>
      </div>

      <p className="text blurb">{blurb}</p>
    </div>
  );
};

export default TestimonialCard;
export const testimonialCount = testimonials.length; // 👈 export count for the carousel
