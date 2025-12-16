// app.js — comportamiento mínimo del prototipo ShareCore

document.addEventListener('DOMContentLoaded',function(){
  // initial built-in offers
  const initialDevices = [
    {id:1, name: 'Gamer-RTX', type: 'Ordenador completo', hours: '18:00-22:00', price: 5, desc: 'PC con RTX 3080, 16GB RAM — ideal para gaming y render ligero'},
    {id:2, name: 'Storage-1TB', type: 'Partición de disco', hours: '7 d', price: 2, desc: '500GB disponibles, perfecto para backups y almacenamiento temporal'},
    {id:3, name: 'Miner-Node', type: 'Ordenador completo', hours: '02:00-06:00', price: 3, desc: 'Equipo con buena GPU para tareas intensas'},
    {id:4, name: 'Studio-Render', type: 'Ordenador completo', hours: '20:00-08:00', price: 8, desc: 'Workstation con CPU eGPU para render de vídeo por la noche'},
    {id:5, name: 'DataLab-2TB', type: 'Partición de disco', hours: '14 d', price: 5, desc: '2TB de espacio disponible para datasets y procesamiento por lotes'},
    {id:6, name: 'Dev-Workstation', type: 'Ordenador completo', hours: '09:00-18:00', price: 4, desc: 'Equipo optimizado para desarrollo: múltiples VMs y 32GB RAM'},
    {id:7, name: 'AI-Train', type: 'Ordenador completo', hours: '00:00-06:00', price: 12, desc: 'GPU-heavy node para entrenamiento de modelos (noche)'},
    {id:8, name: 'Backup-500GB', type: 'Partición de disco', hours: '30 d', price: 1, desc: 'Pequeña partición rentable para copias de seguridad y snapshots'},
    {id:9, name: 'Video-Edit-i9', type: 'Ordenador completo', hours: '14:00-22:00', price: 6, desc: 'CPU i9, 64GB RAM, rápido para edición y exportes'},
    {id:10, name: 'Compute-8CPU', type: 'Ordenador completo', hours: '06:00-18:00', price: 3.5, desc: 'Nodo económico con 8 vCPU para builds y CI'},
    {id:11, name: 'ColdStorage-5TB', type: 'Partición de disco', hours: '60 d', price: 10, desc: 'Gran volumen para archivado a bajo coste (ideal backups largos)'},
    {id:12, name: 'GPU-RTX-AI', type: 'Ordenador completo', hours: '22:00-04:00', price: 15, desc: 'Máquina con GPU moderna para inferencia y entrenamiento ligero'},
    {id:13, name: 'NAS-200GB', type: 'Partición de disco', hours: '10 d', price: 0.8, desc: 'Partición pequeña para sincronización y compartir ficheros'},
    {id:14, name: 'Media-Transcode', type: 'Ordenador completo', hours: '12:00-23:00', price: 7, desc: 'Optimizado para transcodificación de video'},
    {id:15, name: 'Research-Cluster-Node', type: 'Ordenador completo', hours: '00:00-12:00', price: 9, desc: 'Nodo para cálculo científico con gran memoria'}
  ];

  // load persisted offers from localStorage and merge
  let stored = [];
  try{ stored = JSON.parse(localStorage.getItem('sharecore_offers')||'[]') || []; }catch(e){ stored = []; }
  // devices is the merged array used for rendering
  const devices = initialDevices.concat(stored);
  // keep a mutable store for persistence updates
  window.devicesStore = devices.slice();

  const list = document.getElementById('device-list');
  const search = document.getElementById('search');

  // expose renderDevices globally so owner form handler can call it
  window.renderDevices = function(filter){
    if(!list) return;
    list.innerHTML = '';
    const qLower = filter ? filter.toLowerCase() : '';
    const filtered = window.devicesStore.filter(d=>{
      if(!qLower) return true;
      return (d.name+" "+d.type+" "+d.desc).toLowerCase().includes(qLower);
    });
    if(filtered.length===0){
      list.innerHTML = '<p class="muted">No se han encontrado ofertas que coincidan.</p>';
      return;
    }
    filtered.forEach(d=>{
      const el = document.createElement('div'); el.className='device';
      // choose unit: per day for partitions, per hour otherwise
      const isPartition = String(d.type||'').includes('Partición');
      const unit = isPartition ? '€/día' : '€/h';
      // format price nicely: show up to 2 decimals, but drop .00
      let priceVal = d.price;
      let priceText = (typeof priceVal === 'number') ? (Number.isInteger(priceVal) ? String(priceVal) : priceVal.toFixed(2)) : String(priceVal);
      el.innerHTML = `<div class="device-top"><div style="display:flex;gap:12px;align-items:center"><span class="icon">🖥️</span><h4>${d.name}</h4></div><span class="price-badge">${priceText} ${unit}</span></div>
      <p class="meta">${d.type} · Horario: ${d.hours}</p>
      <p>${d.desc}</p>
      <div style="margin-top:10px"><button class="btn" data-id="${d.id}">Alquilar (prototipo)</button></div>`;
      // set data-id attr also on parent for quick selection
      const btn = el.querySelector('button'); if(btn) btn.setAttribute('data-id', d.id);
      list.appendChild(el);
    });
  };

  // initial render
  window.renderDevices();

  if(search){
    search.addEventListener('input',e=>{
      window.renderDevices(e.target.value);
    });
  }

  // click handler for renting buttons
  list.addEventListener('click',e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id; const device = window.devicesStore.find(x=>String(x.id)===String(id));
    if(!device) return;
  const isPartition = String(device.type||'').includes('Partición');
  const unit = isPartition ? '€/día' : '€/h';
  const formatted = (typeof device.price === 'number') ? (Number.isInteger(device.price) ? String(device.price) : device.price.toFixed(2)) : String(device.price);
  const ok = confirm(`Enviar solicitud de alquiler para ${device.name} por ${formatted} ${unit}? (simulación)`);
    if(ok) alert('¡Solicitud enviada (simulación)!');
  });
  // Owner form: allow users to add a device which will appear in the list
  (function(){
    const ownerForm = document.getElementById('owner-form');
    const toast = document.getElementById('toast');
    if(!ownerForm) return;

    // behavior: if type == 'Partición de disco' then show duration (number of hours) instead of schedule
    const typeSelect = ownerForm.querySelector('[name="type"]');
    const hoursInput = document.getElementById('hours-input');
    const hoursLabel = document.getElementById('hours-label');
  const priceLabelEl = ownerForm.querySelector('#price-label-text');
    function updateHoursMode(){
      if(!typeSelect || !hoursInput || !hoursLabel) return;
      const val = typeSelect.value || '';
      if(val.includes('Partición')){
        // switch to duration mode (days)
        hoursInput.type = 'number';
        hoursInput.min = '1';
        hoursInput.placeholder = 'Duración en días (ej. 3)';
        hoursLabel.textContent = 'Duración (días)';
  if(priceLabelEl) priceLabelEl.textContent = 'Precio €/día';
      } else {
        // schedule mode
        hoursInput.type = 'text';
        hoursInput.removeAttribute('min');
        hoursInput.placeholder = '00:00-23:59';
        hoursLabel.textContent = 'Horario (p. ej. 20:00-23:00)';
  if(priceLabelEl) priceLabelEl.textContent = 'Precio €/hora';
      }
      // update preview with current values
      const fd = new FormData(ownerForm);
      updatePreview({name:fd.get('name')||'MiPC (ejemplo)', type:fd.get('type')||'Tipo', hours:fd.get('hours')||'Horario', price:fd.get('price')||'--', desc:fd.get('desc')||'Descripción corta...' });
    }
    if(typeSelect) typeSelect.addEventListener('change', updateHoursMode);
    // run once to set initial state
    updateHoursMode();

    function showToast(msg){
      if(!toast) return; toast.textContent = msg; toast.classList.add('show');
      setTimeout(()=>toast.classList.remove('show'),2800);
    }

    ownerForm.addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(ownerForm);
      const data = {
        id: Date.now(),
        name: fd.get('name') || 'Mi equipo',
        type: fd.get('type') || 'Ordenador completo',
        // if partition -> store duration in days as "Nd"; otherwise keep schedule string
        hours: (String(fd.get('type')||'').includes('Partición') ? `${fd.get('hours')} d` : (fd.get('hours') || '00:00-23:59')),
        price: parseFloat(fd.get('price')||0),
        // explicit unit stored to avoid ambiguity: 'day' or 'hour'
        priceUnit: (String(fd.get('type')||'').includes('Partición') ? 'day' : 'hour'),
        desc: fd.get('desc')||''
      };
      window.devicesStore = window.devicesStore || [];
      window.devicesStore.push(data);
      // persist only user-added items
  try{ localStorage.setItem('sharecore_offers', JSON.stringify(window.devicesStore.filter(d=>d.id>1000000||d.id<1000000))); }catch(e){}
      if(typeof window.renderDevices === 'function'){
        window.renderDevices();
        setTimeout(()=>{
          const newBtn = document.querySelector(`[data-id='${data.id}']`);
          if(newBtn) newBtn.closest('.device').classList.add('animate-card');
        },80);
      }
      ownerForm.reset();
      showToast('Oferta publicada. ¡Buena suerte!');
      // reset preview to defaults after publish
      updatePreview({name:'MiPC (ejemplo)',type:'Tipo',hours:'Horario',price:'--',desc:'Descripción corta...'})
    });

    const resetBtn = document.getElementById('owner-reset');
    if(resetBtn) resetBtn.addEventListener('click',()=>ownerForm.reset());
  })();

  // end of main DOMContentLoaded
  // Navigation: toggle between home and host views
  (function(){
    const navHome = document.getElementById('nav-home');
    const navHost = document.getElementById('nav-host');
    const hostView = document.getElementById('host-view');
    const offersView = document.querySelector('[data-view="home"]');

    function setActive(link){
      document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('active'));
      if(link) link.classList.add('active');
    }

    function showView(name){
      if(name==='host'){
        if(hostView){ hostView.setAttribute('aria-hidden','false'); }
        if(offersView){ offersView.style.display = 'none'; }
        // hide header and footer for full-screen host experience
        const headerEl = document.querySelector('header.hero');
        const footerEl = document.querySelector('footer.footer');
  const topnavEl = document.querySelector('.topnav');
  if(headerEl) headerEl.style.display = 'none';
  if(footerEl) footerEl.style.display = 'none';
  // keep top navigation visible while in host view
  if(topnavEl) topnavEl.style.display = '';
        // prevent background scrolling while host view is open
        try{ document.body.style.overflow = 'hidden'; }catch(e){}
        setActive(navHost);
        // focus first input in owner form
        setTimeout(()=>{ const inp = document.querySelector('#owner-form [name="name"]'); if(inp) inp.focus(); },120);
      } else {
        if(hostView){ hostView.setAttribute('aria-hidden','true'); }
        if(offersView){ offersView.style.display = ''; }
        // restore header and footer
        const headerEl = document.querySelector('header.hero');
        const footerEl = document.querySelector('footer.footer');
  const topnavEl = document.querySelector('.topnav');
  if(headerEl) headerEl.style.display = '';
  if(footerEl) footerEl.style.display = '';
  if(topnavEl) topnavEl.style.display = '';
        try{ document.body.style.overflow = ''; }catch(e){}
        setActive(navHome);
      }
      // scroll to top of page for clarity
      window.scrollTo({top:0,behavior:'smooth'});
    }

    if(navHome) navHome.addEventListener('click',e=>{ e.preventDefault(); showView('home'); });
    if(navHost) navHost.addEventListener('click',e=>{ e.preventDefault(); showView('host'); });

    // initial view
    showView('home');
  })();

});

