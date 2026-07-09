// Particle Network Background
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

// Google Forms RSVP Integration Configuration
// If you want to store RSVP responses in a Google Sheet/Form, enter the Form Response URL and Field Entry IDs here.
// Example: 'https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXXXXXX/formResponse'
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/1-p0Unc2cwFU-p0vaeZQIe6HlZ-jVhNYcPxeYgwZL_k8/formResponse'; 
const GOOGLE_ENTRY_NAME = 'entry.123456789';      // Replace with your Google Form Field Entry IDs
const GOOGLE_ENTRY_TITLE = 'entry.987654321';     // Replace with your Google Form Field Entry IDs
const GOOGLE_ENTRY_EMAIL = 'entry.111222333';     // Replace with your Google Form Field Entry IDs
const GOOGLE_ENTRY_ATTENDANCE = 'entry.444555666';// Replace with your Google Form Field Entry IDs


// Preload Stamp Image
const stampImg = new Image();
stampImg.src = 'stamp.png';

// Preload Logo Image
const logoImg = new Image();
logoImg.src = 'logo.png';

// Preload Signature Image
const sigImg = new Image();
sigImg.src = 'signature.png';

let particles = [];
const particleCount = 60;
const connectionDistance = 120;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.15 * (1 - dist / connectionDistance)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Envelope Animation
const envelopeContainer = document.getElementById('envelope-container');
const introScreen = document.getElementById('intro-screen');
const mainContent = document.getElementById('main-content');

envelopeContainer.addEventListener('click', () => {
  envelopeContainer.classList.add('opened');
  
  setTimeout(() => {
    introScreen.classList.add('hidden');
    mainContent.classList.add('visible');
  }, 1200);
});

// Event Countdown Timer (July 14, 2026 13:00:00 WIB)
const targetDate = new Date('July 14, 2026 13:00:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference < 0) {
    document.querySelector('.countdown-container').innerHTML = "<p style='color: var(--text-gold); font-size: 1.2rem; font-family: var(--font-serif);'>Kegiatan Sedang/Telah Berlangsung</p>";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById('days').innerText = days.toString().padStart(2, '0');
  document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
  document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Form Submission & Certificate Drawing
const rsvpForm = document.getElementById('rsvp-form');
const rsvpFormContainer = document.getElementById('rsvp-form-container');
const rsvpSuccess = document.getElementById('rsvp-success');
const successMsg = document.getElementById('success-msg');
const certificateSection = document.getElementById('certificate-section');
const certCanvas = document.getElementById('certificate-canvas');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('full-name').value;
  const title = document.getElementById('professional-title').value;
  const email = document.getElementById('email-address').value;
  const attendance = document.querySelector('input[name="attendance"]:checked').value;

  // Save to Local Storage
  localStorage.setItem('mhpn_rsvp_name', name);
  localStorage.setItem('mhpn_rsvp_title', title);
  localStorage.setItem('mhpn_rsvp_email', email);
  localStorage.setItem('mhpn_rsvp_attendance', attendance);

  // Submit to Google Form if URL is configured
  if (GOOGLE_FORM_URL) {
    const formData = new FormData();
    formData.append(GOOGLE_ENTRY_NAME, name);
    formData.append(GOOGLE_ENTRY_TITLE, title);
    formData.append(GOOGLE_ENTRY_EMAIL, email);
    formData.append(GOOGLE_ENTRY_ATTENDANCE, attendance === 'attending' ? 'Hadir' : 'Berhalangan Hadir');

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors', // mode: no-cors is necessary to avoid CORS errors (submission still goes through!)
      body: formData
    })
    .then(() => {
      console.log('RSVP successfully sent to Google Form Database.');
    })
    .catch((error) => {
      console.error('Failed to submit RSVP to Google Form:', error);
    });
  }

  showRSVPSuccess(name, title, email, attendance);
});

// Function to open default mail client pre-filled with RSVP details
function sendRSVPEmails(name, title, email, attendance) {
  const statusText = attendance === 'attending' ? 'HADIR' : 'BERHALANGAN HADIR';
  const eventTitle = "Workshop Strategi Penyusunan Proposal Hibah & Update Tren Riset Kesehatan Mental";

  const subject = encodeURIComponent(`[RSVP] ${statusText}: ${name} - ${eventTitle}`);
  
  const body = encodeURIComponent(
    `Yth. Panitia Workshop,\n\n` +
    `Berikut adalah konfirmasi kehadiran saya untuk kegiatan workshop:\n\n` +
    `Detail Pendaftaran:\n` +
    `--------------------------------------\n` +
    `Nama Lengkap : ${name}\n` +
    `Jabatan/Instansi : ${title}\n` +
    `Alamat E-mail : ${email}\n` +
    `Status Kehadiran : ${statusText}\n` +
    `--------------------------------------\n\n` +
    `Sertifikat undangan resmi telah berhasil digenerate di browser.\n\n` +
    `Salam,\n` +
    `${name}`
  );

  // Send to organizer (ekaputri.rubedo@gmail.com) and CC the attendee
  const mailtoUrl = `mailto:ekaputri.rubedo@gmail.com?cc=${email}&subject=${subject}&body=${body}`;
  
  // Open the mail client
  window.location.href = mailtoUrl;
}

