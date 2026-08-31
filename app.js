// Duna HydroSip - Script Interativo, Player de Jingle & Simulador

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initAudioPlayer();
  initSimulator();
  initVideoModal();
  initPreorderModal();
});

/* ============================================================
   1. Player de Áudio do Jingle Oficial (Transforme Seu Dia)
   ============================================================ */
function initAudioPlayer() {
  const playBtn = document.getElementById('btn-play-jingle');
  const pauseBtn = document.getElementById('btn-pause-jingle');
  const progressBar = document.getElementById('jingle-progress');
  const progressContainer = document.getElementById('jingle-progress-container');
  const currentTimeEl = document.getElementById('jingle-current-time');
  const durationEl = document.getElementById('jingle-duration');
  const canvas = document.getElementById('audio-visualizer');
  const audioElement = document.getElementById('jingle-audio-element');

  if (!playBtn || !audioElement) return;

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Atualizar duração assim que carregar
  audioElement.addEventListener('loadedmetadata', () => {
    if (durationEl) durationEl.innerText = formatTime(audioElement.duration);
  });

  audioElement.addEventListener('canplay', () => {
    if (durationEl && audioElement.duration) {
      durationEl.innerText = formatTime(audioElement.duration);
    }
  });

  // Atualizar progresso do áudio
  audioElement.addEventListener('timeupdate', () => {
    if (progressBar && audioElement.duration) {
      const pct = (audioElement.currentTime / audioElement.duration) * 100;
      progressBar.style.width = `${pct}%`;
    }
    if (currentTimeEl) {
      currentTimeEl.innerText = formatTime(audioElement.currentTime);
    }
  });

  // Controle de clique na barra de progresso
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      if (!audioElement.duration) return;
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      audioElement.currentTime = pct * audioElement.duration;
    });
  }

  // Visualizador animado leve e compatível com file://
  let visualizerAnimId = null;
  function startVisualizer() {
    if (!canvas) return;
    const vCtx = canvas.getContext('2d');
    const vWidth = (canvas.width = canvas.clientWidth);
    const vHeight = (canvas.height = canvas.clientHeight || 48);
    const barCount = 36;
    const barWidth = vWidth / barCount;

    function render() {
      if (!audioElement.paused) {
        visualizerAnimId = requestAnimationFrame(render);
      }
      vCtx.clearRect(0, 0, vWidth, vHeight);

      for (let i = 0; i < barCount; i++) {
        let barH;
        if (!audioElement.paused) {
          // Animação de onda sonora dinâmica proporcional ao playback
          const noise = Math.sin(Date.now() * 0.008 + i * 0.4) * Math.cos(Date.now() * 0.005 + i * 0.2);
          barH = Math.max(4, Math.abs(noise) * (vHeight * 0.85));
        } else {
          barH = 3;
        }
        vCtx.fillStyle = '#0284c7';
        vCtx.fillRect(i * barWidth, vHeight - barH, barWidth - 2, barH);
      }
    }
    render();
  }

  function playJingle() {
    audioElement.volume = 1.0;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        startVisualizer();
      }).catch(err => {
        console.error('Erro ao reproduzir áudio:', err);
      });
    }
  }

  function pauseJingle() {
    audioElement.pause();
    playBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
  }

  audioElement.addEventListener('ended', () => {
    playBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    if (progressBar) progressBar.style.width = '0%';
  });

  playBtn.addEventListener('click', playJingle);
  pauseBtn.addEventListener('click', pauseJingle);

  // Desenhar barras em repouso
  if (canvas) {
    const vCtx = canvas.getContext('2d');
    const vWidth = (canvas.width = canvas.clientWidth);
    const vHeight = (canvas.height = canvas.clientHeight || 48);
    const barCount = 36;
    const barWidth = vWidth / barCount;
    for (let i = 0; i < barCount; i++) {
      vCtx.fillStyle = '#0284c7';
      vCtx.fillRect(i * barWidth, vHeight - 3, barWidth - 2, 3);
    }
  }
}

/* ============================================================
   2. Simulador de Extração na Duna
   ============================================================ */
