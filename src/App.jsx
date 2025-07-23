import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, CheckSquare, User, FileText, Settings, Bot, X, Send, Building, Phone, Mail, Clock } from 'lucide-react';
import axios from 'axios';

// Mock Data - In a real application, this would come from an API
const currentUser = {
  name: 'Alex',
  role: 'Software Engineer',
  manager: 'Jane Smith',
  managerInitials: 'JS',
  team: 'Phoenix Team',
  joinDate: 'July 22, 2025',
};

const onboardingTasks = [
  { id: 1, text: 'Complete HR paperwork in Workday', completed: true, day: 1 },
  { id: 2, text: 'Set up your development environment', completed: true, day: 1 },
  { id: 3, text: 'Schedule a 1:1 introduction with your manager', completed: false, day: 2 },
  { id: 4, text: 'Attend company orientation session', completed: false, day: 2 },
  { id: 5, text: 'Review the team\'s project documentation', completed: false, day: 3 },
];

const teamMembers = [
  { id: 1, name: 'Jane Smith', role: 'Engineering Manager', email: 'jane.s@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Bob Johnson', role: 'Senior Software Engineer', email: 'bob.j@example.com', phone: '123-456-7891' },
  { id: 3, name: 'Charlie Brown', role: 'Product Manager', email: 'charlie.b@example.com', phone: '123-456-7892' },
  { id: 4, name: 'Diana Prince', role: 'UX/UI Designer', email: 'diana.p@example.com', phone: '123-456-7893' },
];

const documents = [
  { id: 1, name: 'Employee Handbook', category: 'HR', url: '#' },
  { id: 2, name: 'IT Security Policy', category: 'IT', url: '#' },
  { id: 3, name: 'Project Phoenix Architecture Overview', category: 'Project', url: '#' },
  { id: 4, name: '2025 Holiday Calendar', category: 'HR', url: '#' },
  { id: 5, name: 'Expense Reimbursement Guide', category: 'Finance', url: '#' },
];

const quickLinks = [
    {id: 1, name: 'Company Directory', url: '#'},
    {id: 2, name: 'IT Helpdesk Portal', url: '#'},
    {id: 3, name: 'Performance Reviews', url: '#'},
]

// Main App Component
export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [showCabModal, setShowCabModal] = useState(false);
  const [showITModal, setShowITModal] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Dashboard />;
      case 'team':
        return <TeamDirectory />;
      case 'docs':
        return <DocumentHub />;
      // For simplicity, 'tasks' and 'settings' can show the dashboard or a placeholder
      case 'tasks':
         return <OnboardingChecklistPage />;
      case 'settings':
         return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {renderPage()}
      </main>
      <Chatbot 
        openCabModal={() => setShowCabModal(true)}
        openITModal={() => setShowITModal(true)}
      />
      {showCabModal && <CabBookingModal closeModal={() => setShowCabModal(false)} />}
      {showITModal && <ITTicketModal closeModal={() => setShowITModal(false)} />}
    </div>
  );
}

// Sidebar Navigation
const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'team', icon: User, label: 'My Team' },
    { id: 'docs', icon: FileText, label: 'Documents' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="w-20 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-5">
      <a href="#" className="mb-10">
        <Bot className="h-9 w-9 text-white bg-indigo-600 p-1.5 rounded-lg" />
      </a>
      <ul className="flex-1 flex flex-col items-center space-y-4">
        {navItems.map(item => (
          <li key={item.id}>
            <a
              href="#"
              title={item.label}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.id);
              }}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                activePage === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:bg-indigo-50 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon className="h-6 w-6" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Dashboard / Home Page
const Dashboard = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Welcome, {currentUser.name}!</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 mb-8">Here's your onboarding summary for today.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <OnboardingChecklistCard />
                    <QuickLinksCard />
                </div>
                <div className="lg:col-span-1">
                    <ManagerCard />
                </div>
            </div>
        </div>
    );
};

