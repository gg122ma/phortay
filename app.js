/* ===== LOCAL DATA STORE ===== */
var STORE_KEY='three-leg-cat-store-v2';
var SESSION_KEY='three-leg-cat-session-v2';

function makeId(prefix){
  return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
}

function fileToDataUrl(file){
  return new Promise(function(resolve,reject){
    var reader=new FileReader();
    reader.onload=function(){resolve(reader.result)};
    reader.onerror=function(){reject(new Error('Failed to read file'))};
    reader.readAsDataURL(file);
  });
}

function seedStore(){
  return {
    users:[
      {id:'user-admin',name:'Admin',email:'admin@3legcat.local',password:'admin123456',role:'admin',avatar_url:''}
    ],
    categories:[
      {id:1,name_zh:'咖啡',name_en:'Coffee',name_ms:'Kopi',sort_order:1},
      {id:2,name_zh:'主食',name_en:'Mains',name_ms:'Hidangan Utama',sort_order:2},
      {id:3,name_zh:'甜点',name_en:'Desserts',name_ms:'Pencuci Mulut',sort_order:3}
    ],
    menu_items:[
      {id:101,name_zh:'海盐拿铁',name_en:'Sea Salt Latte',name_ms:'Latte Garam Laut',description_zh:'顺滑奶泡与浓缩咖啡的招牌搭配。',description_en:'A signature latte with silky foam and espresso.',description_ms:'Latte istimewa dengan buih lembut dan espresso.',price:15.9,category_id:1,image_url:'',is_available:true,sort_order:1,updated_at:new Date().toISOString()},
      {id:102,name_zh:'娘惹叻沙意面',name_en:'Nyonya Laksa Pasta',name_ms:'Pasta Laksa Nyonya',description_zh:'带有椰香与香料层次的创意主食。',description_en:'A creative pasta with fragrant coconut laksa notes.',description_ms:'Pasta kreatif dengan aroma santan dan laksa.',price:28.0,category_id:2,image_url:'',is_available:true,sort_order:2,updated_at:new Date().toISOString()},
      {id:103,name_zh:'焦糖布丁',name_en:'Caramel Pudding',name_ms:'Puding Karamel',description_zh:'口感细腻，甜度柔和。',description_en:'Smooth, delicate, and gently sweet.',description_ms:'Lembut, halus dan manis sederhana.',price:12.5,category_id:3,image_url:'',is_available:true,sort_order:3,updated_at:new Date().toISOString()}
    ],
    reservations:[],
    site_settings:{
      hero:{title_zh:'三脚猫咖啡馆',title_en:'3 Leg Cat Cafe',title_ms:'Kafe 3 Leg Cat',subtitle_zh:'在温暖角落里，品尝咖啡与现代娘惹风味。',subtitle_en:'Coffee, comfort, and modern Nyonya flavors in one cozy corner.',subtitle_ms:'Kopi, suasana selesa dan cita rasa Nyonya moden dalam satu ruang.',image_url:''},
      featured_ids:{ids:[101,102,103]},
      about:{story_zh:'三脚猫咖啡馆是一家结合咖啡、轻食与温暖氛围的小店。',story_en:'3 Leg Cat Cafe blends coffee, comfort food, and a welcoming atmosphere.',story_ms:'3 Leg Cat Cafe menggabungkan kopi, makanan selesa dan suasana mesra.'},
      contact:{address_zh:'吉隆坡示例路 123 号',address_en:'123 Sample Street, Kuala Lumpur',address_ms:'123 Jalan Contoh, Kuala Lumpur',phone:'+60 12-345 6789',email:'hello@3legcat.local',hours:'10:00 - 22:00'}
    }
  };
}

function readStore(){
  var raw=localStorage.getItem(STORE_KEY);
  if(!raw){
    var seeded=seedStore();
    writeStore(seeded);
    return seeded;
  }
  try{return JSON.parse(raw)}catch(e){
    var reset=seedStore();
    writeStore(reset);
    return reset;
  }
}

function writeStore(data){
  localStorage.setItem(STORE_KEY,JSON.stringify(data));
}

function mutateStore(fn){
  var data=readStore();
  var next=fn(data)||data;
  writeStore(next);
  return next;
}

function getUsers(){return readStore().users||[]}
function findUserById(id){return getUsers().find(function(u){return u.id===id})||null}
function findUserByEmail(email){return getUsers().find(function(u){return u.email.toLowerCase()===String(email||'').toLowerCase()})||null}

