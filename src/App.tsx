import { FormEvent, ReactNode, useMemo, useState } from "react";

type Page =
  | "login"
  | "register"
  | "select-campus"
  | "home"
  | "activities"
  | "campuses"
  | "saved"
  | "applications"
  | "profile"
  | "detail"
  | "verification-pending"
  | "org-dashboard"
  | "org-add"
  | "org-manage"
  | "org-applicants"
  | "org-profile";

type Category =
  | "Seminar"
  | "Pelatihan"
  | "Kepanitiaan"
  | "Asisten Dosen"
  | "Pertukaran"
  | "Organisasi"
  | "Kompetisi";

type Activity = {
  id: string;
  campus: string;
  title: string;
  category: Category;
  organizer: string;
  eventDate: string;
  deadline: string;
  location: string;
  quota: number;
  description: string;
  status?: "Draf" | "Dibuka" | "Seleksi" | "Berjalan" | "Selesai" | "Ditutup";
  applicants?: number;
  needsSelection?: boolean;
  owner?: string;
};

type Profile = {
  name: string;
  email: string;
  campus: string;
  faculty: string;
  major: string;
};

type Application = {
  id: string;
  activity: Activity;
  status: "Menunggu" | "Diterima" | "Ditolak" | "Terdaftar";
  appliedAt: string;
};

type OrganizerProfile = {
  name: string;
  type: string;
  email: string;
  contact: string;
  campus: string;
  verified: boolean;
};

const campuses = [
  "Universitas Negeri Semarang",
  "Universitas Diponegoro",
  "Universitas Islam Negeri Walisongo Semarang",
  "Politeknik Negeri Semarang",
  "Universitas Gadjah Mada",
  "Institut Teknologi Bandung",
  "Universitas Indonesia",
  "Universitas Padjadjaran",
  "Universitas Brawijaya",
  "Universitas Airlangga",
];

const campusCodes = ["UN", "UD", "UW", "PN", "UG", "IT", "UI", "UP", "UB", "UA"];
const categories: Category[] = [
  "Seminar",
  "Pelatihan",
  "Kepanitiaan",
  "Asisten Dosen",
  "Pertukaran",
  "Organisasi",
  "Kompetisi",
];

const topicSets = [
  ["Inovasi Hijau", "Kepemimpinan Muda", "Data Science", "Festival Mahasiswa", "Global Exchange"],
  ["Teknologi Maritim", "Public Speaking", "Analisis Data", "Diponegoro Muda", "Student Exchange"],
  ["Ekonomi Syariah", "Desain Kreatif", "Literasi Digital", "Festival Walisongo", "Relawan Pendidikan"],
  ["Industri 4.0", "Internet of Things", "Robotika Dasar", "Expo Vokasi", "Kompetisi Inovasi"],
  ["Kebijakan Publik", "Riset Sosial", "Artificial Intelligence", "Gadjah Mada Mengajar", "Global Mobility"],
  ["Energi Terbarukan", "Product Management", "Machine Learning", "Festival Teknologi", "Kompetisi Startup"],
  ["Masa Depan Indonesia", "Career Preparation", "Business Analytics", "UI Youth Festival", "IISMA Preparation"],
  ["Kesehatan Global", "Content Strategy", "Bioinformatika", "Padjadjaran Fair", "Young Researchers"],
  ["Ketahanan Pangan", "Digital Marketing", "Web Development", "Brawijaya Mengajar", "Business Case"],
  ["Sustainable Health", "Personal Branding", "Health Data", "Airlangga Festival", "Global Leadership"],
];

function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const activityTemplates: { category: Category; prefix: string }[] = [
  { category: "Seminar", prefix: "Seminar Nasional" },
  { category: "Pelatihan", prefix: "Pelatihan Intensif" },
  { category: "Kepanitiaan", prefix: "Open Recruitment Panitia" },
  { category: "Asisten Dosen", prefix: "Rekrutmen Asisten Dosen" },
  { category: "Pertukaran", prefix: "Program Pertukaran Pelajar" },
];

const allActivities: Activity[] = campuses.flatMap((campus, campusIndex) =>
  activityTemplates.map((template, index) => ({
    id: `${campusIndex}-${index}`,
    campus,
    title: `${template.prefix} ${topicSets[campusIndex][index]}`,
    category: template.category,
    organizer: index % 2 ? `BEM ${campus}` : `Direktorat Kemahasiswaan ${campus}`,
    eventDate: futureDate(25 + campusIndex * 2 + index * 5),
    deadline: futureDate(4 + campusIndex + index * 3),
    location: index === 0 ? "Daring melalui Zoom Meeting" : `Kampus ${campus}`,
    quota: 12 + campusIndex * 3 + index * 7,
    description: `Program ${topicSets[campusIndex][index]} dirancang untuk membantu mahasiswa mengembangkan kompetensi, memperluas jejaring, dan mendapatkan pengalaman praktis bersama para ahli.`,
    status: index === 4 ? "Draf" : index === 3 ? "Seleksi" : "Dibuka",
    applicants: 18 + index * 7,
    needsSelection: template.category !== "Seminar",
    owner: campusIndex === 2 ? "Himpunan Mahasiswa Teknologi Informasi" : undefined,
  })),
);

const initialProfile: Profile = {
  name: "Andi Pratama",
  email: "andi@mahasiswa.walisongo.ac.id",
  campus: campuses[2],
  faculty: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
  major: "Informatika",
};

const initialOrganizer: OrganizerProfile = {
  name: "Himpunan Mahasiswa Teknologi Informasi",
  type: "Himpunan",
  email: "budi@himti-walisongo.ac.id",
  contact: "0812 3456 7890",
  campus: campuses[2],
  verified: true,
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    building: <><path d="M4 21h16M6 21V8l6-4 6 4v13M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3" /></>,
    bookmark: <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" />,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
    back: <path d="m15 18-6-6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12" /><circle cx="12" cy="12" r="3" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6" /></>,
    seminar: <><path d="M3 5h18v12H3zM8 21h8M12 17v4" /><path d="m8 12 3-3 2 2 3-3" /></>,
    training: <><circle cx="12" cy="12" r="9" /><path d="m12 7 1.4 2.8 3.1.5-2.2 2.2.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.2 3.1-.5Z" /></>,
    group: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20a6 6 0 0 1 12 0M15 15a5 5 0 0 1 6 5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0ZM6 6H3v2a4 4 0 0 0 5 4M18 6h3v2a4 4 0 0 1-5 4M12 13v5M8 21h8M9 18h6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    edit: <><path d="m4 16-1 5 5-1L19 9l-4-4Z" /><path d="m13 7 4 4" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
  };
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.calendar}
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark plant-mark"><span /><span /><span /></span>
      <span>RuangTumbuh</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function daysLeft(value: string) {
  return Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 86400000));
}

function AuthVisual({ register = false }: { register?: boolean }) {
  return (
    <div className="auth-visual">
      <Logo light />
      <div className="auth-copy">
        <span className="eyebrow">RUANG BERTUMBUH MAHASISWA</span>
        <h1>Satu Ruang, Banyak Peluang</h1>
        <p>Temukan kegiatan terbaik, bangun pengalaman, dan siapkan karirmu bersama RuangTumbuh.</p>
      </div>
      <div className="campus-illustration" aria-hidden="true">
        <div className="cloud one" /><div className="cloud two" />
        <div className="building-main"><div className="roof" /><div className="clock" /><div className="windows">••••••</div><div className="door" /></div>
        <div className="building-side left" /><div className="building-side right" />
        <div className="tree t1" /><div className="tree t2" /><div className="tree t3" />
      </div>
    </div>
  );
}

