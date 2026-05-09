import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 100);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="nav-logo">🐾 Patalerta</a>
        <ul className="nav-links">
          <li><a href="#features">Funcionalidades</a></li>
          <li><a href="#pricing">Preços</a></li>
          <li><Link to="/app">Dashboard</Link></li>
          <li><Link to="/register" className="nav-cta">Começar grátis</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left fade-up">
          <div className="hero-badge">🐶 O app de cuidado pet nº1 do Brasil</div>
          <h1>Cuide do <span>seu pet</span> como ele merece</h1>
          <p>Vacinas, ração, passeios e consultas — tudo num só lugar. Receba lembretes no horário certo e nunca mais esqueça nada do seu pet.</p>
          <div className="hero-btns">
            <Link to="/register" className="btn-primary">🐾 Começar Grátis</Link>
            <a href="#features" className="btn-secondary">▶ Ver como funciona</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="num">12k+</div><div className="lbl">Pets cadastrados</div></div>
            <div className="stat"><div className="num">98%</div><div className="lbl">Satisfação</div></div>
            <div className="stat"><div className="num">4.9⭐</div><div className="lbl">Avaliação</div></div>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="dashboard-preview fade-left">
          <div className="dash-header">
            <span style={{fontSize:'1.2rem'}}>🐾</span>
            <div className="dash-logo">Patalerta</div>
          </div>
          <div className="dash-body">
            <div className="dash-sidebar">
              <div className="dash-pet-card">
                <div className="dash-pet-emoji">🐕</div>
                <div className="health-ring"><span>92%</span></div>
                <div className="dash-pet-name">Hércules</div>
                <div className="dash-pet-breed">Pitbull • 2 anos</div>
              </div>
              <ul className="sidebar-menu">
                <li className="active"><span>🏠</span> Início</li>
                <li><span>💉</span> Vacinas</li>
                <li><span>🍖</span> Alimentação</li>
                <li><span>🚶</span> Passeios</li>
                <li><span>🏥</span> Veterinário</li>
                <li><span>🔔</span> Alertas</li>
              </ul>
            </div>
            <div className="dash-main">
              <div className="dash-greeting">Bom dia! Seu pet te espera 🐾</div>
              <div className="dash-cards-row">
                <div className="mini-card warn">
                  <div className="mc-icon">💉</div>
                  <div className="mc-label">Próxima Vacina</div>
                  <div className="mc-value">3 dias</div>
                  <div className="mc-sub">Vacina V10 • Vence 14/04</div>
                </div>
                <div className="mini-card">
                  <div className="mc-icon">🚶</div>
                  <div className="mc-label">Passeios essa semana</div>
                  <div className="mc-value">3 / 5</div>
                  <div className="mc-sub">Meta semanal</div>
                </div>
              </div>
              <div className="timeline-title">📅 Rotina de hoje</div>
              {[
                { dot: 'g', icon: '🍖', name: 'Ração manhã — 300g', detail: '07:00 • Pedigree Adulto', badge: 'done', label: '✓ Feito' },
                { dot: 'b', icon: '💧', name: 'Água fresca', detail: '08:00 • Trocar tigela', badge: 'done', label: '✓ Feito' },
                { dot: 'p', icon: '💊', name: 'Vermífugo', detail: '12:00 • 1 comprimido', badge: 'pending', label: '⏳ Pendente' },
                { dot: 'r', icon: '🏥', name: 'Consulta — Dr. Ricardo', detail: '15/04 • Check-up anual', badge: 'late', label: '! Agendar' },
              ].map((item, i) => (
                <div className="tl-item" key={i}>
                  <div className={`tl-dot ${item.dot}`}>{item.icon}</div>
                  <div className="tl-info">
                    <div className="tl-name">{item.name}</div>
                    <div className="tl-detail">{item.detail}</div>
                  </div>
                  <span className={`tl-badge ${item.badge}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-header reveal">
          <h2>Tudo que seu pet precisa 🐾</h2>
          <p>Quatro módulos completos para cuidar do seu cachorro do jeito certo</p>
        </div>
        <div className="feat-grid">
          {[
            { icon: '💉', title: 'Vacinas & Remédios', desc: 'Cadastre vacinas, vermífugos e medicamentos. Receba alertas antes do vencimento.' },
            { icon: '🍖', title: 'Alimentação', desc: 'Configure horários de ração e água. Controle a dieta e quantidade ideal por peso.' },
            { icon: '🚶', title: 'Passeios', desc: 'Defina metas semanais de exercício e receba lembretes para sair com seu pet.' },
            { icon: '🏥', title: 'Veterinário', desc: 'Agenda de consultas, histórico médico e contato do seu veterinário favorito.' },
          ].map((feat, i) => (
            <div className="feat-card reveal" key={i}>
              <span className="feat-icon">{feat.icon}</span>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="section-header reveal">
          <h2>Planos simples e justos</h2>
          <p>Comece grátis. Pague só quando quiser mais.</p>
        </div>
        <div className="pricing-grid reveal">
          <div className="price-card">
            <div className="plan-name">🐶 Grátis</div>
            <div className="plan-price">R$0 <small>/mês</small></div>
            <ul className="plan-features">
              <li>✅ 1 pet cadastrado</li>
              <li>✅ Lembretes de vacinas</li>
              <li>✅ Rotina de ração</li>
              <li>✅ Notificações push</li>
              <li>❌ Múltiplos pets</li>
              <li>❌ Histórico completo</li>
            </ul>
            <button className="plan-btn">Começar grátis</button>
          </div>
          <div className="price-card featured">
            <div className="plan-name">⭐ Pro</div>
            <div className="plan-price">R$9,90 <small>/mês</small></div>
            <ul className="plan-features">
              <li>✅ Pets ilimitados</li>
              <li>✅ Todos os lembretes</li>
              <li>✅ Histórico médico completo</li>
              <li>✅ Relatório de saúde mensal</li>
              <li>✅ Parceiros veterinários</li>
              <li>✅ Suporte prioritário</li>
            </ul>
            <button className="plan-btn">Assinar Pro</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{padding:'60px 20px', textAlign:'center', background: 'linear-gradient(135deg, #F97316, #FB923C)'}}>
        <h2 style={{fontFamily: "'Fredoka One', cursive", fontSize:'2.4rem', color:'white', marginBottom:'12px'}}>
          Pronto para cuidar melhor do seu pet?
        </h2>
        <p style={{color:'rgba(255,255,255,0.85)', marginBottom:'24px', fontSize:'1.1rem'}}>
          Baixe agora e comece grátis 🌟
        </p>
        <a href="/app" className="btn-primary" style={{background:'white', color:'#F97316', boxShadow:'0 8px 24px rgba(0,0,0,0.2)'}}>
          🐾 Começar Agora
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="footer-logo">🐾 Patalerta</div>
          <p style={{marginTop:'6px'}}>Feito com ❤️ para quem ama seus pets</p>
        </div>
        <div style={{textAlign:'right'}}>
          <p>© 2026 Patalerta. Todos os direitos reservados.</p>
          <p style={{marginTop:'4px'}}>contato@patalerta.com.br</p>
        </div>
      </footer>
    </div>
  );
}
