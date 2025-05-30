import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';

const quizData = {
  1: { title: 'HTML & CSS Basics', description: 'Covers HTML tags, CSS selectors, layouts, and styling fundamentals.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Test your understanding of web page structure and styling.'
  } },
  2: { title: 'JavaScript Essentials', description: 'Focuses on JS syntax, DOM manipulation, and basic programming logic.', instructions: {
    questions: 12,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Assess your core JavaScript knowledge for web development.'
  } },
  3: { title: 'SQL Queries', description: 'Includes SELECT, JOIN, GROUP BY, and filtering data in SQL.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Evaluate your ability to write and understand SQL queries.'
  } },
  4: { title: 'Database Concepts', description: 'Covers normalization, keys, transactions, and DBMS architecture.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Test your grasp of fundamental database management concepts.'
  } },
  5: { title: 'Python Basics', description: 'Covers Python syntax, data types, control flow, and functions.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Assess your foundational Python programming skills.'
  } },
  6: { title: 'OOP in Python', description: 'Focuses on classes, objects, inheritance, and OOP principles in Python.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Test your understanding of object-oriented programming in Python.'
  } },
  7: { title: 'Probability Fundamentals', description: 'Includes probability rules, conditional probability, and basic combinatorics.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Evaluate your grasp of probability concepts and calculations.'
  } },
  8: { title: 'Statistics Essentials', description: 'Covers mean, median, mode, standard deviation, and data interpretation.', instructions: {
    questions: 10,
    type: 'MCQs with only one correct answer',
    marking: 'All questions have equal marks. Every correct response gets 1 mark and wrong response gets -1 mark.',
    attempts: 'You can take this assessment only once.',
    objective: 'Test your understanding of basic statistical measures and analysis.'
  } },
};

function QuizSummary() {
  const { quizId } = useParams();
  const history = useHistory();
  const quiz = quizData[quizId];

  if (!quiz) return <div>Quiz not found.</div>;

  const { instructions } = quiz;

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e6f7ff 0%, #b3e0ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(30,60,114,0.10)',
          padding: 32,
          minWidth: 400,
          maxWidth: 600,
          textAlign: 'left',
        }}>
          <h2 style={{ color: '#1e3c72', marginBottom: 12 }}>{quiz.title}</h2>
          <p style={{ color: '#444', marginBottom: 24 }}>{quiz.description}</p>
          <div style={{ marginBottom: 32 }}>
            <b>Instructions:</b>
            <ol style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li><b>Number of Questions:</b> {instructions.questions}</li>
              <li><b>Type of Questions:</b> {instructions.type}</li>
              <li><b>Marking Scheme:</b> {instructions.marking}</li>
              <li><b>Attempts:</b> {instructions.attempts}</li>
              <li><b>Objective:</b> {instructions.objective}</li>
            </ol>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              style={{
                background: 'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '12px 32px',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
              onClick={() => history.push(`/quiz/${quizId}/start`)}
            >
              START ASSESSMENT &rarr;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizSummary;