function Login({
  onLogin,
  goRegister,
}: {
  onLogin: (email: string) => void;
  goRegister: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <div className="auth-page">
      <AuthVisual />
      <main className="auth-form-wrap">
        <div className="mobile-logo"><Logo /></div>
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onLogin(email); }}>
          <div className="form-heading">
            <span className="eyebrow blue">SELAMAT DATANG KEMBALI</span>
            <h2>Masuk ke RuangTumbuh</h2>
            <p>Lanjutkan perjalanan pengembangan dirimu.</p>
          </div>
          <Field label="Email atau NIM" placeholder="Masukkan email atau NIM" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="demo-accounts"><span>Akun demo:</span><button type="button" onClick={() => setEmail("andi@mahasiswa.walisongo.ac.id")}>Mahasiswa</button><button type="button" onClick={() => setEmail("budi@himti-walisongo.ac.id")}>Penyelenggara</button></div>
          <Field label="Kata Sandi" placeholder="Masukkan kata sandi" type={showPassword ? "text" : "password"} action={<button type="button" className="field-action" onClick={() => setShowPassword(!showPassword)}><Icon name="eye" /></button>} />
          <div className="form-options">
            <label className="checkbox"><input type="checkbox" /> <span>Ingat saya</span></label>
            <button type="button" className="link-button">Lupa kata sandi?</button>
          </div>
          <button className="primary-btn full" type="submit">Masuk <Icon name="arrow" /></button>
          <p className="auth-switch">Belum punya akun? <button type="button" onClick={goRegister}>Daftar di sini</button></p>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  error,
  action,
  ...props
}: { label: string; error?: string; action?: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className={`input-shell ${error ? "error" : ""}`}>
        <input {...props} />
        {action}
      </div>
      {error && <small>{error}</small>}
    </label>
  );
}

function Register({
  onStudentSuccess,
  onOrganizerSuccess,
  goLogin,
}: {
  onStudentSuccess: (profile: Profile) => void;
  onOrganizerSuccess: (profile: OrganizerProfile) => void;
  goLogin: () => void;
}) {
  const [role, setRole] = useState<"student" | "organizer">("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", campus: "", faculty: "", major: "", type: "", contact: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const required = role === "student"
      ? ["name", "email", "password", "confirm", "campus", "faculty", "major"]
      : ["name", "type", "email", "contact", "password", "confirm"];
    required.forEach((key) => { if (!form[key as keyof typeof form]) next[key] = "Kolom ini wajib diisi"; });
    if (form.password && form.password.length < 8) next.password = "Kata sandi minimal 8 karakter";
    if (form.confirm && form.password !== form.confirm) next.confirm = "Konfirmasi kata sandi tidak cocok";
    if (role === "organizer" && /@(gmail|yahoo|outlook|hotmail)\.com$/i.test(form.email)) next.email = "Gunakan email instansi, bukan email pribadi";
    setErrors(next);
    if (!Object.keys(next).length) {
      if (role === "student") onStudentSuccess({ name: form.name, email: form.email, campus: form.campus, faculty: form.faculty, major: form.major });
      else onOrganizerSuccess({ name: form.name, type: form.type, email: form.email, contact: form.contact, campus: form.campus, verified: false });
    }
  }
  const set = (key: string, value: string) => setForm({ ...form, [key]: value });
  const institutionalEmail = role === "organizer" && /\.(ac\.id|co\.id)$/i.test(form.email) && !errors.email;
  return (
    <div className="auth-page register-page">
      <AuthVisual register />
      <main className="auth-form-wrap">
        <div className="mobile-logo"><Logo /></div>
        <form className="auth-form register-form" onSubmit={submit}>
          <div className="form-heading">
            <span className="eyebrow blue">BERGABUNG DENGAN RUANGTUMBUH</span>
            <h2>Buat Akun Anda</h2>
            <p>Lengkapi data berikut untuk mulai menjelajah.</p>
          </div>
          <div className="role-picker">
            <button type="button" className={role === "student" ? "active" : ""} onClick={() => { setRole("student"); setErrors({}); }}><Icon name="user" /><span><strong>Saya Mahasiswa</strong><small>Mencari kegiatan</small></span></button>
            <button type="button" className={role === "organizer" ? "active" : ""} onClick={() => { setRole("organizer"); setErrors({}); }}><Icon name="building" /><span><strong>Saya Penyelenggara</strong><small>Membuat kegiatan</small></span></button>
          </div>
          {role === "student" ? <>
            <div className="form-grid">
              <Field label="Nama Lengkap" placeholder="Nama lengkap Anda" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
              <Field label="Email Kampus" type="email" placeholder="nama@students.ac.id" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
              <Field label="Kata Sandi" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />
              <Field label="Konfirmasi Kata Sandi" type="password" placeholder="Ulangi kata sandi" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} />
            </div>
            <label className="field"><span>Asal Kampus</span><select value={form.campus} onChange={(e) => set("campus", e.target.value)} className={errors.campus ? "select-error" : ""}><option value="">Pilih asal kampus</option>{campuses.map((c) => <option key={c}>{c}</option>)}</select>{errors.campus && <small>{errors.campus}</small>}</label>
            <div className="form-grid">
              <Field label="Fakultas" placeholder="Contoh: Fakultas Teknik" value={form.faculty} onChange={(e) => set("faculty", e.target.value)} error={errors.faculty} />
              <Field label="Program Studi" placeholder="Contoh: Informatika" value={form.major} onChange={(e) => set("major", e.target.value)} error={errors.major} />
            </div>
          </> : <>
            <div className="form-grid">
              <Field label="Nama Penyelenggara/Organisasi" placeholder="Nama resmi organisasi" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
              <label className="field"><span>Jenis Penyelenggara</span><select value={form.type} onChange={(e) => set("type", e.target.value)} className={errors.type ? "select-error" : ""}><option value="">Pilih jenis</option>{["Perusahaan", "Lembaga/Instansi", "Organisasi Mahasiswa", "Himpunan", "UKM", "Kepanitiaan"].map((type) => <option key={type}>{type}</option>)}</select>{errors.type && <small>{errors.type}</small>}</label>
            </div>
            <Field label="Email Instansi" type="email" placeholder="contoh@organisasi.ac.id" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
            <p className={`field-help ${institutionalEmail ? "success" : ""}`}>{institutionalEmail && <Icon name="check" size={14} />}{institutionalEmail ? "Email instansi valid" : "Gunakan email resmi instansi atau organisasi, bukan email pribadi seperti Gmail atau Yahoo. Contoh valid: kegiatan@kampus.ac.id."}</p>
            <div className="form-grid">
              <Field label="Nomor Kontak" placeholder="08xx xxxx xxxx" value={form.contact} onChange={(e) => set("contact", e.target.value)} error={errors.contact} />
              <label className="field"><span>Kampus Sasaran <em>(opsional)</em></span><select value={form.campus} onChange={(e) => set("campus", e.target.value)}><option value="">Pilih kampus sasaran</option>{campuses.map((c) => <option key={c}>{c}</option>)}</select></label>
              <Field label="Kata Sandi" type="password" placeholder="Minimal 8 karakter" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />
              <Field label="Konfirmasi Kata Sandi" type="password" placeholder="Ulangi kata sandi" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} />
            </div>
          </>}
          <button className="primary-btn full" type="submit">Daftar <Icon name="arrow" /></button>
          <p className="auth-switch">Sudah punya akun? <button type="button" onClick={goLogin}>Masuk di sini</button></p>
        </form>
      </main>
    </div>
  );
}

function CampusLogo({ index, large = false }: { index: number; large?: boolean }) {
  return <div className={`campus-logo c${index % 5} ${large ? "large" : ""}`}><span>{campusCodes[index]}</span></div>;
}

