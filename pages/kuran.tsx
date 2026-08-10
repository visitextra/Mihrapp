import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Play, Pause, Bookmark, BookOpen, Search, Volume2, ArrowLeft, VolumeX, List, X } from 'lucide-react';
import styles from './kuran.module.css';

interface SurahListItem {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

interface SurahDetail {
  surahNo: number;
  surahName: string;
  surahNameArabic: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
  arabic1: string[];
  audio: {
    [key: string]: {
      reciter: string;
      url: string;
    }
  };
}

interface AyahTranslation {
  number: number;
  text: string;
  numberInSurah: number;
}



export const KuranPage = () => {
  const [surahs, setSurahs] = useState<SurahListItem[]>([]);
  const [selectedSurahNo, setSelectedSurahNo] = useState<number>(1);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [turkishVerses, setTurkishVerses] = useState<AyahTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [readingMode, setReadingMode] = useState<'both' | 'arabic' | 'turkish'>('both');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bookmark state
  const [bookmark, setBookmark] = useState<{ surahNo: number; surahName: string; ayahNo: number } | null>(null);

  // Fetch Surahs list on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (!res.ok) throw new Error('Surah listesi yüklenemedi');
        const data = await res.json();
        
        const mappedSurahs: SurahListItem[] = data.data.map((item: any) => ({
          surahName: item.englishName,
          surahNameArabic: item.name,
          surahNameArabicLong: item.name,
          surahNameTranslation: item.englishNameTranslation,
          revelationPlace: item.revelationType === 'Meccan' ? 'Mekke' : 'Medine',
          totalAyah: item.numberOfAyahs,
        }));
        
        setSurahs(mappedSurahs);
      } catch (err) {
        console.error(err);
        setError('Kur\'an listesi alınamadı. Lütfen daha sonra tekrar deneyin.');
      }
    };
    fetchSurahs();

    // Load bookmark
    const savedBookmark = localStorage.getItem('mihrapp_quran_bookmark');
    if (savedBookmark) {
      try {
        setBookmark(JSON.parse(savedBookmark));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch Surah details when selection changes
  useEffect(() => {
    const fetchSurahDetail = async () => {
      setLoading(true);
      setError(null);
      
      // Reset audio playing state when loading a new surah
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }

      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNo}/editions/quran-uthmani,tr.diyanet`);
        if (!res.ok) throw new Error('Sure detayları yüklenemedi');

        const data = await res.json();
        if (!data.data || data.data.length < 2) throw new Error('Geçersiz sure verisi');

        const arabicEdition = data.data.find((e: any) => e.edition.identifier === 'quran-uthmani') || data.data[0];
        const turkishEdition = data.data.find((e: any) => e.edition.identifier === 'tr.diyanet') || data.data[1];

        const detailData: SurahDetail = {
          surahNo: arabicEdition.number,
          surahName: arabicEdition.englishName,
          surahNameArabic: arabicEdition.name,
          surahNameTranslation: arabicEdition.englishNameTranslation,
          revelationPlace: arabicEdition.revelationType === 'Meccan' ? 'Mekke' : 'Medine',
          totalAyah: arabicEdition.numberOfAyahs,
          arabic1: arabicEdition.ayahs.map((a: any) => a.text),
          audio: {
            "1": {
              reciter: "Mishary Rashid Alafasy",
              url: `https://download.quranicaudio.com/qdc/mishari_al_afasy/by_surah/surah_${selectedSurahNo}.mp3`
            }
          }
        };

        setSurahDetail(detailData);
        setTurkishVerses(turkishEdition.ayahs.map((a: any) => ({
          number: a.number,
          text: a.text,
          numberInSurah: a.numberInSurah
        })));

        setAudioUrl(`https://download.quranicaudio.com/qdc/mishari_al_afasy/by_surah/surah_${selectedSurahNo}.mp3`);

      } catch (err) {
        console.error(err);
        setError('Sure yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurahDetail();
  }, [selectedSurahNo]);

  // Audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);

      // Apply initial volume
      audio.volume = isMuted ? 0 : volume;

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl, isMuted, volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error('Audio play error:', e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Bookmark a verse
  const handleSaveBookmark = (ayahNo: number) => {
    if (!surahDetail) return;
    const newBookmark = {
      surahNo: selectedSurahNo,
      surahName: surahDetail.surahName,
      ayahNo
    };
    setBookmark(newBookmark);
    localStorage.setItem('mihrapp_quran_bookmark', JSON.stringify(newBookmark));
  };

  const handleGoToBookmark = (b: typeof bookmark) => {
    if (!b) return;
    if (b.surahNo !== selectedSurahNo) {
      setSelectedSurahNo(b.surahNo);
      // Wait for load and scroll
      setTimeout(() => {
        scrollToAyah(b.ayahNo);
      }, 800);
    } else {
      scrollToAyah(b.ayahNo);
    }
  };

  const scrollToAyah = (ayahNo: number) => {
    const el = document.getElementById(`ayah-box-${ayahNo}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add transient highlight style
      el.classList.add(styles.highlighted);
      setTimeout(() => {
        el.classList.remove(styles.highlighted);
      }, 2000);
    }
  };

  // Filter surahs based on search
  const filteredSurahs = surahs.filter((s, idx) => {
    const surahNo = idx + 1;
    const matchName = s.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.surahNameArabic.includes(searchTerm);
    const matchNumber = String(surahNo) === searchTerm;
    return matchName || matchNumber;
  });

  return (
    <>
      <Helmet>
        <title>Kur'an-ı Kerim | Mihrapp</title>
        <meta name="description" content="Mihrapp Kur'an-ı Kerim okuma ekranı ile sureleri Arapça metinleri ve Türkçe mealleri ile okuyun, Mishary Rashid Alafasy kıraatiyle dinleyin." />
        <html lang="tr" />
        <body className="dark" />
      </Helmet>

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="none" />
      )}

      <div className={styles.quranContainer}>
        {/* Toggle Sidebar Button (Mobile) */}
        <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <List size={20} />}
          <span>Sureler</span>
        </button>

        {/* 1. Surah Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.homeLinkContainer}>
              <a href="/" className={styles.homeLink}>
                <ArrowLeft size={16} />
                <span>Anasayfa</span>
              </a>
            </div>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Sure ara (Adı veya No)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.surahList}>
            {filteredSurahs.map((s, idx) => {
              const surahNo = surahs.indexOf(s) + 1;
              const isActive = surahNo === selectedSurahNo;
              return (
                <button
                  key={surahNo}
                  className={`${styles.surahItem} ${isActive ? styles.activeSurah : ''}`}
                  onClick={() => {
                    setSelectedSurahNo(surahNo);
                    if (window.innerWidth <= 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <div className={styles.surahNum}>{surahNo}</div>
                  <div className={styles.surahMeta}>
                    <div className={styles.surahTitle}>{s.surahName}</div>
                    <div className={styles.surahSubtitle}>{s.surahNameArabic}</div>
                  </div>
                  <div className={styles.surahArabicInfo}>
                    <span className={styles.ayahCount}>{s.totalAyah} Ayet</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 2. Reading Viewer Panel */}
        <main className={styles.viewerPanel}>
          {/* Header controls */}
          <div className={styles.viewerHeader}>
            {surahDetail && (
              <div className={styles.surahInfo}>
                <h2>{surahDetail.surahName} ({surahDetail.surahNameArabic})</h2>
                <p>
                  {surahDetail.revelationPlace === 'Mecca' ? 'Mekke' : 'Medine'} • {surahDetail.totalAyah} Ayet
                </p>
              </div>
            )}

            {/* Reading Mode Switcher */}
            <div className={styles.controlsRow}>
              <div className={styles.modeTabs}>
                <button 
                  className={readingMode === 'both' ? styles.activeMode : ''} 
                  onClick={() => setReadingMode('both')}
                >
                  Meal + Arapça
                </button>
                <button 
                  className={readingMode === 'arabic' ? styles.activeMode : ''} 
                  onClick={() => setReadingMode('arabic')}
                >
                  Arapça
                </button>
                <button 
                  className={readingMode === 'turkish' ? styles.activeMode : ''} 
                  onClick={() => setReadingMode('turkish')}
                >
                  Türkçe Meal
                </button>
              </div>

              {/* Quick Bookmark Navigation */}
              {bookmark && (
                <button 
                  className={styles.bookmarkNavBtn} 
                  onClick={() => handleGoToBookmark(bookmark)}
                  title={`Kaldığım Ayet: Sure ${bookmark.surahNo}, Ayet ${bookmark.ayahNo}`}
                >
                  <Bookmark size={14} fill="#d4af37" className={styles.goldText} />
                  <span>Kaldığım Yere Git</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio Player Bar */}
          {audioUrl && surahDetail && (
            <div className={styles.audioPlayer}>
              <button onClick={handlePlayPause} className={styles.playBtn} aria-label={isPlaying ? 'Durdur' : 'Oynat'}>
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              
              <div className={styles.playerMeta}>
                <span className={styles.reciterName}>Sure Dinle (Alafasy)</span>
                <div className={styles.audioTimeline}>
                  <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.progressBar}
                  />
                  <span className={styles.timeLabel}>{formatTime(duration)}</span>
                </div>
              </div>

              <div className={styles.audioVolume}>
                <button onClick={toggleMute} className={styles.muteBtn}>
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeBar}
                />
              </div>
            </div>
          )}

          {/* Loading / Error States */}
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Sure yükleniyor...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
            </div>
          ) : surahDetail ? (
            <div className={styles.versesContainer}>
              {/* Bismillah Header (except Surah At-Tawbah (9) and Surah Al-Fatihah (1) which already includes Bismillah as verse 1) */}
              {selectedSurahNo !== 9 && selectedSurahNo !== 1 && (
                <div className={styles.bismillah}>
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </div>
              )}

              {/* Verses List */}
              {surahDetail.arabic1.map((arabicText, index) => {
                const ayahNo = index + 1;
                const trText = turkishVerses[index]?.text || '';
                const isBookmarked = bookmark?.surahNo === selectedSurahNo && bookmark?.ayahNo === ayahNo;

                return (
                  <div key={ayahNo} id={`ayah-box-${ayahNo}`} className={styles.ayahBox}>
                    <div className={styles.ayahHeader}>
                      {/* Ayah number with golden design */}
                      <span className={styles.ayahBadge}>{ayahNo}</span>
                      
                      {/* Action buttons (Bookmark) */}
                      <button 
                        onClick={() => handleSaveBookmark(ayahNo)}
                        className={`${styles.bookmarkBtn} ${isBookmarked ? styles.activeBookmark : ''}`}
                        title="Bu ayeti işaretle (Kaldığım yer)"
                      >
                        <Bookmark size={14} fill={isBookmarked ? '#d4af37' : 'none'} />
                      </button>
                    </div>

                    {/* Arabic Text */}
                    {(readingMode === 'both' || readingMode === 'arabic') && (
                      <div className={styles.arabicText}>
                        {arabicText}
                      </div>
                    )}

                    {/* Turkish Text */}
                    {(readingMode === 'both' || readingMode === 'turkish') && (
                      <div className={styles.turkishText}>
                        {trText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default KuranPage;
