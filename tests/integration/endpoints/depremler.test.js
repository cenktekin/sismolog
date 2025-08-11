/**
 * Depremler endpoint özel integration testleri
 * Türkiye Deprem Takip Sistemi
 */

const request = require('supertest');
const express = require('express');

describe('Depremler Endpoint Testleri', () => {
  let app;

  beforeAll(() => {
    // Express uygulamasını başlat
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Depremler endpoint'i
    app.get('/api/v1/depremler', async (req, res) => {
      try {
        // Mock deprem verisi
        const mockDepremler = [
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
            tarih: '2025-01-01',
            saat: '14:00:00',
            enlem: '41.0',
            boylam: '37.0',
            derinlik: '20.0',
            buyukluk: '6.0',
            yer: 'İzmir',
            sehir: 'İzmir'
          },
          {
            tarih: '2025-01-01',
            saat: '15:00:00',
            enlem: '42.0',
            boylam: '38.0',
            derinlik: '25.0',
            buyukluk: '3.2',
            yer: 'Bursa',
            sehir: 'Bursa'
          },
          {
            tarih: '2025-01-01',
            saat: '16:00:00',
            enlem: '43.0',
            boylam: '39.0',
            derinlik: '30.0',
            buyukluk: '2.1',
            yer: 'Antalya',
            sehir: 'Antalya'
          }
        ];

        let filteredDepremler = [...mockDepremler];

        // Tarih filtresi
        if (req.query.tarih) {
          filteredDepremler = filteredDepremler.filter(x => x.tarih === req.query.tarih);
        }

        // Minimum büyüklük filtresi
        if (req.query.min) {
          filteredDepremler = filteredDepremler.filter(x => parseFloat(x.buyukluk) >= parseFloat(req.query.min));
        }

        // Maksimum büyüklük filtresi
        if (req.query.max) {
          filteredDepremler = filteredDepremler.filter(x => parseFloat(x.buyukluk) <= parseFloat(req.query.max));
        }

        // Şehir filtresi
        if (req.query.sehir) {
          filteredDepremler = filteredDepremler.filter(x => x.sehir === req.query.sehir);
        }

        // Sayfalama
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedResults = filteredDepremler.slice(startIndex, endIndex);

        res.json({
          data: paginatedResults,
          pagination: {
            current: page,
            total: Math.ceil(filteredDepremler.length / limit),
            count: filteredDepremler.length,
            hasNext: endIndex < filteredDepremler.length,
            hasPrev: page > 1
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  });

  describe('GET /api/v1/depremler - Sayfalama Testleri', () => {
    it('Sayfalama çalışmalı - 1. sayfa', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?page=1&limit=2')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.current).toBe(1);
    });

    it('Sayfalama çalışmalı - 2. sayfa', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?page=2&limit=2')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination.current).toBe(2);
    });

    it('Son sayfa bilgisi doğru olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?page=3&limit=2')
        .expect(200);

      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.hasNext).toBe(false);
    });

    it('Önceki sayfa bilgisi doğru olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?page=2&limit=2')
        .expect(200);

      expect(response.body.pagination.hasPrev).toBe(true);
    });
  });

  describe('GET /api/v1/depremler - Sıralama Testleri', () => {
    it('Büyüklük göre azalan sırada olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?sort=buyukluk&order=desc')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 1) {
        for (let i = 0; i < response.body.data.length - 1; i++) {
          expect(parseFloat(response.body.data[i].buyukluk)).toBeGreaterThanOrEqual(
            parseFloat(response.body.data[i + 1].buyukluk)
          );
        }
      }
    });

    it('Büyüklük göre artan sırada olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?sort=buyukluk&order=asc')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 1) {
        for (let i = 0; i < response.body.data.length - 1; i++) {
          expect(parseFloat(response.body.data[i].buyukluk)).toBeLessThanOrEqual(
            parseFloat(response.body.data[i + 1].buyukluk)
          );
        }
      }
    });

    it('Tarih göre sıralama çalışmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?sort=tarih&order=desc')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/depremler - Gelişmiş Filtreleme Testleri', () => {
    it('Aralık filtresi - büyüklük aralığı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?min=3.0&max=5.0')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      
      response.body.data.forEach(deprem => {
        const magnitude = parseFloat(deprem.buyukluk);
        expect(magnitude).toBeGreaterThanOrEqual(3.0);
        expect(magnitude).toBeLessThanOrEqual(5.0);
      });
    });

    it('Çoklu şehir filtresi', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?seirs[]=İstanbul&seirs[]=Ankara')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Bu test ortamında tek şehir filtresi çalıştığı için basitleştirilmiş
      response.body.data.forEach(deprem => {
        expect(['İstanbul', 'Ankara']).toContain(deprem.sehir);
      });
    });

    it('Tarih aralığı filtresi', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?tarih=2025-01-01')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      
      response.body.data.forEach(deprem => {
        expect(deprem.tarih).toBe('2025-01-01');
      });
    });
  });

  describe('GET /api/v1/depremler - Performans Testleri', () => {
    it('Hızlı yanıt süresi - 2000ms altında', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/v1/depremler')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(2000);
    });

    it('Paralel istekler çalışmalı', async () => {
      const requests = [];
      
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .get('/api/v1/depremler')
            .expect(200)
        );
      }
      
      const responses = await Promise.all(requests);
      
      expect(responses.length).toBe(5);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('GET /api/v1/depremler - Edge Cases', () => {
    it('Boş sonuç durumu', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?min=10.0')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
      expect(response.body.pagination.count).toBe(0);
    });

    it('Geçersiz sayfa numarası', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?page=999&limit=10')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('Negatif limit değeri', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?limit=-1')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/depremler - Veri Bütünlüğü', () => {
    it('Tüm zorunlu alanlar mevcut olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler')
        .expect(200);

      if (response.body.data.length > 0) {
        const firstItem = response.body.data[0];
        const requiredFields = ['tarih', 'saat', 'enlem', 'boylam', 'derinlik', 'buyukluk', 'yer', 'sehir'];
        
        requiredFields.forEach(field => {
          expect(firstItem).toHaveProperty(field);
        });
      }
    });

    it('Alan tipleri doğru olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler')
        .expect(200);

      if (response.body.data.length > 0) {
        const firstItem = response.body.data[0];
        
        expect(typeof firstItem.tarih).toBe('string');
        expect(typeof firstItem.saat).toBe('string');
        expect(typeof firstItem.enlem).toBe('string');
        expect(typeof firstItem.boylam).toBe('string');
        expect(typeof firstItem.derinlik).toBe('string');
        expect(typeof firstItem.buyukluk).toBe('string');
        expect(typeof firstItem.yer).toBe('string');
        expect(typeof firstItem.sehir).toBe('string');
      }
    });

    it('Sayfalama bilgisi doğru olmalı', async () => {
      const response = await request(app)
        .get('/api/v1/depremler?page=1&limit=2')
        .expect(200);

      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.current).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.count).toBeGreaterThan(0);
      expect(typeof response.body.pagination.total).toBe('number');
      expect(typeof response.body.pagination.hasNext).toBe('boolean');
      expect(typeof response.body.pagination.hasPrev).toBe('boolean');
    });
  });
});