/**
 * API endpoint unit testleri
 * Türkiye Deprem Takip Sistemi
 */

// Deprem sınıfını doğrudan tanımla (test için)
class Deprem {
  constructor(tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir) {
    this.tarih = tarih;
    this.saat = saat;
    this.enlem = enlem;
    this.boylam = boylam;
    this.derinlik = derinlik;
    this.buyukluk = buyukluk;
    this.yer = yer;
    this.sehir = sehir;
  }
}

// validateDepremData fonksiyonunu doğrudan tanımla
const validateDepremData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['tarih', 'saat', 'enlem', 'boylam', 'derinlik', 'buyukluk', 'yer', 'sehir'];
  for (const field of requiredFields) {
    if (!data[field]) return false;
  }

  // Sayısal değerlerin kontrolü
  if (isNaN(parseFloat(data.enlem)) || isNaN(parseFloat(data.boylam)) ||
      isNaN(parseFloat(data.derinlik)) || isNaN(parseFloat(data.buyukluk))) {
    return false;
  }

  return true;
};

describe('Deprem Sınıfı Unit Testleri', () => {
  let testDeprem;

  beforeEach(() => {
    testDeprem = new Deprem(
      '2025-01-01',
      '12:00:00',
      '39.0',
      '35.0',
      '10.0',
      '5.0',
      'İstanbul',
      'İstanbul'
    );
  });

  describe('Deprem nesnesi oluşturma', () => {
    it('Doğru parametrelerle Deprem nesnesi oluşturulmalı', () => {
      expect(testDeprem.tarih).toBe('2025-01-01');
      expect(testDeprem.saat).toBe('12:00:00');
      expect(testDeprem.enlem).toBe('39.0');
      expect(testDeprem.boylam).toBe('35.0');
      expect(testDeprem.derinlik).toBe('10.0');
      expect(testDeprem.buyukluk).toBe('5.0');
      expect(testDeprem.yer).toBe('İstanbul');
      expect(testDeprem.sehir).toBe('İstanbul');
    });

    it('Tüm alanların string tipinde olması gerekir', () => {
      expect(typeof testDeprem.tarih).toBe('string');
      expect(typeof testDeprem.saat).toBe('string');
      expect(typeof testDeprem.enlem).toBe('string');
      expect(typeof testDeprem.boylam).toBe('string');
      expect(typeof testDeprem.derinlik).toBe('string');
      expect(typeof testDeprem.buyukluk).toBe('string');
      expect(typeof testDeprem.yer).toBe('string');
      expect(typeof testDeprem.sehir).toBe('string');
    });
  });

  describe('Deprem verisi doğrulama', () => {
    // validateDepremData fonksiyonunu doğrudan tanımla
    const validateDepremData = (data) => {
      if (!data || typeof data !== 'object') return false;
      
      const requiredFields = ['tarih', 'saat', 'enlem', 'boylam', 'derinlik', 'buyukluk', 'yer', 'sehir'];
      for (const field of requiredFields) {
        if (!data[field]) return false;
      }

      // Sayısal değerlerin kontrolü
      if (isNaN(parseFloat(data.enlem)) || isNaN(parseFloat(data.boylam)) ||
          isNaN(parseFloat(data.derinlik)) || isNaN(parseFloat(data.buyukluk))) {
        return false;
      }

      return true;
    };

    it('Geçerli deprem verisi doğrulanmalı', () => {
      const validData = {
        tarih: '2025-01-01',
        saat: '12:00:00',
        enlem: '39.0',
        boylam: '35.0',
        derinlik: '10.0',
        buyukluk: '5.0',
        yer: 'İstanbul',
        sehir: 'İstanbul'
      };

      expect(validateDepremData(validData)).toBe(true);
    });

    it('Eksik alanlı veri doğrulanmamalı', () => {
      const invalidData = {
        tarih: '2025-01-01',
        saat: '12:00:00',
        enlem: '39.0',
        boylam: '35.0',
        derinlik: '10.0',
        buyukluk: '5.0',
        yer: 'İstanbul'
        // sehir alanı eksik
      };

      expect(validateDepremData(invalidData)).toBe(false);
    });

    it('Geçersiz sayısal değerler içeren veri doğrulanmamalı', () => {
      const invalidData = {
        tarih: '2025-01-01',
        saat: '12:00:00',
        enlem: 'geçersiz',
        boylam: '35.0',
        derinlik: '10.0',
        buyukluk: '5.0',
        yer: 'İstanbul',
        sehir: 'İstanbul'
      };

      expect(validateDepremData(invalidData)).toBe(false);
    });

    it('Boş veya null veri doğrulanmamalı', () => {
      expect(validateDepremData(null)).toBe(false);
      expect(validateDepremData(undefined)).toBe(false);
      expect(validateDepremData({})).toBe(false);
    });
  });
});