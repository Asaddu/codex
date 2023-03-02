from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
import sqlite3
from sqlite3 import Error
import os

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

def create_connection():
    conn = None;
    try:
        conn = sqlite3.connect('conversation_history.db')
        print(f'successful connection to database: {sqlite3.version}')
    except Error as e:
        print(e)
        
    return conn

def create_table():
    conn = create_connection()
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS conversation_history")
    cur.execute("""
        CREATE TABLE conversation_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

create_table()

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Hello from LinguiCode'})

@app.route('/', methods=['POST'])
def generate_text():
    try:
        prompt = request.json['prompt']

        # Get the conversation history from the database
        conn = create_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM conversation_history")
        rows = cur.fetchall()
        conversation_history = [{"role": row[1], "content": row[2]} for row in rows]

        # Add the prompt to the conversation history
        conversation_history.append({"role": "user", "content": prompt})

        # Construct messages list for OpenAI API
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
        ]
        for message in conversation_history:
            messages.append({"role": message['role'], "content": message['content']})
        
        # Call OpenAI API to get response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=3000,
            n=1,
            stop=None,
            temperature=0.5
        )

        # Extract bot response from API response
        bot_response = response.choices[0].message['content']

        # Add the bot response to the conversation history
        conversation_history.append({"role": "assistant", "content": bot_response})

        # Store conversation history in the database
        conn = create_connection()
        cur = conn.cursor()
        for message in conversation_history:
            cur.execute(f"INSERT INTO conversation_history (role, content) VALUES (?, ?)", (message['role'], message['content']))
        conn.commit()
        conn.close()

        # Print conversation history
        print('Conversation history:')
        for message in conversation_history:
            print(f'{message["role"]}: {message["content"]}')

        # Return bot response and conversation history as JSON
        return jsonify({'bot': bot_response, 'conversation': conversation_history})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
