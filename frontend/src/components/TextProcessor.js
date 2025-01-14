import React, { useState } from "react";
import axios from "axios";

const TextProcessor = () => {
  const [inputText, setInputText] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [similarityMatrix, setSimilarityMatrix] = useState([]);
  const [conflicts, setConflicts] = useState([]); // Ny state for konflikter

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/process", {
        text: inputText,
      });

      console.log("Response from backend:", response.data);

      setRequirements(response.data.requirements);
      setSimilarityMatrix(response.data.similarity_matrix);
      setConflicts(response.data.conflicts); // Lagre konflikter fra backend
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  return (
    <div>
      <h1>Kravuttrekking med AI</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Lim inn tekst her..."
          rows={10}
          cols={50}
        />
        <br />
        <button type="submit">Analyser tekst</button>
      </form>

      {requirements.length > 0 && (
        <div>
          <h2>Uttrukne Krav:</h2>
          <ul>
            {requirements.map((req, index) => (
              <li key={index}>
                {req.text} <strong>({req.category})</strong>
              </li>
            ))}
          </ul>

          <h2>Likhetsmatrise:</h2>
          <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}></th>
                {requirements.map((req, index) => (
                  <th key={index} style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>
                    Krav {index + 1} ({req.category})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {similarityMatrix.map((row, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>
                    <strong>Krav {i + 1} ({requirements[i].category})</strong>
                  </td>
                  {row.map((value, j) => (
                    <td key={j} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {conflicts.length > 0 && (
            <div>
              <h2>Konflikter:</h2>
              <ul>
                {conflicts.map((conflict, index) => (
                  <li key={index}>
                    <strong>Konflikt:</strong> "{conflict[0]}" vs "{conflict[1]}"
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextProcessor;