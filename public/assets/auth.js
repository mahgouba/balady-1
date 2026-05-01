(function () {
    // ============================================================
    // غيّر اسم المستخدم وكلمة المرور من هنا
    // ============================================================
    var CREDENTIALS = {
        username: 'admin@balady',
        password: 'Balady.X'
    };
    // ============================================================

    var STORAGE_KEY = 'balady_auth_v1';

    function isAuthed() {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function setAuthed(v) {
        try {
            if (v) localStorage.setItem(STORAGE_KEY, '1');
            else localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
    }

    function injectStyles() {
        var css = ''
            + '#__auth_overlay{position:fixed;inset:0;background:#0E726F;display:flex;align-items:center;justify-content:center;z-index:99999;font-family:"IBM Plex Sans Arabic","Cairo",Tahoma,Arial,sans-serif;direction:rtl;}'
            + '#__auth_card{background:#fff;width:92%;max-width:380px;border-radius:14px;padding:28px 24px;box-shadow:0 20px 60px rgba(0,0,0,.25);text-align:center;}'
            + '#__auth_card h2{margin:0 0 6px;color:#0E726F;font-size:22px;}'
            + '#__auth_card p{margin:0 0 20px;color:#555;font-size:13px;}'
            + '#__auth_card label{display:block;text-align:right;margin:10px 0 6px;font-size:13px;color:#333;font-weight:600;}'
            + '#__auth_card input{width:100%;padding:11px 12px;border:1px solid #d6d6d6;border-radius:8px;font-size:15px;box-sizing:border-box;outline:none;transition:border-color .15s;}'
            + '#__auth_card input:focus{border-color:#0E726F;}'
            + '#__auth_card button{margin-top:18px;width:100%;padding:12px;background:#0E726F;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:background .15s;}'
            + '#__auth_card button:hover{background:#0a5b58;}'
            + '#__auth_err{margin-top:12px;color:#c0392b;font-size:13px;min-height:18px;}'
            + '#__auth_logout{position:fixed;top:10px;left:10px;z-index:9998;background:rgba(192,57,43,.9);color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;font-family:inherit;}'
            + '#__auth_logout:hover{background:#c0392b;}'
            + '@media print{#__auth_logout{display:none !important;}}';
        var style = document.createElement('style');
        style.id = '__auth_styles';
        style.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(style);
    }

    function buildOverlay() {
        var ov = document.createElement('div');
        ov.id = '__auth_overlay';
        ov.innerHTML = ''
            + '<div id="__auth_card">'
            + '  <h2>تسجيل الدخول</h2>'
            + '  <p>الرجاء إدخال بيانات الدخول للمتابعة</p>'
            + '  <form id="__auth_form" autocomplete="off">'
            + '    <label for="__auth_user">اسم المستخدم</label>'
            + '    <input id="__auth_user" type="text" required autocomplete="username">'
            + '    <label for="__auth_pass">كلمة المرور</label>'
            + '    <input id="__auth_pass" type="password" required autocomplete="current-password">'
            + '    <button type="submit">دخول</button>'
            + '    <div id="__auth_err"></div>'
            + '  </form>'
            + '</div>';
        document.body.appendChild(ov);
        var u = document.getElementById('__auth_user');
        if (u) setTimeout(function () { u.focus(); }, 50);
        document.getElementById('__auth_form').addEventListener('submit', function (e) {
            e.preventDefault();
            var user = (document.getElementById('__auth_user').value || '').trim();
            var pass = document.getElementById('__auth_pass').value || '';
            if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
                setAuthed(true);
                ov.parentNode && ov.parentNode.removeChild(ov);
                addLogoutButton();
            } else {
                document.getElementById('__auth_err').textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                document.getElementById('__auth_pass').value = '';
                document.getElementById('__auth_pass').focus();
            }
        });
    }

    function addLogoutButton() {
        if (document.getElementById('__auth_logout')) return;
        var btn = document.createElement('button');
        btn.id = '__auth_logout';
        btn.type = 'button';
        btn.textContent = 'تسجيل الخروج';
        btn.addEventListener('click', function () {
            setAuthed(false);
            location.reload();
        });
        document.body.appendChild(btn);
    }

    function start() {
        injectStyles();
        if (isAuthed()) {
            addLogoutButton();
        } else {
            buildOverlay();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
