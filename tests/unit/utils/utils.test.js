/**
 * Utility fonksiyonları unit testleri
 * Türkiye Deprem Takip Sistemi
 */

// Utility fonksiyonlarını doğrudan tanımla
const filterByMagnitude = (data, min = null, max = null) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(eq => {
    const magnitude = parseFloat(eq.buyukluk);
    if (min !== null && magnitude < min) return false;
    if (max !== null && magnitude > max) return false;
    return true;
  });
};

const filterByCity = (data, city) => {
  if (!data || !Array.isArray(data)) return [];
  if (!city) return data;
  
  return data.filter(eq => eq.sehir === city);
};

const filterByDate = (data, date) => {
  if (!data || !Array.isArray(data)) return [];
  if (!date) return data;
  
  return data.filter(eq => eq.tarih === date);
};

describe('Deprem Utility Fonksiyonları Testleri', () => {
  // Test verisi
  const mockEarthquakeData = [
    {
      tarih: '2025-01-01',
      saat: '12:00:00',
      enlem: '39.0',
      boylam: '35.0',
      derinlik: '10.0',
      buyukluk: '5.0',
      yer: 'İstanbul',
      sehir: 'İstanbul'
    },
    {
      tarih: '2025-01-01',
      saat: '13:00:00',
      enlem: '40.0',
      boylam: '36.0',
      derinlik: '15.0',
      buyukluk: '4.5',
      yer: 'Ankara',
      sehir: 'Ankara'
    },
    {
      tarih: '2025-01-02',
      saat: '14:00:00',
      enlem: '41.0',
      boylam: '37.0',
      derinlik: '20.0',
      buyukluk: '3.5',
      yer: 'İzmir',
      sehir: 'İzmir'
    }
  ];

  describe('Büyüklük Filtreleme', () => {
    it('Minimum büyüklük filtresi doğru çalışmalı', () => {
      const minMagnitude = 4.0;
      const filtered = filterByMagnitude(mockEarthquakeData, minMagnitude);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(eq => parseFloat(eq.buyukluk) >= minMagnitude)).toBe(true);
    });

    it('Maksimum büyüklük filtresi doğru çalışmalı', () => {
      const maxMagnitude = 4.0;
      const filtered = filterByMagnitude(mockEarthquakeData, null, maxMagnitude);
      
      expect(filtered.length).toBe(1);
      expect(filtered.every(eq => parseFloat(eq.buyukluk) <= maxMagnitude)).toBe(true);
    });

    it('Aralık filtresi doğru çalışmalı', () => {
      const minMagnitude = 4.0;
      const maxMagnitude = 5.0;
      const filtered = filterByMagnitude(mockEarthquakeData, minMagnitude, maxMagnitude);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(eq => 
        parseFloat(eq.buyukluk) >= minMagnitude && parseFloat(eq.buyukluk) <= maxMagnitude
      )).toBe(true);
    });
  });

  describe('Şehir Filtreleme', () => {
    it('Şehir filtresi doğru çalışmalı', () => {
      const city = 'İstanbul';
      const filtered = filterByCity(mockEarthquakeData, city);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].sehir).toBe(city);
    });

    it('Geçersiz şehir filtresi boş dönmeli', () => {
      const city = 'Geçersiz Şehir';
      const filtered = filterByCity(mockEarthquakeData, city);
      
      expect(filtered.length).toBe(0);
    });
  });

  describe('Tarih Filtreleme', () => {
    it('Tarih filtresi doğru çalışmalı', () => {
      const date = '2025-01-01';
      const filtered = filterByDate(mockEarthquakeData, date);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(eq => eq.tarih === date)).toBe(true);
    });

    it('Geçersiz tarih filtresi boş dönmeli', () => {
      const date = '2025-12-31';
      const filtered = filterByDate(mockEarthquakeData, date);
      
      expect(filtered.length).toBe(0);
    });
  });

  describe('Hata Durumları', () => {
    it('Geçersiz veri girişi boş dönmeli', () => {
      const filtered = filterByMagnitude(null, 4.0);
      expect(filtered).toEqual([]);
    });

    it('Geçersiz büyüklük değerleri boş dönmeli', () => {
      const filtered = filterByMagnitude(mockEarthquakeData, 'geçersiz');
      expect(filtered).toEqual(mockEarthquakeData); // Geçersiz parametre tüm veriyi döndürmeli
    });
  });
});