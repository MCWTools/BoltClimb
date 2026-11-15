# Bolt Climb

Game platformer pixel-art vô tận: robot Bolt leo từ Trái Đất tới hố đen, cùng người bạn Pip.
Cấu trúc: `index.html` (markup), `css/style.css`, `js/audio.js` (âm thanh procedural), `js/i18n.js` (VI/EN), `js/game.js` (game), `assets/` (fonts, ui, characters, shields, platforms, backgrounds, objects). Chạy bằng web server tĩnh bất kỳ (GitHub Pages, Vercel, `python3 -m http.server`).

## Thư mục sprite

Game vẽ sprite bằng code, nhưng nếu có PNG trong `assets/` thì PNG sẽ thay thế bản vẽ bằng code.

| Folder | Nội dung |
|---|---|
| `assets/characters/` | Sprite sheet skin nhân vật (cùng định dạng template trong game). Mỗi file thành 1 skin, liệt kê trong tab Skin → Nhân vật. |
| `assets/shields/` | PNG khiên: hình vuông, khiên hướng sang phải, tâm ảnh là tâm nhân vật. Hiện trong tab Skin → Khiên. |
| `assets/platforms/` | Sprite bệ đứng. Tên file = khoá sprite, ví dụ `plank32.png` (plank rộng 32). |
| `assets/backgrounds/` | Mây nền, vệ tinh, thiên thạch. |
| `assets/objects/` | Thang, cưa, tiền, cổng, UFO... |

`assets/manifest.json` liệt kê các file. Thêm/bớt file thì chạy lại `python3 tools/export_assets.py` (nó cũng xuất lại mọi sprite vẽ bằng code, ghi đè file cũ trong platforms/backgrounds/objects) hoặc sửa tay manifest.
Muốn thay một sprite: sửa file PNG, giữ nguyên tên và kích thước.

## Skin do người chơi import

Skin Nhân vật và Khiên import trong game được lưu trong IndexedDB của trình duyệt (dung lượng lớn), tự lùi về localStorage nếu không có IndexedDB. Nếu cả hai đều đầy, game báo "không lưu được".
