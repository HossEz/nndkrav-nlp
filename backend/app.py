from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")

nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
CORS(app)

CATEGORIES = {
    "safety": ["safety", "secure", "risk"],
    "environment": ["environment", "sustainable", "emission"],
    "reporting": ["report", "document", "record"],
}

def categorize_requirement(text):
    for category, keywords in CATEGORIES.items():
        if any(keyword in text.lower() for keyword in keywords):
            return category
    return "other"

def identify_conflicts(requirements):
    conflicts = []
    for i in range(len(requirements)):
        for j in range(i + 1, len(requirements)):
            if "not" in requirements[i].lower() and "not" not in requirements[j].lower():
                conflicts.append((requirements[i], requirements[j]))
            elif "not" in requirements[j].lower() and "not" not in requirements[i].lower():
                conflicts.append((requirements[i], requirements[j]))
    return conflicts

@app.route("/process", methods=["POST"])
def process_text():
    data = request.json
    text = data.get("text")

    doc = nlp(text)
    requirements = [sent.text for sent in doc.sents if "shall" in sent.text or "must" in sent.text]

    categorized_requirements = [
        {"text": req, "category": categorize_requirement(req)} for req in requirements
    ]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(requirements)
    similarity_matrix = cosine_similarity(tfidf_matrix)

    conflicts = identify_conflicts(requirements)

    return jsonify({
        "requirements": categorized_requirements,
        "similarity_matrix": similarity_matrix.tolist(),
        "conflicts": conflicts,
    })

if __name__ == "__main__":
    app.run(debug=True)