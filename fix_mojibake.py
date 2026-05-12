p='app/profile/page.js';t=open(p,encoding='utf-8').read();import re;o=[];i=0
while i<len(t):
 c=ord(t[i])
 if 0xC2<=c<=0xC3 and i+1<len(t) and 0x80<=ord(t[i+1])<=0xBF:
  b=(c&3)<<6|(ord(t[i+1])&0x3F)
  if 0x80<=b<=0xFF:
   try:
    r=bytes([b]).decode('cp1252')
    o.append(r);i+=2;continue
   except:pass
 o.append(t[i]);i+=1
r=''.join(o);open(p,'w',encoding='utf-8').write(r);print('Fixed',len(t)-len(r),'chars changed')
