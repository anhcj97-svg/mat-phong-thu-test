// GD 23/10: bang HEO (thay bang tho: panel_thu_tho.js). GD 22/10: PHONG THU — bang dieu khien ban web mini test DONG VAT + animation dong vat (gui lenh "thu_*" vao game)
(() => {
 const send=(action,value)=>{if(window.matCommand)window.matCommand(JSON.stringify({action,value}));};
 const focusGame=()=>{const c=document.getElementById('canvas');if(c)c.focus();};
 const p=document.createElement('aside');p.id='mat-panel';
 const nut=(cls,items)=>`<div class="row ${cls}">`+items.map(([t,a,v])=>`<button data-a="${a}" data-v="${v}">${t}</button>`).join('')+'</div>';
 p.innerHTML=`<h2>MAT · Phòng thú · HEO RỪNG</h2><small id="tap-fps">FPS: đang đo…</small>
 <b>Chế độ</b>${nut('che',[['Sinh hoạt','thu_xem','false'],['Xem hoạt ảnh 8 hướng','thu_xem','true']])}
 <b>Xem hoạt ảnh</b>${nut('anim',[['Đứng (idle)','thu_anim','idle'],['Đi (walk)','thu_anim','walk'],['Chạy','thu_anim','chay'],['Húc (v6)','thu_anim','huc'],['Ủi đất','thu_anim','ui_dat'],['Chết (mắt xoáy)','thu_anim','chet']])}
 <div class="huong">${[[3,'↖'],[4,'↑'],[5,'↗'],[2,'←'],[-1,'8 hướng'],[6,'→'],[1,'↙'],[0,'↓'],[7,'↘']].map(([v,t])=>`<button data-a="thu_huong" data-v="${v}">${t}</button>`).join('')}</div>
 <b>Săn thử · vũ khí</b>${nut('',[['Cầm rìu gỗ','axe','wood'],['Cầm rìu đá','axe','stone'],['Cầm rìu đồng','axe','bronze']])}
 ${nut('',[['Hạ 1 con heo (gần MAT nhất)','thu_ha',0],['Hồi sinh tất cả','thu_hoi',0]])}
 <b>Hiệu ứng (VFX thử)</b>${nut('',[['Gió cuộn (phím X)','thu_gio_cuon',0]])}
 <label><input type="checkbox" data-c="thu_gio_tu" checked> Gió tự thổi (9–16 giây 1 lần)</label>
 <b>Tốc độ</b>${nut('toc',[['×1','thu_toc',1],['×0,5','thu_toc',.5],['×0,25','thu_toc',.25],['×0,1','thu_toc',.1]])}
 <b>Dừng hình</b>${nut('',[['Dừng / Chạy','thu_dung',0],['+1 nhịp','thu_buoc',1],['+0,1 s','thu_buoc',6]])}
 <b>Cỡ heo (MAT cao 64 px · thỏ cũ 30)</b>${nut('co',[['32','thu_co',32],['38','thu_co',38],['44','thu_co',44],['52','thu_co',52],['60','thu_co',60]])}
 <b>Lọc hình</b>${nut('loc',[['Mịn','thu_loc','true'],['Pixel','thu_loc','false']])}
 <b>Giờ trong ngày</b>${nut('gio',[['6h','thu_gio',6],['7h','thu_gio',7],['12h30','thu_gio',12.5],['17h30','thu_gio',17.5],['19h','thu_gio',19.5],['21h','thu_gio',21]])}
 <label><input type="checkbox" data-c="thu_dong_ho"> Đồng hồ chạy nhanh (1 giây = 1 phút game)</label>
 <b>Số heo</b>${nut('so',[['1','thu_so',1],['2','thu_so',2],['3','thu_so',3],['4','thu_so',4],['6','thu_so',6]])}
 <b>Phóng to</b>${nut('zoom',[['×1','thu_zoom',1],['×2','thu_zoom',2],['×3','thu_zoom',3]])}
 <label><input type="checkbox" data-c="thu_aggro" checked> Heo tự bị khiêu khích (tắt = heo chỉ sinh hoạt, không đuổi)</label>
 <label><input type="checkbox" data-c="thu_nhan" checked> Nhãn trạng thái trên đầu heo</label>
 ${nut('',[['Đặt lại','thu_lai',0]])}
 <small>WASD đi · Shift chạy · cầm rìu + giữ E = chém (mỗi nhát trúng: sao nổ + heo nháy trắng; 3 nhát heo mới chết, không máu) · X = gió cuộn.<br>Heo: đứng nghỉ, đi dạo, ủi đất. MAT lại gần (đứng yên 6,5 ô · đi bộ 9,5 ô · chạy Shift 13 ô) → heo chú ý, rồi CHẠY lao tới và HÚC khi còn ~2,6 ô; húc xong hồi sức ~1 s rồi húc tiếp / đuổi tiếp. MAT chạy xa hơn 20 ô trong 3 s → heo bỏ cuộc. Húc trúng MAT chỉ đẩy lùi + báo trên chữ góc (phòng thú không trừ máu). Chưa có bụi / hạt (GD tự thêm bằng shader).</small>`;
 document.body.append(p);
 const css=document.createElement('style');css.textContent='#mat-panel b{display:block;margin-top:10px;color:#ffe1a0}#mat-panel .huong{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:6px 0}#mat-panel button[aria-pressed=true]{border:2px solid #ffe089;background:#47633c}';document.head.append(css);
 const t=document.createElement('button');t.id='mat-toggle';t.textContent='Ẩn bảng';t.onclick=()=>{p.hidden=!p.hidden;t.textContent=p.hidden?'⚙ Bảng':'Ẩn bảng';focusGame();};document.body.append(t);
 const val=v=>v==='true'?true:v==='false'?false:(isNaN(Number(v))?v:Number(v));
 p.querySelectorAll('button[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;send(a,val(b.dataset.v));
  if(!['thu_dung','thu_buoc','thu_lai','thu_ha','thu_hoi','axe','thu_gio_cuon'].includes(a))p.querySelectorAll(`button[data-a="${a}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  b.blur();focusGame();});
 p.querySelectorAll('input[data-c]').forEach(c=>c.onchange=()=>{send(c.dataset.c,c.checked);c.blur();focusGame();});
 window.matState=raw=>{try{const s=JSON.parse(raw);if(s.fps!==undefined)document.getElementById('tap-fps').textContent=`FPS: ${Math.round(s.fps)} · ${s.ms.toFixed(1)} ms/khung`;}catch{}};
 window.matDownload=()=>{};window.matSave=()=>{};
})();
