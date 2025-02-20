import React, { useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import backgroundImage from './images/background.jpg';

const PredictForm = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    bglevel: "",
    drugs: "",
    sittingtime: "",
    incomelevel: "",
    veginon: "",
    teaprefer: "",
    healthcon: "",
    pregnancystatus: "",
  });

  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef();

  const styles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Automatically set pregnancy status to "No" for males
      if (name === "gender" && value === "Male ") {
        updatedData.pregnacystatus = "No";
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      setPredictions(response.data);
      setError(null);
    } catch (err) {
      setPredictions(null);
      setError(err.response ? err.response.data.error : "An error occurred");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => resultRef.current,
    documentTitle: "Diabetic Meal Plan",
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
    `,
  });

 const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("Arial");
    doc.setFontSize(12);

    let currentY = 20; // Starting Y position
    const marginLeft = 20;
    const pageWidth = 180; // Adjusting page width to leave some margin

    // Title Section with color
    doc.setTextColor(0, 102, 204); // Blue color for the title
    doc.text("Personalized Meal Plan & Calorie Burnt Recommendation", marginLeft, currentY);
    currentY += 10;

    doc.setTextColor(0, 102, 204); // Blue color for subtitle
    doc.text("For Type 2 Diabetes", marginLeft, currentY);
    currentY += 10;

    doc.setTextColor(0, 0, 0); // Black color for the line
    doc.text("==========================================", marginLeft, currentY);
    currentY += 10;

    // Meal Plan with color
    doc.setTextColor(255, 87, 34); // Orange color for 'Meal Plan'
    doc.text(`Meal Plan: ${predictions["Meal Plan"]}`, marginLeft, currentY);
    currentY += 10;

    // Breakfast with color
    doc.setTextColor(0, 153, 51); // Green color for 'Breakfast'
    doc.text(`Get up Time: ${predictions["Morning"]?.split(',').join(', ')}`, marginLeft, currentY);
    currentY += 10;

    const breakfastText = `Breakfast: ${predictions["Breakfast"]?.split(',').join(', ')}`;
    const breakfastLines = doc.splitTextToSize(breakfastText, pageWidth);
    doc.setTextColor(0, 0, 0); // Black color for content
    doc.text(breakfastLines, marginLeft, currentY);
    currentY += breakfastLines.length * 6;

    // Mid Morning with color
    doc.setTextColor(255, 87, 34); // Orange color for 'Mid Morning'
    const midmorningText = `Mid Morning: ${predictions["Mid Morning"]?.split(',').join(', ')}`;
    const midmorningLines = doc.splitTextToSize(midmorningText, pageWidth);
    doc.text(midmorningLines, marginLeft, currentY);
    currentY += midmorningLines.length * 6;

    // Lunch with color
    doc.setTextColor(0, 153, 51); // Green color for 'Lunch'
    const lunchText = `Lunch: ${predictions["Lunch"]?.split(',').join(', ')}`;
    const lunchLines = doc.splitTextToSize(lunchText, pageWidth);
    doc.text(lunchLines, marginLeft, currentY);
    currentY += lunchLines.length * 6;

    // Mid Evening with color
    doc.setTextColor(0, 102, 204); // Blue color for 'Mid Evening'
    doc.text(`Mid Evening: ${predictions["Mid Evening"]?.split(',').join(', ')}`, marginLeft, currentY);
    currentY += 10;

    // Dinner with color
    doc.setTextColor(255, 87, 34); // Orange color for 'Dinner'
    const dinnerText = `Dinner: ${predictions["Dinner"]?.split(',').join(', ')}`;
    const dinnerLines = doc.splitTextToSize(dinnerText, pageWidth);
    doc.text(dinnerLines, marginLeft, currentY);
    currentY += dinnerLines.length * 6;

    // Water Intake with color
    doc.setTextColor(0, 153, 51); // Green color for 'Water Intake'
    doc.text(`Water Intake: ${predictions["WaterIntake"]}`, marginLeft, currentY);
    currentY += 10;

    // Calorie Burn with color
    doc.setTextColor(255, 87, 34); // Orange color for 'Calorie Burn'
    doc.text(`Calorie Burn: ${predictions["calorie_burn"]}`, marginLeft, currentY);
    currentY += 10;

    // Guideline with color
    doc.setTextColor(0, 102, 204); // Blue color for 'Guideline'
    const guidelineText = `Guideline: ${predictions["Guidline"]?.split(',').join(', ')}`;
    const guidelineLines = doc.splitTextToSize(guidelineText, pageWidth);
    doc.text(guidelineLines, marginLeft, currentY);
    currentY += guidelineLines.length * 6;

    // Special note with color
    doc.setTextColor(0, 0, 0); // Black color for 'Special Note'
    doc.text("Special Note: Mandatory for follow-up with your doctor's prescribed medicine.", marginLeft, currentY);
    currentY += 10;

    // Save PDF
    doc.save("meal_plan.pdf");
 };




  return (

  <div className="predict-form-container">
    <div className="predict-form-heading">
            <h2>Personalized </h2>
             <h2>Meal Plan & Calorie Burnt Recommendation</h2>
              <h2>For Type 2 diabetes</h2>
    </div>
   <div className="meal-predict-form">
     <h1>Own Meal Plan Generator</h1>
     <form onSubmit={handleSubmit} className="predict-form">
       <div className="form-groupmain">
       <div className="form-group2">
         <label htmlFor="gender">Gender</label>
         <select name="gender" id="gender" onChange={handleChange}>
           <option value="">Select Gender</option>
           <option value="Male ">Male</option>
           <option value="Female ">Female</option>
         </select>
       </div>
       <div className="form-group2">
         <label htmlFor="age">Age</label>
          <select name="age" id="age" onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="10 Age - 20 Age">10 Age - 20 Age</option>
                    <option value="21 Age - 59Age">21 Age - 59Age</option>
                    <option value="60 Above">60 Above</option>
                  </select>
       </div>

       </div>
       <div className="form-groupmain">
       <div className="form-group2">
         <label htmlFor="bglevel">Blood Glucose Level</label>
      <select name="bglevel" id="bglevel" onChange={handleChange}>
                 <option value="">Select Gender</option>
                 <option value="100 - 125">100 - 125 (mg/dL)</option>
                 <option value="126 - 350 ">126 - 350 (mg/dL)</option>
                 <option value="350 above ">350 above (mg/dL)</option>
               </select>
       </div>
       <div className="form-group2">
         <label htmlFor="drugs">Drugs</label>
         <select name="drugs" id="drugs" onChange={handleChange}>
           <option value="">Select Drug</option>
           <option value="Tablet">Tablet</option>
           <option value="Insulin">Insulin</option>
         </select>
       </div>

      </div>
      <div className="form-groupmain">
       <div className="form-group2">
         <label htmlFor="sittingtime">Sitting Time (hours)</label>
          <select name="sittingtime" id="sittingtime" onChange={handleChange}>
                     <option value="">Select Gender</option>
                     <option value="Less than 5 hours">Less than 5 hours</option>
                     <option value="More than 5 hours">More than 5 hours</option>
                   </select>
       </div>
       <div className="form-group2">
         <label htmlFor="incomelevel">Income Level</label>
         <select name="incomelevel" id="incomelevel" onChange={handleChange}>
           <option value="">Select Income Level</option>
           <option value="Middle Level ">Middle Level </option>
           <option value="High Level ">High Level</option>
         </select>
       </div>
       </div>
       <div className="form-groupmain">
       <div className="form-group2">
         <label htmlFor="veginon">Vegetarian/Non-Vegetarian</label>
         <select name="veginon" id="veginon" onChange={handleChange}>
           <option value="">Select Preference</option>
           <option value="Non Vegi">Non-Vegetarian</option>
           <option value="Vegi">Vegetarian</option>
         </select>
       </div>
       <div className="form-group2">
         <label htmlFor="teaprefer">Having Milk Tea</label>
         <select name="teaprefer" id="teaprefer" onChange={handleChange}>
           <option value="">Select Preference</option>
           <option value="Having Milk Tea">Having Milk Tea</option>
           <option value="Having Plain Tea or Plain Coffee">Having Plain Tea or Plain Coffee</option>
           <option value="Not Having anything">Not Having anything</option>
         </select>
       </div>
       </div>
<div className="form-groupmain">
  <div className="form-group2">
    <label htmlFor="healthcon">Health Condition</label>
    <select name="healthcon" id="healthcon" onChange={handleChange}>
      <option value="">Select Health Condition</option>
      <option value="Not Applicable">Not Applicable</option>
      <option value="Kidney Problem ">Kidney Problem</option>
      <option value="Cholesterol">Cholesterol</option>
    </select>
  </div>

  {formData.gender === 'Female ' && (
    <div className="form-group2">
      <label htmlFor="pregnacystatus">Pregnancy Status</label>
      <select name="pregnacystatus" id="pregnacystatus" onChange={handleChange}>
        <option value="">Select Status</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  )}

  {formData.gender !== 'Male ' && formData.pregnacystatus === 'No' && (
    <p>Pregnancy Status: No</p>
  )}
</div>
                 <div className="submit-button2-con">
       <button type="submit" className="submit-button2">Get Your Meal Plan</button>
       </div>
     </form>
   </div>



      {predictions && (
        <div className="result-container" ref={resultRef} style={styles}>
        <button onClick={generatePDF}>Download PDF</button>
          <h2>Your Meal Plan</h2>
          <div className="prediction">
            <h3><strong>Meal Plan:</strong> </h3>
            <p>{predictions["Meal Plan"]}</p>
          </div>
          <div className="prediction">
            <h3><strong>Breakfast:</strong> </h3>
            {predictions["Morning"]?.split(',').map((item, index) => (
                <p key={index}>- {item.trim()}</p>
              ))}
          </div>

          <div className="prediction">
                      <h3><strong>Breakfast:</strong> </h3>
                      {predictions["Breakfast"]?.split(',').map((item, index) => (
                          <p key={index}>- {item.trim()}</p>
                        ))}
                    </div>

          <div className="prediction">
            <h3><strong>Mid Morning:</strong> </h3>
            {predictions["Mid Morning"]?.split(',').map((item, index) => (
                            <p key={index}>{item.trim()}</p>
                          ))}

          </div>
          <div className="prediction">
            <h3><strong>Lunch:</strong> </h3>
            {predictions["Lunch"]?.split(',').map((item, index) => (
                                        <p key={index}>- {item.trim()}</p>
                                      ))}
          </div>
          <div className="prediction">
            <h3><strong>Mid Evening:</strong> </h3>
            {predictions["Mid Evening"]?.split(',').map((item, index) => (
                                        <p key={index}>- {item.trim()}</p>
                                      ))}
          </div>
          <div className="prediction">
            <h3><strong>Dinner:</strong> </h3>
            {predictions["Dinner"]?.split(',').map((item, index) => (
                                                    <p key={index}>- {item.trim()}</p>
                                                  ))}

          </div>
               <div className="prediction">
                           <h3><strong>Water Intake:</strong> </h3>
                           <p>{predictions["WaterIntake"]}</p>

                           <hr />
                         </div>


          <div className="prediction">
            <h3><strong>Calorie Burn:</strong> </h3>
            <p>{predictions["calorie_burn"]}</p>

            <hr />
          </div>

          <div className="prediction">
             <h3><strong>Guidline:</strong> </h3>
             {predictions["Guidline"]?.split(',').map((item, index) => (
             <p key={index}>- {item.trim()}</p>
              ))}
         </div>


          <div className="prediction">
                      <h3><strong>Special Note:</strong> </h3>
                      <p> Mandatory for follow up Your Doctors prescribed medicine with this Meal Plan </p>

                  </div>

        </div>

      )}

      {error && <h3 className="error-message">Error: {error}</h3>}
    </div>
  );
};

export default PredictForm;
