from http.server import BaseHTTPRequestHandler
from pytube import YouTube
import moviepy.editor as mp
import json
import re
import os
import shutil

class handler(BaseHTTPRequestHandler):
  def do_POST(self):
    # Reading request body
    content_len = int(self.headers.get('Content-Length'))
    post_body = self.rfile.read(content_len)

    if not post_body:
      self.send_response(400)
      self.send_header('Content-type','application/json')
      self.end_headers()

      response_obj = {
        "message": "Propriedade 'link' é obrigatória"
      }
      json_response = json.dumps(response_obj)

      self.wfile.write(json_response.encode(encoding='utf_8'))
      return

    # Reading property link from body
    body_obj = json.loads(post_body)
    video_link = body_obj.get("link")

    if not video_link:
      self.send_response(400)
      self.send_header('Content-type','application/json')
      self.end_headers()

      response_obj = {
        "message": "Propriedade 'link' é obrigatória"
      }
      json_response = json.dumps(response_obj)

      self.wfile.write(json_response.encode(encoding='utf_8'))
      return

    try:
      yt = YouTube(video_link)
    except:
      self.send_response(400)
      self.send_header('Content-type','application/json')
      self.end_headers()

      response_obj = {
        "message": "Link de vídeo do YouTube inválido."
      }
      json_response = json.dumps(response_obj)

      self.wfile.write(json_response.encode(encoding='utf_8'))
      return

    path = "./"

    # Begin download #
    print("Downloading...")
    ys = yt.streams.filter(only_audio=True).first().download(path)
    print("Download complete!")
    print(ys)

    # Convert mp4 to mp3 #
    print("Converting file...")
    for file in os.listdir(path):
      if re.search('mp4', file):
        mp4_path = os.path.join(path, file)
        mp3_path = os.path.join(path, os.path.splitext(file)[0] + '.mp3')
        new_file = mp.AudioFileClip(mp4_path)
        new_file.write_audiofile(mp3_path)
        os.remove(mp4_path)
    print("Success!")

    with open(mp3_path, 'rb') as f:
      self.send_response(200)
      self.send_header("Content-Type", 'application/octet-stream')
      self.send_header("Content-Disposition", 'attachment; filename="{}"'.format(os.path.basename(mp3_path)))
      fs = os.fstat(f.fileno())
      self.send_header("Content-Length", str(fs.st_size))
      self.end_headers()
      shutil.copyfileobj(f, self.wfile)
      return
