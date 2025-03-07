import { useState } from "react";
import Navbar from "../components/Navbar";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [jobDescription, setJobDescription] = useState(""); // State for job description
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();  // Get response data

      if (response.ok) {
        setExtractedData(data);  // Set the extracted data in the state
        alert("File uploaded and processed successfully!");
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleCompare = () => {
    if (!jobDescription || !extractedData) return;

    // Convert resume skills to lowercase and split them into an array of skills
    const resumeSkills = extractedData.skills.map(skill => skill.toLowerCase().trim());

    // Convert job description into an array of skills, cleaning it up
    const jobSkills = jobDescription
      .toLowerCase()
      .split(/\s*,\s*/g)
      .map(skill => skill.trim());

    let matchCount = 0;

    // Count how many skills from the resume match job description
    resumeSkills.forEach((skill) => {
      if (jobSkills.includes(skill)) {
        matchCount++;
      }
    });

    // Calculate the match percentage
    const matchPercentage = (matchCount / jobSkills.length) * 100;

    setComparisonResult(matchPercentage);
  };

  return (
    <div>
      <Navbar />
      <h1>Upload Your Resume</h1>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}

      {extractedData && (
        <div>
          <h2>Extracted Data:</h2>
          <p><strong>Name:</strong> {extractedData.name}</p>
          <p><strong>Skills:</strong> {extractedData.skills.join(", ")}</p>
          <p><strong>File Path:</strong> {extractedData.filePath}</p>
        </div>
      )}

      <div>
        <h2>Enter Job Description</h2>
        <textarea
          rows="10"
          cols="50"
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Paste job description here"
        />
      </div>

      <button onClick={handleCompare} disabled={!jobDescription || !extractedData}>
        Compare Resume with Job Description
      </button>

      {comparisonResult !== null && (
        <div>
          <h2>Comparison Result</h2>
          <p>Match Percentage: {comparisonResult.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}