// Dashboard Cards
const OnboardingChecklistCard = () => {
    const [tasks, setTasks] = useState(onboardingTasks);
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const remainingTasks = totalTasks - completedTasks;

    const toggleTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Onboarding Checklist</h2>
            
            <div className="flex items-center mb-4">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="ml-4 font-semibold text-indigo-600 dark:text-indigo-400">{progress}%</span>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">You have {remainingTasks} tasks remaining. Keep up the great work!</p>

            <ul className="space-y-3">
                {tasks.slice(0, 3).map(task => ( // Show first 3 tasks
                    <li key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <div className="flex items-center">
                            <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-500'}`}>
                                {task.completed && <CheckSquare className="w-4 h-4 text-white" />}
                            </button>
                            <span className={`ml-3 ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.text}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-400 dark:text-slate-500">
                            <Clock className="w-4 h-4 mr-1.5" />
                            Day {task.day}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ManagerCard = () => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-semibold mb-4 text-left">Your Manager</h2>
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-300">{currentUser.managerInitials}</span>
        </div>
        <h3 className="text-lg font-semibold">{currentUser.manager}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Engineering Manager</p>
        <a href={`mailto:${teamMembers.find(m => m.name === currentUser.manager)?.email}`} className="w-full bg-indigo-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            Send an Email
        </a>
    </div>
);

const QuickLinksCard = () => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <ul className="space-y-2">
            {quickLinks.map(link => (
                <li key={link.id}>
                    <a href={link.url} className="flex items-center justify-between p-3 rounded-lg text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-slate-700/50">
                        <span>{link.name}</span>
                        <span>&rarr;</span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
)


// Full page for Onboarding Checklist
const OnboardingChecklistPage = () => {
    const [tasks, setTasks] = useState(onboardingTasks);

    const toggleTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Your Onboarding Checklist</h1>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm">
                <ul className="space-y-4">
                    {tasks.map(task => (
                        <li key={task.id} className="flex items-center p-3 rounded-md transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <input
                                type="checkbox"
                                id={`task-${task.id}`}
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`task-${task.id}`} className={`ml-4 text-md flex-1 cursor-pointer ${task.completed ? 'line-through text-slate-500' : ''}`}>
                                {task.text}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Team Directory Page
const TeamDirectory = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Team Directory</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map(member => (
                <div key={member.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm text-center">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto flex items-center justify-center mb-4">
                        <User className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-indigo-500 dark:text-indigo-400 text-sm mb-4">{member.role}</p>
                    <div className="text-left text-sm space-y-2 text-slate-600 dark:text-slate-300">
                        <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-slate-400"/> {member.email}</p>
                        <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-slate-400"/> {member.phone}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Document Hub Page
const DocumentHub = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Document Hub</h1>
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {documents.map(doc => (
                    <li key={doc.id} className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-semibold">{doc.name}</p>
                            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 rounded-full">{doc.category}</span>
                        </div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                            View
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// Settings Page Placeholder
const SettingsPage = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm">
            <p>Settings page is under construction. Here you will be able to manage your profile and notification preferences.</p>
        </div>
    </div>
);


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
                    className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Open Chat"
                >
                    <Bot className="h-8 w-8" />
                </button>
            </div>
            <div className={`fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[70vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center">
                        <Bot className="h-6 w-6 text-indigo-500 mr-2" />
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
                            className="flex-1 bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-indigo-500 focus:border-indigo-500 rounded-full py-2 px-4"
                        />
                        <button type="submit" className="ml-3 bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 disabled:bg-indigo-300" disabled={!inputValue.trim()}>
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

// Modal Components for Chatbot Actions
const Modal = ({ children, title, closeModal }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="h-6 w-6" />
                </button>
            </header>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

const CabBookingModal = ({ closeModal }) => (
    <Modal title="Book a Cab" closeModal={closeModal}>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="pickup" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pickup Location</label>
                <input type="text" id="pickup" defaultValue="Company Office" onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="dropoff" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Drop-off Location</label>
                <input type="text" id="dropoff" placeholder="e.g., 123 Main St, Anytown" onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pickup Time</label>
                <input type="datetime-local" id="time" onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={closeModal} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 mr-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700">Request Cab</button>
            </div>
        </form>
    </Modal>
);

const ITTicketModal = ({ closeModal }) => (
    <Modal title="Raise an IT Ticket" closeModal={closeModal}>
        <form className="space-y-4">
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select id="category" className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option>Hardware Issue</option>
                    <option>Software Access</option>
                    <option>Network Problem</option>
                    <option>Account/Login Issue</option>
                </select>
            </div>
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input type="text" id="subject" placeholder="e.g., Cannot connect to VPN" className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea id="description" rows="4" placeholder="Please provide as much detail as possible..." className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={closeModal} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 mr-2">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700">Submit Ticket</button>
            </div>
        </form>
    </Modal>
);