function initSimulator() {
  const depthSlider = document.getElementById('depth-slider');
  const tempSlider = document.getElementById('temp-slider');
  const aiBurstToggle = document.getElementById('ai-burst-toggle');
  const displayDepth = document.getElementById('val-depth');
  const displayTemp = document.getElementById('val-temp');
  const displayMinutes = document.getElementById('val-minutes');
  const displayPurity = document.getElementById('val-purity');
  const displayBottleTemp = document.getElementById('val-bottle-temp');

  if (!depthSlider || !displayMinutes) return;

  function update() {
    const depthCm = parseInt(depthSlider.value);
    const temp = parseInt(tempSlider.value);
    const isBurstActive = aiBurstToggle ? aiBurstToggle.checked : false;

    displayDepth.innerText = `${depthCm} cm`;
    displayTemp.innerText = `${temp}°C`;

    // Tempo base normal: varia de ~18 a ~30 minutos (iniciando em 25 min nos valores padrão 5cm e 38°C)
    let baseTime = Math.round(35 - (depthCm * 0.8) - (temp * 0.15));
    baseTime = Math.max(16, Math.min(32, baseTime)); // base padrão = 25 min

    if (isBurstActive) {
      // Modo AI Burst - Powered by Gemini: Acelera proporcionalmente de 25 min para 3 min (~88% mais rápido)
      const burstTime = Math.max(2, Math.round(baseTime * (3 / 25)));
      displayMinutes.innerHTML = `<span class="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">${burstTime} min</span> <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-mono ml-1">AI BURST</span>`;
      displayPurity.innerText = `99.999%`;
      displayBottleTemp.innerText = `3.8°C Turbo Gelada`;
    } else {
      displayMinutes.innerText = `${baseTime} min`;
      displayPurity.innerText = `99.98%`;
      displayBottleTemp.innerText = `4°C Gelada`;
    }
  }

  depthSlider.addEventListener('input', update);
  tempSlider.addEventListener('input', update);
  if (aiBurstToggle) {
    aiBurstToggle.addEventListener('change', update);
  }
  update();
}

/* ============================================================
   3. Modal e Controles do Vídeo Oficial
   ============================================================ */
function initVideoModal() {
  const btn = document.getElementById('btn-play-film');
  const modal = document.getElementById('film-modal');
  const closeBtn = document.getElementById('btn-close-film');
  const videoEl = document.getElementById('product-video');

  if (!btn || !modal) return;

  btn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(e => console.log('Video play error:', e));
    }
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    if (videoEl) {
      videoEl.pause();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (videoEl) videoEl.pause();
    }
  });
}

/* ============================================================
   4. Modal de Pré-venda
   ============================================================ */
function initPreorderModal() {
  const triggers = document.querySelectorAll('.btn-reserve-trigger');
  const modal = document.getElementById('preorder-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const form = document.getElementById('preorder-form');
  const success = document.getElementById('preorder-success');
  const certNumber = document.getElementById('cert-number');

  if (!modal) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('preorder-name')?.value || 'Não informado';
      const email = document.getElementById('preorder-email')?.value || 'Não informado';
      const phone = document.getElementById('preorder-phone')?.value || 'Não informado';
      const city = document.getElementById('preorder-city')?.value || 'Cachoeiro de Itapemirim - ES';
      const qty = document.getElementById('preorder-qty')?.value || '1';
      
      const code = 'DUNA-RES-' + Math.floor(100000 + Math.random() * 900000);
      if (certNumber) certNumber.innerText = code;

      // Montar corpo oficial do e-mail de reserva
      const recipient = 'hardware@cachoeirodeitapemirim.es.leg.br';
      const subject = `[RESERVA DUNA HYDROSIP] Pedido Oficial de Lançamento - Cód: ${code}`;
      
      const body = 
`SOLICITAÇÃO OFICIAL DE PRÉ-VENDA // DUNA HYDROSIP™
--------------------------------------------------
Código de Protocolo: ${code}
Data/Hora do Registro: ${new Date().toLocaleString('pt-BR')}

DADOS DO CLIENTE / PIONEIRO:
• Nome Completo: ${name}
• E-mail para Faturamento: ${email}
• Telefone/WhatsApp: ${phone}
• Cidade/Estado: ${city}

DETALHES DO HARDWARE SOLICITADO:
• Produto: Duna HydroSip™ (Edição Titânio com Chip Duna N1)
• Modo: AI Burst™ (Powered by Gemini Nano)
• Quantidade: ${qty} unidade(s)
• Valor Unitário: R$ 899,00
• Valor Total Estimado: R$ ${(parseInt(qty) * 899).toLocaleString('pt-BR')},00

STATUS DA COBRANÇA:
[X] Lote 01 de Lançamento - Sem cobrança imediata
[X] Pagamento contra entrega / despacho

Mensagem automática gerada pelo portal oficial Duna HydroSip:
https://robertgarciabr.github.io/duna-hydrosip/
`;

      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Atualizar link para reabrir caso o popup seja bloqueado
      const reopenBtn = document.getElementById('btn-reopen-mailto');
      if (reopenBtn) {
        reopenBtn.href = mailtoUrl;
      }

      // Disparar o cliente de e-mail padrão
      window.location.href = mailtoUrl;

      // Exibir estado de sucesso
      form.classList.add('hidden');
      success.classList.remove('hidden');
      if (window.lucide) {
        lucide.createIcons();
      }
    });
  }
}