function CampusPicker({
  selected,
  onSelect,
  onContinue,
  toast,
}: {
  selected: string;
  onSelect: (campus: string) => void;
  onContinue: () => void;
  toast?: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = campuses.filter((campus) => campus.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="picker-page">
      <header className="simple-header"><Logo /><span>Langkah 1 dari 1</span></header>
      <main className="picker-content">
        <div className="picker-heading"><span className="step-icon"><Icon name="building" /></span><h1>Pilih Kampus Anda</h1><p>Pilih kampus tempat Anda ingin melihat kegiatan.</p></div>
        <div className="campus-search"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama kampus..." /></div>
        <div className="campus-grid">
          {filtered.map((campus) => {
            const index = campuses.indexOf(campus);
            return <button key={campus} onClick={() => onSelect(campus)} className={`campus-card ${selected === campus ? "selected" : ""}`}><CampusLogo index={index} />{selected === campus && <span className="campus-check"><Icon name="check" size={14} /></span>}<span>{campus}</span></button>;
          })}
        </div>
        <button disabled={!selected} className="primary-btn picker-next" onClick={onContinue}>Lanjutkan <Icon name="arrow" /></button>
      </main>
      {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}
    </div>
  );
}

const navItems = [
  ["home", "Beranda", "home"],
  ["activities", "Kegiatan", "calendar"],
  ["campuses", "Kampus", "building"],
  ["saved", "Tersimpan", "bookmark"],
  ["applications", "Pendaftaran Saya", "file"],
  ["profile", "Profil", "user"],
] as const;

function Dashboard({
  page,
  setPage,
  profile,
  children,
  toast,
  logout,
}: {
  page: Page;
  setPage: (page: Page) => void;
  profile: Profile;
  children: ReactNode;
  toast: string;
  logout: () => void;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <div className="dashboard">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="sidebar-logo"><Logo /></div>
        <nav>
          {navItems.map(([target, label, icon]) => <button key={target} className={page === target || (page === "detail" && target === "activities") ? "active" : ""} onClick={() => { setPage(target); setMobileNav(false); }}><Icon name={icon} /><span>{label}</span></button>)}
        </nav>
        <button className="sidebar-logout" onClick={logout}><Icon name="logout" /><span>Keluar</span></button>
        <div className="sidebar-help"><span>?</span><strong>Butuh bantuan?</strong><small>Hubungi tim RuangTumbuh</small></div>
      </aside>
      {mobileNav && <button className="nav-backdrop" onClick={() => setMobileNav(false)} aria-label="Tutup menu" />}
      <section className="dashboard-main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileNav(true)}><Icon name="menu" /></button>
          <div className="top-search"><Icon name="search" /><input placeholder="Cari kegiatan, nama, atau kata kunci..." /></div>
          <div className="top-actions"><button className="notification"><Icon name="bell" /><span /></button><div className="avatar">{profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div className="user-meta"><strong>{profile.name}</strong><span>Mahasiswa</span></div></div>
        </header>
        <main className="page-content">{children}</main>
      </section>
      {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}
    </div>
  );
}

function CampusBadge({ campus, change }: { campus: string; change: () => void }) {
  return <div className="campus-badge"><Icon name="building" size={15} /><span>Kampus: <strong>{campus}</strong></span><button onClick={change}>Ganti</button></div>;
}

function CategoryIcon({ category }: { category: Category }) {
  const names: Record<Category, string> = { Seminar: "seminar", Pelatihan: "training", Kepanitiaan: "group", "Asisten Dosen": "user", Pertukaran: "globe", Organisasi: "building", Kompetisi: "trophy" };
  return <Icon name={names[category]} size={24} />;
}

function Home({
  profile,
  campus,
  activities,
  goActivities,
  goCampuses,
  openActivity,
  saved,
  toggleSave,
}: {
  profile: Profile;
  campus: string;
  activities: Activity[];
  goActivities: (category?: Category) => void;
  goCampuses: () => void;
  openActivity: (a: Activity) => void;
  saved: string[];
  toggleSave: (id: string) => void;
}) {
  return (
    <>
      <CampusBadge campus={campus} change={goCampuses} />
      <div className="welcome-line"><div><p>Senang melihatmu kembali</p><h1>Halo, {profile.name.split(" ")[0]}!</h1></div><span>{new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}</span></div>
      <section className="hero-banner">
        <div><span className="hero-pill">WAKTUNYA BERTUMBUH</span><h2>Temukan Kegiatan yang Sesuai dengan Minat dan Tujuanmu</h2><p>Jelajahi beragam peluang untuk mengembangkan keterampilan dan membangun masa depan.</p><button className="white-btn" onClick={() => goActivities()}>Jelajahi Kegiatan <Icon name="arrow" /></button></div>
        <div className="hero-art"><div className="orbit o1" /><div className="orbit o2" /><div className="hero-person"><span /></div><div className="float-card f1"><Icon name="trophy" /></div><div className="float-card f2"><Icon name="calendar" /></div></div>
      </section>
      <section className="section-block">
        <div className="section-title"><div><h2>Jelajahi Kategori</h2><p>Temukan kesempatan yang paling sesuai dengan minatmu.</p></div></div>
        <div className="category-grid">{categories.map((category) => <button key={category} onClick={() => goActivities(category)}><span><CategoryIcon category={category} /></span><strong>{category}</strong></button>)}</div>
      </section>
      <section className="section-block">
        <div className="section-title"><div><h2>Kegiatan Terbaru</h2><p>Peluang pilihan terbaru dari kampusmu.</p></div><button className="see-all" onClick={() => goActivities()}>Lihat semua <Icon name="arrow" size={16} /></button></div>
        <div className="activity-grid">{activities.slice(0, 3).map((a) => <ActivityCard key={a.id} activity={a} open={() => openActivity(a)} saved={saved.includes(a.id)} toggleSave={() => toggleSave(a.id)} />)}</div>
      </section>
    </>
  );
}

function ActivityPoster({ activity, large = false }: { activity: Activity; large?: boolean }) {
  const palettes = ["poster-blue", "poster-purple", "poster-orange", "poster-teal", "poster-navy"];
  return <div className={`activity-poster ${palettes[Number(activity.id.split("-")[1]) % palettes.length]} ${large ? "large" : ""}`}><div className="poster-shape" /><span>{activity.category}</span><strong>{activity.title.split(" ").slice(0, large ? 7 : 4).join(" ")}</strong><small>{campusCodes[campuses.indexOf(activity.campus)]}</small></div>;
}

function ActivityCard({
  activity,
  open,
  saved,
  toggleSave,
  removeLabel = false,
}: {
  activity: Activity;
  open: () => void;
  saved: boolean;
  toggleSave: () => void;
  removeLabel?: boolean;
}) {
  return (
    <article className="activity-card">
      <button className="poster-button" onClick={open}><ActivityPoster activity={activity} /></button>
      <button className={`save-button ${saved ? "saved" : ""}`} onClick={toggleSave} aria-label={removeLabel ? "Hapus dari simpanan" : "Simpan kegiatan"}><Icon name={removeLabel ? "trash" : "bookmark"} size={18} /></button>
      <div className="activity-body"><div className="activity-meta"><span className="category-tag">{activity.category}</span><span className="open-tag">Pendaftaran Dibuka</span></div><button className="activity-title" onClick={open}>{activity.title}</button><p className="organizer">{activity.organizer}</p><div className="activity-info"><span><Icon name="calendar" size={16} />{formatDate(activity.eventDate)}</span><span><Icon name="file" size={16} />Batas {formatDate(activity.deadline)}</span></div><div className="card-footer"><strong>Ditutup {daysLeft(activity.deadline)} hari lagi</strong><button onClick={open}>Lihat detail <Icon name="arrow" size={14} /></button></div></div>
    </article>
  );
}

function ActivitiesPage({
  campus,
  activities,
  initialCategory,
  goCampuses,
  openActivity,
  saved,
  toggleSave,
}: {
  campus: string;
  activities: Activity[];
  initialCategory: string;
  goCampuses: () => void;
  openActivity: (a: Activity) => void;
  saved: string[];
  toggleSave: (id: string) => void;
}) {
  const [category, setCategory] = useState(initialCategory || "Semua");
  const [sort, setSort] = useState("Terbaru");
  const filtered = activities.filter((a) => category === "Semua" || a.category === category).sort((a, b) => sort === "Deadline Terdekat" ? +new Date(a.deadline) - +new Date(b.deadline) : +new Date(b.eventDate) - +new Date(a.eventDate));
  return (
    <>
      <CampusBadge campus={campus} change={goCampuses} />
      <div className="page-heading"><div><h1>Kegiatan di {campus}</h1><p>Temukan kegiatan terbaik untuk mengembangkan potensi dirimu.</p></div><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Terbaru</option><option>Deadline Terdekat</option></select></div>
      <div className="filter-chips">{["Semua", ...categories].map((c) => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
      {filtered.length ? <div className="activity-grid">{filtered.map((a) => <ActivityCard key={a.id} activity={a} open={() => openActivity(a)} saved={saved.includes(a.id)} toggleSave={() => toggleSave(a.id)} />)}</div> : <EmptyState title="Belum ada kegiatan pada kategori ini" subtitle="Coba pilih kategori lain untuk menemukan peluang menarik." />}
    </>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="empty-state"><div className="empty-art"><Icon name="search" size={38} /><span /></div><h3>{title}</h3><p>{subtitle}</p></div>;
}

function CampusesPage({
  active,
  onChange,
}: {
  active: string;
  onChange: (campus: string) => void;
}) {
  const [pending, setPending] = useState("");
  return (
    <>
      <div className="page-heading"><div><h1>Kampus</h1><p>Pilih kampus untuk menyesuaikan daftar kegiatan yang kamu lihat.</p></div></div>
      <section className="active-campus-card"><CampusLogo index={campuses.indexOf(active)} large /><div><span>KAMPUS AKTIF</span><h2>{active}</h2><p>Semua rekomendasi kegiatan saat ini berasal dari kampus ini.</p></div><span className="active-check"><Icon name="check" /></span></section>
      <div className="section-title compact"><div><h2>Pilih Kampus Lain</h2><p>Kamu dapat mengganti kampus aktif kapan saja.</p></div></div>
      <div className="campus-grid dashboard-campuses">{campuses.map((campus, index) => <button key={campus} disabled={active === campus} onClick={() => setPending(campus)} className={`campus-card ${active === campus ? "selected" : ""}`}><CampusLogo index={index} />{active === campus && <span className="campus-check"><Icon name="check" size={14} /></span>}<span>{campus}</span>{active === campus && <small>Aktif</small>}</button>)}</div>
      {pending && <Modal onClose={() => setPending("")}><div className="confirm-icon"><Icon name="building" /></div><h2>Ganti ke {pending}?</h2><p>Daftar kegiatan akan diperbarui sesuai kampus yang kamu pilih.</p><div className="modal-actions"><button className="secondary-btn" onClick={() => setPending("")}>Batal</button><button className="primary-btn" onClick={() => { onChange(pending); setPending(""); }}>Ya, Ganti Kampus</button></div></Modal>}
    </>
  );
}

function Modal({ children, onClose, wide = false }: { children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop"><div className={`modal ${wide ? "wide" : ""}`}><button className="modal-close" onClick={onClose}><Icon name="x" /></button>{children}</div></div>;
}

function DetailPage({
  activity,
  back,
  registered,
  onRegister,
  saved,
  toggleSave,
}: {
  activity: Activity;
  back: () => void;
  registered: boolean;
  onRegister: (activity: Activity) => void;
  saved: boolean;
  toggleSave: () => void;
}) {
  const [tab, setTab] = useState("Deskripsi");
  const [formOpen, setFormOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const closed = daysLeft(activity.deadline) <= 0;
  return (
    <>
      <button className="back-button" onClick={back}><Icon name="back" />Kembali ke daftar kegiatan</button>
      <div className="detail-layout">
        <div className="detail-main">
          <ActivityPoster activity={activity} large />
          <div className="detail-title-row"><div><div className="activity-meta"><span className="category-tag">{activity.category}</span><span className="open-tag">Pendaftaran Dibuka</span></div><h1>{activity.title}</h1><p>{activity.organizer}</p></div><button className={`detail-save ${saved ? "saved" : ""}`} onClick={toggleSave}><Icon name="bookmark" /></button></div>
          <div className="detail-facts"><div><Icon name="building" /><span><small>Kampus</small><strong>{activity.campus}</strong></span></div><div><Icon name="calendar" /><span><small>Pelaksanaan</small><strong>{formatDate(activity.eventDate)}</strong></span></div><div><Icon name="globe" /><span><small>Lokasi</small><strong>{activity.location}</strong></span></div></div>
          <div className="detail-tabs">{["Deskripsi", "Persyaratan", "Cara Pendaftaran", "Jadwal"].map((t) => <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>
          <div className="tab-content">
            {tab === "Deskripsi" && <><h3>Tentang Kegiatan</h3><p>{activity.description}</p><p>Kegiatan ini menghadirkan pengalaman belajar kolaboratif serta kesempatan membangun relasi dengan mahasiswa dan profesional dari berbagai bidang.</p></>}
            {tab === "Persyaratan" && <><h3>Persyaratan Peserta</h3><ul className="check-list"><li>Mahasiswa aktif minimal semester 2</li><li>Memiliki IPK minimal 3,00</li><li>Mengunggah CV terbaru</li><li>Bersedia mengikuti seluruh rangkaian kegiatan</li></ul></>}
            {tab === "Cara Pendaftaran" && <><h3>Langkah Pendaftaran</h3><ol className="step-list"><li><span>1</span><div><strong>Lengkapi formulir</strong><p>Isi motivasi dan periksa kembali data profil.</p></div></li><li><span>2</span><div><strong>Unggah berkas</strong><p>Lampirkan CV atau berkas pendukung jika diperlukan.</p></div></li><li><span>3</span><div><strong>Kirim pendaftaran</strong><p>Pantau status melalui menu Pendaftaran Saya.</p></div></li></ol></>}
            {tab === "Jadwal" && <><h3>Jadwal Kegiatan</h3><div className="timeline"><div><span /><small>{formatDate(activity.deadline)}</small><strong>Batas pendaftaran</strong></div><div><span /><small>{formatDate(activity.eventDate)}</small><strong>Pelaksanaan kegiatan</strong></div></div></>}
          </div>
        </div>
        <aside className="registration-card"><h3>Pendaftaran</h3><div className="deadline-box"><small>Batas Pendaftaran</small><strong>{formatDate(activity.deadline)}</strong><span>{daysLeft(activity.deadline)} hari lagi</span></div><div className="quota"><span>Kuota tersisa</span><strong>{activity.quota} peserta</strong><div><i style={{ width: `${Math.min(85, activity.quota)}%` }} /></div></div><button disabled={registered || closed} className={`primary-btn full ${registered || closed ? "disabled" : ""}`} onClick={() => setFormOpen(true)}>{closed ? "Pendaftaran Ditutup" : registered ? "Sudah Terdaftar" : "Daftar Sekarang"}</button><p>Pastikan data yang kamu masukkan sudah benar.</p></aside>
      </div>
      {formOpen && <RegistrationModal activity={activity} agreed={agreed} setAgreed={setAgreed} close={() => setFormOpen(false)} submit={() => { onRegister(activity); setFormOpen(false); }} />}
    </>
  );
}

function RegistrationModal({ activity, agreed, setAgreed, close, submit }: { activity: Activity; agreed: boolean; setAgreed: (v: boolean) => void; close: () => void; submit: () => void }) {
  return <Modal onClose={close} wide><span className="eyebrow blue">FORMULIR PENDAFTARAN</span><h2>Daftar {activity.title}</h2><p className="modal-subtitle">Data profilmu telah terisi otomatis.</p><div className="form-grid"><Field label="Nama Lengkap" value="Andi Pratama" readOnly /><Field label="Email" value="andi.pratama@students.ac.id" readOnly /></div><label className="field"><span>Motivasi Mengikuti</span><textarea placeholder="Ceritakan motivasimu mengikuti kegiatan ini..." /></label><label className="upload-box"><Icon name="upload" /><span><strong>Unggah CV atau berkas pendukung</strong><small>PDF, maksimal 5 MB</small></span><input type="file" /></label><label className="checkbox agreement"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /><span>Saya menyatakan data yang diisi benar dan bersedia mengikuti ketentuan kegiatan.</span></label><div className="modal-actions"><button className="secondary-btn" onClick={close}>Batal</button><button disabled={!agreed} className="primary-btn" onClick={submit}>Kirim Pendaftaran</button></div></Modal>;
}

function SavedPage({ activities, openActivity, toggleSave }: { activities: Activity[]; openActivity: (a: Activity) => void; toggleSave: (id: string) => void }) {
  return <><div className="page-heading"><div><h1>Kegiatan Tersimpan</h1><p>Semua peluang yang ingin kamu lihat kembali.</p></div><span className="count-pill">{activities.length} kegiatan</span></div>{activities.length ? <div className="activity-grid">{activities.map((a) => <ActivityCard key={a.id} activity={a} open={() => openActivity(a)} saved toggleSave={() => toggleSave(a.id)} removeLabel />)}</div> : <EmptyState title="Belum ada kegiatan tersimpan" subtitle="Klik ikon simpan pada kegiatan yang menarik untuk melihatnya di sini." />}</>;
}

function ApplicationsPage({ applications, openActivity }: { applications: Application[]; openActivity: (a: Activity) => void }) {
  const [filter, setFilter] = useState("Semua");
  const [selected, setSelected] = useState<Application | null>(null);
  const filtered = applications.filter((a) => filter === "Semua" || a.status === filter);
  return <>
    <div className="page-heading"><div><h1>Pendaftaran Saya</h1><p>Pantau status seluruh pendaftaran kegiatanmu.</p></div></div>
    <div className="application-tabs">{["Semua", "Menunggu", "Diterima", "Ditolak"].map((t) => <button key={t} className={filter === t ? "active" : ""} onClick={() => setFilter(t)}>{t}<span>{t === "Semua" ? applications.length : applications.filter((a) => a.status === t).length}</span></button>)}</div>
    <div className="application-list">{filtered.map((app) => <button key={app.id} className="application-card" onClick={() => setSelected(app)}><ActivityPoster activity={app.activity} /><div className="application-info"><span className="category-tag">{app.activity.category}</span><h3>{app.activity.title}</h3><p><Icon name="building" size={15} />{app.activity.campus}</p><small>Daftar pada {app.appliedAt}</small></div><span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span><Icon name="arrow" className="application-arrow" /></button>)}</div>
    {!filtered.length && <EmptyState title="Belum ada pendaftaran dengan status ini" subtitle="Status pendaftaranmu akan ditampilkan di sini." />}
    {selected && <Modal onClose={() => setSelected(null)}><span className={`status status-${selected.status.toLowerCase()}`}>{selected.status}</span><h2>Detail Pendaftaran</h2><div className="application-modal-title"><ActivityPoster activity={selected.activity} /><div><strong>{selected.activity.title}</strong><span>{selected.activity.campus}</span></div></div><div className="modal-info"><span><small>Kategori</small><strong>{selected.activity.category}</strong></span><span><small>Tanggal Daftar</small><strong>{selected.appliedAt}</strong></span></div><button className="primary-btn full" onClick={() => { openActivity(selected.activity); setSelected(null); }}>Lihat Kegiatan</button>{selected.status === "Menunggu" && <button className="danger-link">Batalkan Pendaftaran</button>}</Modal>}
  </>;
}

function ProfilePage({ profile, updateProfile, logout }: { profile: Profile; updateProfile: (p: Profile) => void; logout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  return <>
    <div className="page-heading"><div><h1>Profil Saya</h1><p>Kelola informasi pribadi dan keamanan akunmu.</p></div></div>
    <section className="profile-hero"><div className="profile-avatar">{profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div><h2>{profile.name}</h2><p>{profile.email}</p><span>{profile.major}</span></div></section>
    <section className="settings-card"><div className="settings-heading"><div><h2>Informasi Pribadi</h2><p>Informasi ini digunakan untuk melengkapi pendaftaran kegiatan.</p></div>{!editing && <button className="secondary-btn" onClick={() => setEditing(true)}>Edit Profil</button>}</div>
      <div className="profile-fields">
        {editing ? <><Field label="Nama Lengkap" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /><Field label="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /><label className="field"><span>Asal Kampus</span><select value={draft.campus} onChange={(e) => setDraft({ ...draft, campus: e.target.value })}>{campuses.map((c) => <option key={c}>{c}</option>)}</select></label><label className="field"><span>Fakultas</span><select value={draft.faculty} onChange={(e) => setDraft({ ...draft, faculty: e.target.value })}><option>Fakultas Matematika dan Ilmu Pengetahuan Alam</option><option>Fakultas Teknik</option><option>Fakultas Ekonomi dan Bisnis</option><option>Fakultas Ilmu Sosial</option></select></label><Field label="Program Studi" value={draft.major} onChange={(e) => setDraft({ ...draft, major: e.target.value })} /></> : Object.entries({ "Nama Lengkap": profile.name, Email: profile.email, "Asal Kampus": profile.campus, Fakultas: profile.faculty, "Program Studi": profile.major }).map(([label, value]) => <div className="profile-value" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      {editing && <div className="edit-actions"><button className="secondary-btn" onClick={() => { setDraft(profile); setEditing(false); }}>Batal</button><button className="primary-btn" onClick={() => { updateProfile(draft); setEditing(false); }}>Simpan</button></div>}
    </section>
    <section className="settings-card"><div className="settings-heading"><div><h2>Ubah Kata Sandi</h2><p>Gunakan kata sandi kuat untuk menjaga keamanan akun.</p></div></div><div className="password-grid"><Field label="Kata Sandi Lama" type="password" placeholder="Masukkan kata sandi lama" /><Field label="Kata Sandi Baru" type="password" placeholder="Minimal 8 karakter" /><Field label="Konfirmasi Kata Sandi" type="password" placeholder="Ulangi kata sandi baru" /></div><button className="secondary-btn">Perbarui Kata Sandi</button></section>
    <button className="logout-button" onClick={logout}><Icon name="logout" />Keluar dari Akun</button>
  </>;
}

function VerificationPending({ organizer, goLogin }: { organizer: OrganizerProfile; goLogin: () => void }) {
  return <div className="verification-page"><div className="verification-card"><Logo /><div className="verification-icon"><Icon name="clock" size={34} /></div><span className="eyebrow blue">PENDAFTARAN BERHASIL</span><h1>Akun Anda Menunggu Verifikasi</h1><p>Akun <strong>{organizer.name}</strong> sedang diperiksa oleh tim RuangTumbuh. Anda baru dapat memublikasikan kegiatan setelah akun berhasil diverifikasi.</p><div className="verification-note"><Icon name="clock" /><span>Proses verifikasi biasanya memerlukan waktu 1–2 hari kerja. Kami akan mengirimkan kabar melalui email.</span></div><button className="primary-btn full" onClick={goLogin}>Kembali ke Halaman Masuk</button><small>Untuk mencoba dashboard terverifikasi, gunakan akun demo <strong>budi@himti-walisongo.ac.id</strong>.</small></div></div>;
}

const organizerNav = [
  ["org-dashboard", "Dashboard", "home"],
  ["org-add", "Tambah Kegiatan", "plus"],
  ["org-manage", "Kelola Kegiatan", "calendar"],
  ["org-applicants", "Data Pendaftar", "group"],
  ["org-profile", "Profil", "user"],
] as const;

function OrganizerShell({ page, setPage, organizer, children, toast, logout }: { page: Page; setPage: (page: Page) => void; organizer: OrganizerProfile; children: ReactNode; toast: string; logout: () => void }) {
  const [mobileNav, setMobileNav] = useState(false);
  return <div className="dashboard">
    <aside className={`sidebar ${mobileNav ? "open" : ""}`}><div className="sidebar-logo"><Logo /></div><nav>{organizerNav.map(([target, label, icon]) => <button key={target} className={page === target ? "active" : ""} onClick={() => { setPage(target); setMobileNav(false); }}><Icon name={icon} /><span>{label}</span></button>)}</nav><button className="sidebar-logout" onClick={logout}><Icon name="logout" /><span>Keluar</span></button><div className="sidebar-help"><span>?</span><strong>Butuh bantuan?</strong><small>Hubungi tim RuangTumbuh</small></div></aside>
    {mobileNav && <button className="nav-backdrop" onClick={() => setMobileNav(false)} aria-label="Tutup menu" />}
    <section className="dashboard-main"><header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}><Icon name="menu" /></button><div className="top-search"><Icon name="search" /><input placeholder="Cari kegiatan atau pendaftar..." /></div><div className="top-actions"><button className="notification"><Icon name="bell" /><span /></button><div className="avatar">{organizer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div className="user-meta"><strong>{organizer.name}</strong><span>Penyelenggara</span></div></div></header><main className="page-content">{children}</main></section>
    {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}
  </div>;
}

function OrganizerDashboard({ organizer, activities, applications, add }: { organizer: OrganizerProfile; activities: Activity[]; applications: Application[]; add: () => void }) {
  const active = activities.filter((a) => a.status === "Dibuka").length;
  const totalApplicants = activities.reduce((sum, a) => sum + (a.applicants || 0), 0) + applications.filter((a) => activities.some((item) => item.id === a.activity.id)).length;
  const stats = [["Total Kegiatan", activities.length, "calendar"], ["Total Pendaftar", totalApplicants, "group"], ["Kegiatan Aktif", active, "trophy"], ["Menunggu Seleksi", applications.filter((a) => a.status === "Menunggu").length + 12, "clock"]];
  return <><div className="org-welcome"><div><p>Kelola peluang dan temukan talenta terbaik</p><h1>Halo, {organizer.name}!</h1></div><button className="primary-btn" onClick={add}><Icon name="plus" />Tambah Kegiatan</button></div>
    <div className="summary-grid">{stats.map(([label, value, icon], index) => <div className={`summary-card tone-${index}`} key={String(label)}><span><Icon name={String(icon)} /></span><div><small>{label}</small><strong>{value}</strong><p>{index === 1 ? "Dari seluruh kegiatan" : "Data terbaru"}</p></div></div>)}</div>
    <section className="settings-card org-recent"><div className="settings-heading"><div><h2>Kegiatan Terbaru</h2><p>Pantau performa kegiatan yang baru dibuat.</p></div></div><div className="manage-list">{activities.slice(0, 4).map((activity) => <div className="manage-row" key={activity.id}><ActivityPoster activity={activity} /><div className="manage-info"><span className="category-tag">{activity.category}</span><h3>{activity.title}</h3><p>{activity.campus}</p></div><div className="applicant-total"><strong>{activity.applicants || 0}</strong><span>Pendaftar</span></div><span className={`event-status event-${(activity.status || "Dibuka").toLowerCase()}`}>{activity.status || "Dibuka"}</span></div>)}</div></section>
  </>;
}

type ActivityDraft = { title: string; category: Category; campus: string; description: string; organizer: string; contact: string; paid: string; location: string; openDate: string; deadline: string; quota: string; needsSelection: boolean; announcement: string; requirements: string[]; files: string[]; eventDate: string; endDate: string };

function AddActivityPage({ organizer, verified, save }: { organizer: OrganizerProfile; verified: boolean; save: (activity: Activity, draft: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [requirement, setRequirement] = useState("");
  const [form, setForm] = useState<ActivityDraft>({ title: "", category: "Seminar", campus: organizer.campus || campuses[2], description: "", organizer: organizer.name, contact: organizer.contact, paid: "Gratis", location: "", openDate: "", deadline: "", quota: "100", needsSelection: false, announcement: "", requirements: ["Mahasiswa aktif"], files: [], eventDate: "", endDate: "" });
  const set = <K extends keyof ActivityDraft>(key: K, value: ActivityDraft[K]) => setForm({ ...form, [key]: value });
  function submit(draft: boolean) {
    const activity: Activity = { id: `custom-${Date.now()}`, title: form.title || "Kegiatan Baru RuangTumbuh", category: form.category, campus: form.campus, description: form.description || "Kegiatan pengembangan diri untuk mahasiswa.", organizer: form.organizer, location: form.location || "Daring", deadline: form.deadline ? new Date(form.deadline).toISOString() : futureDate(14), eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : futureDate(30), quota: Number(form.quota) || 100, status: draft ? "Draf" : "Dibuka", applicants: 0, needsSelection: form.needsSelection, owner: organizer.name };
    save(activity, draft);
  }
  return <><div className="page-heading"><div><h1>Tambah Kegiatan</h1><p>Publikasikan peluang baru untuk mahasiswa.</p></div></div>
    <div className="wizard-steps">{[["Informasi Kegiatan", 1], ["Pendaftaran", 2], ["Jadwal Program", 3]].map(([label, number]) => <div className={`${step >= Number(number) ? "active" : ""}`} key={String(label)}><span>{number}</span><strong>{label}</strong></div>)}</div>
    <section className="settings-card wizard-card">
      {step === 1 && <><div className="settings-heading"><div><h2>Informasi Kegiatan</h2><p>Lengkapi informasi utama yang akan dilihat mahasiswa.</p></div><span>Langkah 1 dari 3</span></div><Field label="Judul Kegiatan" placeholder="Contoh: Pelatihan UI/UX untuk Pemula" value={form.title} onChange={(e) => set("title", e.target.value)} /><div className="form-grid"><label className="field"><span>Kategori</span><select value={form.category} onChange={(e) => { const category = e.target.value as Category; setForm({ ...form, category, needsSelection: category === "Seminar" ? false : form.needsSelection }); }}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label><label className="field"><span>Kampus Sasaran</span><select value={form.campus} onChange={(e) => set("campus", e.target.value)}>{campuses.map((c) => <option key={c}>{c}</option>)}</select></label></div><label className="field"><span>Deskripsi</span><textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Jelaskan tujuan dan manfaat kegiatan..." /></label><label className="upload-box poster-upload"><Icon name="upload" /><span><strong>Upload Poster Kegiatan</strong><small>PNG atau JPG, maksimal 5 MB</small></span><input type="file" /></label><div className="form-grid"><Field label="Penyelenggara" value={form.organizer} onChange={(e) => set("organizer", e.target.value)} /><Field label="Kontak" value={form.contact} onChange={(e) => set("contact", e.target.value)} /><label className="field"><span>Biaya</span><select value={form.paid} onChange={(e) => set("paid", e.target.value)}><option>Gratis</option><option>Berbayar</option></select></label><Field label="Lokasi atau Tautan Online" placeholder="Lokasi / https://..." value={form.location} onChange={(e) => set("location", e.target.value)} /></div></>}
      {step === 2 && <><div className="settings-heading"><div><h2>Pendaftaran dan Persyaratan</h2><p>Atur periode, kuota, dan mekanisme seleksi.</p></div><span>Langkah 2 dari 3</span></div><div className="form-grid"><Field label="Tanggal Buka Pendaftaran" type="date" value={form.openDate} onChange={(e) => set("openDate", e.target.value)} /><Field label="Batas Pendaftaran" type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /><Field label="Kuota Peserta" type="number" value={form.quota} onChange={(e) => set("quota", e.target.value)} /></div><div className="requirement-box"><label>Daftar Persyaratan</label>{form.requirements.map((item, index) => <div key={`${item}-${index}`}><Icon name="check" /><span>{item}</span><button onClick={() => set("requirements", form.requirements.filter((_, i) => i !== index))}><Icon name="x" size={15} /></button></div>)}<div className="add-requirement"><input value={requirement} onChange={(e) => setRequirement(e.target.value)} placeholder="Tambahkan persyaratan..." /><button onClick={() => { if (requirement) set("requirements", [...form.requirements, requirement]); setRequirement(""); }}><Icon name="plus" />Tambah</button></div></div><label className="toggle-row"><span><strong>Butuh Seleksi?</strong><small>Seminar secara default tidak memerlukan seleksi.</small></span><input type="checkbox" checked={form.needsSelection} disabled={form.category === "Seminar"} onChange={(e) => set("needsSelection", e.target.checked)} /></label>{form.needsSelection && <Field label="Tanggal Pengumuman Hasil" type="date" value={form.announcement} onChange={(e) => set("announcement", e.target.value)} />}<div className="file-options"><strong>Berkas wajib pendaftar</strong>{["CV", "Transkrip", "Portofolio"].map((file) => <label className="checkbox" key={file}><input type="checkbox" checked={form.files.includes(file)} onChange={(e) => set("files", e.target.checked ? [...form.files, file] : form.files.filter((f) => f !== file))} />{file}</label>)}</div></>}
      {step === 3 && <><div className="settings-heading"><div><h2>Jadwal dan Tahapan Program</h2><p>Susun rangkaian program secara jelas.</p></div><span>Langkah 3 dari 3</span></div><div className="form-grid"><Field label="Tanggal Pelaksanaan" type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} /><Field label="Tanggal Selesai" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} /></div><div className="program-stages">{["Pendaftaran Dibuka", ...(form.needsSelection ? ["Seleksi"] : []), "Pelaksanaan", "Selesai"].map((stage, index) => <div key={stage}><span>{index + 1}</span><div><strong>{stage}</strong><input type="date" /></div></div>)}</div></>}
      <div className="wizard-actions"><button className="secondary-btn" disabled={step === 1} onClick={() => setStep(step - 1)}><Icon name="back" />Kembali</button><div><button className="secondary-btn" onClick={() => submit(true)}>Simpan sebagai Draf</button>{step < 3 ? <button className="primary-btn" onClick={() => setStep(step + 1)}>Lanjutkan <Icon name="arrow" /></button> : <button className="primary-btn" disabled={!verified} onClick={() => submit(false)}>Publikasikan</button>}</div></div>{step === 3 && !verified && <p className="verification-warning"><Icon name="clock" />Menunggu verifikasi akun</p>}
    </section>
  </>;
}

function ManageActivitiesPage({ activities, applications, viewApplicants, update, remove }: { activities: Activity[]; applications: Application[]; viewApplicants: () => void; update: (id: string, status: Activity["status"]) => void; remove: (id: string) => void }) {
  const [tab, setTab] = useState("Semua");
  const [confirmDelete, setConfirmDelete] = useState<Activity | null>(null);
  const visible = activities.filter((a) => tab === "Semua" || (daysLeft(a.deadline) <= 0 ? "Ditutup" : a.status) === tab);
  return <><div className="page-heading"><div><h1>Kelola Kegiatan</h1><p>Kelola publikasi dan pantau performa seluruh kegiatan.</p></div></div><div className="filter-chips">{["Semua", "Draf", "Dibuka", "Seleksi", "Berjalan", "Selesai", "Ditutup"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div><div className="manage-table"><div className="manage-head"><span>Kegiatan</span><span>Pendaftaran</span><span>Pendaftar</span><span>Status</span><span>Aksi</span></div>{visible.map((activity) => { const status = daysLeft(activity.deadline) <= 0 ? "Ditutup" : activity.status || "Dibuka"; return <div className="manage-row detailed" key={activity.id}><div className="manage-event"><ActivityPoster activity={activity} /><div><span className="category-tag">{activity.category}</span><h3>{activity.title}</h3><p>{activity.campus}</p></div></div><span>{formatDate(activity.deadline)}</span><strong>{(activity.applicants || 0) + applications.filter((a) => a.activity.id === activity.id).length} / {activity.quota}</strong><span className={`event-status event-${status.toLowerCase()}`}>{status}</span><div className="row-actions"><button onClick={viewApplicants} title="Lihat Pendaftar"><Icon name="group" /></button><button title="Edit"><Icon name="edit" /></button>{status === "Dibuka" && <button onClick={() => update(activity.id, "Ditutup")} title="Tutup Pendaftaran"><Icon name="x" /></button>}<button className="danger" onClick={() => setConfirmDelete(activity)} title="Hapus"><Icon name="trash" /></button></div></div>})}</div>{!visible.length && <EmptyState title="Belum ada kegiatan pada status ini" subtitle="Kegiatan yang sesuai akan tampil di sini." />}{confirmDelete && <Modal onClose={() => setConfirmDelete(null)}><div className="confirm-icon danger"><Icon name="trash" /></div><h2>Hapus kegiatan?</h2><p>Kegiatan “{confirmDelete.title}” akan dihapus permanen.</p><div className="modal-actions"><button className="secondary-btn" onClick={() => setConfirmDelete(null)}>Batal</button><button className="primary-btn danger-btn" onClick={() => { remove(confirmDelete.id); setConfirmDelete(null); }}>Hapus</button></div></Modal>}</>;
}

const demoApplicants = [
  { id: "demo-a", name: "Nabila Rahma", nim: "2206012345", campus: campuses[2], major: "Teknologi Informasi", date: "18 Maret 2026", status: "Menunggu" },
  { id: "demo-b", name: "Rizky Ramadhan", nim: "2206012388", campus: campuses[2], major: "Sistem Informasi", date: "17 Maret 2026", status: "Diterima" },
  { id: "demo-c", name: "Siti Aisyah", nim: "2206012412", campus: campuses[0], major: "Informatika", date: "16 Maret 2026", status: "Ditolak" },
];

function ApplicantsPage({ activities, applications, updateStatus }: { activities: Activity[]; applications: Application[]; updateStatus: (id: string, status: Application["status"]) => void }) {
  const [activityId, setActivityId] = useState(activities[0]?.id || "");
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [demoRows, setDemoRows] = useState(demoApplicants);
  const [detail, setDetail] = useState<{ id: string; name: string; nim: string; campus: string; major: string; date: string; status: string } | null>(null);
  const selectedActivity = activities.find((a) => a.id === activityId) || activities[0];
  const realRows = applications.filter((app) => app.activity.id === selectedActivity?.id).map((app) => ({ id: app.id, name: "Andi Pratama", nim: "2306011001", campus: app.activity.campus, major: "Informatika", date: app.appliedAt, status: app.status }));
  const rows = [...realRows, ...demoRows].filter((row) => (filter === "Semua" || row.status === filter) && row.name.toLowerCase().includes(query.toLowerCase()));
  const noSelection = selectedActivity?.category === "Seminar" || !selectedActivity?.needsSelection;
  function changeStatus(id: string, status: Application["status"]) { updateStatus(id, status); setDemoRows((current) => current.map((row) => row.id === id ? { ...row, status } : row)); }
  function bulk(status: Application["status"]) { selectedRows.forEach((id) => changeStatus(id, status)); setSelectedRows([]); }
  return <><div className="page-heading"><div><h1>Data Pendaftar</h1><p>Periksa profil dan tentukan hasil seleksi peserta.</p></div><button className="secondary-btn"><Icon name="download" />Ekspor Data (Excel)</button></div><section className="applicant-controls"><label className="field"><span>Pilih Kegiatan</span><select value={activityId} onChange={(e) => setActivityId(e.target.value)}>{activities.map((a) => <option value={a.id} key={a.id}>{a.title}</option>)}</select></label><div className="applicant-summary">{["Semua", "Menunggu", "Diterima", "Ditolak"].map((status) => <button className={filter === status ? "active" : ""} onClick={() => setFilter(status)} key={status}><strong>{status === "Semua" ? rows.length : [...realRows, ...demoRows].filter((r) => r.status === status).length}</strong><span>{status === "Semua" ? "Total Pendaftar" : status}</span></button>)}</div></section><div className="table-tools"><div className="campus-search"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama pendaftar..." /></div>{!noSelection && selectedRows.length > 0 && <div><button className="accept-btn" onClick={() => bulk("Diterima")}>Terima Terpilih</button><button className="reject-btn" onClick={() => bulk("Ditolak")}>Tolak Terpilih</button></div>}</div><div className="applicant-table"><div className="applicant-head"><span /><span>Nama</span><span>Kampus & Prodi</span><span>Tanggal Daftar</span><span>Berkas</span><span>Status</span><span>Aksi</span></div>{rows.map((row) => <div className="applicant-row" key={row.id} onClick={() => setDetail(row)}><label onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedRows.includes(row.id)} onChange={(e) => setSelectedRows(e.target.checked ? [...selectedRows, row.id] : selectedRows.filter((id) => id !== row.id))} /></label><div><strong>{row.name}</strong><small>{row.nim}</small></div><div><strong>{row.campus}</strong><small>{row.major}</small></div><span>{row.date}</span><button className="file-link">Lihat Berkas</button><span className={`status status-${row.status.toLowerCase()}`}>{noSelection ? "Terdaftar" : row.status}</span><div className="selection-actions">{!noSelection && row.status === "Menunggu" && <><button className="accept-btn" onClick={(e) => { e.stopPropagation(); changeStatus(row.id, "Diterima"); }}>Terima</button><button className="reject-btn" onClick={(e) => { e.stopPropagation(); changeStatus(row.id, "Ditolak"); }}>Tolak</button></>}</div></div>)}</div>{detail && <Modal onClose={() => setDetail(null)} wide><span className={`status status-${detail.status.toLowerCase()}`}>{detail.status}</span><h2>Detail Pendaftar</h2><div className="applicant-detail"><div className="profile-avatar">{detail.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div><div><strong>{detail.name}</strong><span>{detail.nim} · {detail.major}</span><small>{detail.campus}</small></div></div><div className="motivation-box"><small>Motivasi Mengikuti</small><p>Saya ingin memperluas wawasan, meningkatkan keterampilan, dan mendapatkan pengalaman baru melalui kegiatan ini.</p></div><div className="uploaded-files"><strong>Berkas Terlampir</strong><button><Icon name="file" />CV_{detail.name.replace(" ", "_")}.pdf <span>Lihat</span></button></div>{!noSelection && detail.status === "Menunggu" && <div className="modal-actions"><button className="reject-btn" onClick={() => { changeStatus(detail.id, "Ditolak"); setDetail(null); }}>Tolak</button><button className="accept-btn" onClick={() => { changeStatus(detail.id, "Diterima"); setDetail(null); }}>Terima Pendaftar</button></div>}</Modal>}</>;
}

function OrganizerProfilePage({ profile, update, logout }: { profile: OrganizerProfile; update: (profile: OrganizerProfile) => void; logout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  return <><div className="page-heading"><div><h1>Profil Penyelenggara</h1><p>Kelola identitas organisasi dan keamanan akun.</p></div></div><section className="profile-hero organizer-profile-hero"><div className="profile-avatar">{profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div><div><h2>{profile.name}</h2><p>{profile.type}</p><span className={profile.verified ? "verified-badge" : "pending-badge"}><Icon name={profile.verified ? "check" : "clock"} size={13} />{profile.verified ? "Terverifikasi" : "Menunggu Verifikasi"}</span></div></section><section className="settings-card"><div className="settings-heading"><div><h2>Informasi Penyelenggara</h2><p>Informasi ini ditampilkan pada kegiatan yang dipublikasikan.</p></div>{!editing && <button className="secondary-btn" onClick={() => setEditing(true)}>Edit Profil</button>}</div><div className="profile-fields">{editing ? <><Field label="Nama Penyelenggara" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /><label className="field"><span>Jenis</span><select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>{["Perusahaan", "Lembaga/Instansi", "Organisasi Mahasiswa", "Himpunan", "UKM", "Kepanitiaan"].map((type) => <option key={type}>{type}</option>)}</select></label><Field label="Email Instansi" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /><Field label="Nomor Kontak" value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} /><label className="field"><span>Kampus Sasaran</span><select value={draft.campus} onChange={(e) => setDraft({ ...draft, campus: e.target.value })}>{campuses.map((c) => <option key={c}>{c}</option>)}</select></label></> : Object.entries({ "Nama Penyelenggara": profile.name, Jenis: profile.type, "Email Instansi": profile.email, "Nomor Kontak": profile.contact, "Kampus Sasaran": profile.campus }).map(([label, value]) => <div className="profile-value" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>{editing && <div className="edit-actions"><button className="secondary-btn" onClick={() => { setDraft(profile); setEditing(false); }}>Batal</button><button className="primary-btn" onClick={() => { update(draft); setEditing(false); }}>Simpan</button></div>}</section><section className="settings-card"><div className="settings-heading"><div><h2>Ubah Kata Sandi</h2><p>Perbarui kata sandi akun penyelenggara.</p></div></div><div className="password-grid"><Field label="Kata Sandi Lama" type="password" /><Field label="Kata Sandi Baru" type="password" /><Field label="Konfirmasi Kata Sandi" type="password" /></div><button className="secondary-btn">Perbarui Kata Sandi</button></section><button className="logout-button" onClick={logout}><Icon name="logout" />Keluar dari Akun</button></>;
}

function App() {
  const [page, setPage] = useState<Page>("login");
  const [role, setRole] = useState<"student" | "organizer" | null>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [organizer, setOrganizer] = useState(initialOrganizer);
  const [pendingOrganizer, setPendingOrganizer] = useState<OrganizerProfile | null>(null);
  const [campus, setCampus] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activityCategory, setActivityCategory] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [activities, setActivities] = useState<Activity[]>(allActivities);
  const initialApplications: Application[] = [
    { id: "app-1", activity: allActivities[1], status: "Diterima", appliedAt: "12 Februari 2026" },
    { id: "app-2", activity: allActivities[2], status: "Menunggu", appliedAt: "18 Februari 2026" },
    { id: "app-3", activity: allActivities[5], status: "Terdaftar", appliedAt: "22 Februari 2026" },
    { id: "app-4", activity: allActivities[8], status: "Ditolak", appliedAt: "4 Maret 2026" },
    { id: "app-5", activity: allActivities[14], status: "Menunggu", appliedAt: "8 Maret 2026" },
  ];
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const campusActivities = useMemo(() => activities.filter((a) => a.campus === campus && new Date(a.deadline) > new Date() && (a.status || "Dibuka") === "Dibuka"), [activities, campus]);
  const organizerActivities = useMemo(() => activities.filter((a) => a.owner === organizer.name || a.owner === initialOrganizer.name), [activities, organizer.name]);
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }
  function goActivities(category?: Category) {
    setActivityCategory(category || "");
    setPage("activities");
  }
  function openActivity(activity: Activity) {
    setSelectedActivity(activity);
    setPage("detail");
  }
  function toggleSave(id: string) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function registerActivity(activity: Activity) {
    const status = activity.category === "Seminar" ? "Terdaftar" : "Menunggu";
    setApplications((current) => current.some((app) => app.activity.id === activity.id) ? current : [{ id: `app-${Date.now()}`, activity, status, appliedAt: formatDate(new Date().toISOString()) }, ...current]);
    notify("Pendaftaran berhasil dikirim");
  }
  function logout() {
    setRole(null);
    setPage("login");
    notify("");
  }
  function handleLogin(email: string) {
    if (email.toLowerCase() === "budi@himti-walisongo.ac.id") {
      setOrganizer(initialOrganizer);
      setRole("organizer");
      setPage("org-dashboard");
      return;
    }
    setRole("student");
    if (email.toLowerCase() === "andi@mahasiswa.walisongo.ac.id") {
      setProfile(initialProfile);
      setSelectedCampus(campuses[2]);
      setCampus(campuses[2]);
    }
    setPage(campus || email.toLowerCase() === "andi@mahasiswa.walisongo.ac.id" ? "home" : "select-campus");
  }
  function updateApplicationStatus(id: string, status: Application["status"]) {
    setApplications((current) => current.map((app) => app.id === id ? { ...app, status } : app));
    notify(`Status pendaftar diubah menjadi ${status}`);
  }
  if (page === "login") return <Login onLogin={handleLogin} goRegister={() => setPage("register")} />;
  if (page === "register") return <Register goLogin={() => setPage("login")} onStudentSuccess={(data) => { setProfile(data); setSelectedCampus(data.campus); setRole("student"); notify("Akun berhasil dibuat"); setPage("select-campus"); }} onOrganizerSuccess={(data) => { setPendingOrganizer(data); setPage("verification-pending"); }} />;
  if (page === "verification-pending" && pendingOrganizer) return <VerificationPending organizer={pendingOrganizer} goLogin={() => setPage("login")} />;
  if (page === "select-campus") return <CampusPicker selected={selectedCampus} onSelect={setSelectedCampus} onContinue={() => { setCampus(selectedCampus); setProfile({ ...profile, campus: selectedCampus }); setPage("home"); }} toast={toast} />;

  if (role === "organizer") {
    let organizerContent: ReactNode = null;
    if (page === "org-dashboard") organizerContent = <OrganizerDashboard organizer={organizer} activities={organizerActivities} applications={applications} add={() => setPage("org-add")} />;
    if (page === "org-add") organizerContent = <AddActivityPage organizer={organizer} verified={organizer.verified} save={(activity, draft) => { setActivities((current) => [activity, ...current]); notify(draft ? "Kegiatan disimpan sebagai draf" : "Kegiatan berhasil dipublikasikan"); setPage("org-manage"); }} />;
    if (page === "org-manage") organizerContent = <ManageActivitiesPage activities={organizerActivities} applications={applications} viewApplicants={() => setPage("org-applicants")} update={(id, status) => { setActivities((current) => current.map((activity) => activity.id === id ? { ...activity, status } : activity)); notify("Status kegiatan berhasil diperbarui"); }} remove={(id) => { setActivities((current) => current.filter((activity) => activity.id !== id)); notify("Kegiatan berhasil dihapus"); }} />;
    if (page === "org-applicants") organizerContent = <ApplicantsPage activities={organizerActivities} applications={applications} updateStatus={updateApplicationStatus} />;
    if (page === "org-profile") organizerContent = <OrganizerProfilePage profile={organizer} update={(data) => { setOrganizer(data); notify("Profil berhasil diperbarui"); }} logout={logout} />;
    return <OrganizerShell page={page} setPage={setPage} organizer={organizer} toast={toast} logout={logout}>{organizerContent}</OrganizerShell>;
  }

  const content = (() => {
    if (page === "home") return <Home profile={profile} campus={campus} activities={campusActivities} goActivities={goActivities} goCampuses={() => setPage("campuses")} openActivity={openActivity} saved={saved} toggleSave={toggleSave} />;
    if (page === "activities") return <ActivitiesPage key={`${campus}-${activityCategory}`} campus={campus} activities={campusActivities} initialCategory={activityCategory} goCampuses={() => setPage("campuses")} openActivity={openActivity} saved={saved} toggleSave={toggleSave} />;
    if (page === "campuses") return <CampusesPage active={campus} onChange={(next) => { setCampus(next); setPage("home"); notify(`Kampus aktif diubah ke ${next}`); }} />;
    if (page === "saved") return <SavedPage activities={activities.filter((a) => saved.includes(a.id))} openActivity={openActivity} toggleSave={toggleSave} />;
    if (page === "applications") return <ApplicationsPage applications={applications} openActivity={openActivity} />;
    if (page === "profile") return <ProfilePage profile={profile} updateProfile={(data) => { setProfile(data); notify("Profil berhasil diperbarui"); }} logout={logout} />;
    if (page === "detail" && selectedActivity) return <DetailPage activity={selectedActivity} back={() => setPage("activities")} registered={applications.some((app) => app.activity.id === selectedActivity.id)} onRegister={registerActivity} saved={saved.includes(selectedActivity.id)} toggleSave={() => toggleSave(selectedActivity.id)} />;
    return null;
  })();
  return <Dashboard page={page} setPage={setPage} profile={profile} toast={toast} logout={logout}>{content}</Dashboard>;
}

export default App;
