from http.server import BaseHTTPRequestHandler
from pytube import YouTube
from shutil import copyfileobj
from moviepy import editor as mp
from json import dumps, loads
from re import search
from os import listdir, path, fstat, remove

class handler(BaseHTTPRequestHandler):
  def do_POST(self):
    content_len = int(self.headers.get('Content-Length'))
    post_body = self.rfile.read(content_len)
    body_obj = loads(post_body)
    video_link = body_obj.get("link")

    try:
      yt = YouTube(video_link)
    except:
      self.send_response(400)
      self.send_header('Content-type','application/json')
      self.end_headers()

      response_obj = {
        "message": "Link de vídeo do YouTube inválido."
      }
      json_response = dumps(response_obj)

      self.wfile.write(json_response.encode(encoding='utf_8'))
      return

    dir_path = "./"
    yt.streams.filter(only_audio=True).first().download(dir_path)

    for file in listdir(dir_path):
      if search('mp4', file):
        mp4_path = path.join(dir_path, file)
        mp3_path = path.join(dir_path, path.splitext(file)[0] + '.mp3')
        new_file = mp.AudioFileClip(mp4_path)
        new_file.write_audiofile(mp3_path)
        remove(mp4_path)

    with open(mp3_path, 'rb') as f:
      self.send_response(200)
      self.send_header("Content-Type", 'application/octet-stream')
      self.send_header("Content-Disposition", 'attachment; filename="{}"'.format(path.basename(mp3_path)))
      fs = fstat(f.fileno())
      self.send_header("Content-Length", str(fs.st_size))
      self.end_headers()
      copyfileobj(f, self.wfile)
      return
