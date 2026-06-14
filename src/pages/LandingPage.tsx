import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Mic,
  Users,
  Globe,
  Sparkles,
  Zap,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Shield,
  FileText,
  Bot,
  ArrowRight,
  Play,
  ChevronRight,
} from 'lucide-react';

const LandingPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({ msme: 0, penalties: 0, agents: 0, response: 0 });
  const [currentPenalty, setCurrentPenalty] = useState(600);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles for neural network effect
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      });
    }

    // 3D Shapes data
    const shapes = [
      { type: 'icosahedron', x: 0.2, y: 0.3, size: 80, rotation: 0, speed: 0.002, color: '#1E5EE5' },
      { type: 'torus', x: 0.8, y: 0.25, size: 60, rotation: 0, speed: 0.003, color: '#7F77DD' },
      { type: 'octahedron', x: 0.15, y: 0.7, size: 70, rotation: 0, speed: 0.0025, color: '#1E5EE5' },
      { type: 'icosahedron', x: 0.75, y: 0.65, size: 50, rotation: 0, speed: 0.0015, color: '#7F77DD' },
      { type: 'torus', x: 0.5, y: 0.8, size: 40, rotation: 0, speed: 0.002, color: '#1E5EE5' },
    ];

    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / canvas.width;
      mouseY = e.clientY / canvas.height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawShape = (shape: typeof shapes[0]) => {
      const x = shape.x * canvas.width + (mouseX - 0.5) * 30;
      const y = shape.y * canvas.height + (mouseY - 0.5) * 30;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(shape.rotation);

      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;

      if (shape.type === 'icosahedron') {
        // Draw icosahedron wireframe
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(0, -shape.size);
          ctx.lineTo(shape.size * 0.9, shape.size * 0.3);
          ctx.lineTo(-shape.size * 0.9, shape.size * 0.3);
          ctx.closePath();
          ctx.stroke();
          ctx.rotate(Math.PI * 2 / 3);
        }
      } else if (shape.type === 'torus') {
        // Draw torus wireframe
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.ellipse(0, 0, shape.size, shape.size * 0.3, (i * Math.PI) / 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (shape.type === 'octahedron') {
        // Draw octahedron wireframe
        ctx.beginPath();
        ctx.moveTo(0, -shape.size);
        ctx.lineTo(shape.size * 0.7, 0);
        ctx.lineTo(0, shape.size);
        ctx.lineTo(-shape.size * 0.7, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -shape.size);
        ctx.lineTo(0, shape.size);
        ctx.moveTo(shape.size * 0.7, 0);
        ctx.lineTo(-shape.size * 0.7, 0);
        ctx.stroke();
      }

      ctx.restore();
    };

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.4,
        0,
        canvas.width * 0.5,
        canvas.height * 0.4,
        canvas.width * 0.7
      );
      gradient.addColorStop(0, 'rgba(30, 94, 229, 0.15)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 94, 229, ${0.3 + p.size * 0.1})`;
        ctx.fill();

        // Connect particles
        particles.forEach((p2, j) => {
          if (i >= j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(30, 94, 229, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });

      // Draw shapes
      shapes.forEach(shape => {
        shape.rotation += shape.speed;
        drawShape(shape);
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate stats
  useEffect(() => {
    if (!statsVisible) return;
    const targets = { msme: 63, penalties: 2000, agents: 6, response: 3 };
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        msme: Math.round(targets.msme * easeOut),
        penalties: Math.round(targets.penalties * easeOut),
        agents: Math.round(targets.agents * easeOut),
        response: Math.round(targets.response * easeOut),
      });

      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [statsVisible]);

  const features = [
    { icon: Mic, title: 'Hindi Voice WhatsApp', desc: 'Ask in Hindi, get instant replies with action cards' },
    { icon: Users, title: 'Multi-Agent Debate', desc: 'Two AI agents verify every regulation — zero hallucinations' },
    { icon: Globe, title: 'Autonomous Filing', desc: 'Browser agent pre-fills your GST return. You just approve.' },
    { icon: TrendingUp, title: 'Predictive Radar', desc: 'Know about regulation changes 30 days before published' },
    { icon: AlertTriangle, title: 'Live Penalty Clock', desc: 'See exactly what delaying costs you — in real time' },
    { icon: Bot, title: 'Peer Network', desc: 'Learn from 200+ similar businesses in your sector' },
  ];

  const agents = [
    { icon: Globe, name: 'Intake', desc: 'Fetches circulars' },
    { icon: Scale, name: 'Debate A+B', desc: 'Interpret regulations' },
    { icon: Zap, name: 'Judge', desc: 'Resolves conflicts' },
    { icon: FileText, name: 'Profile Match', desc: 'Maps to your business' },
    { icon: AlertTriangle, name: 'Penalty Calc', desc: 'Computes impact' },
    { icon: Globe, name: 'Browser Filer', desc: 'Auto-fills returns' },
    { icon: Mic, name: 'Voice Alert', desc: 'Notifies you' },
  ];

  return (
    <div className="min-h-screen bg-navy-darker text-white overflow-x-hidden">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">RegulaAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white transition text-sm">Features</a>
            <a href="#how-it-works" className="text-white/80 hover:text-white transition text-sm">How It Works</a>
            <a href="#impact" className="text-white/80 hover:text-white transition text-sm">Impact</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition text-sm">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin" className="px-4 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition">
              Sign In
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm font-medium transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/90">Powered by Agentic AI — India's First Compliance Autopilot</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Never Miss a<br />
            <span className="gradient-text">Compliance Deadline</span><br />
            Again.
          </h1>
          <p className="text-lg md:text-xl text-text-tertiary max-w-2xl mx-auto mb-8">
            RegulaAI monitors Indian regulations 24/7, predicts your obligations, and files your returns — all in Hindi and English. Built for 63 million MSMEs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/signup" className="px-8 py-4 bg-primary hover:bg-primary-dark rounded-lg text-lg font-medium transition flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 border border-white/30 rounded-lg text-lg hover:bg-white/10 transition flex items-center gap-2">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-text-tertiary">
            <span>Trusted by MSMEs across India</span>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['RK', 'PS', 'SK', 'AM', 'VD'].map((initials, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${['bg-primary', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-red-500'][i]}`}>
                    {initials}
                  </div>
                ))}
              </div>
              <span>Join 10,000+ businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Strip */}
      <div className="relative z-10 bg-navy-dark/80 py-3 overflow-hidden border-y border-white/5">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-sm text-white/70">
              <span>GST Portal ✓</span>
              <span>•</span>
              <span>MCA21 ✓</span>
              <span>•</span>
              <span>Ministry of Labour ✓</span>
              <span>•</span>
              <span>EPFO ✓</span>
              <span>•</span>
              <span>PRS India ✓</span>
              <span>•</span>
              <span>FSSAI ✓</span>
              <span>•</span>
              <span>Income Tax Portal ✓</span>
              <span>•</span>
              <span>Udyam Registration ✓</span>
            </span>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section ref={statsRef} className="relative z-10 bg-navy-darker py-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{counts.msme}M+</div>
            <div className="text-text-tertiary text-sm">MSMEs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">₹{counts.penalties.toLocaleString()} Cr+</div>
            <div className="text-text-tertiary text-sm">Penalties Avoided</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{counts.agents}</div>
            <div className="text-text-tertiary text-sm">AI Agents</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">&lt;{counts.response}s</div>
            <div className="text-text-tertiary text-sm">Response Time</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-navy-darker py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything your compliance team would do — <span className="gradient-text">automated</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-card p-6 hover:border-primary/50 transition group cursor-pointer"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-text-tertiary text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 bg-navy-dark py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            6 AI Agents. One unified compliance engine.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {agents.map((agent, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="glass rounded-lg p-4 text-center min-w-[120px] hover:border-primary/50 transition">
                  <agent.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className="text-xs text-text-tertiary">{agent.desc}</div>
                </div>
                {i < agents.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-primary/50 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative z-10 bg-navy-darker py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The problem is massive. The solution is <span className="gradient-text">precise</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {[
                { name: 'Ramesh, Hardware shop, Karol Bagh', quote: 'Saved ₹18,000 in penalties last year', icon: '👨‍🔧' },
                { name: 'Priya, Food stall, Pune', quote: 'Files GST in one tap now', icon: '👩‍🍳' },
                { name: 'Suresh, Textile trader, Surat', quote: 'Replaced CA for all routine filings', icon: '👨‍💼' },
              ].map((user, i) => (
                <div key={i} className="glass rounded-card p-4 flex items-center gap-4">
                  <div className="text-3xl">{user.icon}</div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-text-tertiary text-sm">{user.quote}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass rounded-card p-6">
              <h3 className="font-semibold mb-6">Annual Compliance Cost Comparison</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Before RegulaAI</span>
                    <span className="text-accent-red font-medium">₹45,000/yr</span>
                  </div>
                  <div className="h-8 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-red w-[90%] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>After RegulaAI</span>
                    <span className="text-accent-green font-medium">₹4,999/yr</span>
                  </div>
                  <div className="h-8 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-green w-[10%] rounded-full" />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-accent-green/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-accent-green">89% Savings</div>
                <div className="text-sm text-text-tertiary">On average compliance costs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 bg-navy-darker py-20 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to never miss a deadline?</h2>
          <p className="text-text-tertiary mb-8">Join thousands of Indian businesses running on autopilot.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark rounded-lg text-lg font-medium transition">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-navy-darkest py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-primary" />
                <span className="font-bold">RegulaAI</span>
              </Link>
              <p className="text-text-tertiary text-sm">63M businesses. One co-pilot. Zero missed deadlines.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#features" className="text-text-tertiary hover:text-white transition">Features</a>
              <a href="#pricing" className="text-text-tertiary hover:text-white transition">Pricing</a>
              <a href="#" className="text-text-tertiary hover:text-white transition">About</a>
              <a href="#" className="text-text-tertiary hover:text-white transition">Contact</a>
            </div>
            <div className="text-text-tertiary text-sm text-center md:text-right">
              <div>Built for HackArena 2.0 | IIIT Delhi</div>
              <div className="mt-1">© 2025 RegulaAI</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
