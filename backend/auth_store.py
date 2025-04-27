import json, pathlib, uuid, time
DB = pathlib.Path(__file__).with_name('pins.json')
class Store:
    def _l(self):
        return json.loads(DB.read_text()) if DB.exists() else {}
    def _s(self,d):
        DB.write_text(json.dumps(d,indent=2))
    def validate_pin(self,pin,mac):
        d=self._l(); r=d.get(pin)
        if not r or r.get('paused'): raise ValueError('bad pin')
        m=r.setdefault('macs',[])
        if mac not in m:
            if len(m)>=3: raise ValueError('limit')
            m.append(mac)
        self._s(d); return {'pin':pin,'status':'ok'}
    def issue_new(self,rank):
        d=self._l(); pin=str(uuid.uuid4().int)[-8:]
        d[pin]={'rank':rank,'created':time.time(),'paused':False}
        self._s(d); return {'pin':pin,'status':'ok'}
store=Store()
