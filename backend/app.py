from flask import Flask, request, jsonify
from flask_cors import CORS
from main import get_legal_response

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        query = data.get("query")

        print("Received query:", query)

        result = get_legal_response(query)

        print("Generated result:", result)

        return jsonify({"response": result})

    except Exception as e:
        print("❌ ERROR:", str(e))   # 👈 VERY IMPORTANT
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)