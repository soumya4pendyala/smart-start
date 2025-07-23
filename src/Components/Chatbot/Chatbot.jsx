/* eslint-disable no-unused-vars */
import { Bot, Send, X } from "lucide-react";
import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import { currentUser } from "../../mockData";

// AI Chatbot Component
const API_URL = 'http://127.0.0.1:8000';
const Chatbot = ({ openCabModal, openITModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef(null);
    const [sessionId] = useState(`session_${Date.now()}`);
    const [toolData, setToolData] = useState(null);
    const [toolValues, setToolValues] = useState(null);


    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 1,
                sender: 'bot',
                text: `Hi ${currentUser.name}! I'm your onboarding assistant. How can I help? You can ask about policies, or ask me to "book a cab" or "raise an IT ticket".`
            }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setTimeout(() => handleBotResponse(inputValue), 1000);
    };

    const handleBotResponse = async (userInput) => {
        const messageText = userInput.toLowerCase();
         let botResponseText = "I'm sorry, I'm not sure how to help with that. Try asking about HR policies, booking a cab, or raising an IT ticket.";

        // if (lowerCaseInput.includes("book a cab")) {
        //     botResponseText = "Of course. I can help you book a cab. Please fill out the details in the form that just appeared.";
        //     openCabModal();
        // } else if (lowerCaseInput.includes("it ticket") || lowerCaseInput.includes("it request")) {
        //     botResponseText = "I can certainly help with that. Please describe your IT issue in the form that just opened.";
        //     openITModal();
        // } else if (lowerCaseInput.includes("hr policies") || lowerCaseInput.includes("leave policy")) {
        //     botResponseText = "You can find all HR documents, including the leave policy, in the 'Documents' section. Our standard leave policy includes 25 days of paid vacation and 10 sick days annually.";
        // } else if (lowerCaseInput.includes("manager")) {
        //     botResponseText = `Your manager is ${currentUser.manager}. You can find their contact details in the 'My Team' section. I recommend scheduling a 1-on-1 with them soon!`;
        // } else if (lowerCaseInput.includes("project")) {
        //     botResponseText = `You are assigned to the ${currentUser.team}. You can find project-specific documents in the 'Documents' hub. A good starting point is the 'Project Phoenix Architecture Overview'.`;
        // }

        try {
            const response = await axios.post(`${API_URL}/chat`, {
                message: messageText,
                sessionId: sessionId
               // tool_values: toolValues || {}, // Send data from our modal form
            },{
        headers: {
            "Content-Type": "application/json"
            }
        }
);

            const botResponse = response.data;

            if (botResponse.action_required) {
                // Backend needs more info, so we open a modal
              //  setActiveModal(botResponse.tool_name);
            var tool_name=botResponse.tool_name
        if (tool_name.includes("book_cab")) {
            botResponseText = "Of course. I can help you book a cab. Please fill out the details in the form that just appeared.";
            openCabModal();
        } else if (tool_name.includes("create_ticket") || lowerCaseInput.includes("it request")) {
            botResponseText = "I can certainly help with that. Please describe your IT issue in the form that just opened.";
            openITModal();
         }// else if (lowerCaseInput.includes("hr policies") || lowerCaseInput.includes("leave policy")) {
        //     botResponseText = "You can find all HR documents, including the leave policy, in the 'Documents' section. Our standard leave policy includes 25 days of paid vacation and 10 sick days annually.";
        // } else if (lowerCaseInput.includes("manager")) {
        //     botResponseText = `Your manager is ${currentUser.manager}. You can find their contact details in the 'My Team' section. I recommend scheduling a 1-on-1 with them soon!`;
        // } else if (lowerCaseInput.includes("project")) {
        //     botResponseText = `You are assigned to the ${currentUser.team}. You can find project-specific documents in the 'Documents' hub. A good starting point is the 'Project Phoenix Architecture Overview'.`;
        // 

                setToolData({
                    fields: botResponse.required_fields,
                    messageOnSubmit: messageText
                });
        const botMessage = {
            id: Date.now() + 1,
            sender: 'bot',
            text: botResponseText,
        };
        setMessages(prev => [...prev, botMessage]);
            } else {
                // Normal bot response
                setMessages(prev => [...prev, { id: Date.now() + 1,sender: 'bot', text: botResponse.response }]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
        }
        
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white rounded-full p-4 shadow-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                    aria-label="Open Chat"
                >
                    <Bot className="h-8 w-8" />
                </button>
            </div>
            <div className={`fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[70vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center">
                        <Bot className="h-6 w-6 mr-2" style={{color: "#11b67a"}}/>
                        <h3 className="font-semibold">AI Assistant</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="h-6 w-6" />
                    </button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                </div>
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-green-500 focus:border-green-500 rounded-full py-2 px-4"
                        />
                        <button type="submit" className="ml-3 bg-green-600 text-white rounded-full p-3 hover:bg-green-700 disabled:bg-slate-300" disabled={!inputValue.trim()}>
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot