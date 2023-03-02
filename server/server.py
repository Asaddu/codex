from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Hello from LinguiCode'})

@app.route('/', methods=['POST'])
def generate_text():
    try:
        prompt = request.json['prompt']
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000,
            n=1,
            stop=None,
            temperature=0
        )
        return jsonify({'bot': response.choices[0].message['content']})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)