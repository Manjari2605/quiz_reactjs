import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function QuizStart() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [skipped, setSkipped] = useState(0);
  const [timer, setTimer] = useState(10); // 20 seconds per question
  const timerRef = useRef();
  const [quizStartTime, setQuizStartTime] = useState(null);

  useEffect(() => {
    fetch('http://localhost/quiz/get_questions.php?quiz_id=' + quizId)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // If answer is not present, fetch again with answer
          if (data.questions.length > 0 && !('answer' in data.questions[0])) {
            // Try to fetch with answer field
            fetch('http://localhost/quiz/get_questions.php?quiz_id=' + quizId + '&with_answer=1')
              .then(res2 => res2.json())
              .then(data2 => {
                if (data2.success) {
                  setQuestions(data2.questions);
                } else {
                  setQuestions(data.questions);
                }
                setLoading(false);
              });
          } else {
            setQuestions(data.questions);
            setLoading(false);
          }
        } else {
          setQuestions([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [quizId]);

  useEffect(() => {
    if (!showResult && questions.length > 0 && currentQuestion < questions.length && !showNext) {
      setTimer(20);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSkip();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => {};
    // eslint-disable-next-line
  }, [currentQuestion, showNext, showResult, questions.length]);

  useEffect(() => {
    if (questions.length > 0 && quizStartTime === null) {
      // Set start time in Asia/Kolkata timezone
      setQuizStartTime(dayjs().tz('Asia/Kolkata'));
    }
  }, [questions, quizStartTime]);

  // Helper to shuffle options for a question
  function shuffleOptions(question) {
    const opts = [question.option1, question.option2, question.option3, question.option4];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }

  // Store shuffled options for each question
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (questions.length > 0) {
      setShuffledOptions(questions.map(q => shuffleOptions(q)));
    }
  }, [questions]);

  // Helper to format time spent in mm:ss
  function formatTimeSpent(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? mins + ' min ' : ''}${secs} sec`;
  }

  // Add state for time spent display
  const [timeSpentDisplay, setTimeSpentDisplay] = useState(0);

  // Save result to backend when quiz is completed
  useEffect(() => {
    if (!loading && questions.length > 0 && showResult) {
      let username = localStorage.getItem('quizbolt_username');
      if (!username) {
        username = 'Guest' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('quizbolt_username', username);
      }
      // Calculate time spent in seconds using Asia/Kolkata time
      let time_spent = 0;
      if (quizStartTime) {
        const endTime = dayjs().tz('Asia/Kolkata');
        time_spent = endTime.diff(quizStartTime, 'second');
      }
      setTimeSpentDisplay(time_spent); // <-- set for display
      fetch('http://localhost/quiz/save_result.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          quiz_id: quizId,
          score,
          total_questions: totalQuestions,
          attempted,
          time_spent
        })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            console.error('Failed to save result:', data.message);
          }
        })
        .catch(err => {
          console.error('Error saving result:', err);
        });
    }
    // eslint-disable-next-line
  }, [showResult, loading, questions.length]);

  if (loading) return <div>Loading...</div>;
  if (questions.length === 0) return <div>No questions found for this quiz.</div>;

  const q = questions[currentQuestion];
  const totalQuestions = questions.length;
  const maxScore = totalQuestions * 10;

  function handleOptionSelect(opt) {
    if (!showNext) setSelectedOption(opt);
  }

  function handleSubmit() {
    if (selectedOption == null) return;
    setAttempted(a => a + 1);
    if (selectedOption === q.answer) {
      setScore(s => s + 10);
    }
    setShowNext(true);
    clearInterval(timerRef.current);
  }

  function handleSkip() {
    setSkipped(s => s + 1);
    setShowNext(true);
    setSelectedOption(null);
    clearInterval(timerRef.current);
  }

  function handleNext() {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setShowNext(false);
    } else {
      setShowResult(true);
    }
  }

  function getProgress() {
    return ((currentQuestion + 1) / totalQuestions) * 100;
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#23272f', padding: '40px 0', color: '#fff' }}>
        <div style={{
          background: '#2d313a',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(30,60,114,0.10)',
          padding: 32,
          maxWidth: 600,
          margin: '0 auto',
          position: 'relative'
        }}>
          {!showResult ? (
            <>
              {/* Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16 }}>Question {currentQuestion + 1} / {totalQuestions}</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{score} / {maxScore}</div>
              </div>
              <div style={{ height: 8, background: '#444', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
                <div style={{ width: getProgress() + '%', height: '100%', background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', transition: 'width 0.3s' }}></div>
              </div>
              {/* Question */}
              <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>{q.question}</div>
              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {shuffledOptions[currentQuestion] && shuffledOptions[currentQuestion].map((opt, idx) => {
                  let bg = '#444';
                  if (showNext) {
                    if (opt === q.answer) {
                      bg = '#009688'; // correct answer green
                    } else if (selectedOption === opt && selectedOption !== q.answer) {
                      bg = '#e57373'; // wrong answer red
                    }
                  } else if (selectedOption === opt) {
                    bg = '#00bcd4'; // selected but not submitted
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(opt)}
                      disabled={showNext}
                      style={{
                        background: bg,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 24,
                        padding: '14px 0',
                        fontSize: 18,
                        fontWeight: 500,
                        cursor: showNext ? 'default' : 'pointer',
                        transition: 'background 0.2s',
                        outline: 'none',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {/* Timer and Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 16, color: '#bdbdbd', fontWeight: 500 }}>⏰ {timer < 10 ? '0' + timer : timer}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {!showNext && <button onClick={handleSkip} style={{ background: '#757575', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Skip</button>}
                  {!showNext && <button onClick={handleSubmit} disabled={selectedOption == null} style={{ background: selectedOption ? 'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)' : '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: selectedOption ? 'pointer' : 'not-allowed' }}>Submit</button>}
                  {showNext && <button onClick={handleNext} style={{ background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Next</button>}
                </div>
              </div>
            </>
          ) : (
            // Summary as popup modal
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ background: 'linear-gradient(135deg, #e3f0fc 0%, #f5faff 100%)', borderRadius: 16, padding: 28, maxWidth: 480, minWidth: 340, margin: '0 8px', boxShadow: '0 8px 32px rgba(30,60,114,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: '#1976d2', marginBottom: 18, fontWeight: 700, letterSpacing: 1, fontSize: 26, textAlign: 'center' }}>Quiz Summary</h2>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  {/* Left: Circular Progress */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: 110, height: 110, marginRight: 32 }}>
                    <svg width="110" height="110" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                      <circle cx="55" cy="55" r="46" stroke="#e3eafc" strokeWidth="12" fill="none" />
                      <circle cx="55" cy="55" r="46" stroke="#1976d2" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - score / maxScore)} style={{ transition: 'stroke-dashoffset 1s' }} />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '110px',
                      height: '110px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}>
                      <span style={{ fontSize: 38, color: '#1976d2', fontWeight: 700, lineHeight: 1 }}>{score / 10}</span>
                      <span style={{ fontSize: 18, color: '#1976d2', fontWeight: 500, lineHeight: 1.2 }}>/ {totalQuestions}</span>
                    </div>
                  </div>
                  {/* Right: Score Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, minWidth: 140 }}>
                    <div style={{ color: '#1976d2', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center' }}><span style={{ color: 'green', fontWeight: 700, fontSize: 22, marginRight: 6 }}>✔ {score / 10}</span>Answered</div>
                    <div style={{ color: '#1976d2', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center' }}><span style={{ color: 'red', fontWeight: 700, fontSize: 22, marginRight: 6 }}>✖ {attempted - score / 10}</span>Wrong</div>
                    <div style={{ color: '#1976d2', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center' }}><span style={{ color: '#ffb300', fontWeight: 700, fontSize: 22, marginRight: 6 }}>⏭ {skipped}</span>Skipped</div>
                  </div>
                </div>
                {/* Time Spent */}
                <div style={{ color: '#1976d2', fontWeight: 600, fontSize: 18, marginTop: 18, marginBottom: 8 }}>
                  ⏱️ Time Spent: {formatTimeSpent(timeSpentDisplay)}
                </div>
                {/* Buttons below the card */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 28, width: '100%' }}>
                  <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 32px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', minWidth: 120 }}>Retake Quiz</button>
                  <button onClick={() => window.location.href = '/home'} style={{ background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 32px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', minWidth: 120 }}>Go Home</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default QuizStart;

