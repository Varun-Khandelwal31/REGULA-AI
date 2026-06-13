import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
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

function useCountUp(target: number, duration = 2000, inView: boolean) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out: 1 - (1 - progress)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  
  return count;
}

const LandingPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const countMsme = useCountUp(63, 2000, inView);
  const countPenalties = useCountUp(2000, 2000, inView);
  const countAgents = useCountUp(6, 2000, inView);
  const countResponse = useCountUp(3, 2000, inView);

  // Three.js Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create Scene
    const scene = new THREE.Scene();

    // Create WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 4;

    // 80 Points (particles) in range -5 to 5
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x1E5EE5,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particlePoints = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlePoints);

    // Connect nearby particles when distance < 1.5
    const lineIndices: number[] = [];
    const posArr = particlesGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const p1 = new THREE.Vector3(posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2]);
      for (let j = i + 1; j < particleCount; j++) {
        const p2 = new THREE.Vector3(posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]);
        if (p1.distanceTo(p2) < 1.5) {
          lineIndices.push(i, j);
        }
      }
    }
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', particlesGeometry.attributes.position);
    linesGeometry.setIndex(lineIndices);

    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x1E5EE5,
      transparent: true,
      opacity: 0.15,
    });
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lines);

    // 3 wireframe meshes
    const meshMaterial = new THREE.MeshBasicMaterial({
      color: 0x1E5EE5,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), meshMaterial);
    icosahedron.position.set(-2, 1, -1);
    scene.add(icosahedron);

    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 8, 20), meshMaterial);
    torus.position.set(2, -1, -2);
    scene.add(torus);

    const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.7), meshMaterial);
    octahedron.position.set(0, 2, -3);
    scene.add(octahedron);

    const meshes = [icosahedron, torus, octahedron];

    // Mouse parallax
    const target = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.8;
      target.y = -(e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow rotation
      meshes.forEach(mesh => {
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
      });

      // Mouse Lerp
      camera.position.x += (target.x - camera.position.x) * 0.05;
      camera.position.y += (target.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -2);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

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
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

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
        <div className="text-center max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 10 }}>
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
            <div className="text-4xl md:text-5xl font-bold mb-2">{countMsme}M+</div>
            <div className="text-text-tertiary text-sm">MSMEs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">₹{countPenalties.toLocaleString()}Cr+</div>
            <div className="text-text-tertiary text-sm">Penalties Avoided</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">{countAgents}</div>
            <div className="text-text-tertiary text-sm">AI Agents</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">&lt;{countResponse} sec</div>
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
