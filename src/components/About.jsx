import { useNavigate } from "react-router-dom";

function About() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>About Us</h1>
            <p>Learn more about our company and mission.</p>
            <button onClick={() => navigate("/Home")}>View Home</button>
        </div>
    );
}
export default About;