function showRSVPSuccess(name, title, email, attendance) {
  const zoomInfoSection = document.getElementById('zoom-info-section');
  rsvpFormContainer.style.display = 'none';
  rsvpSuccess.style.display = 'block';

  if (attendance === 'attending') {
    successMsg.innerHTML = `Terima kasih, <strong>${name}</strong>. Kehadiran Anda telah dikonfirmasi. Informasi akses rapat Zoom tersedia di bawah ini.`;
    if (zoomInfoSection) zoomInfoSection.style.display = 'block';
  } else {
    successMsg.innerHTML = `Terima kasih atas konfirmasi Anda, <strong>${name}</strong>. Kami menghargai tanggapan Anda dan berharap dapat bekerja sama di lain kesempatan.`;
    if (zoomInfoSection) zoomInfoSection.style.display = 'none';
  }
}

// Certificate Generation Logic
function drawCertificate(name, title) {
  const canvasWidth = 1200;
  const canvasHeight = 850;
  
  certCanvas.width = canvasWidth * 3; // 3x resolution (3600x2550) for ultra-high print quality
  certCanvas.height = canvasHeight * 3;
  
  const ctx = certCanvas.getContext('2d');
  ctx.scale(3, 3);
  
  // 1. Draw elegant ivory/cream background
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // 2. Draw outer border
  ctx.strokeStyle = '#bca060';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);
  
  // 3. Draw thin inner gold border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(35, 35, canvasWidth - 70, canvasHeight - 70);
  
  // 4. Draw decorative corner lines
  drawCornerDecorations(ctx, canvasWidth, canvasHeight);

  // 5. Draw Header Logo
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (logoImg.complete && logoImg.naturalWidth !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    // Draw logo centered (3.3:1 aspect ratio)
    ctx.drawImage(logoImg, canvasWidth / 2 - 150, 55, 300, 91);
    ctx.restore();
  }

  // Title
  ctx.fillStyle = '#0f172a'; // Deep Navy
  ctx.font = '700 56px Cinzel, Georgia, serif';
  ctx.fillText('SERTIFIKAT', canvasWidth / 2, 180);

  // Divider Line
  ctx.strokeStyle = 'rgba(188, 160, 96, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2 - 100, 215);
  ctx.lineTo(canvasWidth / 2 + 100, 215);
  ctx.stroke();

  // Subtitle 1
  ctx.fillStyle = '#64748b'; // Muted Slate
  ctx.font = 'italic 400 22px "Plus Jakarta Sans", Georgia, serif';
  ctx.fillText('Diberikan kepada', canvasWidth / 2, 250);

  // Attendee Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 700 48px Cinzel, Georgia, serif';
  ctx.fillText(name.toUpperCase(), canvasWidth / 2, 300);
  
  // Attendee Professional Title
  if (title) {
    ctx.fillStyle = '#bca060';
    ctx.font = 'italic 600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(title, canvasWidth / 2, 335);
  }

  // Subtitle 2
  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 400 22px "Plus Jakarta Sans", Georgia, serif';
  ctx.fillText('sebagai Peserta dalam kegiatan', canvasWidth / 2, 385);

  // Workshop Title
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 26px Cinzel, Georgia, serif';
  ctx.fillText('WORKSHOP STRATEGI PENYUSUNAN PROPOSAL HIBAH', canvasWidth / 2, 430);
  ctx.fillText('DAN UPDATE TREN RISET KESEHATAN MENTAL', canvasWidth / 2, 460);

  // Paragraph description
  ctx.fillStyle = '#334155';
  ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
  const descLine1 = 'yang diselenggarakan oleh Klaster Riset Mental Health and Psychiatric Nursing,';
  const descLine2 = 'Fakultas Ilmu Keperawatan Universitas Indonesia pada tanggal 14 Juli 2026';
  const descLine3 = 'secara daring melalui Zoom dengan durasi 2 JPL.';

  ctx.fillText(descLine1, canvasWidth / 2, 510);
  ctx.fillText(descLine2, canvasWidth / 2, 535);
  ctx.fillText(descLine3, canvasWidth / 2, 560);

  // 10. Center Signature Layout (Single Signatory - Prof. Herni Susanti)
  const sigX = canvasWidth / 2;
  const sigY = 725;

  ctx.fillStyle = '#334155';
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Depok, 14 Juli 2026', sigX, sigY - 95);
  ctx.fillText('Ketua Klaster Riset', sigX, sigY - 70);
  ctx.fillText('Mental Health and Psychiatric Nursing', sigX, sigY - 45);

  // Signature Line
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sigX - 120, sigY + 15);
  ctx.lineTo(sigX + 120, sigY + 15);
  ctx.stroke();

  // Real signature drawing (using multiply blending to remove any white background box cleanly)
  if (sigImg.complete && sigImg.naturalWidth !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    // Draw signature centered above and overlapping the line (enlarged even more)
    ctx.drawImage(sigImg, sigX - 180, sigY - 50, 360, 108);
    ctx.restore();
  }

  // Seal/Stamp image shifted further to the left to avoid ugly text overlap
  if (stampImg.complete && stampImg.naturalWidth !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    // Position stamp on the left, overlapping the left side of the signature line
    ctx.drawImage(stampImg, sigX - 280, sigY - 35, 240, 80);
    ctx.restore();
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Prof. Herni Susanti, S.Kp., M.N., Ph.D.', sigX, sigY + 38);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NUP. 197512061999032001', sigX, sigY + 58);
}

