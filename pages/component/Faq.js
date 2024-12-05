// src/FAQ.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../animation/Fade';





const DetailItem = ({ question, answer }) => (
  <motion.details
  variants={fadeIn("up", 0.2)}
              initial={"hidden"}
              
              whileInView={"show"}
              viewport={{once:false, amount:0.1}}
  className="group [&_summary::-webkit-details-marker]:hidden">
    <summary
      className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-sky-100 dark:bg-[#12122B] p-4 hover:bg-sky-50 text-gray-900 dark:text-slate-100"
    >
      <h2 className="font-medium">{question}</h2>

      <svg
        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="mt-4 px-4 leading-relaxed text-gray-700 dark:text-[#c0c0c0]">{answer}</p>
  </motion.details>
);

const FAQ = () => (
  <section id="faq" className="pt-36 font-sans  w-full mx-auto pb-96 ">
    <div className="space-y-4 ">
      <DetailItem 
        question="What services do you offer as a UI/UX Designer?"
        answer="I offer a range of services including user research, wireframing, prototyping, user interface design, user experience design, and usability testing. My goal is to create intuitive and engaging digital experiences that meet both user needs and business objectives."
      />
      <DetailItem 
        question="What is your experience with blockchain technology?"
        answer="As a blockchain validator, I have extensive experience in setting up and maintaining blockchain nodes, validating transactions, and ensuring the security and integrity of the blockchain network. I am familiar with various blockchain protocols and consensus mechanisms."
      />
      <DetailItem 
        question="What tools do you use for UI/UX design?"
        answer="I use various design tools such as Figma, Sketch, Adobe XD, and InVision for creating wireframes, prototypes, and final designs. Additionally, I use tools like Miro and FigJam for collaborative work and user research."
      />
      <DetailItem 
        question="How do you ensure the security of blockchain transactions?"
        answer="I follow best practices for blockchain security, including implementing robust cryptographic techniques, regularly updating software, monitoring the network for suspicious activities, and following guidelines provided by blockchain protocols to ensure the security and integrity of transactions."
      />
    </div>
  </section>
);

export default FAQ;