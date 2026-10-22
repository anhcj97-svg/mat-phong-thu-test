// GD 22/10: PHONG THU — bang dieu khien ban web mini test DONG VAT + animation dong vat (gui lenh "thu_*" vao game)
(() => {
 const send=(action,value)=>{if(window.matCommand)window.matCommand(JSON.stringify({action,value}));};
 const focusGame=()=>{const c=document.getElementById('canvas');if(c)c.focus();};
 const p=document.createElement('aside');p.id='mat-panel';
 const nut=(cls,items)=>`<div class="row ${cls}">`+items.map(([t,a,v])=>`<button data-a="${a}" data-v="${v}">${t}</button>`).join('')+'</div>';
 p.innerHTML=`<h2>MAT · Phòng thú</h2><small id="tap-fps">FPS: đang đo…</small>
 <b>Chế độ</b>${nut('che',[['Sinh hoạt','thu_xem','false'],['Xem hoạt ảnh 8 hướng','thu_xem','true']])}
 <b>Xem hoạt ảnh</b>${nut('anim',[['Đứng (IDLE)','thu_anim','idle'],['Đi chậm (dạo)','thu_anim','cham'],['Nhảy (bỏ chạy)','thu_anim','di'],['Gặm cỏ','thu_anim','gam'],['Đứng thẳng','thu_anim','dung'],['Chết (mắt xoáy)','thu_anim','chet']])}
 <b>Săn thử (chưa có vũ khí)</b>${nut('',[['Hạ 1 con thỏ','thu_ha',0],['Hồi sinh tất cả','thu_hoi',0]])}
 <div class="huong">${[[3,'↖'],[4,'↑'],[5,'↗'],[2,'←'],[-1,'8 hướng'],[6,'→'],[1,'↙'],[0,'↓'],[7,'↘']].map(([v,t])=>`<button data-a="thu_huong" data-v="${v}">${t}</button>`).join('')}</div>
 <b>Tốc độ</b>${nut('toc',[['×1','thu_toc',1],['×0,5','thu_toc',.5],['×0,25','thu_toc',.25],['×0,1','thu_toc',.1]])}
 <b>Dừng hình</b>${nut('',[['Dừng / Chạy','thu_dung',0],['+1 nhịp','thu_buoc',1],['+0,1 s','thu_buoc',6]])}
 <b>Cỡ thỏ (MAT cao 64 px)</b>${nut('co',[['18','thu_co',18],['24','thu_co',24],['30','thu_co',30],['36','thu_co',36],['44','thu_co',44]])}
 <b>Lọc hình</b>${nut('loc',[['Mịn','thu_loc','true'],['Pixel','thu_loc','false']])}
 <b>Giờ trong ngày</b>${nut('gio',[['6h','thu_gio',6],['7h','thu_gio',7],['12h30','thu_gio',12.5],['17h30','thu_gio',17.5],['19h','thu_gio',19.5],['21h','thu_gio',21]])}
 <label><input type="checkbox" data-c="thu_dong_ho"> Đồng hồ chạy nhanh (1 giây = 1 phút game)</label>
 <b>Số thỏ</b>${nut('so',[['1','thu_so',1],['2','thu_so',2],['4','thu_so',4],['6','thu_so',6]])}
 <b>Phóng to</b>${nut('zoom',[['×1','thu_zoom',1],['×2','thu_zoom',2],['×3','thu_zoom',3]])}
 <label><input type="checkbox" data-c="thu_fx" checked> Hiệu ứng bụi chân / vụn cỏ</label>
 <label><input type="checkbox" data-c="thu_sfx" checked> Tiếng thỏ (bước, nhảy, nhai, kêu)</label>
 <label><input type="checkbox" data-c="thu_nhan" checked> Nhãn trạng thái trên đầu thỏ</label>
 <label><input type="checkbox" data-c="thu_nhac"> Nhấc người thêm bằng code khi nhảy (tắt = đúng hình gốc, mặc định)</label>
 ${nut('',[['Đặt lại','thu_lai',0]])}
 <small>WASD đi · Shift chạy. Đứng yên thỏ chỉ thấy bạn khi lại rất gần; đi bộ thì thỏ thấy từ xa hơn; chạy thì thỏ thấy từ rất xa và bỏ chạy sớm.<br>Thỏ: ngồi, ngó quanh, gặm cỏ, đi chậm từng đoạn rồi dừng; thấy người thì đứng im cảnh giác, tới gần thì nhảy zíc zắc về bụi và trốn; con này chạy thì con bên cạnh giật mình theo. Ban trưa nghỉ nhiều, đêm (sau 20h) về bụi ngủ.</small>`;
 document.body.append(p);
 const css=document.createElement('style');css.textContent='#mat-panel b{display:block;margin-top:10px;color:#ffe1a0}#mat-panel .huong{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:6px 0}#mat-panel button[aria-pressed=true]{border:2px solid #ffe089;background:#47633c}';document.head.append(css);
 const t=document.createElement('button');t.id='mat-toggle';t.textContent='Ẩn bảng';t.onclick=()=>{p.hidden=!p.hidden;t.textContent=p.hidden?'⚙ Bảng':'Ẩn bảng';focusGame();};document.body.append(t);
 const val=v=>v==='true'?true:v==='false'?false:(isNaN(Number(v))?v:Number(v));
 p.querySelectorAll('button[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;send(a,val(b.dataset.v));
  if(!['thu_dung','thu_buoc','thu_lai','thu_ha','thu_hoi'].includes(a))p.querySelectorAll(`button[data-a="${a}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  b.blur();focusGame();});
 p.querySelectorAll('input[data-c]').forEach(c=>c.onchange=()=>{send(c.dataset.c,c.checked);c.blur();focusGame();});
 window.matState=raw=>{try{const s=JSON.parse(raw);if(s.fps!==undefined)document.getElementById('tap-fps').textContent=`FPS: ${Math.round(s.fps)} · ${s.ms.toFixed(1)} ms/khung`;}catch{}};
 window.matDownload=()=>{};window.matSave=()=>{};
})();
