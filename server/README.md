# Görev Yöneticisi API

Yazılım şirketi için görev, proje ve çalışan sorumluluklarını takip eden Express.js REST API.

Veriler `data/db.json` dosyasında tutulur (file-based JSON). Başlangıç verisi `data/db.seed.json` içindedir.

## Kurulum

```bash
cd server
npm install
npm start
```

Geliştirme (dosya değişince otomatik yeniden başlatma):

```bash
npm run dev
```

Varsayılan adres: `http://localhost:3000`

Port değiştirmek için: `PORT=4000 npm start`

Seed verisini geri yüklemek:

```bash
npm run seed
```

## Kaynaklar

| Kaynak | Base path |
| --- | --- |
| Health | `GET /api/health` |
| Çalışanlar | `/api/employees` |
| Projeler | `/api/projects` |
| Görevler | `/api/tasks` |
| Raporlar | `/api/reports/...` |

### Çalışanlar (`employees`)

| Method | Path | Açıklama |
| --- | --- | --- |
| GET | `/api/employees` | Listele |
| GET | `/api/employees/:id` | Detay |
| POST | `/api/employees` | Oluştur |
| PUT | `/api/employees/:id` | Güncelle |
| DELETE | `/api/employees/:id` | Sil |

Body örneği:

```json
{
  "name": "Ali Veli",
  "email": "ali.veli@ornek.com",
  "role": "QA Engineer",
  "department": "Engineering"
}
```

### Projeler (`projects`)

| Method | Path | Açıklama |
| --- | --- | --- |
| GET | `/api/projects` | Listele (`?status=&memberId=`) |
| GET | `/api/projects/:id` | Detay (+ üyeler ve görevler) |
| POST | `/api/projects` | Oluştur |
| PUT | `/api/projects/:id` | Güncelle |
| DELETE | `/api/projects/:id` | Sil |

`status`: `planning` \| `active` \| `on-hold` \| `completed`

```json
{
  "name": "Billing Servisi",
  "description": "Faturalama mikroservisi",
  "status": "planning",
  "memberIds": ["emp-001"]
}
```

### Görevler (`tasks`)

| Method | Path | Açıklama |
| --- | --- | --- |
| GET | `/api/tasks` | Listele / filtrele |
| GET | `/api/tasks/:id` | Detay |
| POST | `/api/tasks` | Oluştur |
| PUT | `/api/tasks/:id` | Güncelle |
| PATCH | `/api/tasks/:id/assign` | Çalışana ata |
| PATCH | `/api/tasks/:id/status` | Durum güncelle |
| DELETE | `/api/tasks/:id` | Sil |

`status`: `pending` \| `in-progress` \| `done`  
`priority`: `low` \| `medium` \| `high` \| `critical`

Filtre / sıralama query parametreleri:

- `status`, `priority`, `projectId`, `assigneeId`
- `unassigned=true`
- `q=` (başlık / açıklama araması)
- `sortBy=priority|dueDate|createdAt|title`
- `order=asc|desc`

```bash
curl "http://localhost:3000/api/tasks?status=pending&priority=high&sortBy=dueDate&order=asc"
```

Görev oluşturma:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API dokümantasyonu",
    "description": "OpenAPI özeti yaz",
    "status": "pending",
    "priority": "medium",
    "projectId": "prj-001",
    "assigneeId": "emp-001",
    "dueDate": "2026-12-01"
  }'
```

Atama:

```bash
curl -X PATCH http://localhost:3000/api/tasks/tsk-004/assign \
  -H "Content-Type: application/json" \
  -d '{"assigneeId":"emp-001"}'
```

Durum:

```bash
curl -X PATCH http://localhost:3000/api/tasks/tsk-002/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'
```

### Raporlar (`reports`)

| Method | Path | Açıklama |
| --- | --- | --- |
| GET | `/api/reports/summary` | Toplamlar + status/priority dağılımı |
| GET | `/api/reports/workload` | Çalışan bazlı iş yükü |
| GET | `/api/reports/overdue` | Geciken (done olmayan) görevler |

## Klasör yapısı

```text
server/
  data/                 # JSON veritabanı + seed
  src/
    app.js              # Express uygulaması
    server.js           # HTTP dinleyici
    constants.js
    controllers/        # İş kuralları
    middleware/         # validation + error handling
    routes/             # Router tanımları
    services/store.js   # JSON okuma/yazma
    scripts/seed.js
```

## Notlar

- Validation middleware hatalı isteklerde `400` + `details` döner.
- Silme kuralları: atanmış görevi olan çalışan / görevi olan proje silinemez (`409`).
- Mevcut React frontend (`/`) LocalStorage kullanmaya devam eder; bu API bağımsız bir backend katmanıdır.