/* ===== I18N ===== MODIFIED: added register & profile translations ===== */
var LANGS=['en','zh','ms'];
var T={
  en:{
    nav:{home:'Home',menu:'Menu',reservation:'Reservation',about:'About',contact:'Contact Us',login:'Login',logout:'Logout',admin:'Admin',profile:'My Profile'},
    home:{tagline:'Where artisanal coffee meets modern Nyonya flavors in a cozy corner.',bookNow:'Book a Table',viewMenu:'View Menu',featured:'Featured Items'},
    menu:{title:'Our Menu',all:'All',price:'RM'},
    res:{title:'Make a Reservation',name:'Name',email:'Email',phone:'Phone',date:'Date',time:'Time',size:'Party Size',notes:'Special Requests',submit:'Confirm Booking',okTitle:'Reservation Confirmed!',okDesc:'We have received your booking request.',another:'Make Another'},
    about:{title:'About 3 Leg Cat'},
    contact:{title:'Contact Us',address:'Address',hours:'Opening Hours',phone:'Phone',email:'Email'},
    login:{title:'Login',email:'Email',password:'Password',submit:'Sign In',error:'Invalid email or password'},
    register:{title:'Register',name:'Name',email:'Email',password:'Password',confirmPass:'Confirm Password',submit:'Create Account',noAccount:"Don't have an account?",hasAccount:'Already have an account?',regInstead:'Register now',loginInstead:'Sign in instead',success:'Account created! You can now sign in.',passMismatch:'Passwords do not match',confirmSent:'Confirmation email sent! Please check your inbox.'},
    profile:{title:'My Profile',avatar:'Profile Photo',upload:'Upload Photo',save:'Save Changes',saved:'Profile updated!',name:'Name',email:'Email',noLogin:'Please log in to view your profile.'},
    admin:{title:'Admin Dashboard',dash:'Dashboard',hp:'Homepage',menuM:'Menu',res:'Reservations',totalIt:'Menu Items',totalCat:'Categories',pendRes:'Pending',totalRes:'Total',hero:'Hero Section',featIt:'Featured Items',aboutSec:'About',contactSec:'Contact Info',cats:'Categories',menuIt:'Menu Items',addIt:'Add Item',addCat:'Add Category',edit:'Edit',delete:'Delete',save:'Save',cancel:'Cancel',confirm:'Confirm',uploadImg:'Upload Image',name:'Name',desc:'Description',price:'Price',category:'Category',available:'Available',yes:'Yes',no:'No',actions:'Actions',gName:'Guest',gEmail:'Email',gPhone:'Phone',date:'Date',time:'Time',sz:'Party',status:'Status',notes:'Notes',pending:'Pending',confirmed:'Confirmed',cancelled:'Cancelled',noImg:'No image',uploaded:'Image uploaded!',sOrder:'Sort Order',subtitle:'Subtitle',titleL:'Title'}
  },
  zh:{
    nav:{home:'首页',menu:'菜单',reservation:'预订',about:'关于我们',contact:'联系我们',login:'登录',logout:'退出',admin:'管理后台',profile:'个人资料'},
    home:{tagline:'在这个角落，感受手冲咖啡与现代娘惹风味的碰撞。',bookNow:'立即预订',viewMenu:'查看菜单',featured:'招牌推荐'},
    menu:{title:'我们的菜单',all:'全部',price:'RM'},
    res:{title:'预订座位',name:'姓名',email:'邮箱',phone:'电话',date:'日期',time:'时间',size:'人数',notes:'备注',submit:'确认预订',okTitle:'预订成功！',okDesc:'我们已收到您的预订请求，期待您的光临。',another:'再次预订'},
    about:{title:'关于三脚猫'},
    contact:{title:'联系我们',address:'地址',hours:'营业时间',phone:'电话',email:'邮箱'},
    login:{title:'登录',email:'邮箱',password:'密码',submit:'登录',error:'邮箱或密码错误'},
    register:{title:'注册',name:'姓名',email:'邮箱',password:'密码',confirmPass:'确认密码',submit:'创建账号',noAccount:'还没有账号？',hasAccount:'已有账号？',regInstead:'立即注册',loginInstead:'返回登录',success:'账号已创建！现在可以登录了。',passMismatch:'两次输入的密码不一致',confirmSent:'确认邮件已发送，请查收邮箱。'},
    profile:{title:'个人资料',avatar:'头像',upload:'上传头像',save:'保存修改',saved:'资料已更新！',name:'姓名',email:'邮箱',noLogin:'请先登录后再查看个人资料。'},
    admin:{title:'管理后台',dash:'概览',hp:'首页内容',menuM:'菜单管理',res:'预订管理',totalIt:'菜品数',totalCat:'分类数',pendRes:'待处理',totalRes:'总预订',hero:'首页区域',featIt:'推荐菜品',aboutSec:'关于我们',contactSec:'联系信息',cats:'分类',menuIt:'菜品',addIt:'添加菜品',addCat:'添加分类',edit:'编辑',delete:'删除',save:'保存',cancel:'取消',confirm:'确认',uploadImg:'上传图片',name:'名称',desc:'描述',price:'价格',category:'分类',available:'上架',yes:'是',no:'否',actions:'操作',gName:'姓名',gEmail:'邮箱',gPhone:'电话',date:'日期',time:'时间',sz:'人数',status:'状态',notes:'备注',pending:'待确认',confirmed:'已确认',cancelled:'已取消',noImg:'暂无图片',uploaded:'图片已上传！',sOrder:'排序',subtitle:'副标题',titleL:'标题'}
  },
  ms:{
    nav:{home:'Utama',menu:'Menu',reservation:'Tempahan',about:'Tentang Kami',contact:'Hubungi Kami',login:'Log Masuk',logout:'Log Keluar',admin:'Admin',profile:'Profil Saya'},
    home:{tagline:'Di mana kopi artisan bertemu cita rasa Nyonya moden.',bookNow:'Tempah Meja',viewMenu:'Lihat Menu',featured:'Menu Pilihan'},
    menu:{title:'Menu Kami',all:'Semua',price:'RM'},
    res:{title:'Buat Tempahan',name:'Nama',email:'E-mel',phone:'Telefon',date:'Tarikh',time:'Masa',size:'Bilangan',notes:'Nota',submit:'Sahkan',okTitle:'Tempahan Berjaya!',okDesc:'Kami telah menerima tempahan anda.',another:'Tempah Lagi'},
    about:{title:'Tentang 3 Leg Cat'},
    contact:{title:'Hubungi Kami',address:'Alamat',hours:'Waktu Operasi',phone:'Telefon',email:'E-mel'},
    login:{title:'Log Masuk',email:'E-mel',password:'Kata Laluan',submit:'Log Masuk',error:'E-mel atau kata laluan salah'},
    register:{title:'Daftar',name:'Nama',email:'E-mel',password:'Kata Laluan',confirmPass:'Sahkan Kata Laluan',submit:'Cipta Akaun',noAccount:'Belum ada akaun?',hasAccount:'Sudah ada akaun?',regInstead:'Daftar sekarang',loginInstead:'Log masuk',success:'Akaun dicipta! Sila log masuk.',passMismatch:'Kata laluan tidak sepadan',confirmSent:'E-mel pengesahan dihantar! Sila semak peti masuk anda.'},
    profile:{title:'Profil Saya',avatar:'Foto Profil',upload:'Muat Naik Foto',save:'Simpan',saved:'Profil dikemas kini!',name:'Nama',email:'E-mel',noLogin:'Sila log masuk untuk melihat profil anda.'},
    admin:{title:'Papan Pemuka',dash:'Ringkasan',hp:'Laman Utama',menuM:'Menu',res:'Tempahan',totalIt:'Item Menu',totalCat:'Kategori',pendRes:'Menunggu',totalRes:'Jumlah',hero:'Hero',featIt:'Item Pilihan',aboutSec:'Tentang',contactSec:'Hubungi',cats:'Kategori',menuIt:'Item Menu',addIt:'Tambah Item',addCat:'Tambah Kategori',edit:'Edit',delete:'Padam',save:'Simpan',cancel:'Batal',confirm:'Sahkan',uploadImg:'Muat Naik',name:'Nama',desc:'Penerangan',price:'Harga',category:'Kategori',available:'Tersedia',yes:'Ya',no:'Tidak',actions:'Tindakan',gName:'Nama',gEmail:'E-mel',gPhone:'Telefon',date:'Tarikh',time:'Masa',sz:'Bil.',status:'Status',notes:'Nota',pending:'Menunggu',confirmed:'Disahkan',cancelled:'Dibatalkan',noImg:'Tiada gambar',uploaded:'Dimuat naik!',sOrder:'Susunan',subtitle:'Sarikata',titleL:'Tajuk'}
  }
};
var lang=localStorage.getItem('lang')||'en';
function t(k){var s=k.split('.'),r=T[lang];for(var i=0;i<s.length;i++){if(!r)return k;r=r[s[i]]}return r||k}
function lf(o,f){if(!o)return'';var s=lang==='zh'?'_zh':lang==='ms'?'_ms':'_en';return o[f+s]||o[f+'_en']||''}
function setLang(l){lang=l;localStorage.setItem('lang',l);document.documentElement.lang=l;renderAll()}

/* ===== AUTH ===== */
var curUser=null;

