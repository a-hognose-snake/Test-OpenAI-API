"use client"; // Ensure this file is treated as a client-side component

import React, { useState } from 'react';

export default function Home() {
  // State to manage the conversation messages
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  // State to manage the input text
  const [input, setInput] = useState('');
  // State to manage the loading state of the button
  const [loading, setLoading] = useState(false);

  // Function to handle the AI query
  const askTheAI = async () => {
    if (input.trim()) {
      setLoading(true); // Set loading to true when the function is called
      try {
        // Make a POST request to the API
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: input }), // Send the input as the 'query' property in the body
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const data = await response.json();
        // Add the new messages to the conversation
        const newMessages = [
          ...messages,
          { sender: 'User', text: input },
          { sender: 'Assistant', text: data.response },
        ];

        setMessages(newMessages); // Update the messages state
        setInput(''); // Clear the input
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Container for conversation history */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-gray-500 text-xl font-bold mb-4 text-center">Conversation History</h2>
        <div className="h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-left">No messages.</p> // Show this if there are no messages
          ) : (
            messages.map((message, index) => (
              <div key={index} className="mb-4">
                <textarea
                  className="w-full p-2 mb-2 border rounded-lg resize-none focus:outline-none text-black bg-gray-200"
                  rows={Math.max(2, Math.ceil(message.text.length / 50))}
                  readOnly
                  value={`${message.sender}:\n${message.text}`}
                ></textarea>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Container for the input and button */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mb-6">
        <textarea
          className="w-full p-4 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          rows={6}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button
          className={`w-full py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          onClick={askTheAI}
          disabled={loading} // Disable the button when loading
        >
          {loading ? 'Asking the AI...' : 'Ask the AI'}
        </button>
      </div>
    </div>
  );
}
