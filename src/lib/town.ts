/**
 * サイト全体を「M2D TOWN」として見せるための語彙。
 * PLACES: 全ページの一覧（文章ページの見出し・お問い合わせの関連ページなどで使う）。
 * NAV: 右上のナビに出す項目と、その並び順・サブ項目（SiteChrome が使う）。
 * label / en: ページ名。place / placeEn は同じ値（町の場所名は廃止）。
 */
export interface Place { path: string; place: string; placeEn: string; label: string; en: string; }

export const PLACES: Place[] = [
  // 2026-10-29: 町の場所名（広場・研究棟など）はユーザー要望で廃止し、通常のページ名に戻した。place/placeEn は label/en と同じ値を保持
  { path: '/',             place: 'ホーム',     placeEn: 'Home',         label: 'ホーム',     en: 'Home' },
  { path: '/message',      place: 'メッセージ',  placeEn: 'Message',      label: 'メッセージ',  en: 'Message' },
  { path: '/news',         place: 'お知らせ',    placeEn: 'News',         label: 'お知らせ',    en: 'News' },
  { path: '/about',        place: '研究室概要',  placeEn: 'About',        label: '研究室概要',  en: 'About' },
  { path: '/research',     place: '研究テーマ',  placeEn: 'Research',     label: '研究テーマ',  en: 'Research' },
  { path: '/members',      place: 'メンバー',    placeEn: 'Members',      label: 'メンバー',    en: 'Members' },
  { path: '/publications', place: '業績',       placeEn: 'Publications', label: '業績',       en: 'Publications' },
  { path: '/equipment',    place: '装置・設備',  placeEn: 'Apparatus',    label: '装置・設備',  en: 'Apparatus' },
  { path: '/voices',       place: '学生の声',    placeEn: 'Voices',       label: '学生の声',    en: 'Voices' },
  { path: '/access',       place: 'アクセス',    placeEn: 'Access',       label: 'アクセス',    en: 'Access' },
  { path: '/contact',      place: 'お問い合わせ', placeEn: 'Contact',      label: 'お問い合わせ', en: 'Contact' },
];

/**
 * 右上のナビ。上から順に左 → 右に並ぶ。
 *   path: その項目自身のページ（PLACES の path）。無ければ押してもページは開かず、サブ項目の一覧だけを開く（label / en が必須）
 *   children: カーソルを載せると下に出るサブ項目（PLACES の path）
 * 2026-11-21: ホーム・メッセージ・お知らせ・研究室・お問い合わせ・アクセスの 6 項目。研究室概要・研究テーマ・業績・装置・設備・学生の声・メンバーは「研究室」のサブ項目（ユーザー要望）。
 * audiences: true の項目には、お問い合わせの対象（src/content/contact/*.md の label。学生・企業・一般）がサブ項目として自動で入る。
 * form: true の項目には、サブ項目の最後に「お問い合わせフォーム」（src/data/site.json の contactFormUrl。別タブで開く）が入る。
 */
export interface NavItem { path?: string; label?: string; en?: string; children?: string[]; audiences?: boolean; form?: boolean; }
export const NAV: NavItem[] = [
  { path: '/' },                    // ホーム（タウンビューに戻る）
  { path: '/message' },
  { path: '/news' },
  { label: '研究室', en: 'Lab', children: ['/about', '/research', '/publications', '/equipment', '/voices', '/members'] },
  { path: '/contact', audiences: true, form: true },
  { path: '/access' },
];

/** お問い合わせの対象タブの id（ファイル名 01-student.md → aud-student）。ナビのサブ項目のリンク先 /contact#aud-student と、ページ内のタブで共通に使う。 */
export const audId = (entryId: string) => 'aud-' + entryId.replace(/^\d+-/, '');

/** 文章ページの URL（BASE_URL 込み）から、その場所を引く。/research/xxx のような下位ページも親に合わせる。 */
export function placeFor(pathname: string, base: string): Place | undefined {
  const rel = '/' + pathname.replace(base.replace(/\/$/, ''), '').replace(/^\/+/, '').replace(/\/$/, '');
  if (rel === '/') return PLACES[0];
  return PLACES.filter((p) => p.path !== '/' && !p.path.includes('#') && (rel === p.path || rel.startsWith(p.path + '/')))
    .sort((a, b) => b.path.length - a.path.length)[0];
}
