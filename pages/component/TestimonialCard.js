// TestimonialCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../animation/Fade";


const TestimonialCard = ({ name, role, image, message, delay }) => {
  return (
    <motion.div
    variants={fadeIn("up", delay)}
    initial={"hidden"}
    
    whileInView={"show"}
    viewport={{once:false, amount:0.1}}
    
    className="grid grid-cols-1 w-full h-full bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-[#292929] rounded-full"></div>
    
      <div className="w-full mx-auto text-center">
        <img
          src={image}
          alt={`${name}'s picture`}
          className="w-15 h-15 mx-auto"
        />
        <h2 className="text-xl font-bold mb-1 text-[#292929] mt-2">{name}</h2>
        <h3 className="text-sm font-light mb-3 text-[#292929]">{role}</h3>
      </div>
      <div className="w-full mx-auto text-center text-xs italic text-[#646464] font-light">
        <p>{message}</p>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
