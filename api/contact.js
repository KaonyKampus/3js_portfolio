const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = { name: 80, email: 120, message: 3000 };

// quita saltos de línea para que nadie inyecte cabeceras de correo por el nombre
const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').trim();

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const name = oneLine(body.name || '');
    const email = oneLine(body.email || '');
    const message = String(body.message || '').trim();
    const website = String(body.website || '').trim();

    if (website) return res.status(200).json({ ok: true });

    // 4. validar otra vez en el servidor
    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, error: 'Missing fields' });
    }
    if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ ok: false, error: 'Invalid email' });
    }
    if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
        return res.status(400).json({ ok: false, error: 'Too long' });
    }

    try {
        const { error } = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: process.env.CONTACT_TO,
            replyTo: email,
            subject: `New message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`
        });
        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ ok: false, error: 'Could not send' });
        }
        // 6. todo bien
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, error: 'Server error' });
    }
};