async function signIn(e,p){
  var user=findUserByEmail(e);
  if(!user||user.password!==p)throw new Error('Invalid email or password');
  localStorage.setItem(SESSION_KEY,user.id);
  return{user:user,profile:user};
}

async function signUp(name,email,password){
  if(findUserByEmail(email))throw new Error('This email is already registered');
  var user={id:makeId('user'),name:name,email:email,password:password,role:'customer',avatar_url:''};
  mutateStore(function(data){data.users.push(user);return data;});
  localStorage.setItem(SESSION_KEY,user.id);
  return{user:user,profile:user};
}

async function signOut(){localStorage.removeItem(SESSION_KEY)}
async function getProf(uid){return findUserById(uid)}
async function getCur(){var uid=localStorage.getItem(SESSION_KEY);return uid?findUserById(uid):null}

/* ===== IMAGE HANDLING ===== */
async function uploadImg(file){
  return await fileToDataUrl(file);
}

/* ===== HELPERS ===== */
function eh(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function gv(id){var el=document.getElementById(id);return el?el.value.trim():''}
function toast(m,ok){var c=document.getElementById('toast-box'),d=document.createElement('div');d.className='toast '+(ok!==false?'toast-ok':'toast-err');d.textContent=m;c.appendChild(d);setTimeout(function(){d.remove()},3500)}
function toggleDD(id){document.getElementById(id).classList.toggle('open')}
function toggleMob(){document.getElementById('m-panel').classList.toggle('open');document.getElementById('m-ov').classList.toggle('open')}

/* ===== ROUTER ===== MODIFIED: added 'profile' ===== */
var pages=['home','menu','reservation','about','contact','login','admin','profile'];
function navigate(){
  var h=location.hash.replace('#/','').split('?')[0]||'home';
  if(pages.indexOf(h)===-1)h='home';
  var adminApp=document.getElementById('a-app');
  var adminDenied=document.getElementById('a-denied');
  if(adminApp)adminApp.style.display='none';
  if(adminDenied)adminDenied.classList.add('hd');
  /* profile requires login */
  if(h==='profile'&&!curUser){location.hash='#/login';return}
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
  var pg=document.getElementById('pg-'+h);
  if(pg)pg.classList.add('active');
  if(h==='admin'){
    if(curUser&&curUser.role==='admin'){initAdmin()}
    else{
      if(adminDenied)adminDenied.classList.remove('hd');
      location.hash='#/';return
    }
  }
  if(h==='profile'){renderProfilePage()}
  renderNav();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',navigate);

/* ===== RENDER NAVBAR ===== MODIFIED: avatar + profile link ===== */
function renderNav(){
  var h=location.hash.replace('#/','').split('?')[0]||'home';
  var items=[{l:t('nav.home'),href:'#/'},{l:t('nav.menu'),href:'#/menu'},{l:t('nav.reservation'),href:'#/reservation'},{l:t('nav.about'),href:'#/about'}];
  var links=items.map(function(it){var a=h===it.href.replace('#/','')?' active':'';return '<a href="'+it.href+'" class="nav-l'+a+'">'+it.l+'</a>'}).join('');
  var ll=lang==='zh'?'中文':lang==='ms'?'BM':'EN';
  var lo=LANGS.map(function(l){var lb=l==='zh'?'中文':l==='ms'?'Bahasa Malaysia':'English';var s=l===lang?' sel':'';return '<a href="#" data-lang="'+l+'" class="dd-item'+s+'">'+lb+'</a>'}).join('');

  /* ===== MODIFIED: avatar button ===== */
  var auth='';
  if(curUser){
    var avatarBtn;
    if(curUser.avatar_url){
      avatarBtn='<img src="'+curUser.avatar_url+'" class="avatar-nav" alt="">';
    }else{
      avatarBtn='<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    }
    var al=curUser.role==='admin'?'<a href="#/admin" class="dd-item">'+t('nav.admin')+'</a>':'';
    auth='<div class="dd" id="udd"><button class="btn btn-ic btn-u" onclick="toggleDD(\'udd\')">'+avatarBtn+'</button><div class="dd-menu"><div class="dd-hdr"><strong>'+eh(curUser.name||'')+'</strong><br><small>'+eh(curUser.email||'')+'</small></div><a href="#/profile" class="dd-item">'+t('nav.profile')+'</a>'+al+'<a href="#" class="dd-item td" onclick="doLogout()">'+t('nav.logout')+'</a></div></div>';
  } else {
    auth='<a href="#/login" class="btn btn-o btn-sm">'+t('nav.login')+'</a>'
  }

  /* ===== MODIFIED: mobile menu with avatar + profile ===== */
  var ml=items.map(function(it){var a=h===it.href.replace('#/','')?' active':'';return '<a href="'+it.href+'" class="m-link'+a+'" onclick="toggleMob()">'+it.l+'</a>'}).join('');
  var mauth='';
  if(curUser){
    var mAvatar='';
    if(curUser.avatar_url){mAvatar='<img src="'+curUser.avatar_url+'" style="width:2.5rem;height:2.5rem;border-radius:50%;object-fit:cover;margin-bottom:.5rem" alt="">';}
    mauth=mAvatar+'<div><strong>'+eh(curUser.name||'')+'</strong></div>'+'<a href="#/profile" class="btn btn-o btn-fw" onclick="toggleMob()">'+t('nav.profile')+'</a>'+
      (curUser.role==='admin'?'<a href="#/admin" class="btn btn-o btn-fw" onclick="toggleMob()">'+t('nav.admin')+'</a>':'')+
      '<a href="#" class="btn btn-g btn-fw td" onclick="doLogout()">'+t('nav.logout')+'</a>';
  }else{
    mauth='<a href="#/login" class="btn btn-p btn-fw" onclick="toggleMob()">'+t('nav.login')+'</a>'
  }
  var mlangs=LANGS.map(function(l){var lb=l==='zh'?'中文':l==='ms'?'BM':'EN';var s=l===lang?' active':'';return '<button class="lang-chip'+s+'" onclick="setLang(\''+l+'\')">'+lb+'</button>'}).join('');

  document.getElementById('navbar').innerHTML=
    '<nav class="navbar"><div class="ctn navbar-i">'+
    '<a href="#/" class="nav-logo"><span class="logo-z">三脚猫</span><span class="logo-e">3 Leg Cat</span></a>'+
    '<div class="nav-links">'+links+'</div>'+
    '<div class="nav-acts">'+
    '<div class="dd" id="ldd"><button class="btn btn-g btn-sm" onclick="toggleDD(\'ldd\')"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> '+ll+'</button><div class="dd-menu">'+lo+'</div></div>'+
    '<a href="#/contact" class="btn btn-o btn-sm">'+t('nav.contact')+'</a>'+auth+
    '</div>'+
    '<button class="hamburger" onclick="toggleMob()"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>'+
    '</div></nav>'+
    '<div class="m-overlay" id="m-ov" onclick="toggleMob()"></div>'+
    '<div class="m-panel" id="m-panel">'+
    '<div class="m-hdr"><div><span class="logo-z">三脚猫</span><br><span class="logo-e">3 Leg Cat</span></div><button class="m-close" onclick="toggleMob()"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>'+
    '<div class="m-links">'+ml+'<a href="#/contact" class="m-link" onclick="toggleMob()">'+t('nav.contact')+'</a></div>'+
    '<div class="m-foot">'+mauth+'<div class="m-lang">'+mlangs+'</div></div>'+
    '</div>';
}

/* ===== RENDER FOOTER ===== */
function renderFooter(){
  document.getElementById('footer').innerHTML=
    '<footer class="footer"><div class="ctn">'+
    '<div class="f-grid">'+
    '<div><a href="#/" class="nav-logo"><span class="logo-z">三脚猫</span><span class="logo-e">3 Leg Cat</span></a><p class="f-desc">'+t('home.tagline')+'</p></div>'+
    '<div><h4 class="f-heading">Explore</h4><a href="#/" class="f-link">'+t('nav.home')+'</a><a href="#/menu" class="f-link">'+t('nav.menu')+'</a><a href="#/reservation" class="f-link">'+t('nav.reservation')+'</a><a href="#/about" class="f-link">'+t('nav.about')+'</a></div>'+
    '<div><h4 class="f-heading">'+t('contact.title')+'</h4><p class="f-text">'+(lf(contactD,'address')||'123 Heritage Lane,<br>Georgetown, 10200<br>Penang, Malaysia')+'</p><p class="f-text mt1">'+(contactD.email||'hello@3legcat.com')+'<br>'+(contactD.phone||'+60 12-345 6789')+'</p></div>'+
    '</div>'+
    '<div class="f-bot"><p>&copy; '+new Date().getFullYear()+' 3 Leg Cat Cafe</p><div class="f-social"><a href="#">Instagram</a><a href="#">Facebook</a></div></div>'+
    '</div></footer>';
}

/* ===== GLOBAL EVENTS ===== */
document.addEventListener('click',function(e){
  document.querySelectorAll('.dd.open').forEach(function(d){if(!d.contains(e.target))d.classList.remove('open')});
  var le=e.target.closest('[data-lang]');
  if(le){e.preventDefault();setLang(le.getAttribute('data-lang'))}
});
async function doLogout(){await signOut();curUser=null;location.hash='#/';renderAll()}

/* ===== HOME ===== */
var homeD={hero:{},featured:[]};
async function loadHome(){
  var store=readStore();
  homeD.hero=store.site_settings.hero||{};
  var ids=((store.site_settings.featured_ids||{}).ids)||[];
  var items=(store.menu_items||[]).slice().sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0)});
  homeD.featured=(ids.length?items.filter(function(it){return ids.indexOf(it.id)>-1}):items.slice(0,3));
}
function renderHome(){
  var h=homeD.hero;
  var sec=document.getElementById('hero-sec');
  var eb=sec.querySelector('.hero-bg');if(eb)eb.remove();
  if(h.image_url){var bd=document.createElement('div');bd.className='hero-bg';bd.style.backgroundImage='url('+h.image_url+')';sec.insertBefore(bd,sec.firstChild)}
  document.getElementById('h-title').textContent=lf(h,'title')||'3 Leg Cat';
  document.getElementById('h-sub').textContent=lf(h,'subtitle')||'';
  document.getElementById('h-book').textContent=t('home.bookNow');
  document.getElementById('h-menu').textContent=t('home.viewMenu');
  document.getElementById('feat-title').textContent=t('home.featured');
  document.getElementById('feat-more').textContent=t('home.viewMenu');
  var g=document.getElementById('feat-grid');
  if(!homeD.featured.length){g.innerHTML='<p class="tc tc-t" style="grid-column:1/-1">Menu items coming soon.</p>';return}
  g.innerHTML=homeD.featured.map(function(it,i){
    var img=it.image_url?'<div class="card-img"><img src="'+it.image_url+'" alt="'+eh(lf(it,'name'))+'"></div>':'<div class="card-img" style="display:flex;align-items:center;justify-content:center"><span style="font-size:3rem">☕</span></div>';
    var sold=it.is_available?'':'<span class="badge b-cancelled">Sold Out</span>';
    return '<div class="card fiu" style="animation-delay:'+(i*.15)+'s">'+img+'<div class="card-body"><div class="fl jcb aic mb1"><h3 class="card-title">'+eh(lf(it,'name'))+'</h3><span class="card-price">'+t('menu.price')+' '+Number(it.price).toFixed(2)+'</span></div>'+sold+'<p class="card-desc mt1">'+eh(lf(it,'desc'))+'</p></div></div>'}).join('');
}

