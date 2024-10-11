import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  Calendar as CalendarIcon, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  Video, 
  Edit, 
  Trash2,
  List,
  Bell
} from 'lucide-react';

const TaskItem = ({ task, onComplete, onDelete, onEdit, onDateChange, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    onEdit(task.id, editedTitle);
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-2 rounded-lg shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className={`w-full mr-2 p-1 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
        ) : (
          <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </span>
        )}
        <div className="text-sm text-gray-500 mt-1">
          Due: {task.dueDate ? task.dueDate.toDateString() : 'No due date'}
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <DatePicker
            selected={task.dueDate}
            onChange={(date) => onDateChange(task.id, date)}
            className={`p-1 border rounded mr-2 text-sm pl-8 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            dateFormat="MM/dd/yyyy"
          />
          <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
        {isEditing ? (
          <button
            onClick={handleEdit}
            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onComplete(task.id)}
          className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ListView = ({ tasks, events, darkMode, onComplete, onDelete, onEdit, onDateChange, handleQuickAction }) => {
  return (
    <div className={`mt-4 ${darkMode ? 'text-white' : ''}`}>
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {tasks.map(task => (
        <div key={task.id} className={`p-4 mb-2 rounded flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex-grow">
            <div className={`font-bold ${task.completed ? 'line-through' : ''}`}>{task.title}</div>
            <div className="text-sm text-gray-500">Due: {task.dueDate ? task.dueDate.toDateString() : 'No due date'}</div>
          </div>
          <div className="flex items-center">
            <DatePicker
              selected={task.dueDate}
              onChange={(date) => onDateChange(task.id, date)}
              className={`p-1 border rounded mr-2 text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
              dateFormat="MM/dd/yyyy"
            />
            <button
              onClick={() => onComplete(task.id)}
              className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button
              onClick={() => onEdit(task.id, prompt('Edit task:', task.title))}
              className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="mr-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <h2 className="text-xl font-bold mb-4 mt-8">Events</h2>
      {events.map((event, index) => (
        <div key={index} className={`p-4 mb-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="font-bold">{event.actionType}</div>
          <div>Patient: {event.patientName}</div>
          <div>Date: {event.date.toDateString()} {event.date.toLocaleTimeString()}</div>
          <div>Notes: {event.notes}</div>
        </div>
      ))}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleQuickAction('Schedule a Call')}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
        >
          <Video size={16} className="mr-1" /> Schedule Call
        </button>
        <button
          onClick={() => handleQuickAction('Send a Message')}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
        >
          <MessageCircle size={16} className="mr-1" /> Send Message
        </button>
        <button
          onClick={() => handleQuickAction('Call Patient')}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
        >
          <Phone size={16} className="mr-1" /> Call Patient
        </button>
      </div>
    </div>
  );
};

const QuickActionModal = ({ isOpen, onClose, onSubmit, actionType, eventToEdit }) => {
  const [patientName, setPatientName] = useState(eventToEdit ? eventToEdit.patientName : '');
  const [date, setDate] = useState(eventToEdit ? new Date(eventToEdit.date) : new Date());
  const [notes, setNotes] = useState(eventToEdit ? eventToEdit.notes : '');

  useEffect(() => {
    if (eventToEdit) {
      setPatientName(eventToEdit.patientName);
      setDate(new Date(eventToEdit.date));
      setNotes(eventToEdit.notes);
    } else {
      setPatientName('');
      setDate(new Date());
      setNotes('');
    }
  }, [eventToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      id: eventToEdit ? eventToEdit.id : undefined,
      patientName, 
      date, 
      notes, 
      actionType 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{actionType}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient Name"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Calendar = ({ tasks, events, currentDate, onChangeMonth, darkMode, onEditEvent, onDeleteEvent }) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => `empty-${i}`);

  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  const goToToday = () => {
    onChangeMonth(new Date());
  };

  return (
    <div className={`mt-4 ${darkMode ? 'text-white' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onChangeMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1"><ChevronLeft /></button>
        <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => onChangeMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1"><ChevronRight /></button>
      </div>
      <button onClick={goToToday} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Today
      </button>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {emptyDays.map((emptyDay) => (
          <div key={emptyDay} className="h-24"></div>
        ))}
        {days.map(day => (
          <div key={day} className={`border p-1 h-24 overflow-y-auto ${
            isCurrentMonth && day === today.getDate() ? 'bg-blue-100 dark:bg-blue-900' : ''
          } ${darkMode ? 'border-gray-700' : ''}`}>
            <div className="font-bold">{day}</div>
            {tasks
              .filter(task => task.dueDate && new Date(task.dueDate).getDate() === day && new Date(task.dueDate).getMonth() === currentDate.getMonth())
              .map(task => (
                <div key={task.id} className={`text-xs p-1 rounded mb-1 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>{task.title}</div>
              ))}
            {events
              .filter(event => new Date(event.date).getDate() === day && new Date(event.date).getMonth() === currentDate.getMonth())
              .map((event) => (
                <div 
                  key={event.id} 
                  className={`text-xs p-1 rounded mb-1 cursor-pointer ${
                    event.actionType === 'Schedule a Call' ? 'bg-green-200 dark:bg-green-800' :
                    event.actionType === 'Send a Message' ? 'bg-yellow-200 dark:bg-yellow-800' :
                    event.actionType === 'Call Patient' ? 'bg-red-200 dark:bg-red-800' :
                    'bg-purple-200 dark:bg-purple-800'
                  }`}
                  onClick={() => onEditEvent(event)}
                >
                  {event.patientName} - {event.actionType}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const EventItem = ({ event, onEdit, onDelete, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const handleEdit = () => {
    onEdit(event.id, editedEvent);
    setIsEditing(false);
  };

  return (
    <div className={`p-4 mb-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedEvent.patientName}
            onChange={(e) => setEditedEvent({...editedEvent, patientName: e.target.value})}
            className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
          <div className="flex items-center mb-2">
            <CalendarIcon className="mr-2" size={16} />
            <DatePicker
              selected={editedEvent.date}
              onChange={(date) => setEditedEvent({...editedEvent, date})}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className={`p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
            />
          </div>
          <textarea
            value={editedEvent.notes}
            onChange={(e) => setEditedEvent({...editedEvent, notes: e.target.value})}
            className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
          />
          <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      ) : (
        <div>
          <div className="font-bold">{event.actionType}</div>
          <div>Patient: {event.patientName}</div>
          <div>Date: {event.date.toDateString()} {event.date.toLocaleTimeString()}</div>
          <div>Notes: {event.notes}</div>
          <div className="mt-2">
            <button onClick={() => setIsEditing(true)} className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              <Edit size={16} />
            </button>
            <button onClick={() => onDelete(event.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskManagementApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks, (key, value) => {
        if (key === 'dueDate' && value) return new Date(value);
        if (key === 'dateAdded' && value) return new Date(value);
        return value;
      }));
    }
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        dateAdded: new Date(),
        dueDate: null
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const completeTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newTitle) => {
    if (newTitle) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      ));
    }
  };

  const changeDueDate = (id, newDate) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, dueDate: newDate } : task
    ));
  };

  const changeMonth = (newDate) => {
    setCurrentDate(new Date(newDate));
  };

  const handleQuickAction = (actionType) => {
    setCurrentAction(actionType);
    setModalOpen(true);
  };

  const handleModalSubmit = (eventData) => {
    const newEvent = { 
      ...eventData, 
      id: eventData.id || Date.now(),
      date: new Date(eventData.date)  // Ensure date is a Date object
    };
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(e => e.id !== newEvent.id);
      return [...updatedEvents, newEvent];
    });
  };

  const editEvent = (eventToEdit) => {
    setCurrentAction(eventToEdit.actionType);
    setModalOpen(true);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    if (sortBy === 'dateAdded') return b.dateAdded - a.dateAdded;
    if (sortBy === 'dueDate') return (a.dueDate || new Date(9999, 11, 31)) - (b.dueDate || new Date(9999, 11, 31));
    return 0;
  });

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className={`max-w-6xl mx-auto p-8 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Get 'Er Done</h1>
          <div className="flex items-center">
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              className={`mr-4 p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              {viewMode === 'calendar' ? <List size={24} /> : <CalendarIcon size={24} />}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-800'}`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="md:w-3/4">
            <div className="mb-4 flex justify-between items-center flex-wrap">
              <div className="mb-2 sm:mb-0">
                <label htmlFor="filter" className="mr-2">Filter:</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`p-2 border rounded w-36 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="mb-2 sm:mb-0">
                <label htmlFor="sort" className="mr-2">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`p-2 border rounded w-36 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
            </div>
            {viewMode === 'calendar' ? (
              <Calendar 
                tasks={sortedTasks}
                events={events}
                currentDate={currentDate} 
                onChangeMonth={changeMonth}
                darkMode={darkMode}
                onEditEvent={editEvent}
                onDeleteEvent={deleteEvent}
              />
            ) : (
              <div>
                {sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onDateChange={changeDueDate}
                    darkMode={darkMode}
                  />
                ))}
                {events.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onEdit={editEvent}
                    onDelete={deleteEvent}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/4 mt-4 md:mt-0">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickAction('Schedule a Call')}
                className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
              >
                <Video size={16} className="mr-2" /> Schedule Call
              </button>
              <button
                onClick={() => handleQuickAction('Send a Message')}
                className="w-full px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center"
              >
                <MessageCircle size={16} className="mr-2" /> Send Message
              </button>
              <button
                onClick={() => handleQuickAction('Call Patient')}
                className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" /> Call Patient
              </button>
              <button
                onClick={() => handleQuickAction('Create Reminder')}
                className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center"
              >
                <Bell size={16} className="mr-2" /> Create Reminder
              </button>
            </div>
          </div>
        </div>
        <QuickActionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          actionType={currentAction}
        />
      </div>
    </div>
  );
};

export default TaskManagementApp;