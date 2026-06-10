import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Calendar as CalendarIcon, ChevronDown, Check, X, RefreshCw } from 'lucide-react';
import styles from './PrayerTimesHeader.module.css';

interface Vakit {
  HicriTarihUzun: string;
  MiladiTarihUzun: string;
  MiladiTarihKisa: string;
  Imsak: string;
  Gunes: string;
  Ogle: string;
  Ikindi: string;
  Aksam: string;
  Yatsi: string;
}

interface LocationConfig {
  countryName: string;
  cityName: string;
  districtName: string;
  districtId: string;
}

export const PrayerTimesHeader = () => {
  const [location, setLocation] = useState<LocationConfig | null>(null);
  const [times, setTimes] = useState<Vakit[]>([]);
  const [todayVakit, setTodayVakit] = useState<Vakit | null>(null);
  const [tomorrowVakit, setTomorrowVakit] = useState<Vakit | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Konum alınıyor...');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Geolocation error tracking
  const [locError, setLocError] = useState<string | null>(null);

  // Manual selector states
  const [modalOpen, setModalOpen] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('2'); // default Turkey
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectorLoading, setSelectorLoading] = useState(false);

  // Fallback defaults (Istanbul Fatih/Istanbul Center)
  const defaultLocation: LocationConfig = {
    countryName: 'TÜRKİYE',
    cityName: 'İSTANBUL',
    districtName: 'İSTANBUL',
    districtId: '9541' // Istanbul Center/District ID
  };

  // 1. Keep track of live time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to clean and compare Turkish characters
  const cleanStr = (s: string): string => {
    if (!s) return '';
    return s
      .toUpperCase()
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'I')
      .replace(/Ğ/g, 'G')
      .replace(/Ü/g, 'U')
      .replace(/Ş/g, 'S')
      .replace(/Ö/g, 'O')
      .replace(/Ç/g, 'C')
      .replace(/[^A-Z0-9\s]/g, '')
      .trim();
  };

  // 2. Initialize Location
  useEffect(() => {
    const savedConfig = localStorage.getItem('mihrapp_location_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig) as LocationConfig;
        setLocation(parsed);
        fetchPrayerTimes(parsed.districtId);
      } catch (e) {
        detectLocation();
      }
    } else {
      detectLocation();
    }
  }, []);

  const detectLocation = () => {
    setLoading(true);
    setLoadingMsg('Konum alınıyor...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setLoadingMsg('Adres çözümleniyor...');
            
            // Nominatim reverse geocoding
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`,
              {
                headers: {
                  'User-Agent': 'Mihrapp-Web-App'
                }
              }
            );
            
            if (!geoRes.ok) throw new Error('Geocoding servis hatası');
            const geoData = await geoRes.json();
            
            const rawCity = geoData.address.province || geoData.address.city || geoData.address.state || '';
            const rawDistrict = geoData.address.county || geoData.address.town || geoData.address.suburb || geoData.address.city_district || '';

            if (!rawCity) throw new Error('Şehir adı tespit edilemedi');

            setLoadingMsg('Ezan vakitleri eşleştiriliyor...');
            await matchDiyanetLocation('2', rawCity, rawDistrict);
          } catch (err) {
            console.error('Konum detaylandırma hatası, IP fallback deneniyor:', err);
            fallbackToIp();
          }
        },
        (error) => {
          console.warn('Geolocation izni reddedildi/hata oluştu, IP fallback deneniyor:', error);
          fallbackToIp();
        },
        { timeout: 8000 }
      );
    } else {
      fallbackToIp();
    }
  };

  const fallbackToIp = async () => {
    try {
      setLoadingMsg('IP konumu tespit ediliyor...');
      const ipRes = await fetch('https://ipapi.co/json/');
      if (!ipRes.ok) throw new Error('IP konum servisi hatası');
      const ipData = await ipRes.json();
      
      const rawCity = ipData.city || '';
      if (!rawCity) throw new Error('IP üzerinden şehir okunamadı');

      await matchDiyanetLocation('2', rawCity, '');
    } catch (err) {
      console.error('IP Konum hatası, varsayılan İstanbul uygulanıyor:', err);
      applyConfig(defaultLocation);
    }
  };

  const matchDiyanetLocation = async (countryId: string, rawCityName: string, rawDistrictName: string) => {
    try {
      // Fetch Turkey cities
      const citiesRes = await fetch(`https://ezanvakti.emushaf.net/sehirler/${countryId}`);
      if (!citiesRes.ok) throw new Error('Şehir listesi yüklenemedi');
      const diyanetCities = await citiesRes.json();

      const cleanedGeoCity = cleanStr(rawCityName);
      
      // Find matching city
      let matchedCity = diyanetCities.find(
        (c: any) => cleanStr(c.SehirAdiEn) === cleanedGeoCity || cleanStr(c.SehirAdi) === cleanedGeoCity
      );

      // Substring check fallback
      if (!matchedCity) {
        matchedCity = diyanetCities.find(
          (c: any) => cleanedGeoCity.includes(cleanStr(c.SehirAdiEn)) || cleanStr(c.SehirAdiEn).includes(cleanedGeoCity)
        );
      }

      if (!matchedCity) throw new Error(`Şehir eşleştirilemedi: ${rawCityName}`);

      // Fetch districts
      const distsRes = await fetch(`https://ezanvakti.emushaf.net/ilceler/${matchedCity.SehirID}`);
      if (!distsRes.ok) throw new Error('İlçe listesi yüklenemedi');
      const diyanetDistricts = await distsRes.json();

      const cleanedGeoDist = cleanStr(rawDistrictName);
      
      // Find matching district
      let matchedDistrict = diyanetDistricts.find(
        (d: any) => cleanStr(d.IlceAdiEn) === cleanedGeoDist || cleanStr(d.IlceAdi) === cleanedGeoDist
      );

      if (!matchedDistrict && cleanedGeoDist) {
        matchedDistrict = diyanetDistricts.find(
          (d: any) => cleanedGeoDist.includes(cleanStr(d.IlceAdiEn)) || cleanStr(d.IlceAdiEn).includes(cleanedGeoDist)
        );
      }

      // Default to the central district if no match
      if (!matchedDistrict) {
        // Look for district named after the city
        matchedDistrict = diyanetDistricts.find(
          (d: any) => cleanStr(d.IlceAdiEn) === cleanStr(matchedCity.SehirAdiEn)
        ) || diyanetDistricts[0];
      }

      if (!matchedDistrict) throw new Error('İlçe bulunamadı');

      const config: LocationConfig = {
        countryName: 'TÜRKİYE',
        cityName: matchedCity.SehirAdi,
        districtName: matchedDistrict.IlceAdi,
        districtId: matchedDistrict.IlceID
      };

      applyConfig(config);
    } catch (err) {
      console.error('Diyanet eşleme hatası, varsayılana dönülüyor:', err);
      applyConfig(defaultLocation);
    }
  };

  const applyConfig = (config: LocationConfig) => {
    setLocation(config);
    localStorage.setItem('mihrapp_location_config', JSON.stringify(config));
    fetchPrayerTimes(config.districtId);
  };

  const fetchPrayerTimes = async (districtId: string) => {
    setLoading(true);
    setLoadingMsg('Ezan vakitleri yükleniyor...');
    try {
      const res = await fetch(`https://ezanvakti.emushaf.net/vakitler/${districtId}`);
      if (!res.ok) throw new Error('Vakitler API hatası');
      const data = await res.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Geçersiz vakit verisi');
      }

      setTimes(data);
      calculateTodayVakit(data);
      setLoading(false);
      setLocError(null);
    } catch (err) {
      console.error('Vakitler çekilemedi:', err);
      setLocError('Ezan vakitleri alınamadı.');
      setLoading(false);
    }
  };

  // Find today's and tomorrow's prayer times
  const calculateTodayVakit = (vakitList: Vakit[]) => {
    const now = new Date();
    const cleanDatePart = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    };

    const todayStr = cleanDatePart(now);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = cleanDatePart(tomorrow);

    const todayIndex = vakitList.findIndex(v => v.MiladiTarihKisa === todayStr);
    if (todayIndex !== -1) {
      setTodayVakit(vakitList[todayIndex]);
      
      if (todayIndex + 1 < vakitList.length) {
        setTomorrowVakit(vakitList[todayIndex + 1]);
      } else {
        setTomorrowVakit(null);
      }
    } else {
      // Fallback if local date matching fails, use index 0
      setTodayVakit(vakitList[0]);
      setTomorrowVakit(vakitList[1] || null);
    }
  };

  // Parse time helper (e.g. "12:52" -> Date object)
  const parseTime = (timeStr: string, baseDate: Date): Date => {
    const [hrs, mins] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(hrs, mins, 0, 0);
    return d;
  };

  // Calculations for active/next times
  const getTimesState = () => {
    if (!todayVakit) return null;

    const baseToday = new Date(currentTime);
    const baseTomorrow = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

    const imsak = parseTime(todayVakit.Imsak, baseToday);
    const gunes = parseTime(todayVakit.Gunes, baseToday);
    const ogle = parseTime(todayVakit.Ogle, baseToday);
    const ikindi = parseTime(todayVakit.Ikindi, baseToday);
    const aksam = parseTime(todayVakit.Aksam, baseToday);
    const yatsi = parseTime(todayVakit.Yatsi, baseToday);

    const nextImsak = tomorrowVakit 
      ? parseTime(tomorrowVakit.Imsak, baseTomorrow)
      : new Date(imsak.getTime() + 24 * 60 * 60 * 1000);

    let activeName = '';
    let nextName = '';
    let nextTime: Date = imsak;

    if (currentTime < imsak) {
      activeName = 'Yatsı';
      nextName = 'İmsak';
      nextTime = imsak;
    } else if (currentTime >= imsak && currentTime < gunes) {
      activeName = 'İmsak';
      nextName = 'Güneş';
      nextTime = gunes;
    } else if (currentTime >= gunes && currentTime < ogle) {
      activeName = 'Güneş';
      nextName = 'Öğle';
      nextTime = ogle;
    } else if (currentTime >= ogle && currentTime < ikindi) {
      activeName = 'Öğle';
      nextName = 'İkindi';
      nextTime = ikindi;
    } else if (currentTime >= ikindi && currentTime < aksam) {
      activeName = 'İkindi';
      nextName = 'Akşam (İftar)';
      nextTime = aksam;
    } else if (currentTime >= aksam && currentTime < yatsi) {
      activeName = 'Akşam';
      nextName = 'Yatsı';
      nextTime = yatsi;
    } else {
      activeName = 'Yatsı';
      nextName = 'İmsak';
      nextTime = nextImsak;
    }

    const diffMs = nextTime.getTime() - currentTime.getTime();
    let countdownStr = '00:00:00';
    if (diffMs > 0) {
      const totalSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      const pad = (n: number) => String(n).padStart(2, '0');
      countdownStr = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    return { activeName, nextName, countdownStr };
  };

  const timesState = getTimesState();

  // Load manual location modal options
  const openManualSelector = async () => {
    setModalOpen(true);
    setSelectorLoading(true);
    try {
      // Directly load cities of Turkey (country ID '2')
      const res = await fetch('https://ezanvakti.emushaf.net/sehirler/2');
      if (res.ok) {
        const citiesData = await res.json();
        setCities(citiesData);

        if (location) {
          // Find city matching location.cityName
          const matchedCityObj = citiesData.find(
            (c: any) => cleanStr(c.SehirAdi) === cleanStr(location.cityName)
          );
          if (matchedCityObj) {
            const cityId = matchedCityObj.SehirID;
            setSelectedCity(cityId);

            // Load districts for this city
            const distsRes = await fetch(`https://ezanvakti.emushaf.net/ilceler/${cityId}`);
            if (distsRes.ok) {
              const districtsData = await distsRes.json();
              setDistricts(districtsData);

              // Find district matching location.districtId or location.districtName
              const matchedDistrictObj = districtsData.find(
                (d: any) => d.IlceID === location.districtId || cleanStr(d.IlceAdi) === cleanStr(location.districtName)
              );
              if (matchedDistrictObj) {
                setSelectedDistrict(matchedDistrictObj.IlceID);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSelectorLoading(false);
    }
  };

  const loadCities = async (countryId: string) => {
    setSelectorLoading(true);
    setSelectedCountry(countryId);
    setSelectedCity('');
    setSelectedDistrict('');
    setDistricts([]);
    try {
      const res = await fetch(`https://ezanvakti.emushaf.net/sehirler/${countryId}`);
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSelectorLoading(false);
    }
  };

  const loadDistricts = async (cityId: string) => {
    setSelectorLoading(true);
    setSelectedCity(cityId);
    setSelectedDistrict('');
    try {
      const res = await fetch(`https://ezanvakti.emushaf.net/ilceler/${cityId}`);
      if (res.ok) {
        const data = await res.json();
        setDistricts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSelectorLoading(false);
    }
  };

  const handleManualSelectSave = () => {
    if (!selectedCity || !selectedDistrict) return;

    const cityObj = cities.find(c => c.SehirID === selectedCity);
    const districtObj = districts.find(d => d.IlceID === selectedDistrict);

    if (cityObj && districtObj) {
      const config: LocationConfig = {
        countryName: 'TÜRKİYE',
        cityName: cityObj.SehirAdi,
        districtName: districtObj.IlceAdi,
        districtId: districtObj.IlceID
      };
      applyConfig(config);
      setModalOpen(false);
    }
  };

  if (loading && !todayVakit) {
    return (
      <div className={styles.topbarLoading}>
        <RefreshCw className={styles.spinIcon} size={16} />
        <span>{loadingMsg}</span>
      </div>
    );
  }

  const timesList = todayVakit ? [
    { name: 'İmsak', time: todayVakit.Imsak },
    { name: 'Güneş', time: todayVakit.Gunes },
    { name: 'Öğle', time: todayVakit.Ogle },
    { name: 'İkindi', time: todayVakit.Ikindi },
    { name: 'Akşam', time: todayVakit.Aksam },
    { name: 'Yatsı', time: todayVakit.Yatsi },
  ] : [];

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.container}>
          {/* Location details */}
          <div className={styles.leftSection}>
            <div className={styles.locationBadge} onClick={openManualSelector} title="Konum Değiştir">
              <MapPin size={14} className={styles.goldText} />
              <span>
                {location ? (
                  <>
                    <span className={styles.cityName}>{location.cityName}</span>
                    <span className={styles.districtName}>, {location.districtName}</span>
                  </>
                ) : (
                  'Konum Seçilmedi'
                )}
              </span>
              <ChevronDown size={12} className={styles.mutedText} />
            </div>
            
            {todayVakit && (
              <div className={styles.dateBadge} title="Tarih Bilgisi">
                <CalendarIcon size={14} className={styles.goldText} />
                <span className={styles.dateText}>
                  {todayVakit.MiladiTarihUzun.split(' ')[0]} {todayVakit.MiladiTarihUzun.split(' ')[1]} | {todayVakit.HicriTarihUzun}
                </span>
              </div>
            )}
          </div>

          {/* Vakit List */}
          <div className={styles.timesContainer}>
            {timesList.map((t) => {
              const isActive = timesState?.activeName === t.name;
              return (
                <div key={t.name} className={`${styles.vakitItem} ${isActive ? styles.activeVakit : ''}`}>
                  <span className={styles.vakitName}>{t.name}</span>
                  <span className={styles.vakitTime}>{t.time}</span>
                </div>
              );
            })}
          </div>

          {/* Countdown timer */}
          {timesState && (
            <div className={styles.rightSection}>
              <Clock size={14} className={styles.goldText} />
              <div className={styles.countdownBox}>
                <span className={styles.countdownLabel}>{timesState.nextName} Vaktine:</span>
                <span className={styles.countdownTime}>{timesState.countdownStr}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Location Selection Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>📍 Konum Seçin</h3>
              <button onClick={() => setModalOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Şehir</label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => loadDistricts(e.target.value)}
                  disabled={selectorLoading}
                >
                  <option value="">Şehir Seçin</option>
                  {cities.map(c => (
                    <option key={c.SehirID} value={c.SehirID}>{c.SehirAdi}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>İlçe</label>
                <select 
                  value={selectedDistrict} 
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={selectorLoading || !selectedCity}
                >
                  <option value="">İlçe Seçin</option>
                  {districts.map(d => (
                    <option key={d.IlceID} value={d.IlceID}>{d.IlceAdi}</option>
                  ))}
                </select>
              </div>

              {selectorLoading && (
                <div className={styles.modalLoader}>
                  <RefreshCw className={styles.spinIcon} size={16} />
                  <span>Yükleniyor...</span>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={detectLocation} 
                className={styles.gpsBtn}
                title="GPS kullanarak otomatik konum al"
              >
                Konumumu Bul
              </button>
              <button 
                onClick={handleManualSelectSave} 
                className={styles.saveBtn}
                disabled={!selectedDistrict}
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
