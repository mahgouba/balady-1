const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS certificates (
                id TEXT PRIMARY KEY,
                amanah TEXT,
                amanah_logo TEXT,
                municipality TEXT,
                municipality_logo TEXT,
                name TEXT,
                id_number TEXT,
                gender TEXT,
                nationality TEXT,
                cert_number TEXT,
                job TEXT,
                issue_date_hijri TEXT,
                issue_date_gregorian TEXT,
                expiry_date_hijri TEXT,
                expiry_date_gregorian TEXT,
                profile_image TEXT,
                establishment_name TEXT,
                establishment_number TEXT,
                license_number TEXT,
                program_type TEXT,
                program_end_date TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS dropdown_items (
                id SERIAL PRIMARY KEY,
                type TEXT,
                name TEXT,
                logo TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_cert_number ON certificates(cert_number)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_id_number ON certificates(id_number)`);
        console.log('Database schema initialized');
    } catch (e) {
        console.error('DB init error:', e.message);
    }
}

app.get('/api/certificates', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM certificates ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/certificates/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT * FROM certificates WHERE id = $1 OR cert_number = $1 OR id_number = $1 LIMIT 1',
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/certificates', async (req, res) => {
    try {
        const c = req.body;
        await pool.query(`
            INSERT INTO certificates (
                id, amanah, amanah_logo, municipality, municipality_logo,
                name, id_number, gender, nationality, cert_number, job,
                issue_date_hijri, issue_date_gregorian, expiry_date_hijri, expiry_date_gregorian,
                profile_image, establishment_name, establishment_number, license_number,
                program_type, program_end_date
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
            ON CONFLICT (id) DO UPDATE SET
                amanah=EXCLUDED.amanah, amanah_logo=EXCLUDED.amanah_logo,
                municipality=EXCLUDED.municipality, municipality_logo=EXCLUDED.municipality_logo,
                name=EXCLUDED.name, id_number=EXCLUDED.id_number,
                gender=EXCLUDED.gender, nationality=EXCLUDED.nationality,
                cert_number=EXCLUDED.cert_number, job=EXCLUDED.job,
                issue_date_hijri=EXCLUDED.issue_date_hijri, issue_date_gregorian=EXCLUDED.issue_date_gregorian,
                expiry_date_hijri=EXCLUDED.expiry_date_hijri, expiry_date_gregorian=EXCLUDED.expiry_date_gregorian,
                profile_image=EXCLUDED.profile_image, establishment_name=EXCLUDED.establishment_name,
                establishment_number=EXCLUDED.establishment_number, license_number=EXCLUDED.license_number,
                program_type=EXCLUDED.program_type, program_end_date=EXCLUDED.program_end_date
        `, [
            c.id, c.amanah||'', c.amanah_logo||c.amanahLogo||'',
            c.municipality||'', c.municipality_logo||c.municipalityLogo||'',
            c.name||'', c.id_number||c.idNumber||'', c.gender||'',
            c.nationality||'', c.cert_number||c.certNumber||c.id,
            c.job||'', c.issue_date_hijri||c.issueDateHijri||'',
            c.issue_date_gregorian||c.issueDateGregorian||'',
            c.expiry_date_hijri||c.expiryDateHijri||'',
            c.expiry_date_gregorian||c.expiryDateGregorian||'',
            c.profile_image||c.profileImage||'',
            c.establishment_name||c.establishmentName||'',
            c.establishment_number||c.establishmentNumber||'',
            c.license_number||c.licenseNumber||'',
            c.program_type||c.programType||'',
            c.program_end_date||c.programEndDate||''
        ]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/certificates/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const c = req.body;
        await pool.query(`
            UPDATE certificates SET
                amanah=$2, amanah_logo=$3, municipality=$4, municipality_logo=$5,
                name=$6, id_number=$7, gender=$8, nationality=$9,
                cert_number=$10, job=$11,
                issue_date_hijri=$12, issue_date_gregorian=$13,
                expiry_date_hijri=$14, expiry_date_gregorian=$15,
                profile_image=$16, establishment_name=$17,
                establishment_number=$18, license_number=$19,
                program_type=$20, program_end_date=$21
            WHERE id=$1
        `, [
            id,
            c.amanah||'', c.amanah_logo||c.amanahLogo||'',
            c.municipality||'', c.municipality_logo||c.municipalityLogo||'',
            c.name||'', c.id_number||c.idNumber||'', c.gender||'',
            c.nationality||'', c.cert_number||c.certNumber||'',
            c.job||'', c.issue_date_hijri||c.issueDateHijri||'',
            c.issue_date_gregorian||c.issueDateGregorian||'',
            c.expiry_date_hijri||c.expiryDateHijri||'',
            c.expiry_date_gregorian||c.expiryDateGregorian||'',
            c.profile_image||c.profileImage||'',
            c.establishment_name||c.establishmentName||'',
            c.establishment_number||c.establishmentNumber||'',
            c.license_number||c.licenseNumber||'',
            c.program_type||c.programType||'',
            c.program_end_date||c.programEndDate||''
        ]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/certificates/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM certificates WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/dropdown-items', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM dropdown_items ORDER BY created_at ASC');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/dropdown-items', async (req, res) => {
    try {
        const { type, name, logo } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO dropdown_items (type, name, logo) VALUES ($1, $2, $3) RETURNING id',
            [type, name, logo || '']
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/dropdown-items/:id', async (req, res) => {
    try {
        const { name, logo } = req.body;
        await pool.query(
            'UPDATE dropdown_items SET name=$2, logo=$3 WHERE id=$1',
            [req.params.id, name, logo || '']
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/dropdown-items/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM dropdown_items WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/dropdown-items/seed', async (req, res) => {
    try {
        const items = req.body;
        for (const item of items) {
            await pool.query(
                'INSERT INTO dropdown_items (type, name, logo) VALUES ($1, $2, $3)',
                [item.type, item.name, item.logo || '']
            );
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDb().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
});
