import "./Testimonials.css"
import TestimonialCard from "./TestimonialCard"

const Testimonials = () => {
  
  return (
    <div className="testimonials">
        <div className="title-box">
            <h1 className="title">Testimonials</h1>
            <p className="text">Hear what my colleagues have to say</p>
        </div>
        <div className="testimonials-frame">
            <TestimonialCard index={0}/>
            <TestimonialCard index={1}/>
            <TestimonialCard index={2}/>
        </div>
    </div>
  );
};

export default Testimonials;