// live preview: update preview card as user types
function updatePreview(values){
  const preview = document.getElementById('preview-card');
  if(!preview) return;
  const title = preview.querySelector('.preview-title');
  const price = preview.querySelector('.preview-price');
  const meta = preview.querySelector('.preview-meta');
  const desc = preview.querySelector('.preview-desc');
  if(title) title.textContent = values.name || 'MiPC (ejemplo)';
  if(price){
    const isPartition = String(values.type||'').includes('Partición');
    const unit = isPartition ? '€/día' : '€/h';
    price.textContent = (values.price && values.price!=='') ? `${values.price} ${unit}` : `-- ${unit}`;
  }
  if(meta) meta.textContent = `${values.type || 'Tipo'} · ${values.hours || 'Horario'}`;
  if(desc) desc.textContent = values.desc || 'Descripción corta...';
}

// wire preview to form inputs (if present)
document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('owner-form');
  if(!form) return;
  const inputs = ['name','type','hours','price','desc'];
  function readAndUpdate(){
    const fd = new FormData(form);
    const v = {name:fd.get('name')||'MiPC (ejemplo)', type:fd.get('type')||'Tipo', hours:fd.get('hours')||'Horario', price:fd.get('price')||'--', desc:fd.get('desc')||'Descripción corta...'};
    updatePreview(v);
  }
  form.addEventListener('input', readAndUpdate);
  // initial preview fill
  readAndUpdate();
});
