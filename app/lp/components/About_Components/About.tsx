import AboutAccess from "./AboutAccess";
import AboutTeam from "./AboutTeam";
import AboutTitle from "./AboutTitle";
import Recruitment from "../Recruite/Recruitment";

const About = () => {
  return (
    <div className="h-auto px-4">
      <AboutTitle />
      <AboutAccess />
      <AboutTeam />
      <Recruitment />
    </div>
  );
};

export default About;
