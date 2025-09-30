import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex flex-1 justify-center items-center">
    <div className="bg-transparent text-black p-10 rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4 text-center">✨ Welcome to CrewControl ✨</h1>
      <p className="mb-6">Streamline your workflow with a complete user management solution. <br />
        Get secure authentication and full CRUD capabilities, all managed from one intuitive dashboard. <br /> 
         Stop wrestling with complex systems and take control of your user base in minutes. <br />  
        Your users, your control—made simple.</p>
      <div className="flex justify-center space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-500 text-white rounded-lg">Login</Link>
        <Link to="/signup" className="px-6 py-2 bg-green-500 text-white rounded-lg">Sign Up</Link>
      </div>
    </div>
  </div>
);

export default Home;
