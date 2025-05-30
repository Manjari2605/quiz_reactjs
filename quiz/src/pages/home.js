import React from 'react';
import Navbar from '../components/Navbar';

const subjects = [
	{
		name: 'Web Development',
		quizzes: [
			{
				id: '1',
				title: 'HTML & CSS Basics',
				description: 'Test your knowledge of HTML and CSS fundamentals.',
			},
			{
				id: '2',
				title: 'JavaScript Essentials',
				description: 'Quiz on core JavaScript concepts for the web.',
			},
		],
	},
	{
		name: 'DBMS',
		quizzes: [
			{
				id: '3',
				title: 'SQL Queries',
				description: 'Assess your SQL and database query skills.',
			},
			{
				id: '4',
				title: 'Database Concepts',
				description: 'Quiz on normalization, keys, and DBMS basics.',
			},
		],
	},
	{
		name: 'Python',
		quizzes: [
			{
				id: '5',
				title: 'Python Basics',
				description: 'Test your understanding of Python syntax and features.',
			},
			{
				id: '6',
				title: 'OOP in Python',
				description: 'Quiz on object-oriented programming in Python.',
			},
		],
	},
	{
		name: 'Probability & Statistics',
		quizzes: [
			{
				id: '7',
				title: 'Probability Fundamentals',
				description: 'Quiz on basic probability concepts and calculations.',
			},
			{
				id: '8',
				title: 'Statistics Essentials',
				description: 'Test your knowledge of mean, median, mode, and more.',
			},
		],
	},
];

function Home() {
	const username = localStorage.getItem('quizbolt_username');
	return (
		<>
			<Navbar />
			<div
				style={{
					minHeight: '100vh',
					background: 'linear-gradient(135deg, #e6f7ff 0%, #b3e0ff 100%)',
					padding: '32px 0',
				}}
			>
				<h1
					style={{
						color: 'transparent',
						background: 'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)',
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						fontSize: '2.2rem',
						marginBottom: 16,
						textAlign: 'center',
						fontWeight: 700,
					}}
				>
					QuizBolt
				</h1>
				<p
					style={{
						fontSize: '1.1rem',
						color: '#444',
						textAlign: 'center',
						marginBottom: 32,
					}}
				>
					Select a subject to start your quiz journey!
				</p>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
						gap: '32px',
						justifyContent: 'center',
						maxWidth: 800,
						margin: '0 auto',
					}}
				>
					{subjects.map((subject) => (
						<div
							key={subject.name}
							style={{
								background: '#fff',
								borderRadius: 12,
								boxShadow: '0 4px 16px rgba(30,60,114,0.10)',
								padding: 24,
								minWidth: 260,
								maxWidth: 320,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<h2
								style={{
									color: '#1e3c72',
									marginBottom: 12,
								}}
							>
								{subject.name}
							</h2>
							<div style={{ width: '100%' }}>
								{subject.quizzes.map((quiz) => (
									<div
										key={quiz.id}
										style={{
											background: '#e6f7ff',
											borderRadius: 8,
											marginBottom: 12,
											padding: '12px 16px',
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										<span style={{ fontWeight: 600 }}>{quiz.title}</span>
										<span
											style={{
												fontSize: '0.95rem',
												color: '#555',
												marginBottom: 6,
											}}
										>
											{quiz.description}
										</span>
										<a
											href={`/quiz/${quiz.id}`}
											style={{
												background:
													'linear-gradient(90deg, #ffb300 0%, #ff6f00 100%)',
												color: '#fff',
												border: 'none',
												borderRadius: 6,
												padding: '6px 18px',
												fontWeight: 600,
												textDecoration: 'none',
												textAlign: 'center',
												marginTop: 4,
												display: 'inline-block',
											}}
										>
											Open Quiz
										</a>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default Home;