/* ===== MENU ===== */
var menuD={cats:[],items:[]};
var menuCat='all';
async function loadMenu(){
  var store=readStore();
  menuD.cats=(store.categories||[]).slice().sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0)});
  menuD.items=(store.menu_items||[]).slice().sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0)});
}
function renderMenu(){
  document.getElementById('m-title').textContent=t('menu.title');
  var th='<button class="tab'+(menuCat==='all'?' active':'')+'" data-cat="all">'+t('menu.all')+'</button>';
  th+=menuD.cats.map(function(c){return '<button class="tab'+(menuCat===String(c.id)?' active':'')+'" data-cat="'+c.id+'">'+eh(lf(c,'name'))+'</button>'}).join('');
  document.getElementById('m-tabs').innerHTML=th;
  var fi=menuCat==='all'?menuD.items:menuD.items.filter(function(i){return String(i.category_id)===menuCat});
  var g=document.getElementById('m-grid');
  if(!fi.length){g.innerHTML='<p class="tc tc-t" style="grid-column:1/-1">No items.</p>';return}
  g.innerHTML=fi.map(function(it,i){
    var img=it.image_url?'<div class="mi-img"><img src="'+it.image_url+'"></div>':'<div class="mi-img"><span style="font-size:2rem">🍽️</span></div>';
    var sold=it.is_available?'':'<span class="badge b-cancelled">Sold Out</span>';
    var extraClass=it.is_available?'':' sold-out';
    return '<div class="mi fiu'+extraClass+'" style="animation-delay:'+(i*.05)+'s">'+img+'<div class="mi-body"><div class="mi-hdr"><div><h3 style="font-family:var(--fd);font-size:1.125rem;font-weight:700">'+eh(lf(it,'name'))+'</h3>'+sold+'</div><span class="card-price">'+t('menu.price')+' '+Number(it.price).toFixed(2)+'</span></div><p class="tc" style="font-size:.875rem">'+eh(lf(it,'desc'))+'</p></div></div>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('.tab[data-cat]');if(b){menuCat=b.getAttribute('data-cat');renderMenu()}});

/* ===== RESERVATION ===== */
function renderResLabels(){
  document.getElementById('r-title').textContent=t('res.title');
  ['name','email','phone','size','date','time','notes'].forEach(function(k){var el=document.getElementById('rl-'+k);if(el)el.textContent=t('res.'+k)});
  document.getElementById('r-btn').textContent=t('res.submit');
  document.getElementById('ok-title').textContent=t('res.okTitle');
  document.getElementById('ok-desc').textContent=t('res.okDesc');
  document.getElementById('ok-another').textContent=t('res.another');
  document.getElementById('r-date').min=new Date().toISOString().split('T')[0];
}
function resetRes(){document.getElementById('r-form').reset();document.getElementById('r-time').value='19:00';document.getElementById('r-size').value='2';document.getElementById('res-form-wrap').classList.remove('hd');document.getElementById('res-ok').classList.add('hd')}
document.getElementById('r-form').addEventListener('submit',async function(e){
  e.preventDefault();var btn=document.getElementById('r-btn');btn.disabled=true;btn.textContent='...';
  try{
    var row={id:Date.now(),guest_name:gv('r-name'),guest_email:gv('r-email'),guest_phone:gv('r-phone'),reservation_date:gv('r-date'),reservation_time:gv('r-time'),party_size:parseInt(gv('r-size'),10),notes:gv('r-notes')||'',status:'pending',created_at:new Date().toISOString()};
    if(curUser)row.user_id=curUser.id;
    mutateStore(function(data){data.reservations.unshift(row);return data;});
    document.getElementById('res-form-wrap').classList.add('hd');document.getElementById('res-ok').classList.remove('hd');
  }catch(err){toast(err.message||'Error',false)}
  finally{btn.disabled=false;btn.textContent=t('res.submit')}
});

/* ===== ABOUT ===== */
var aboutD={};
async function loadAbout(){aboutD=readStore().site_settings.about||{}}
function renderAbout(){document.getElementById('ab-title').textContent=t('about.title');document.getElementById('ab-story').textContent=lf(aboutD,'story')||''}

/* ===== CONTACT ===== */
var contactD={};
async function loadContact(){contactD=readStore().site_settings.contact||{}}
function renderContact(){
  document.getElementById('co-title').textContent=t('contact.title');
  document.getElementById('cl-addr').textContent=t('contact.address');document.getElementById('c-addr').textContent=lf(contactD,'address')||'';
  document.getElementById('cl-phone').textContent=t('contact.phone');document.getElementById('c-phone').textContent=contactD.phone||'';
  document.getElementById('cl-email').textContent=t('contact.email');document.getElementById('c-email').textContent=contactD.email||'';
  document.getElementById('cl-hours').textContent=t('contact.hours');document.getElementById('c-hours').textContent=contactD.hours||'';
}
/* ===== LOGIN ===== MODIFIED: supports register mode ===== */
var loginMode='login'; /* 'login' or 'register' */

function toggleLoginMode(){
  loginMode=loginMode==='login'?'register':'login';
  document.getElementById('lg-err').classList.add('hd');
  renderLogin();
}

function renderLogin(){
  var isReg=loginMode==='register';
  document.getElementById('lg-title').textContent=isReg?t('register.title'):t('login.title');
  document.getElementById('ll-email').textContent=t('login.email');
  document.getElementById('ll-pass').textContent=t('login.password');
  document.getElementById('lg-btn').textContent=isReg?t('register.submit'):t('login.submit');
  document.getElementById('lg-toggle').textContent=isReg?t('register.hasAccount')+' '+t('register.loginInstead'):t('register.noAccount')+' '+t('register.regInstead');

  /* show/hide register-only fields */
  var nw=document.getElementById('lg-name-wrap');
  var cw=document.getElementById('lg-cpass-wrap');
  var ni=document.getElementById('l-name');
  var ci=document.getElementById('l-cpass');
  if(isReg){
    nw.classList.remove('hd');cw.classList.remove('hd');
    ni.required=true;ci.required=true;
    document.getElementById('ll-name').textContent=t('register.name');
    document.getElementById('ll-cpass').textContent=t('register.confirmPass');
  }else{
    nw.classList.add('hd');cw.classList.add('hd');
    ni.required=false;ci.required=false;ni.value='';ci.value='';
  }
}

document.getElementById('lg-form').addEventListener('submit',async function(e){
  e.preventDefault();
  var btn=document.getElementById('lg-btn'),err=document.getElementById('lg-err');
  btn.disabled=true;btn.textContent='...';err.classList.add('hd');

  if(loginMode==='register'){
    /* ===== REGISTRATION FLOW ===== */
    try{
      var pw=gv('l-pass'),cpw=gv('l-cpass');
      if(pw!==cpw){throw new Error(t('register.passMismatch'))}
      var reg=await signUp(gv('l-name'),gv('l-email'),pw);
      curUser=reg.profile;
      toast(t('register.success'));
      loginMode='login';
      document.getElementById('l-name').value='';
      document.getElementById('l-cpass').value='';
      document.getElementById('l-email').value='';
      document.getElementById('l-pass').value='';
      renderLogin();
      location.hash=curUser.role==='admin'?'#/admin':'#/';
    }catch(ex){
      err.textContent=ex.message||'Registration failed';err.classList.remove('hd');
    }finally{
      btn.disabled=false;btn.textContent=t('register.submit');
    }
  }else{
    /* ===== LOGIN FLOW (unchanged logic) ===== */
    try{
      var r=await signIn(gv('l-email'),gv('l-pass'));
      curUser=r.profile;
      location.hash=r.profile&&r.profile.role==='admin'?'#/admin':'#/';
    }catch(ex){
      err.textContent=t('login.error');err.classList.remove('hd');
    }finally{
      btn.disabled=false;btn.textContent=t('login.submit');
    }
  }
});

/* ===== NEW: PROFILE PAGE ===== */
function renderProfilePage(){
  if(!curUser){return}
  document.getElementById('pf-title').textContent=t('profile.title');
  document.getElementById('pf-l-photo').textContent=t('profile.avatar');
  document.getElementById('pf-l-name').textContent=t('profile.name');
  document.getElementById('pf-l-email').textContent=t('profile.email');
  document.getElementById('pf-btn').textContent=t('profile.save');
  document.getElementById('pf-name').value=curUser.name||'';
  document.getElementById('pf-email').value=curUser.email||'';
  var wrap=document.getElementById('pf-avatar-wrap');
  if(curUser.avatar_url){wrap.innerHTML='<img src="'+curUser.avatar_url+'" class="avatar-lg" alt="">';}
  else{wrap.innerHTML='<span id="pf-avatar-img" style="font-size:2.5rem">👤</span>';}
}

async function saveProfile(){
  if(!curUser)return;
  var btn=document.getElementById('pf-btn'),err=document.getElementById('pf-err');
  btn.disabled=true;btn.textContent='...';err.classList.add('hd');
  try{
    var fileInput=document.getElementById('pf-file');
    var avatarUrl=curUser.avatar_url||'';
    if(fileInput.files&&fileInput.files[0]){avatarUrl=await uploadImg(fileInput.files[0]);}
    var newName=gv('pf-name')||curUser.name;
    mutateStore(function(data){var user=data.users.find(function(u){return u.id===curUser.id});if(user){user.name=newName;user.avatar_url=avatarUrl;}return data;});
    curUser=await getCur();
    toast(t('profile.saved'));
    renderNav();
    renderProfilePage();
  }catch(ex){err.textContent=ex.message||'Error';err.classList.remove('hd');}
  finally{btn.disabled=false;btn.textContent=t('profile.save');}
}

/* ===== ADMIN ===== */
var A={tab:'dash',cats:[],items:[],res:[],settings:{}};
function initAdmin(){
  var adminApp=document.getElementById('a-app');
  var adminDenied=document.getElementById('a-denied');
  if(adminApp)adminApp.style.display='flex';
  if(adminDenied)adminDenied.classList.add('hd');
  loadAdmin().then(function(){renderASide();switchATab(A.tab||'dash')}).catch(function(e){toast('Admin load failed: '+e.message,false)})
}
async function loadAdmin(){var store=readStore();A.cats=(store.categories||[]).slice().sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0)});A.items=(store.menu_items||[]).slice().sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0)});A.res=(store.reservations||[]).slice().sort(function(a,b){return String(b.created_at||'').localeCompare(String(a.created_at||''))});A.settings=store.site_settings||{}}
function renderASide(){var tabs=[{id:'dash',icon:'📊',l:t('admin.dash')},{id:'home',icon:'🏠',l:t('admin.hp')},{id:'menu',icon:'🍽️',l:t('admin.menuM')},{id:'res',icon:'📅',l:t('admin.res')}];document.getElementById('a-side').innerHTML=tabs.map(function(tb){return '<button class="a-sb'+(A.tab===tb.id?' active':'')+'" data-at="'+tb.id+'"><span>'+tb.icon+'</span><span>'+tb.l+'</span></button>'}).join('')}
document.addEventListener('click',function(e){var b=e.target.closest('.a-sb[data-at]');if(b)switchATab(b.getAttribute('data-at'))});
function switchATab(tab){A.tab=tab;renderASide();document.querySelectorAll('.a-sec').forEach(function(e){e.classList.remove('active')});document.getElementById('as-'+tab).classList.add('active');renderATab(tab)}
function renderATab(tab){if(tab==='dash')renderADash();if(tab==='home')renderAHome();if(tab==='menu')renderAMenu();if(tab==='res')renderARes();}
function renderADash(){var p=A.res.filter(function(r){return r.status==='pending'}).length;document.getElementById('as-dash').innerHTML='<h2 style="margin-bottom:1.5rem">'+t('admin.dash')+'</h2><div class="sg"><div class="sc"><div class="sc-label">'+t('admin.totalIt')+'</div><div class="sc-val">'+A.items.length+'</div></div><div class="sc"><div class="sc-label">'+t('admin.totalCat')+'</div><div class="sc-val">'+A.cats.length+'</div></div><div class="sc"><div class="sc-label">'+t('admin.pendRes')+'</div><div class="sc-val">'+p+'</div></div><div class="sc"><div class="sc-label">'+t('admin.totalRes')+'</div><div class="sc-val">'+A.res.length+'</div></div></div>'}
function mkIn(id,lbl,v){return '<div class="fg"><label class="fl-l">'+lbl+'</label><input type="text" id="'+id+'" class="fi" value="'+eh(v)+'"></div>'}
function renderAHome(){var hero=A.settings.hero||{},about=A.settings.about||{},contact=A.settings.contact||{},feat=(A.settings.featured_ids&&A.settings.featured_ids.ids)||[];document.getElementById('as-home').innerHTML='<h2 style="margin-bottom:1.5rem">'+t('admin.hp')+'</h2>'+'<div class="ap"><div class="ap-title">'+t('admin.hero')+'</div>'+'<div class="fgr">'+mkIn('ah-tz',t('admin.titleL')+' (中文)',hero.title_zh||'')+mkIn('ah-te',t('admin.titleL')+' (EN)',hero.title_en||'')+mkIn('ah-tm',t('admin.titleL')+' (BM)',hero.title_ms||'')+'</div>'+'<div class="fgr">'+mkIn('ah-sz',t('admin.subtitle')+' (中文)',hero.subtitle_zh||'')+mkIn('ah-se',t('admin.subtitle')+' (EN)',hero.subtitle_en||'')+mkIn('ah-sm',t('admin.subtitle')+' (BM)',hero.subtitle_ms||'')+'</div>'+'<div class="fg"><label class="fl-l">'+t('admin.uploadImg')+'</label><input type="file" id="ah-file" accept="image/*" class="fi" style="padding:.5rem">'+(hero.image_url?'<img src="'+hero.image_url+'" class="img-prev">':'')+'<input type="hidden" id="ah-img" value="'+eh(hero.image_url||'')+'"></div>'+'<button class="btn btn-p" onclick="saveHero()">'+t('admin.save')+'</button></div>'+'<div class="ap"><div class="ap-title">'+t('admin.featIt')+'</div><div class="fg-grid">'+A.items.map(function(it){var ck=feat.indexOf(it.id)>-1?' checked':'';var sel=feat.indexOf(it.id)>-1?' sel':'';return '<label class="fg-item'+sel+'"><input type="checkbox" value="'+it.id+'"'+ck+' onchange="updFG(this)"><span>'+eh(lf(it,'name'))+'</span></label>'}).join('')+'</div><button class="btn btn-p mt3" onclick="saveFeat()">'+t('admin.save')+'</button></div>'+'<div class="ap"><div class="ap-title">'+t('admin.aboutSec')+'</div>'+'<div class="fg"><label class="fl-l">Story (中文)</label><textarea id="ab-zh" class="ft" rows="3">'+eh(about.story_zh||'')+'</textarea></div>'+'<div class="fg"><label class="fl-l">Story (EN)</label><textarea id="ab-en" class="ft" rows="3">'+eh(about.story_en||'')+'</textarea></div>'+'<div class="fg"><label class="fl-l">Story (BM)</label><textarea id="ab-ms" class="ft" rows="3">'+eh(about.story_ms||'')+'</textarea></div>'+'<button class="btn btn-p" onclick="saveAbout()">'+t('admin.save')+'</button></div>'+'<div class="ap"><div class="ap-title">'+t('admin.contactSec')+'</div>'+'<div class="fgr">'+mkIn('ac-az',t('contact.address')+' (中文)',contact.address_zh||'')+mkIn('ac-ae',t('contact.address')+' (EN)',contact.address_en||'')+mkIn('ac-am',t('contact.address')+' (BM)',contact.address_ms||'')+'</div>'+'<div class="fgr">'+mkIn('ac-ph',t('contact.phone'),contact.phone||'')+mkIn('ac-em',t('contact.email'),contact.email||'')+'</div>'+'<div class="fg">'+mkIn('ac-hr',t('contact.hours'),contact.hours||'')+'</div>'+'<button class="btn btn-p" onclick="saveContact()">'+t('admin.save')+'</button></div>'}
function updFG(cb){var l=cb.closest('.fg-item');cb.checked?l.classList.add('sel'):l.classList.remove('sel')}
async function saveHero(){var f=document.getElementById('ah-file').files[0];if(f){try{var u=await uploadImg(f);document.getElementById('ah-img').value=u;toast(t('admin.uploaded'))}catch(e){toast(e.message,false);return}}await saveSetting('hero',{title_zh:gv('ah-tz'),title_en:gv('ah-te'),title_ms:gv('ah-tm'),subtitle_zh:gv('ah-sz'),subtitle_en:gv('ah-se'),subtitle_ms:gv('ah-sm'),image_url:document.getElementById('ah-img').value})}
async function saveFeat(){var ids=[];document.querySelectorAll('.fg-item input:checked').forEach(function(c){ids.push(parseInt(c.value,10))});await saveSetting('featured_ids',{ids:ids})}
async function saveAbout(){await saveSetting('about',{story_zh:document.getElementById('ab-zh').value,story_en:document.getElementById('ab-en').value,story_ms:document.getElementById('ab-ms').value})}
async function saveContact(){await saveSetting('contact',{address_zh:gv('ac-az'),address_en:gv('ac-ae'),address_ms:gv('ac-am'),phone:gv('ac-ph'),email:gv('ac-em'),hours:gv('ac-hr')})}
async function saveSetting(k,v){mutateStore(function(data){data.site_settings[k]=v;return data;});A.settings[k]=v;await loadHome();await loadAbout();await loadContact();renderAll();if(location.hash.indexOf('#/admin')===0)initAdmin();toast('Saved!')}
function renderAMenu(){document.getElementById('as-menu').innerHTML='<h2 style="margin-bottom:1.5rem">'+t('admin.menuM')+'</h2>'+'<div class="ap"><div class="ap-title"><span>'+t('admin.cats')+'</span><button class="btn btn-sm btn-p" onclick="openCatM()">'+t('admin.addCat')+'</button></div><div class="tw"><table class="dt"><thead><tr><th>ID</th><th>'+t('admin.name')+'</th><th>'+t('admin.sOrder')+'</th><th>'+t('admin.actions')+'</th></tr></thead><tbody id="cat-tb"></tbody></table></div></div>'+'<div class="ap"><div class="ap-title"><span>'+t('admin.menuIt')+'</span><button class="btn btn-sm btn-p" onclick="openItemM()">'+t('admin.addIt')+'</button></div><div class="tw"><table class="dt"><thead><tr><th>IMG</th><th>'+t('admin.name')+'</th><th>'+t('admin.category')+'</th><th>'+t('admin.price')+'</th><th>'+t('admin.available')+'</th><th>'+t('admin.actions')+'</th></tr></thead><tbody id="it-tb"></tbody></table></div></div>';renderCatTb();renderItemTb();}
function renderCatTb(){document.getElementById('cat-tb').innerHTML=A.cats.map(function(c){return '<tr><td>'+c.id+'</td><td>'+eh(c.name_zh)+' / '+eh(c.name_en)+' / '+eh(c.name_ms)+'</td><td>'+c.sort_order+'</td><td><button class="btn btn-sm btn-o" onclick="openCatM('+c.id+')">'+t('admin.edit')+'</button> <button class="btn btn-sm btn-d" onclick="delCat('+c.id+')">'+t('admin.delete')+'</button></td></tr>'}).join('')}
function renderItemTb(){document.getElementById('it-tb').innerHTML=A.items.map(function(it){var cat=A.cats.find(function(c){return c.id===it.category_id});var img=it.image_url?'<img src="'+it.image_url+'" class="thumb">':'-';var av=it.is_available?'<span style="color:var(--secondary);font-weight:600">'+t('admin.yes')+'</span>':'<span class="td" style="font-weight:600">Sold Out</span>';return '<tr><td>'+img+'</td><td>'+eh(it.name_zh)+'<br><small class="tc">'+eh(it.name_en)+'</small></td><td>'+(cat?eh(lf(cat,'name')):'-')+'</td><td class="font-mono">RM '+Number(it.price).toFixed(2)+'</td><td>'+av+'</td><td><button class="btn btn-sm btn-o" onclick="openItemM('+it.id+')">'+t('admin.edit')+'</button> <button class="btn btn-sm btn-d" onclick="delItem('+it.id+')">'+t('admin.delete')+'</button></td></tr>'}).join('')}
function openCatM(id){var c=id?A.cats.find(function(x){return x.id===id}):null;document.getElementById('mod-title').textContent=c?t('admin.edit'):t('admin.addCat');document.getElementById('mod-body').innerHTML='<form onsubmit="saveCat(event,'+(id||'null')+')">'+mkIn('mcz','名称 (中文)',c?c.name_zh:'')+mkIn('mce','Name (EN)',c?c.name_en:'')+mkIn('mcs','Nama (BM)',c?c.name_ms:'')+mkIn('mcsort',t('admin.sOrder'),c?String(c.sort_order):'0')+'<button class="btn btn-p btn-fw mt2">'+t('admin.save')+'</button></form>';openModal()}
async function saveCat(e,id){e.preventDefault();var d={name_zh:gv('mcz'),name_en:gv('mce'),name_ms:gv('mcs'),sort_order:parseInt(gv('mcsort'),10)||0};mutateStore(function(data){if(id){var cat=data.categories.find(function(x){return x.id===id});if(cat)Object.assign(cat,d);}else{d.id=(data.categories.reduce(function(max,it){return Math.max(max,it.id||0)},0)+1);data.categories.push(d);}return data;});closeModal();await loadMenu();await loadAdmin();renderMenu();renderAMenu();toast('Saved!')}
async function delCat(id){if(!confirm('Delete?'))return;mutateStore(function(data){data.categories=data.categories.filter(function(c){return c.id!==id});data.menu_items=data.menu_items.map(function(it){if(it.category_id===id)it.category_id=null;return it;});return data;});await loadMenu();await loadAdmin();renderMenu();renderAMenu();toast('Deleted!')}
function openItemM(id){var it=id?A.items.find(function(x){return x.id===id}):null;document.getElementById('mod-title').textContent=it?t('admin.edit'):t('admin.addIt');var co='<option value="">- '+t('admin.category')+' -</option>'+A.cats.map(function(c){var s=it&&it.category_id===c.id?' selected':'';return '<option value="'+c.id+'"'+s+'>'+eh(lf(c,'name'))+'</option>'}).join('');document.getElementById('mod-body').innerHTML='<form onsubmit="saveItem(event,'+(id||'null')+')"><div class="fgr">'+mkIn('miz','名称 (中文)',it?it.name_zh:'')+mkIn('mie','Name (EN)',it?it.name_en:'')+'</div>'+mkIn('mis','Nama (BM)',it?it.name_ms:'')+'<div class="fgr"><div class="fg"><label class="fl-l">'+t('admin.desc')+' (中文)</label><textarea id="midz" class="ft" rows="2">'+eh(it?it.description_zh||'':'')+'</textarea></div><div class="fg"><label class="fl-l">'+t('admin.desc')+' (EN)</label><textarea id="mide" class="ft" rows="2">'+eh(it?it.description_en||'':'')+'</textarea></div></div><div class="fg"><label class="fl-l">'+t('admin.desc')+' (BM)</label><textarea id="mids" class="ft" rows="2">'+eh(it?it.description_ms||'':'')+'</textarea></div><div class="fgr"><div class="fg"><label class="fl-l">'+t('admin.price')+' (RM)</label><input type="number" id="mip" class="fi" step="0.01" min="0" value="'+(it?it.price:'0')+'" required></div><div class="fg"><label class="fl-l">'+t('admin.category')+'</label><select id="mic" class="fi fsel">'+co+'</select></div></div><div class="fgr"><div class="fg"><label class="fl-l">'+t('admin.sOrder')+'</label><input type="number" id="misort" class="fi" value="'+(it?it.sort_order:'0')+'"></div><div class="fg"><label class="fl-l">'+t('admin.available')+'</label><select id="miav" class="fi fsel"><option value="true"'+(!it||it.is_available?' selected':'')+'>'+t('admin.yes')+'</option><option value="false"'+(it&&!it.is_available?' selected':'')+'>'+t('admin.no')+'</option></select></div></div><div class="fg"><label class="fl-l">'+t('admin.uploadImg')+'</label><input type="file" id="mif" accept="image/*" class="fi" style="padding:.5rem">'+(it&&it.image_url?'<img src="'+it.image_url+'" class="img-prev">':'')+'<input type="hidden" id="miu" value="'+eh(it?it.image_url||'':'')+'"></div><button class="btn btn-p btn-fw mt2">'+t('admin.save')+'</button></form>';openModal()}
async function saveItem(e,id){e.preventDefault();var f=document.getElementById('mif').files[0];if(f){try{var u=await uploadImg(f);document.getElementById('miu').value=u}catch(err){toast(err.message,false);return}}var d={name_zh:gv('miz'),name_en:gv('mie'),name_ms:gv('mis'),description_zh:document.getElementById('midz').value,description_en:document.getElementById('mide').value,description_ms:document.getElementById('mids').value,price:parseFloat(gv('mip'))||0,category_id:gv('mic')?parseInt(gv('mic'),10):null,image_url:document.getElementById('miu').value,is_available:gv('miav')==='true',sort_order:parseInt(gv('misort'),10)||0,updated_at:new Date().toISOString()};mutateStore(function(data){if(id){var item=data.menu_items.find(function(x){return x.id===id});if(item)Object.assign(item,d);}else{d.id=(data.menu_items.reduce(function(max,it){return Math.max(max,it.id||0)},100)+1);data.menu_items.push(d);}return data;});closeModal();await loadHome();await loadMenu();await loadAdmin();renderHome();renderMenu();renderAMenu();toast('Saved!')}
async function delItem(id){if(!confirm('Delete?'))return;mutateStore(function(data){data.menu_items=data.menu_items.filter(function(it){return it.id!==id});if(data.site_settings.featured_ids&&data.site_settings.featured_ids.ids){data.site_settings.featured_ids.ids=data.site_settings.featured_ids.ids.filter(function(fid){return fid!==id});}return data;});await loadHome();await loadMenu();await loadAdmin();renderHome();renderMenu();renderAMenu();toast('Deleted!')}
function renderARes(){document.getElementById('as-res').innerHTML='<h2 style="margin-bottom:1.5rem">'+t('admin.res')+'</h2><div class="ap"><div class="tw"><table class="dt"><thead><tr><th>#</th><th>'+t('admin.gName')+'</th><th>'+t('admin.gEmail')+'</th><th>'+t('admin.gPhone')+'</th><th>'+t('admin.date')+'</th><th>'+t('admin.time')+'</th><th>'+t('admin.sz')+'</th><th>'+t('admin.status')+'</th><th>'+t('admin.notes')+'</th><th>'+t('admin.actions')+'</th></tr></thead><tbody id="res-tb"></tbody></table></div></div>';renderResTb()}
function renderResTb(){document.getElementById('res-tb').innerHTML=A.res.map(function(r){var b='<span class="badge b-'+r.status+'">'+(t('admin.'+r.status)||r.status)+'</span>';var a='';if(r.status==='pending'){a='<button class="btn btn-sm btn-s" onclick="updRes('+r.id+',\'confirmed\')">'+t('admin.confirm')+'</button> <button class="btn btn-sm btn-d" onclick="updRes('+r.id+',\'cancelled\')">'+t('admin.cancel')+'</button>'}else if(r.status==='confirmed'){a='<button class="btn btn-sm btn-d" onclick="updRes('+r.id+',\'cancelled\')">'+t('admin.cancel')+'</button>'}a+=' <button class="btn btn-sm btn-o td" onclick="delRes('+r.id+')">'+t('admin.delete')+'</button>';return '<tr><td>'+r.id+'</td><td>'+eh(r.guest_name)+'</td><td>'+eh(r.guest_email)+'</td><td>'+eh(r.guest_phone)+'</td><td>'+r.reservation_date+'</td><td>'+r.reservation_time+'</td><td>'+r.party_size+'</td><td>'+b+'</td><td class="tc" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+eh(r.notes||'-')+'</td><td style="white-space:nowrap">'+a+'</td></tr>'}).join('')}
async function updRes(id,s){mutateStore(function(data){var row=data.reservations.find(function(r){return r.id===id});if(row)row.status=s;return data;});await loadAdmin();renderResTb();toast('Updated!')}
async function delRes(id){if(!confirm('Delete?'))return;mutateStore(function(data){data.reservations=data.reservations.filter(function(r){return r.id!==id});return data;});await loadAdmin();renderResTb();toast('Deleted!')}
function openModal(){document.getElementById('modal').classList.add('open')}
function closeModal(){document.getElementById('modal').classList.remove('open')}

/* ===== RENDER ALL ===== MODIFIED: added renderProfilePage ===== */
function renderAll(){renderNav();renderFooter();renderHome();renderMenu();renderResLabels();renderAbout();renderContact();renderLogin();if(curUser)renderProfilePage();}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded',async function(){try{curUser=await getCur()}catch(e){}await Promise.all([loadHome(),loadMenu(),loadAbout(),loadContact()]);renderAll();navigate();});


