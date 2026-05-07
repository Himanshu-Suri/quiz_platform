const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Quiz = require('./models/Quiz');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Quiz.deleteMany({});
  console.log('Cleared old data');

  const hash = bcrypt.hashSync('password123', 10);

  const instructor = await User.create({
    name: 'Prof. Smith',
    email: 'instructor@test.com',
    password: hash,
    role: 'instructor'
  });

  await User.create([
    { name: 'Alice',   email: 'alice@test.com',   password: hash, role: 'student' },
    { name: 'Bob',     email: 'bob@test.com',     password: hash, role: 'student' },
    { name: 'Charlie', email: 'charlie@test.com', password: hash, role: 'student' }
  ]);
  console.log('Users created');

  await Quiz.create([
    {
      title: 'JavaScript Basics',
      description: 'Test your knowledge of JavaScript fundamentals',
      instructor: instructor._id,
      timeLimitSeconds: 600,
      isActive: true,
      passingScore: 60,
      maxAttempts: 3,
      questions: [
        { text: 'What is the output of typeof null?', options: ['null','object','undefined','string'], correctIndex: 1, marks: 1 },
        { text: 'Which method adds an element to the end of an array?', options: ['push()','pop()','shift()','unshift()'], correctIndex: 0, marks: 1 },
        { text: 'What does === check?', options: ['Only value','Only type','Value and type','Neither'], correctIndex: 2, marks: 1 },
        { text: 'What is a closure?', options: ['A loop','A function with access to outer scope','An array method','A CSS property'], correctIndex: 1, marks: 1 },
        { text: 'Which keyword declares a block-scoped variable?', options: ['var','let','both','none'], correctIndex: 1, marks: 1 }
      ]
    },
    {
      title: 'HTML & CSS Fundamentals',
      description: 'Core concepts of HTML and CSS',
      instructor: instructor._id,
      timeLimitSeconds: 480,
      isActive: true,
      passingScore: 50,
      maxAttempts: 2,
      questions: [
        { text: 'What does HTML stand for?', options: ['Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Logic','None'], correctIndex: 0, marks: 1 },
        { text: 'Which tag is used for the largest heading?', options: ['<h6>','<heading>','<h1>','<head>'], correctIndex: 2, marks: 1 },
        { text: 'Which CSS property controls text size?', options: ['font-weight','text-size','font-size','text-style'], correctIndex: 2, marks: 1 },
        { text: 'What is the default display of a div?', options: ['inline','block','flex','grid'], correctIndex: 1, marks: 1 },
        { text: 'Which property makes a flex container?', options: ['display:block','display:flex','flex:1','flex-wrap'], correctIndex: 1, marks: 1 }
      ]
    },
    {
      title: 'Database Concepts',
      description: 'SQL and NoSQL database fundamentals',
      instructor: instructor._id,
      timeLimitSeconds: 900,
      isActive: true,
      passingScore: 70,
      maxAttempts: 2,
      questions: [
        { text: 'What does SQL stand for?', options: ['Structured Query Language','Simple Query Logic','Standard Query Layer','None'], correctIndex: 0, marks: 1 },
        { text: 'Which of these is a NoSQL database?', options: ['MySQL','PostgreSQL','MongoDB','SQLite'], correctIndex: 2, marks: 1 },
        { text: 'What is a primary key?', options: ['A foreign key','A unique identifier for a record','A duplicate field','An index'], correctIndex: 1, marks: 1 },
        { text: 'What does JOIN do in SQL?', options: ['Deletes tables','Combines rows from two tables','Creates a database','Updates records'], correctIndex: 1, marks: 1 },
        { text: 'Which MongoDB method finds all documents?', options: ['find()','get()','fetch()','select()'], correctIndex: 0, marks: 1 }
      ]
    }
  ]);
  console.log('Quizzes created');

  console.log('');
  console.log('Seed complete!');
  console.log('Instructor -> instructor@test.com / password123');
  console.log('Students   -> alice@test.com / bob@test.com / charlie@test.com / password123');
  mongoose.disconnect();
}

seed().catch(console.error);