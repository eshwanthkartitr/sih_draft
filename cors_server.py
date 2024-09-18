import http.server
import socketserver
import json
import os
import cgi
from urllib.parse import unquote

PORT = 8000
UPLOAD_DIR = 'uploads'

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def do_POST(self):
        if self.path == '/process-image':
            content_type, _ = cgi.parse_header(self.headers.get('Content-Type'))
            if content_type == 'multipart/form-data':
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )
                if 'image' in form:
                    fileitem = form['image']
                    filename = os.path.basename(fileitem.filename)
                    filepath = os.path.join(UPLOAD_DIR, filename)
                    
                    with open(filepath, 'wb') as f:
                        f.write(fileitem.file.read())
                    
                    # Process the image (placeholder)
                    obj_filename = f"{os.path.splitext(filename)[0]}.obj"
                    mtl_filename = f"{os.path.splitext(filename)[0]}.mtl"
                    
                    # Create dummy OBJ and MTL files (replace with actual processing)
                    with open(os.path.join(UPLOAD_DIR, obj_filename), 'w') as f:
                        f.write("v 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3")
                    with open(os.path.join(UPLOAD_DIR, mtl_filename), 'w') as f:
                        f.write("newmtl material0\nKa 1 1 1\nKd 1 1 1\nKs 0 0 0")
                    
                    response = {
                        'objFileUrl': f'/download/{obj_filename}',
                        'mtlFileUrl': f'/download/{mtl_filename}'
                    }
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode())
                    return
        
        self.send_error(400, "Bad Request")

    def do_GET(self):
        if self.path.startswith('/download/'):
            filename = unquote(os.path.basename(self.path))
            filepath = os.path.join(UPLOAD_DIR, filename)
            if os.path.exists(filepath):
                self.send_response(200)
                if filename.endswith('.obj'):
                    self.send_header('Content-Type', 'application/x-tgif')
                elif filename.endswith('.mtl'):
                    self.send_header('Content-Type', 'text/plain')
                else:
                    self.send_header('Content-Type', 'application/octet-stream')
                self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
                self.end_headers()
                with open(filepath, 'rb') as f:
                    self.wfile.write(f.read())
                return
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == "__main__":
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"serving at http://localhost:{PORT}")
        httpd.serve_forever()