import React, { useState } from "react";
import axios from "axios";
import './App.css';  // Make sure to import the CSS file

const App = () => {
  const [inputData, setInputData] = useState({
    age: "",
    weight_kg: "",
    hormonal_imbalance: "",
    hyperandrogenism: "",
    hirsutism: "",
    conception_difficulty: "",
    insulin_resistance: "",
    exercise_frequency: "",
    exercise_type: "",
    exercise_duration: "",
    sleep_hours: "",
    exercise_benefit: "",
  });

  const [pcosResult, setPcosResult] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to Flask backend
      const response = await axios.post("http://localhost:5000/predict", inputData);

      // Handle successful response and display user-friendly message
      const result = response.data.PCOS;
      if (result === "Yes") {
        setPcosResult("You have PCOS");
      } else if (result === "No") {
        setPcosResult("You do not have PCOS");
      } else {
        setPcosResult("Unable to determine PCOS status");
      }
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Error predicting PCOS: " + err.message);
      setPcosResult(null); // Clear result on error
    }
  };

  return (
    <div className="container">
      <h1>PCOS Prediction</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Age: </label>
          <input
            type="text"
            name="age"
            value={inputData.age}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Weight (kg): </label>
          <input
            type="text"
            name="weight_kg"
            value={inputData.weight_kg}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Hormonal Imbalance: </label>
          <input
            type="text"
            name="hormonal_imbalance"
            value={inputData.hormonal_imbalance}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Hyperandrogenism: </label>
          <input
            type="text"
            name="hyperandrogenism"
            value={inputData.hyperandrogenism}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Hirsutism: </label>
          <input
            type="text"
            name="hirsutism"
            value={inputData.hirsutism}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Conception Difficulty: </label>
          <input
            type="text"
            name="conception_difficulty"
            value={inputData.conception_difficulty}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Insulin Resistance: </label>
          <input
            type="text"
            name="insulin_resistance"
            value={inputData.insulin_resistance}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Exercise Frequency: </label>
          <input
            type="text"
            name="exercise_frequency"
            value={inputData.exercise_frequency}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Exercise Type: </label>
          <input
            type="text"
            name="exercise_type"
            value={inputData.exercise_type}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Exercise Duration: </label>
          <input
            type="text"
            name="exercise_duration"
            value={inputData.exercise_duration}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Sleep Hours: </label>
          <input
            type="text"
            name="sleep_hours"
            value={inputData.sleep_hours}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Exercise Benefit: </label>
          <input
            type="text"
            name="exercise_benefit"
            value={inputData.exercise_benefit}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {pcosResult && (
        <div className="result">
          <h3>PCOS Prediction Result:</h3>
          <p>{pcosResult}</p>
        </div>
      )}

      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