function drawCornerDecorations(ctx, w, h) {
  const size = 30;
  const margin = 48;

  ctx.strokeStyle = '#bca060';
  ctx.lineWidth = 2;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(margin, margin + size);
  ctx.lineTo(margin, margin);
  ctx.lineTo(margin + size, margin);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(w - margin, margin + size);
  ctx.lineTo(w - margin, margin);
  ctx.lineTo(w - margin - size, margin);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(margin, h - margin - size);
  ctx.lineTo(margin, h - margin);
  ctx.lineTo(margin + size, h - margin);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(w - margin, h - margin - size);
  ctx.lineTo(w - margin, h - margin);
  ctx.lineTo(w - margin - size, h - margin);
  ctx.stroke();
}

// Download Certificate Button
const downloadBtn = document.getElementById('download-cert-btn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const name = localStorage.getItem('mhpn_rsvp_name') || 'Undangan';
    const fileName = `Undangan_Workshop_MHPN_FIK_UI_${name.replace(/\s+/g, '_')}.png`;
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = certCanvas.toDataURL('image/png');
    link.click();
  });
}

// Send Certificate Email Button
const emailBtn = document.getElementById('email-cert-btn');
const emailToast = document.getElementById('email-toast');
const toastEmailDesc = document.getElementById('toast-email-desc');

if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const name = localStorage.getItem('mhpn_rsvp_name') || 'Peserta';
    const title = localStorage.getItem('mhpn_rsvp_title') || '';
    const email = localStorage.getItem('mhpn_rsvp_email') || 'ekaputri.rubedo@gmail.com';
    const attendance = localStorage.getItem('mhpn_rsvp_attendance') || 'attending';
    
    sendRSVPEmails(name, title, email, attendance);
    
    toastEmailDesc.innerText = `Mengalihkan ke aplikasi email untuk mengirim sertifikat ke ${email}...`;
    emailToast.classList.add('show');
    
    setTimeout(() => {
      emailToast.classList.remove('show');
    }, 4500);
  });
}

// Add to Calendar Generator (.ics file)
const calendarBtn = document.getElementById('calendar-btn');
calendarBtn.addEventListener('click', () => {
  const event = {
    title: 'Workshop Strategi Penyusunan Proposal Hibah & Update Tren Riset Kesehatan Mental',
    description: 'Mental Health & Psychiatric Nursing Research Cluster mengundang Anda ke Rapat Zoom.\\n\\nTopik: Workshop Kluster\\nID Rapat: 837 2819 9098\\nKode Sandi: 334353\\n\\nLink Zoom: https://us06web.zoom.us/j/83728199098?pwd=L4luYUOYzD1xY5QmD5NndHOrw3GfAc.1',
    location: 'Zoom Online Meeting (https://us06web.zoom.us/j/83728199098?pwd=L4luYUOYzD1xY5QmD5NndHOrw3GfAc.1)',
    start: '20260714T130000',
    end: '20260714T150000'
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FIKUI//Research Cluster Invitation//ID',
    'BEGIN:VEVENT',
    `UID:${new Date().getTime()}@ui.ac.id`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${event.start}`,
    `DTEND:${event.end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Workshop_Riset_Kesehatan_Mental_FIK_UI.ics';
  link.click();
});

// Update RSVP Form Details
const editRsvpBtn = document.getElementById('edit-rsvp-btn');
editRsvpBtn.addEventListener('click', () => {
  rsvpSuccess.style.display = 'none';
  rsvpFormContainer.style.display = 'block';
  
  // Populate from local storage
  document.getElementById('full-name').value = localStorage.getItem('mhpn_rsvp_name') || '';
  document.getElementById('professional-title').value = localStorage.getItem('mhpn_rsvp_title') || '';
  document.getElementById('email-address').value = localStorage.getItem('mhpn_rsvp_email') || '';
});
