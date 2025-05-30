import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const quizMeta = {
  1: { title: 'HTML & CSS Basics', description: 'Test your knowledge of HTML and CSS fundamentals.' },
  2: { title: 'JavaScript Essentials', description: 'Quiz on core JavaScript concepts for the web.' },
  3: { title: 'SQL Queries', description: 'Assess your SQL and database query skills.' },
  4: { title: 'Database Concepts', description: 'Quiz on normalization, keys, and DBMS basics.' },
  5: { title: 'Python Basics', description: 'Test your understanding of Python syntax and features.' },
  6: { title: 'OOP in Python', description: 'Quiz on object-oriented programming in Python.' },
  7: { title: 'Probability Fundamentals', description: 'Quiz on basic probability concepts and calculations.' },
  8: { title: 'Statistics Essentials', description: 'Test your knowledge of mean, median, mode, and more.' },
};

function Performance() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('quizbolt_username');
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    if (!username) return;
    fetch(`http://localhost/quiz/get_user_results.php?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setResults(data.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  function formatTime(seconds) {
    if (seconds == null) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  if (!username) {
    return <div><Navbar /><div style={{padding: 32, textAlign: 'center'}}>Please enter a username to view performance.</div></div>;
  }

  if (loading) return <div><Navbar /><div style={{padding: 32, textAlign: 'center'}}>Loading...</div></div>;

  if (!results || results.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: '#1e3c72', marginBottom: 16 }}>No Performance Data</h2>
          <p style={{ color: '#444', marginBottom: 24 }}>Start testing your knowledge by taking a quiz!</p>
          <button onClick={() => window.location.href = '/home'} style={{ background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 32px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>Go to Home</button>
        </div>
      </>
    );
  }

  // Pie chart for scores by quiz
  const quizScores = {};
  const quizTimes = {};
  results.forEach(r => {
    const qid = r.quiz_id;
    quizScores[qid] = (quizScores[qid] || 0) + r.score;
    quizTimes[qid] = (quizTimes[qid] || 0) + (r.time_spent || 0);
  });

  const scorePieData = {
    labels: Object.keys(quizScores).map(qid => quizMeta[qid]?.title || `Quiz ${qid}`),
    datasets: [{
      data: Object.values(quizScores),
      backgroundColor: [
        '#1976d2', '#ffb300', '#00c6ff', '#ff6f00', '#009688', '#e57373', '#8e24aa', '#43a047'
      ],
    }],
  };

  const timePieData = {
    labels: Object.keys(quizTimes).map(qid => quizMeta[qid]?.title || `Quiz ${qid}`),
    datasets: [{
      data: Object.values(quizTimes),
      backgroundColor: [
        '#43a047', '#8e24aa', '#e57373', '#009688', '#ff6f00', '#00c6ff', '#ffb300', '#1976d2'
      ],
    }],
  };

  // Find lowest performing quiz
  let weakestQuiz = null;
  let minScore = Infinity;
  Object.entries(quizScores).forEach(([qid, score]) => {
    if (score < minScore) {
      minScore = score;
      weakestQuiz = qid;
    }
  });

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e6f7ff 0%, #b3e0ff 100%)', padding: '40px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
          <h2 style={{ color: '#1e3c72', marginBottom: 24, textAlign: 'center' }}>Your Quiz Performance</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 32 }}>
            {results.map(r => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(30,60,114,0.10)', padding: 20, minWidth: 220, maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1976d2', marginBottom: 6 }}>{quizMeta[r.quiz_id]?.title || `Quiz ${r.quiz_id}`}</div>
                <div style={{ color: '#444', fontSize: 15, marginBottom: 10 }}>{quizMeta[r.quiz_id]?.description || ''}</div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Score: <b>{r.score}</b> / {r.total_questions * 10}</div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Attempted: {r.attempted}</div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Time Spent: {formatTime(r.time_spent)}</div>
                <button onClick={() => setSelectedQuiz(r.quiz_id)} style={{ background: 'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>Performance</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center', marginBottom: 40 }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(30,60,114,0.10)', padding: 24, minWidth: 320 }}>
              <h3 style={{ color: '#1976d2', marginBottom: 12 }}>Score Distribution</h3>
              <Pie data={scorePieData} />
            </div>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(30,60,114,0.10)', padding: 24, minWidth: 320 }}>
              <h3 style={{ color: '#1976d2', marginBottom: 12 }}>Time Spent Distribution</h3>
              <Pie data={timePieData} />
            </div>
          </div>
          {weakestQuiz && (
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(255,0,0,0.08)', padding: 24, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
              <h3 style={{ color: '#e57373', marginBottom: 10 }}>Focus Area</h3>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#e57373', marginBottom: 6 }}>{quizMeta[weakestQuiz]?.title || `Quiz ${weakestQuiz}`}</div>
              <div style={{ color: '#444', fontSize: 15 }}>{quizMeta[weakestQuiz]?.description || ''}</div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>You scored the lowest in this quiz. Consider revisiting this topic!</div>
            </div>
          )}
        </div>
      </div>
      {/* Modal for individual quiz performance pie chart */}
      {selectedQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, minWidth: 340, boxShadow: '0 8px 32px rgba(30,60,114,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: '#1976d2', marginBottom: 18 }}>Quiz Performance</h2>
            <Pie data={{
              labels: ['Score', 'Missed'],
              datasets: [{
                data: [quizScores[selectedQuiz], (results.find(r => r.quiz_id === selectedQuiz)?.total_questions || 0) * 10 - quizScores[selectedQuiz]],
                backgroundColor: ['#1976d2', '#e57373']
              }]
            }} />
            <button onClick={() => setSelectedQuiz(null)} style={{ marginTop: 24, background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Performance;
