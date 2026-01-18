import { useState } from 'react';

// Types
interface Question {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Category {
  title: string;
  icon: string;
  description: string;
  questions: Question[];
}

interface QuizData {
  [key: string]: Category;
}

interface Result {
  correct: boolean;
}

// Quiz Data
const quizData: QuizData = {
  languageBasics: {
    title: "Language Basics",
    icon: "📝",
    description: "Syntax, types, and core differences",
    questions: [
      {
        id: 1, difficulty: "easy",
        question: "What happens when you run this Python code?\n\ndef greet(name: str) -> str:\n    return f\"Hello, {name}\"\n\ngreet(123)",
        options: ["TypeError at runtime", "Compilation error", "Runs fine, returns 'Hello, 123'", "SyntaxError"],
        correct: 2,
        explanation: "Python type hints are completely ignored at runtime! Unlike TypeScript, they're just documentation. You need external tools like mypy to catch type errors."
      },
      {
        id: 2, difficulty: "easy",
        question: "In Python, what's the equivalent of TypeScript's `interface`?",
        options: ["class with @interface decorator", "Protocol from typing module", "Abstract base class (ABC)", "TypedDict only"],
        correct: 1,
        explanation: "Protocol (PEP 544) provides structural subtyping like TypeScript interfaces. If an object has the required methods, it satisfies the Protocol - no inheritance needed!"
      },
      {
        id: 3, difficulty: "medium",
        question: "What will this print?\n\nif True:\n    x = 10\n\nprint(x)",
        options: ["NameError: x is not defined", "10", "None", "SyntaxError"],
        correct: 1,
        explanation: "Python has NO block scope! Variables in if/for/with blocks leak into the surrounding function scope. One of the most jarring differences from TypeScript."
      },
      {
        id: 4, difficulty: "medium",
        question: "What's the Pythonic way to check for None?",
        options: ["if x == None:", "if x is None:", "if !x:", "if x === None:"],
        correct: 1,
        explanation: "Always use 'is' for None, True, and False. 'is' checks identity (same object in memory), while '==' checks equality. None is a singleton."
      },
      {
        id: 5, difficulty: "hard",
        question: "What does `a := b` do in Python?",
        options: ["Type assertion like 'as'", "Assignment expression (walrus operator)", "Destructuring assignment", "Reference assignment"],
        correct: 1,
        explanation: "The walrus operator := (Python 3.8+) assigns and returns a value in one expression. Useful in while loops and comprehensions."
      }
    ]
  },
  gotchas: {
    title: "Tricky Gotchas",
    icon: "⚠️",
    description: "Classic Python traps that catch TS devs",
    questions: [
      {
        id: 6, difficulty: "hard",
        question: "What does this return after all three calls?\n\ndef add_item(item, lst=[]):\n    lst.append(item)\n    return lst\n\nadd_item(1); add_item(2); add_item(3)",
        options: ["[3]", "[1, 2, 3]", "[[1], [2], [3]]", "TypeError"],
        correct: 1,
        explanation: "THE classic Python gotcha! Default arguments are evaluated ONCE when defined, not per call. The same list is shared. Always use None as default for mutables!"
      },
      {
        id: 7, difficulty: "hard",
        question: "What does this print?\n\nfuncs = []\nfor i in range(3):\n    funcs.append(lambda: i)\n\nprint([f() for f in funcs])",
        options: ["[0, 1, 2]", "[2, 2, 2]", "[3, 3, 3]", "Error"],
        correct: 1,
        explanation: "Late binding in closures! Python captures variables by reference, not value. All lambdas reference the same 'i'=2 after loop. Fix: lambda i=i: i"
      },
      {
        id: 8, difficulty: "medium",
        question: "Which values are falsy in Python but truthy in JavaScript?",
        options: ["0, '', null/None", "Empty array [], empty object {}", "NaN, undefined", "false, 0"],
        correct: 1,
        explanation: "Empty collections ([], {}, set()) are FALSY in Python but truthy in JavaScript! Use explicit length checks if zero-length is valid."
      },
      {
        id: 9, difficulty: "medium",
        question: "What's wrong with this?\n\na = 256; b = 256\nprint(a is b)  # True\n\nx = 257; y = 257\nprint(x is y)  # ???",
        options: ["Both True", "Both False", "First True, second False", "SyntaxError"],
        correct: 2,
        explanation: "Python caches integers -5 to 256. 'is' works by accident for these. For 257+, different objects are created. NEVER use 'is' for numbers!"
      },
      {
        id: 10, difficulty: "easy",
        question: "How do you make a class attribute truly private in Python?",
        options: ["private keyword", "Double underscore __", "@private decorator", "You can't - no true privacy"],
        correct: 3,
        explanation: "Python has NO true private! Single underscore (_var) is convention. Double underscore (__var) triggers name mangling but is still accessible via _ClassName__var."
      }
    ]
  },
  pythonic: {
    title: "Pythonic Style",
    icon: "🐍",
    description: "Idiomatic Python patterns",
    questions: [
      {
        id: 11, difficulty: "easy",
        question: "What's the Pythonic way to iterate with an index?",
        options: ["for i in range(len(items)):", "for i, item in enumerate(items):", "items.forEach((item, i))", "for item, i in items.entries():"],
        correct: 1,
        explanation: "enumerate() is the Pythonic way! It yields (index, value) tuples. You can start from a different number: enumerate(items, start=1)"
      },
      {
        id: 12, difficulty: "medium",
        question: "What does EAFP mean in Python?",
        options: ["Error And Failure Prevention", "Easier to Ask Forgiveness than Permission", "Execute All Functions Properly", "Evaluate Arguments For Parameters"],
        correct: 1,
        explanation: "EAFP: Try the operation, catch exceptions if it fails. Preferred over LBYL (Look Before You Leap). Example: try dict[key] except KeyError."
      },
      {
        id: 13, difficulty: "medium",
        question: "What's the cleanest way to swap two variables in Python?",
        options: ["temp = a; a = b; b = temp", "[a, b] = [b, a]", "a, b = b, a", "swap(a, b)"],
        correct: 2,
        explanation: "Python's tuple unpacking allows elegant swapping: a, b = b, a. No temporary needed! Right side evaluated completely before assignment."
      },
      {
        id: 14, difficulty: "hard",
        question: "What's the purpose of 'else' in try/except/else/finally?",
        options: ["Runs if ANY exception", "Runs if NO exception in try", "Alternative to except", "Doesn't exist"],
        correct: 1,
        explanation: "else runs ONLY when no exception occurred. Keeps success code separate, and errors in else won't be caught by except!"
      },
      {
        id: 15, difficulty: "easy",
        question: "What does this return?\n\nfirst, *middle, last = [1, 2, 3, 4, 5]",
        options: ["first=1, middle=2, last=5", "first=1, middle=[2,3,4], last=5", "SyntaxError", "first=[1], middle=[2,3,4], last=[5]"],
        correct: 1,
        explanation: "Extended unpacking with * captures multiple elements into a list. first=1, middle=[2,3,4], last=5. Super useful for parsing!"
      }
    ]
  },
  async: {
    title: "Async Patterns",
    icon: "⚡",
    description: "Asyncio vs Promises",
    questions: [
      {
        id: 16, difficulty: "medium",
        question: "What happens without await?\n\nasync def fetch():\n    return 'data'\n\nresult = fetch()",
        options: ["result = 'data'", "result = coroutine object (nothing runs)", "RuntimeError", "result = Promise"],
        correct: 1,
        explanation: "Coroutines are LAZY! Calling an async function returns a coroutine object but executes nothing. Must await or use asyncio.run()."
      },
      {
        id: 17, difficulty: "hard",
        question: "What's the Python equivalent of Promise.all()?",
        options: ["await all(promises)", "asyncio.gather(*coroutines)", "Promise.all(coroutines)", "asyncio.wait(coroutines)"],
        correct: 1,
        explanation: "asyncio.gather() runs concurrently and returns results in order. asyncio.wait() returns done/pending sets - different behavior!"
      },
      {
        id: 18, difficulty: "hard",
        question: "Why is this problematic?\n\nimport requests\nawait async_func()\ndata = requests.get(url)",
        options: ["requests doesn't work", "Blocks the entire event loop", "Need aiohttp import", "Works fine"],
        correct: 1,
        explanation: "Most Python libraries are sync! requests.get() blocks the ENTIRE event loop. Use async libraries like aiohttp or httpx."
      },
      {
        id: 19, difficulty: "medium",
        question: "How do you start an async program in Python?",
        options: ["Call the async function", "asyncio.run(main())", "await main()", "new EventLoop().run(main)"],
        correct: 1,
        explanation: "Unlike Node.js's implicit event loop, Python needs explicit management. asyncio.run() creates loop, runs coroutine, closes it."
      },
      {
        id: 20, difficulty: "easy",
        question: "What makes sync code run in async without blocking?",
        options: ["@async decorator", "@asyncio.coroutine", "Run in executor (no decorator)", "@await"],
        correct: 2,
        explanation: "No magic decorator exists. Use loop.run_in_executor() for thread pool, or asyncio.to_thread() (Python 3.9+)."
      }
    ]
  },
  ecosystem: {
    title: "Ecosystem & Tools",
    icon: "🛠️",
    description: "Package managers, testing, linting",
    questions: [
      {
        id: 21, difficulty: "easy",
        question: "What's the modern (2024+) recommended Python package manager?",
        options: ["pip only", "poetry", "uv (by Astral)", "conda"],
        correct: 2,
        explanation: "uv (2024) is 10-100x faster than pip, written in Rust by Ruff creators. Combines packages, venv, Python versions. Think pnpm/Bun for Python."
      },
      {
        id: 22, difficulty: "medium",
        question: "What's Python's equivalent to package.json?",
        options: ["requirements.txt", "setup.py", "pyproject.toml", "Pipfile"],
        correct: 2,
        explanation: "pyproject.toml is the modern standard (PEP 518/621). Holds metadata, deps, tool configs. requirements.txt is legacy."
      },
      {
        id: 23, difficulty: "medium",
        question: "What tool replaced Black, flake8, and isort?",
        options: ["pylint", "prettier-python", "ruff", "autopep8"],
        correct: 2,
        explanation: "Ruff (2023+) is 100x faster, written in Rust. Does linting, formatting, import sorting in one tool. The new standard."
      },
      {
        id: 24, difficulty: "hard",
        question: "In pytest, how do you inject dependencies?",
        options: ["beforeEach/afterEach", "@pytest.fixture decorator", "TestCase.setUp()", "DI library"],
        correct: 1,
        explanation: "Fixtures are pytest's DI - more powerful than Jest hooks. Define with @pytest.fixture, request by parameter name. Supports scopes and auto-cleanup."
      },
      {
        id: 25, difficulty: "easy",
        question: "What's pytest's equivalent of Jest's test.each?",
        options: ["@pytest.each", "@pytest.mark.parametrize", "for loop in test", "pytest.data()"],
        correct: 1,
        explanation: "@pytest.mark.parametrize('input,expected', [(1,2), (2,4)]) runs test with each parameter set. Great for data-driven testing!"
      }
    ]
  },
  frameworks: {
    title: "Web Frameworks",
    icon: "🌐",
    description: "FastAPI, Flask, Django patterns",
    questions: [
      {
        id: 26, difficulty: "easy",
        question: "Which Python framework is most similar to NestJS?",
        options: ["Flask", "Django", "FastAPI", "Bottle"],
        correct: 2,
        explanation: "FastAPI is type-driven, async-first, with auto OpenAPI docs and DI - very NestJS-like. Flask is Express-like, Django is batteries-included."
      },
      {
        id: 27, difficulty: "medium",
        question: "In FastAPI, what validates request/response data?",
        options: ["Manual validation", "Pydantic models", "JSON Schema", "dataclasses"],
        correct: 1,
        explanation: "Pydantic provides runtime validation from type hints! Define a model, use as parameter, FastAPI auto-validates and generates OpenAPI docs."
      },
      {
        id: 28, difficulty: "hard",
        question: "How does FastAPI handle DI?\n\nasync def get_db():\n    db = Database()\n    yield db\n    db.close()",
        options: ["Constructor injection", "Depends() with generator", "Decorator pattern", "@inject"],
        correct: 1,
        explanation: "Depends() for DI. Generators with yield manage lifecycle - before yield runs pre-route, after yield runs cleanup."
      },
      {
        id: 29, difficulty: "medium",
        question: "What's the Python equivalent of Prisma?",
        options: ["SQLAlchemy + Alembic", "Django ORM", "Peewee", "All above"],
        correct: 0,
        explanation: "SQLAlchemy is the dominant ORM (like TypeORM). Alembic handles migrations. SQLAlchemy 2.0 has modern, type-safe API. Django ORM is Django-only."
      },
      {
        id: 30, difficulty: "hard",
        question: "What's WRONG here?\n\nuser = session.query(User).filter_by(id=1).first()",
        options: ["Nothing wrong", "Uses deprecated 1.x style", "filter_by should be filter", "first() should be one()"],
        correct: 1,
        explanation: "session.query() is OLD 1.x style! SQLAlchemy 2.0: stmt = select(User).where(User.id == 1); session.execute(stmt).scalar_one_or_none()"
      }
    ]
  }
};

// Utility function
const shuffleArray = <T,>(arr: T[]): T[] => {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
};

// Difficulty colors
const difficultyColors: Record<string, string> = {
  easy: '#10b981',
  medium: '#f59e0b', 
  hard: '#ef4444'
};

// Grade colors
const gradeColors: Record<string, string> = {
  S: '#fbbf24',
  A: '#10b981',
  B: '#6366f1',
  C: '#f59e0b',
  F: '#ef4444'
};

// Grade messages
const gradeMessages: Record<string, string> = {
  S: "🐍 Python Master!",
  A: "🔥 Excellent work!",
  B: "👍 Good job!",
  C: "📚 Review the gotchas!",
  F: "💪 Keep learning!"
};

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'quiz' | 'results'>('menu');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [multi, setMulti] = useState(1);
  const [catScores, setCatScores] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  const startCategory = (key: string) => {
    setCurrentCategory(key);
    setQuestions(shuffleArray([...quizData[key].questions]));
    setQIndex(0);
    setSelected(null);
    setShowResult(false);
    setResults([]);
    setScore(0);
    setStreak(0);
    setMulti(1);
    setScreen('quiz');
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === questions[qIndex].correct;
    const pts: Record<string, number> = { easy: 100, medium: 200, hard: 300 };
    const points = pts[questions[qIndex].difficulty];
    
    if (correct) {
      const ns = streak + 1;
      const nm = Math.min(1 + ns * 0.2, 3);
      setStreak(ns);
      setMulti(nm);
      setScore(s => s + Math.round(points * nm));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    } else {
      setStreak(0);
      setMulti(1);
    }
    setResults(r => [...r, { correct }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      if (currentCategory) {
        setCatScores(s => ({ ...s, [currentCategory]: score }));
      }
      setScreen('results');
    }
  };

  const q = questions[qIndex];
  const qParts = q?.question.split('\n') || [];
  const hasCode = qParts.length > 1;
  const textPart = hasCode ? qParts[0] : q?.question;
  const codePart = hasCode ? qParts.slice(1).join('\n') : null;

  const correctCount = results.filter(r => r.correct).length;
  const pct = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const grade = pct >= 90 ? 'S' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'F';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: "'Space Grotesk', -apple-system, sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-200px) rotate(720deg); opacity: 0; } }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(99,102,241,0.1); }
        .btn:hover:not(:disabled) { transform: translateY(-2px); }
        .opt:hover:not(:disabled) { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.4); transform: translateX(4px); }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />

      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '60%',
              width: '10px',
              height: '10px',
              background: ['#10b981', '#6366f1', '#f59e0b', '#ef4444'][i % 4],
              borderRadius: '50%',
              animation: `confetti ${0.5 + Math.random() * 0.5}s ease-out ${Math.random() * 0.3}s forwards`
            }} />
          ))}
        </div>
      )}

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '2rem 1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '2rem', fontWeight: 700 }}>
          <span style={{ background: 'linear-gradient(135deg, #3178c6, #235a97)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TS</span>
          <span style={{ color: '#6366f1', animation: 'pulse 2s infinite' }}>→</span>
          <span style={{ background: 'linear-gradient(135deg, #ffd43b, #306998)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PY</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>TypeScript to Python</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Master the transition with interactive challenges</p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', position: 'relative', zIndex: 1 }}>

        {/* MENU */}
        {screen === 'menu' && (
          <div style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {Object.entries(quizData).map(([key, data]) => (
                <button key={key} className="card" onClick={() => startCategory(key)} style={{
                  background: 'linear-gradient(145deg, rgba(30,30,40,0.9), rgba(20,20,30,0.95))',
                  border: `1px solid ${key in catScores ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.2)'}`,
                  borderRadius: '16px', padding: '1.5rem', textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.3s', fontFamily: 'inherit', color: 'inherit'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{data.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#f1f5f9' }}>{data.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>{data.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6366f1', fontFamily: "'JetBrains Mono'" }}>{data.questions.length} questions</span>
                    {key in catScores && <span style={{ color: '#10b981', fontWeight: 600 }}>✓ {catScores[key]}pts</span>}
                  </div>
                </button>
              ))}
            </div>
            {Object.keys(catScores).length > 0 && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(30,30,40,0.5)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#94a3b8' }}>
                <span>{Object.keys(catScores).length}/{Object.keys(quizData).length} completed</span>
                <span style={{ color: '#10b981', fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>Total: {Object.values(catScores).reduce((a, b) => a + b, 0)} pts</span>
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {screen === 'quiz' && q && currentCategory && (
          <div style={{ animation: 'slideUp 0.4s ease-out' }}>
            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#6366f1', fontWeight: 500 }}>{quizData[currentCategory].title}</span>
                <span style={{ color: '#64748b', fontFamily: "'JetBrains Mono'" }}>{qIndex + 1}/{questions.length}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(99,102,241,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((qIndex + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '3px', transition: 'width 0.4s' }} />
              </div>
            </div>

            {/* Score */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[{ l: 'SCORE', v: score.toLocaleString(), c: '#e2e8f0' }, { l: 'STREAK', v: `${streak}🔥`, c: '#f59e0b' }, { l: 'MULTI', v: `×${multi.toFixed(1)}`, c: '#10b981' }].map(x => (
                <div key={x.l} style={{ background: 'rgba(30,30,40,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '100px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', letterSpacing: '1px', marginBottom: '0.25rem' }}>{x.l}</span>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, fontFamily: "'JetBrains Mono'", color: x.c }}>{x.v}</span>
                </div>
              ))}
            </div>

            {/* Question Card */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(30,30,40,0.95), rgba(20,20,30,0.98))',
              border: `1px solid ${showResult ? (selected === q.correct ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)') : 'rgba(99,102,241,0.2)'}`,
              borderRadius: '20px', padding: '2rem', transition: 'border-color 0.3s, box-shadow 0.3s',
              boxShadow: showResult ? `0 0 40px ${selected === q.correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}` : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ background: difficultyColors[q.difficulty], color: 'white', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px', padding: '0.35rem 0.75rem', borderRadius: '20px', textTransform: 'uppercase' }}>{q.difficulty}</span>
                <span style={{ color: '#4b5563', fontFamily: "'JetBrains Mono'", fontSize: '0.85rem' }}>#{q.id}</span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: '#f1f5f9', marginBottom: codePart ? '1rem' : 0 }}>{textPart}</p>
                {codePart && (
                  <pre style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '1rem', overflow: 'auto', fontFamily: "'JetBrains Mono'", fontSize: '0.9rem', lineHeight: 1.6, color: '#c9d1d9', whiteSpace: 'pre', margin: 0 }}>
                    <code>{codePart}</code>
                  </pre>
                )}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrectAnswer = showResult && idx === q.correct;
                  const isWrongAnswer = showResult && isSelected && idx !== q.correct;
                  return (
                    <button key={idx} className="opt" disabled={showResult} onClick={() => setSelected(idx)} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                      background: isCorrectAnswer ? 'rgba(16,185,129,0.15)' : isWrongAnswer ? 'rgba(239,68,68,0.15)' : isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(20,20,30,0.6)',
                      border: `1px solid ${isCorrectAnswer ? '#10b981' : isWrongAnswer ? '#ef4444' : isSelected ? '#6366f1' : 'rgba(99,102,241,0.15)'}`,
                      borderRadius: '12px', cursor: showResult ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit', color: 'inherit', fontSize: '1rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: isCorrectAnswer ? '#10b981' : isWrongAnswer ? '#ef4444' : isSelected ? '#6366f1' : 'rgba(99,102,241,0.2)', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', color: isSelected || isCorrectAnswer || isWrongAnswer ? 'white' : '#6366f1', flexShrink: 0 }}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span style={{ flex: 1, lineHeight: 1.5, color: '#e2e8f0' }}>{opt}</span>
                      {isCorrectAnswer && <span style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>}
                      {isWrongAnswer && <span style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold' }}>✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && (
                <div style={{
                  marginTop: '1.5rem', padding: '1.25rem', borderRadius: '12px', animation: 'slideUp 0.3s',
                  background: selected === q.correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${selected === q.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem', color: selected === q.correct ? '#10b981' : '#fbbf24' }}>
                    {selected === q.correct ? '🎉 Correct!' : '💡 Learn from this:'}
                  </div>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{q.explanation}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              {!showResult ? (
                <button className="btn" disabled={selected === null} onClick={handleSubmit} style={{
                  padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: '12px', cursor: selected === null ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontFamily: 'inherit', opacity: selected === null ? 0.5 : 1, transition: 'all 0.2s'
                }}>Check Answer</button>
              ) : (
                <button className="btn" onClick={handleNext} style={{
                  padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: '12px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontFamily: 'inherit', transition: 'all 0.2s'
                }}>{qIndex < questions.length - 1 ? 'Next Question →' : 'See Results →'}</button>
              )}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {screen === 'results' && currentCategory && (
          <div style={{ textAlign: 'center', animation: 'slideUp 0.5s', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f1f5f9' }}>Quiz Complete!</h2>
            <p style={{ color: '#6366f1', fontSize: '1.1rem', marginBottom: '2rem' }}>{quizData[currentCategory].title}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 700, background: gradeColors[grade], color: grade === 'S' || grade === 'C' ? '#1f2937' : 'white', animation: 'float 2s infinite' }}>{grade}</div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: 700, color: '#f1f5f9', fontFamily: "'JetBrains Mono'" }}>{pct}%</span>
                <span style={{ color: '#64748b' }}>{correctCount}/{questions.length} correct</span>
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', color: '#94a3b8', marginBottom: '2rem' }}>{gradeMessages[grade]}</p>

            <div style={{ background: 'rgba(30,30,40,0.5)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Question Breakdown</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {results.map((r, i) => (
                  <div key={i} style={{
                    width: '50px', height: '50px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono'",
                    background: r.correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    border: `1px solid ${r.correct ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Q{i + 1}</span>
                    <span style={{ fontSize: '1rem', color: r.correct ? '#10b981' : '#ef4444' }}>{r.correct ? '✓' : '✗'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => startCategory(currentCategory)} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: '12px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontFamily: 'inherit', transition: 'all 0.2s'
              }}>↺ Try Again</button>
              <button className="btn" onClick={() => setScreen('menu')} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', cursor: 'pointer', color: '#6366f1', fontFamily: 'inherit', transition: 'all 0.2s'
              }}>← All Categories</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
