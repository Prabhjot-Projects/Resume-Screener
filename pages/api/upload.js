import formidable from "formidable";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const config = {
  api: {
    bodyParser: false,  // Disable default body parsing
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, _, files) => {
    if (err) return res.status(500).json({ message: "Upload failed", error: err });

    const file = files.file[0];
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = path.join(form.uploadDir, file.originalFilename);
    fs.renameSync(file.filepath, filePath);

    // Extract text from the uploaded file (PDF or DOCX)
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      try {
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;

        // Process extracted resume text for skills, name, etc.
        const skills = extractSkills(resumeText);
        const name = extractName(resumeText);

        // Return the extracted data
        res.status(200).json({
          message: "PDF file uploaded and processed successfully",
          filePath: `/uploads/${file.originalFilename}`,
          skills: skills,
          name: name,
        });

      } catch (error) {
        return res.status(500).json({ message: "Error extracting PDF text", error: error.message });
      }

    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      try {
        const data = await mammoth.extractRawText({ path: filePath });
        const resumeText = data.value;

        // Process extracted resume text for skills, name, etc.
        const skills = extractSkills(resumeText);
        const name = extractName(resumeText);

        // Return the extracted data
        res.status(200).json({
          message: "DOCX file uploaded and processed successfully",
          filePath: `/uploads/${file.originalFilename}`,
          skills: skills,
          name: name,
        });

      } catch (error) {
        return res.status(500).json({ message: "Error extracting DOCX text", error: error.message });
      }

    } else {
      res.status(400).json({ message: "Only PDF and DOCX files are supported." });
    }
  });
}

// Example function to extract skills (you can improve this with regex or NLP libraries)
function extractSkills(text) {
  const skills = ["JavaScript", "React", "Node.js", "Python"];  // Sample skill list
  return skills.filter(skill => text.includes(skill));
}

// Example function to extract name (simple placeholder)
function extractName(text) {
  const nameMatch = text.match(/[A-Z][a-z]*\s[A-Z][a-z]*/);  // Simple regex for name (this is a placeholder)
  return nameMatch ? nameMatch[0] : "Unknown Name";
}