const API_BASE = '/api';
const urlInput = document.getElementById('urlInput');
const fetchBtn = document.getElementById('fetchBtn');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const fileInfoEl = document.getElementById('fileInfo');
const streamsEl = document.getElementById('streams');
const player = document.getElementById('player');

fetchBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return status('Paste a link.');

  try {
    status('Fetching...');
    resultEl.classList.add('hidden');
    streamsEl.innerHTML = '';

    const res = await fetch(API_BASE + '/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const j = await res.json();
    if (!j.status) return status('Failed: ' + j.message);

    status('Success!');
    fileInfoEl.innerHTML = `<strong>${j.name}</strong> — ${j.size || ''}`;

    (j.streams || []).forEach(s => {
      const div = document.createElement('div');
      div.className = 'stream-item';
      div.innerHTML = `
        <div>${s.quality}</div>
        <div>
          <a href="${s.url}" target="_blank">Open</a>
          <button class="play" data-url="${s.url}">Play</button>
        </div>
      `;
      streamsEl.appendChild(div);
    });

    // play buttons
    streamsEl.querySelectorAll('button.play').forEach(b => {
      b.addEventListener('click', e => {
        player.src = e.target.dataset.url;
        player.style.display = 'block';
        player.play();
      });
    });

    resultEl.classList.remove('hidden');
  } catch (e) {
    status('Error: ' + e.message);
  }
});

function status(msg) {
  statusEl.innerText = msg;
}
